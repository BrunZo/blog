import CardGrid from "app/ui/notes/card-grid";
import { MongoClient } from "mongodb";
import Pagination from "app/ui/notes/pagination";
import Search from "app/ui/notes/search";
import { fetchAmountPages, fetchFilteredArticles as fetchFilteredNotes } from "app/lib/notes-retriever";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    tags?: string[]
    page?: string
  };
}) {
  const amountPages = await fetchAmountPages(searchParams);
  const notes = await fetchFilteredNotes(searchParams);

  return (
    <>
      <h1 className='text-gray-800 text-3xl font-bold mt-2'>Archivo de notas</h1>
      <p className='text-gray-800'>Listado de artículos por orden cronológico.</p>
      <Search/>
      { notes.length > 0 ? (
        <>
          <CardGrid notes={notes}/>
          <Pagination amountPages={amountPages}/>
        </>
      ) : (
        <h2 className="text-center text-lg mt-32">
          No se encontró ninguna nota con los parámetros indicados.
        </h2>
      )}
    </>
  );
}