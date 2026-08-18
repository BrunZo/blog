import { Link } from "react-router-dom";

import type { NoteSummary } from "@/render/types";

export default function Listing({
  notes,
  heading,
}: {
  notes: NoteSummary[];
  heading: string;
}) {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">{heading}</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.slug} className="mb-5">
            <Link to={`/n/${note.slug}`} className="text-lg font-medium underline">
              {note.title}
            </Link>
            {note.date && (
              <span className="ml-2 text-sm text-stone-500">{note.date}</span>
            )}
            {note.abstract && (
              <p className="mt-1 text-stone-700">{note.abstract}</p>
            )}
          </li>
        ))}
      </ul>
      {notes.length === 0 && (
        <p className="text-stone-500">Nothing published yet.</p>
      )}
    </main>
  );
}
