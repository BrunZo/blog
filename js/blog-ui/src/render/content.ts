/**
 * Reads the JSON that `python -m app.export` wrote. Build-time only.
 *
 * The static build and the live API share the same producer, so they cannot
 * disagree about what is published.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";

import type { NoteDocument, NoteSummary } from "./types";

const CONTENT_DIR = process.env.CONTENT_DIR ?? "src/content";

export interface Index {
  notes: NoteSummary[];
  tags: Record<string, number>;
}

function read<T>(relative: string): T {
  const path = join(CONTENT_DIR, relative);
  if (!existsSync(path)) {
    throw new Error(
      `missing ${path} — run: python -m app.export --out ${CONTENT_DIR}`,
    );
  }
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export const loadIndex = (): Index => read<Index>("index.json");

export const loadNote = (slug: string): NoteDocument =>
  read<NoteDocument>(join("notes", `${slug}.json`));

export function loadAllNotes(): NoteDocument[] {
  return loadIndex().notes.map((n) => loadNote(n.slug));
}
