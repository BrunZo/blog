import ZettelList from "zettel/ui/z/zettel_list";
import { filterZettels } from "zettel/lib/retrieve";

export const id = "topology";
export const title = "Topology";
export const abstract = "Topology is the study of spaces and their properties.";
export const tags = ["math", "topology"];
export const date = new Date("2025-10-21 16:20:00");

export default async function Topology() {
    const zettels = await filterZettels({ 
        globPattern: "hidden/math/top/**/*.mdx", 
        sortMethod: (a, b) => (a.sectionNumber || 0) - (b.sectionNumber || 0) 
    });
    return <ZettelList zettels={zettels} />;
}
