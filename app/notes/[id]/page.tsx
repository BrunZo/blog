import { MongoClient } from "mongodb";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('local');
  const article = await db.collection('notes').findOne({ id: Number(params.id) });
  if (!article) {
    console.log('article not found')
    return "404"
  }
  else
    return (
      <>
        <Link
          href='/notes'
          className='text-md text-gray-500 hover:text-gray-800'>
            Volver al archivo de notas
        </Link>
        <h1 className='font-bold text-gray-800 text-2xl'>{article.title}</h1>
        <p className='text-gray-500 text-sm'>{article.date.toLocaleString()}</p>
        <main
          className='text-gray-800 text-md'
          dangerouslySetInnerHTML={{__html: article.content}}/>
      </>
  )
}