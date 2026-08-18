// Mirrors notekit/render/ast.py. Keep in sync — it is the API contract.

export type Inline =
  | { t: "text"; value: string }
  | { t: "code"; value: string }
  | { t: "math_inline"; value: string }
  | { t: "math_display"; value: string }
  | { t: "tag"; value: string }
  | { t: "bold"; children: Inline[] }
  | { t: "italic"; children: Inline[] }
  | { t: "bolditalic"; children: Inline[] }
  | { t: "strike"; children: Inline[] }
  | { t: "highlight"; children: Inline[] }
  | { t: "link"; href: string; children: Inline[] }
  | { t: "image"; alt: string; src: string }
  | { t: "wikilink"; target: string; text: string; href: string | null }
  | {
      t: "embed";
      target: string;
      section: string | null;
      text: string;
      href: string | null;
    };

export type BlockKind =
  | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "li" | "blockquote" | "code" | "hr";

export interface Block {
  kind: BlockKind;
  /** Position among embeddable blocks, or null. Matches the search index. */
  index: number | null;
  children?: Inline[];
  value?: string;
  depth?: number;
  ordered?: boolean;
}

export interface NoteSummary {
  slug: string;
  title: string;
  date: string | null;
  abstract: string;
  tags: string[];
}

export interface NoteDocument extends NoteSummary {
  blocks: Block[];
  backlinks: { slug: string; title: string }[];
}
