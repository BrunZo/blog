"""Generate the whole static site.

    python -m core.build --out dist [--vault ~/notes]

Renders straight from notekit blocks. The JSON export is for the API and any
future client, not for this build — a serialize/deserialize round-trip would
buy nothing here.
"""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from notekit.render import obsidian

from blog.app.site import VAULT_PATH, Site, load_site
from blog.core import pages
from blog.core.html import blocks_to_html

STYLE = Path(__file__).parent / "style.css"


def parse_args():
    ap = argparse.ArgumentParser(description="Build the static site.")
    ap.add_argument("--out", type=Path, default=Path("dist"))
    ap.add_argument("--vault", type=Path, default=VAULT_PATH)
    return ap.parse_args()


def write(out: Path, route: str, html: str) -> None:
    """`/n/foo` → `out/n/foo/index.html`, so nginx resolves clean URLs."""
    target = out / route.strip("/") / "index.html" if route.strip("/") else out / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding="utf-8")


def build(out: Path, site: Site) -> int:
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    notes = site.listing()
    count = 0

    write(out, "/", pages.listing_page("Notes", [_summary(n) for n in notes]))
    count += 1

    for note in notes:
        path = next(p for p, s in site.published_paths.items() if s == note.slug)
        _, blocks = obsidian.parse(path.read_text(encoding="utf-8"))
        body = blocks_to_html(blocks, site.href)
        document = {
            "slug": note.slug,
            "title": note.title,
            "date": note.date,
            "abstract": note.abstract,
            "tags": note.tags,
            "backlinks": site.backlinks(path),
        }
        write(out, f"/n/{note.slug}", pages.note_page(document, body))
        count += 1

    for tag in site.tags():
        tagged = [_summary(n) for n in site.listing(tag)]
        write(out, f"/tags/{tag}", pages.listing_page(f"#{tag}", tagged))
        count += 1

    shutil.copyfile(STYLE, out / "style.css")
    return count


def _summary(note) -> dict:
    return {
        "slug": note.slug,
        "title": note.title,
        "date": note.date,
        "abstract": note.abstract,
        "tags": note.tags,
    }


def main():
    args = parse_args()
    site = load_site(args.vault)
    if not site.notes:
        raise SystemExit("nothing published — add `publish: true` to a note")
    count = build(args.out, site)
    print(f"built {count} pages from {len(site.notes)} published notes → {args.out}")


if __name__ == "__main__":
    main()
