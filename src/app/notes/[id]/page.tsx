import Link from "next/link";
import { zettelById } from "zettel/lib/retrieve";
import Zettel from "zettel/ui/z/zettel";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const zettel = await zettelById(id);

  return (
    <>
      <Link href="/notes" className='text-gray-500'>Back to notes</Link>
      <Zettel key={id} {...zettel} mode="full" showTitle={true} showDate={true} showTags={true} showAbstract={true} />
    </>
  );
}
