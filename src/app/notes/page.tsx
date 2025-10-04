import CardGrid from "@/ui/notes/card_grid";
import Pagination from "@/ui/notes/pagination";
import Search from "@/ui/notes/search";
import { fetchAmountPages, fetchFilteredNotes } from "@/lib/notes_retriever";

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
      const { title, date, abstract } = await import(`@/content/${path}.mdx`)
      const millisecondsSinceBirth = date.getTime() - new Date("2004-07-21 10:08:00").getTime();
      const minutesSinceBirth = millisecondsSinceBirth / 60000;

      return {
        id: path,
        title: title,
        abstract: abstract,
        date: minutesSinceBirth
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
