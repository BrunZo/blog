"""The published subset of the vault.

Publishing is a property of a note (`publish: true` in frontmatter), not a copy
of it. There is no separate corpus: the blog reads `~/notes` through notekit and
filters.

Wikilinks to unpublished notes are *not* broken links — they render as plain
text. A private note must never leak its existence through a 404.
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import date, datetime
from functools import lru_cache
from pathlib import Path
from typing import Any

from notekit.graph import build_vault
from notekit.render.ast import note_to_ast

VAULT_PATH = Path(os.environ.get("VAULT_PATH", Path.home() / "notes"))


@dataclass
class Note:
    slug: str
    title: str
    path: str
    date: str | None
    abstract: str
    tags: list[str]
    frontmatter: dict


def _truthy(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"true", "yes", "1"}


def slug_for(rel_path: str) -> str:
    return rel_path[:-3] if rel_path.endswith(".md") else rel_path


def _as_iso(value: Any) -> str | None:
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    return str(value) if value else None


@dataclass
class Site:
    vault: Any
    notes: dict[str, Note]            # slug -> Note
    published_paths: dict[Path, str]  # abs path -> slug

    def href(self, target_stem_or_path: str) -> str | None:
        """Resolve a wikilink target to a public URL, or None if unpublished."""
        for path, slug in self.published_paths.items():
            if path.stem == target_stem_or_path or slug == target_stem_or_path.lstrip("/"):
                return f"/n/{slug}"
        return None

    def listing(self, tag: str | None = None) -> list[Note]:
        notes = list(self.notes.values())
        if tag:
            notes = [n for n in notes if tag in n.tags]
        return sorted(notes, key=lambda n: (n.date or "", n.title), reverse=True)

    def tags(self) -> dict[str, int]:
        counts: dict[str, int] = {}
        for note in self.notes.values():
            for tag in note.tags:
                counts[tag] = counts.get(tag, 0) + 1
        return dict(sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])))

    def document(self, slug: str) -> dict | None:
        note = self.notes.get(slug)
        if note is None:
            return None
        abs_path = next(p for p, s in self.published_paths.items() if s == slug)
        parsed = note_to_ast(abs_path.read_text(encoding="utf-8"), self.href)
        return {
            "slug": slug,
            "title": note.title,
            "date": note.date,
            "abstract": note.abstract,
            "tags": note.tags,
            "blocks": parsed["blocks"],
            "backlinks": self.backlinks(abs_path),
        }

    def backlinks(self, abs_path: Path) -> list[dict]:
        out = []
        for neighbor in self.vault.adjacency.get(abs_path, ()):
            slug = self.published_paths.get(neighbor)
            if slug:
                out.append({"slug": slug, "title": self.notes[slug].title})
        return sorted(out, key=lambda n: n["title"])

    def graph(self) -> dict:
        """Link graph restricted to published notes."""
        edges = set()
        for path, slug in self.published_paths.items():
            for neighbor in self.vault.adjacency.get(path, ()):
                other = self.published_paths.get(neighbor)
                if other:
                    edges.add(tuple(sorted((slug, other))))
        return {
            "nodes": [{"slug": s, "title": n.title, "tags": n.tags}
                      for s, n in self.notes.items()],
            "edges": [{"source": a, "target": b} for a, b in sorted(edges)],
        }


def _abstract(frontmatter: dict, abs_path: Path) -> str:
    stated = frontmatter.get("abstract")
    if stated:
        return str(stated)
    # First paragraph, plain text.
    from notekit.render import obsidian

    _, blocks = obsidian.parse(abs_path.read_text(encoding="utf-8"))
    for block in blocks:
        if block.kind == "p" and block.text.strip():
            text = obsidian.to_text([block])
            return text[0][:280] if text else ""
    return ""


def load_site(vault_path: Path = VAULT_PATH) -> Site:
    vault = build_vault(vault_path)
    notes: dict[str, Note] = {}
    published: dict[Path, str] = {}

    for path in vault.notes:
        frontmatter = vault.frontmatter.get(path) or {}
        if not _truthy(frontmatter.get("publish")):
            continue
        rel = vault.rel(path)
        slug = slug_for(rel)
        published[path] = slug
        notes[slug] = Note(
            slug=slug,
            title=str(frontmatter.get("title") or path.stem.replace("_", " ")),
            path=rel,
            date=_as_iso(frontmatter.get("date")),
            abstract=_abstract(frontmatter, path),
            tags=[str(t) for t in (vault.tags.get(path) or [])],
            frontmatter=frontmatter,
        )

    return Site(vault=vault, notes=notes, published_paths=published)


@lru_cache(maxsize=1)
def cached_site() -> Site:
    return load_site()
