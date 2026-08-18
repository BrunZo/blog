"""One-shot: MDX notes → vault markdown.

`~/code/notes` stored frontmatter as JS exports and transclusion as a Zettel
component. Both become plain YAML + `![[embed]]`, so the note can live in the
vault and be published from there.

Run against a scratch directory first:

    python -m app.migrate_mdx --src ../js/blog-ui/src/notes --out /tmp/migrated
    python -m app.migrate_mdx --src ../js/blog-ui/src/notes --out ~/notes/from_blog
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

EXPORT_STR = re.compile(r'export\s+const\s+(\w+)\s*=\s*[`"\']([^`"\']*)[`"\']\s*;?')
EXPORT_DATE = re.compile(r'export\s+const\s+(\w+)\s*=\s*new\s+Date\("([^"]+)"\)\s*;?')
EXPORT_LIST = re.compile(r'export\s+const\s+(\w+)\s*=\s*\[([^\]]*)\]\s*;?')
IMPORT_LINE = re.compile(r"^\s*import\s+.*$", re.MULTILINE)

# mode may be hyphenated ("semi-full") and the space before /> is optional
ZETTEL_FULL = re.compile(r'<Zettel\.(\w+)\s+mode=["\']((?:semi-)?full)["\']\s*/>')
ZETTEL_ANY = re.compile(r'<Zettel\.(\w+)(?:\s+mode=["\']([\w-]+)["\'])?\s*/>')
JSX_LEFTOVER = re.compile(r"<[A-Z][\w.]*[^>]*/>")


def convert(source: str) -> tuple[dict, str]:
    meta: dict = {}

    for match in EXPORT_DATE.finditer(source):
        meta[match.group(1)] = match.group(2).split(" ")[0]
    for match in EXPORT_LIST.finditer(source):
        items = [i.strip().strip("\"'") for i in match.group(2).split(",") if i.strip()]
        meta[match.group(1)] = items
    for match in EXPORT_STR.finditer(source):
        # backtick templates often span lines; collapse to a single line
        value = " ".join(match.group(2).split())
        meta.setdefault(match.group(1), value)

    body = EXPORT_DATE.sub("", source)
    body = EXPORT_LIST.sub("", body)
    body = EXPORT_STR.sub("", body)
    body = IMPORT_LINE.sub("", body)

    body = ZETTEL_FULL.sub(lambda m: f"![[{m.group(1)}]]", body)
    body = ZETTEL_ANY.sub(lambda m: f"[[{m.group(1)}]]", body)

    return meta, body.strip() + "\n"


def to_frontmatter(meta: dict, published: bool) -> str:
    """Serialize with yaml, never by hand.

    Abstracts contain LaTeX, and `\\to` inside a double-quoted YAML scalar is an
    invalid escape — the document silently loses its frontmatter.
    """
    import yaml

    data: dict = {}
    for key in ("title", "date", "abstract"):
        if meta.get(key):
            data[key] = meta[key]
    if meta.get("tags"):
        data["tags"] = meta["tags"]
    data["publish"] = published

    body = yaml.safe_dump(data, allow_unicode=True, sort_keys=False,
                          default_flow_style=False, width=10_000)
    return f"---\n{body}---\n\n"


def parse_args():
    ap = argparse.ArgumentParser(description="Convert MDX notes to vault markdown.")
    ap.add_argument("--src", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--flatten", action="store_true",
                    help="Drop the visible/ prefix; publication is frontmatter now.")
    return ap.parse_args()


def main():
    args = parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    converted = warnings = 0

    for path in sorted(args.src.rglob("*.mdx")):
        rel = path.relative_to(args.src)
        # `visible/` was the old publish gate; it becomes `publish: true`.
        published = rel.parts[0] == "visible"
        parts = rel.parts[1:] if (published and args.flatten) else rel.parts

        meta, body = convert(path.read_text(encoding="utf-8"))
        leftover = JSX_LEFTOVER.findall(body)
        if leftover:
            warnings += 1
            print(f"  ! {rel}: unconverted JSX {leftover[:3]}")

        target = args.out.joinpath(*parts).with_suffix(".md")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(to_frontmatter(meta, published) + body, encoding="utf-8")
        converted += 1

    jsx = sorted(args.src.rglob("*.jsx"))
    for path in jsx:
        print(f"  ! {path.relative_to(args.src)}: React component, not a note — "
              f"rewrite as a generated listing")

    print(f"\nconverted {converted} notes ({warnings} with leftover JSX), "
          f"{len(jsx)} components need rewriting")


if __name__ == "__main__":
    main()
