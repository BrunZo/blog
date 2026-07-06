import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import { dirname, join, relative } from "path";
import { pathToFileURL } from "url";
import { execFileSync } from "child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import { compile, evaluateSync } from "@mdx-js/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import * as runtime from "react/jsx-runtime";

import RootLayout from "@/layout";
import HomePage from "@/app/home";
import PhiPage from "@/app/phi";

const MDX_OPTIONS = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [[rehypeKatex, { strict: true, throwOnError: true }]],
};

rmSync("dist", { recursive: true, force: true });
rmSync(".mdx-cache", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

const aboutMeSource = readFileSync("src/app/about-me.mdx", "utf-8");
const { default: AboutMe } = evaluateSync(aboutMeSource, {
  ...runtime,
  ...MDX_OPTIONS,
} as any);

// index pages
const pages: { location: string; component: any; filename: string }[] = [
  { location: "/", component: HomePage, filename: "index" },
  { location: "/about-me", component: AboutMe, filename: "about-me/index" },
  { location: "/phi", component: PhiPage, filename: "phi/index" },
];

// notes pages
async function loadNoteComponent(fullPath: string) {
  const source = readFileSync(fullPath, "utf-8");
  const compiled = await compile(source, {
    outputFormat: "program",
    ...MDX_OPTIONS,
  });
  const cachePath = join(".mdx-cache", relative("src/notes", fullPath)).replace(
    /\.mdx$/,
    ".mjs",
  );
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, String(compiled));
  return import(pathToFileURL(cachePath).href);
}

async function walkNotes(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkNotes(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      const slug = relative("src/notes", fullPath).replace(/\.mdx$/, "");
      try {
        const mod = await loadNoteComponent(fullPath);
        pages.push({
          location: `/notes/${slug}`,
          component: mod.default,
          filename: `notes/${entry.name.replace(".mdx", "")}/index`,
        });
      } catch (error) {
        console.warn(`skipping notes/${slug}:`, error);
      }
    }
  }
}

await walkNotes("src/notes");

// compile all React pages
for (const page of pages) {
  const Component = page.component;
  try {
    const html =
      "<!DOCTYPE html>" +
      renderToStaticMarkup(
        <StaticRouter location={page.location}>
          <RootLayout>
            <Component />
          </RootLayout>
        </StaticRouter>,
      );
    const outPath = `dist/${page.filename}.html`;
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
  } catch (error) {
    console.warn(`skipping render of ${page.location}:`, error);
  }
}

rmSync(".mdx-cache", { recursive: true, force: true });

// compile tailwindcss styles
execFileSync(
  "npx",
  ["@tailwindcss/cli", "-i", "src/ui/global.css", "-o", "dist/global.css"],
  {
    stdio: "inherit",
  },
);
