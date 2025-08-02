import CardGrid from "app/ui/notes/card-grid";
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
  const paths = await fetchFilteredNotes(searchParams);
  const notes = await Promise.all(
    paths.map(async (path) => {
      const { title, date, abstract } = await import(`@/app/content/${path}.mdx`)
      return {
        id: path,
        title: title,
        abstract: abstract,
        date: date
      }
    })
  )

  return (
    <>
      <h1 className='text-gray-800 text-3xl font-bold mt-2'>notes</h1>
      <Search/>
      { notes.length > 0 ? (
        <>
          <CardGrid notes={notes}/>
          <Pagination amountPages={amountPages}/>
        </>
      ) : (
        <p className="text-center text-gray-800 italic my-20">
            Nothing here...
        </p>
      )}
      <p className='italic text-gray-800'>(Timestamps are in minutes since my birth time.)</p>
    </>
  );
}
