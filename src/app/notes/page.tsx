import ZettelSearch from "zettel/ui/zettel_search";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string
    tags?: string | string[]
    page?: string
  }>;
}) {
  return <ZettelSearch searchParams={searchParams} />;
}
