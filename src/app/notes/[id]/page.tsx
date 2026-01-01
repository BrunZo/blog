import Link from "next/link";

import { filterZettels, zettelById } from "zettel/lib/retrieve";
import { getZettelVersions, getZettelAtVersion, getZettelDiff } from "zettel/lib/versions";
import Zettel from "zettel/ui/z/zettel";
import VersionSelector from "zettel/ui/components/version_selector";
import DiffViewer from "zettel/ui/components/diff_viewer";

export default async function Page({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ version?: string; diff?: string; from?: string; to?: string }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const versionParam = search?.version ? parseInt(search.version) : undefined;
  const diffMode = search?.diff === "1";
  const fromRevision = search?.from ? parseInt(search.from) : undefined;
  const toRevision = search?.to ? parseInt(search.to) : undefined;

  const versions = await getZettelVersions(id);

  let zettel;
  let diff: string | null = null;

  if (diffMode && fromRevision && toRevision) {
    diff = await getZettelDiff(id, fromRevision, toRevision);
  } else if (versionParam) {
    zettel = await getZettelAtVersion(id, versionParam);
  } else {
    zettel = await zettelById(id);
  }

  if (!zettel && !diff) {
    return (
      <div>
        <Link href="/notes" className='text-gray-500'>Back to notes</Link>
        <p>Zettel not found</p>
      </div>
    );
  }

  return (
    <>
      <Link href="/notes" className='text-gray-500'>Back to notes</Link>
      {versions.length > 0 && (
        <VersionSelector
          zettelId={id}
          versions={versions}
          currentRevision={versionParam}
          currentDiff={diffMode && fromRevision && toRevision ? { from: fromRevision, to: toRevision } : undefined}
        />
      )}
      {diffMode && diff && fromRevision && toRevision ? (
        <DiffViewer diff={diff} fromRevision={fromRevision} toRevision={toRevision} />
      ) : (
        <Zettel
          key={id}
          {...zettel}
          mode="full"
          showTitle={true}
          showDate={true}
          showTags={true}
          showAbstract={true}
          version={versionParam ? versions.find(v => v.revision === versionParam) : undefined}
        />
      )}
    </>
  );
}

export async function generateStaticParams() {
  const zettels = await filterZettels({ globPattern: "visible/**/*.{jsx,mdx}" });
  return zettels.map((zettel) => ({ id: zettel.id }));
}