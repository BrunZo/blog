'use client';

import Card from "./card";

export default function CardGrid({ notes }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {notes.map((note) => (
        <Card
          key={note.id}
          id={note.id}
          title={note.title}
          abstract={note.abstract}
          date={note.date} />
      ))}
    </div>
  );
}
