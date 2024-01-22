import Link from "next/link";

export default function Card({id, title, abstract, date}: {
  id: number,
  title: string,
  abstract: string,
  date: string
}) {
  return (
    <Link
      className='flex flex-col h-72 p-4 mt-8 border rounded-[25px] hover:bg-gray-100 overflow-hidden hover:overflow-scroll'
      href={`/notes/${id}`}>
        <h1 className='font-bold text-gray-800 text-2xl m-0'>{title}</h1>
        <p className='text-gray-500 text-sm'>{date.toLocaleString()}</p>
        <p className='text-gray-800 text-md'>{abstract}</p>
    </Link>
  );
}