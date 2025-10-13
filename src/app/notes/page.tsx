import CardGrid from "@/ui/notes/card_grid";
import Pagination from "@/ui/notes/pagination";
import Search from "@/ui/notes/search";
import TagFilter from "@/ui/notes/tag_filter";
import { fetchAmountPages, fetchFilteredNotes, fetchAllTags } from "@/lib/notes_retriever";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string
    tags?: string | string[]
    page?: string
  }>;
}) {
  const params = await searchParams;
  
  // Parse tags parameter - it can be a string or array
  const tagsParam = params?.tags;
  const tags = Array.isArray(tagsParam) 
    ? tagsParam 
    : tagsParam 
      ? tagsParam.split(',') 
      : undefined;

  const parsedSearchParams = {
    ...params,
    tags
  };

  const amountPages = await fetchAmountPages(parsedSearchParams);
  const paths = await fetchFilteredNotes(parsedSearchParams);
  const availableTags = await fetchAllTags();
  const notes = await Promise.all(
    paths.map(async (path) => {
      const { title, date, abstract, tags } = await import(`@/content/${path}.mdx`)
      const millisecondsSinceBirth = date.getTime() - new Date("2004-07-21 10:08:00").getTime();
      const minutesSinceBirth = millisecondsSinceBirth / 60000;

      return {
        id: path,
        title: title,
        abstract: abstract,
        date: minutesSinceBirth,
        tags: tags || []
      }
    })
  )

  return (
    <>
      <h1 className='text-gray-800 text-3xl font-bold mt-2'>notes</h1>
      <div className='flex flex-col sm:flex-row gap-4 mt-4'>
        <div className='flex-1'>
          <Search/>
        </div>
        <div className='flex-1'>
          <TagFilter availableTags={availableTags} />
        </div>
      </div>
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
