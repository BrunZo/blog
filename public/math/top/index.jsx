import { Zettels } from "zettel/lib/proxy";

export const id = "topology";
export const title = "Topology";

export default function Topology() {
    return (
        <div>
            <Zettels.topological_space mode="semi-full" showTitle={true} />
            <Zettels.hausdorff_axiom mode="semi-full" showTitle={true} />
        </div>
    )
}