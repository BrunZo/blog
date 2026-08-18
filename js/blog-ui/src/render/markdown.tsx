/**
 * Renders notekit's AST. No markdown parsing happens here, and no
 * dangerouslySetInnerHTML — every node kind maps to a component, which is what
 * MDX used to give us.
 *
 * To add a custom block (Definition, Theorem, …), extend `components` rather
 * than touching this file.
 */
import katex from "katex";
import { Link } from "react-router-dom";

import type { Block, Inline } from "./types";

// ── inline ───────────────────────────────────────────────────────────────────

function Math({ tex, display }: { tex: string; display: boolean }) {
  // KaTeX renders to a static string; there is nothing interactive inside, so
  // this is the one legitimate use of dangerouslySetInnerHTML.
  let html: string;
  try {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false });
  } catch {
    return <code className="text-red-700">{tex}</code>;
  }
  const Tag = display ? "div" : "span";
  return <Tag className={display ? "my-4 overflow-x-auto" : ""}
              dangerouslySetInnerHTML={{ __html: html }} />;
}

function Wikilink({ node }: { node: Extract<Inline, { t: "wikilink" }> }) {
  // Unpublished target: plain text. A private note must not leak via a 404.
  if (!node.href) return <span>{node.text}</span>;
  return (
    <Link to={node.href} className="underline decoration-1 underline-offset-2">
      {node.text}
    </Link>
  );
}

export function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.t) {
          case "text":
            return <span key={i}>{node.value}</span>;
          case "code":
            return <code key={i} className="rounded bg-stone-100 px-1">{node.value}</code>;
          case "math_inline":
            return <Math key={i} tex={node.value} display={false} />;
          case "math_display":
            return <Math key={i} tex={node.value} display={true} />;
          case "bold":
            return <strong key={i}><Inlines nodes={node.children} /></strong>;
          case "italic":
            return <em key={i}><Inlines nodes={node.children} /></em>;
          case "bolditalic":
            return <strong key={i}><em><Inlines nodes={node.children} /></em></strong>;
          case "strike":
            return <s key={i}><Inlines nodes={node.children} /></s>;
          case "highlight":
            return <mark key={i}><Inlines nodes={node.children} /></mark>;
          case "link":
            return (
              <a key={i} href={node.href} className="underline">
                <Inlines nodes={node.children} />
              </a>
            );
          case "image":
            return <img key={i} alt={node.alt} src={node.src} />;
          case "wikilink":
            return <Wikilink key={i} node={node} />;
          case "embed":
            return <Embed key={i} node={node} />;
          case "tag":
            return (
              <Link key={i} to={`/tags/${node.value}`} className="text-stone-500">
                #{node.value}
              </Link>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/** Transclusion. Replaces zettel's `<Zettel.id mode="full" />`. */
function Embed({ node }: { node: Extract<Inline, { t: "embed" }> }) {
  if (!node.href) return <span>{node.text}</span>;
  return (
    <aside className="my-4 border-l-2 border-stone-300 pl-4 text-stone-700">
      <Link to={node.href} className="font-medium">{node.text}</Link>
    </aside>
  );
}

// ── blocks ───────────────────────────────────────────────────────────────────

const HEADING_CLASS: Record<string, string> = {
  h1: "text-3xl font-bold mt-8 mb-3",
  h2: "text-2xl font-bold mt-7 mb-3",
  h3: "text-xl font-semibold mt-6 mb-2",
  h4: "text-lg font-semibold mt-5 mb-2",
  h5: "font-semibold mt-4 mb-2",
  h6: "font-semibold mt-4 mb-2",
};

function BlockNode({ block }: { block: Block }) {
  const children = <Inlines nodes={block.children ?? []} />;
  // data-index ties a rendered block to its chunk in the search index.
  const attrs = block.index !== null ? { "data-index": block.index } : {};

  switch (block.kind) {
    case "p":
      return <p className="my-3 leading-relaxed" {...attrs}>{children}</p>;
    case "h1": case "h2": case "h3": case "h4": case "h5": case "h6": {
      const Tag = block.kind;
      return <Tag className={HEADING_CLASS[block.kind]} {...attrs}>{children}</Tag>;
    }
    case "blockquote":
      return (
        <blockquote className="my-4 border-l-2 border-stone-300 pl-4 italic" {...attrs}>
          {children}
        </blockquote>
      );
    case "code":
      return (
        <pre className="my-4 overflow-x-auto rounded bg-stone-100 p-3 text-sm">
          <code>{block.value}</code>
        </pre>
      );
    case "hr":
      return <hr className="my-8 border-stone-300" />;
    case "li":
      return (
        <li className="ml-6 list-disc my-1"
            style={{ marginLeft: `${1.5 + (block.depth ?? 0) * 1.5}rem` }}
            {...attrs}>
          {children}
        </li>
      );
    default:
      return null;
  }
}

/** Consecutive `li` blocks are grouped so they render as real lists. */
export default function Markdown({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let run: Block[] = [];

  const flush = () => {
    if (!run.length) return;
    const ordered = run[0].ordered;
    const ListTag = ordered ? "ol" : "ul";
    out.push(
      <ListTag key={`list-${out.length}`} className="my-3">
        {run.map((b, i) => <BlockNode key={i} block={b} />)}
      </ListTag>,
    );
    run = [];
  };

  for (const block of blocks) {
    if (block.kind === "li") {
      run.push(block);
      continue;
    }
    flush();
    out.push(<BlockNode key={`b-${out.length}`} block={block} />);
  }
  flush();

  return <article>{out}</article>;
}
