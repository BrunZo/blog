import fs from "fs";
import path from "path";
import Link from "next/link";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const { default: Note, title, date } = await import(`@/app/content/${id}.mdx`);
  const millisecondsSinceBirth = date - new Date("2004-07-21 10:08:00");
  const minutesSinceBirth = millisecondsSinceBirth / 60000;

  if (!Note) {
    return (
      <>
        <Link
          href='/notes'
          className='text-md text-gray-500 hover:text-gray-800'>
            Return to note list
        </Link>
        <div className="p-4 text-red-600 font-bold">
            404 — Note not found for id "{id}"
        </div>
      </> 
    ) 
  }

  return (
    <>
      <Link
        href='/notes'
        className='text-md text-gray-500 hover:text-gray-800'>
          Return to note list
      </Link>
      <h1 className='font-bold text-gray-800 text-2xl'>{title}</h1>
      <p className='text-gray-500 text-sm'>{minutesSinceBirth}</p>
      <Note />
    </>
  )
}

/**
 * This is necessary for the above function to be async and import MDX components
 */
export async function generateStaticParams() {
  const baseDir = path.join(process.cwd(), 'app/content');
  const paths = fs.readdirSync(baseDir)
                    .filter((file) => file.endsWith('.mdx'));
  const params = paths.map(path => ({ id: path.replace(/\.mdx$/, '') }))
  return params;
}

// Force all params to be on the statically generated list
export const dynamicParams = false;
