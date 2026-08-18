/**
 * Static build. Reads the JSON that `python -m app.export` produced and
 * pre-renders every page.
 *
 * There is no MDX here any more: markdown is parsed once, in Python, by
 * notekit. This file only turns an AST into HTML.
 */
import { execFileSync } from "child_process";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { dirname } from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";

import Listing from "@/app/listing";
import NotePage from "@/app/note";
import RootLayout from "@/layout";
import { loadAllNotes, loadIndex } from "@/render/content";

interface Page {
  location: string;
  filename: string;
  element: React.ReactNode;
}

const OUT = process.env.OUT_DIR ?? "dist";

const index = loadIndex();
const notes = loadAllNotes();

const pages: Page[] = [
  {
    location: "/",
    filename: "index",
    element: <Listing notes={index.notes} heading="Notes" />,
  },
];

for (const note of notes) {
  pages.push({
    location: `/n/${note.slug}`,
    filename: `n/${note.slug}/index`,
    element: <NotePage note={note} />,
  });
}

for (const tag of Object.keys(index.tags)) {
  pages.push({
    location: `/tags/${tag}`,
    filename: `tags/${tag}/index`,
    element: (
      <Listing
        notes={index.notes.filter((n) => n.tags.includes(tag))}
        heading={`#${tag}`}
      />
    ),
  });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let rendered = 0;
for (const page of pages) {
  try {
    const html =
      "<!DOCTYPE html>" +
      renderToStaticMarkup(
        <StaticRouter location={page.location}>
          <RootLayout>{page.element}</RootLayout>
        </StaticRouter>,
      );
    const outPath = `${OUT}/${page.filename}.html`;
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    rendered += 1;
  } catch (error) {
    console.warn(`skipping ${page.location}:`, error);
  }
}

console.log(`rendered ${rendered}/${pages.length} pages`);

execFileSync(
  "npx",
  ["@tailwindcss/cli", "-i", "src/ui/global.css", "-o", `${OUT}/global.css`],
  { stdio: "inherit" },
);
