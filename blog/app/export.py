"""Dump the API's responses as static JSON, for the build.

Same code path as the live server, so the static site and the API can never
disagree. `build.tsx` reads this directory instead of evaluating MDX.

    python -m app.export --out js/blog-ui/src/content
"""
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from app.site import VAULT_PATH, load_site


def parse_args():
    ap = argparse.ArgumentParser(description="Export the published vault as JSON.")
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--vault", type=Path, default=VAULT_PATH)
    return ap.parse_args()


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")


def export(out: Path, vault_path: Path) -> int:
    site = load_site(vault_path)

    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    write_json(out / "index.json", {
        "notes": [
            {"slug": n.slug, "title": n.title, "date": n.date,
             "abstract": n.abstract, "tags": n.tags}
            for n in site.listing()
        ],
        "tags": site.tags(),
    })
    write_json(out / "graph.json", site.graph())

    for slug in site.notes:
        write_json(out / "notes" / f"{slug}.json", site.document(slug))

    return len(site.notes)


def main():
    args = parse_args()
    count = export(args.out, args.vault)
    print(f"exported {count} published notes to {args.out}")
    if count == 0:
        print("nothing published — add `publish: true` to a note's frontmatter")


if __name__ == "__main__":
    main()
