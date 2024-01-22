import Card from "./card";

export default function CardGrid({ notes }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {notes.map((article) => (
        <Card
          id={article.id}
          title={article.title}
          abstract={article.abstract}
          date={article.date} />
      ))}
    </div>
  );
}