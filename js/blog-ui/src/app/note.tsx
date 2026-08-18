import { Link } from "react-router-dom";

import Markdown from "@/render/markdown";
import type { NoteDocument } from "@/render/types";

export default function NotePage({ note }: { note: NoteDocument }) {
  return (
    <main className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{note.title}</h1>
        <div className="mt-1 text-sm text-stone-500">
          {note.date && <time dateTime={note.date}>{note.date}</time>}
          {note.tags.length > 0 && (
            <span className="ml-3">
              {note.tags.map((tag) => (
                <Link key={tag} to={`/tags/${tag}`} className="mr-2">
                  #{tag}
                </Link>
              ))}
            </span>
          )}
        </div>
      </header>

      <Markdown blocks={note.blocks} />

      {note.backlinks.length > 0 && (
        <footer className="mt-12 border-t border-stone-200 pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Linked from
          </h2>
          <ul className="mt-2">
            {note.backlinks.map((b) => (
              <li key={b.slug}>
                <Link to={`/n/${b.slug}`} className="underline">{b.title}</Link>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </main>
  );
}
