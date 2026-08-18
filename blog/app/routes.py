"""Read-only JSON API over the published vault.

The React client renders the AST; it never parses markdown. One parser, in
notekit — see `architecture`.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.site import cached_site

router = APIRouter(prefix="/api")


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/notes")
async def list_notes(tag: str | None = None):
    site = cached_site()
    return {
        "notes": [
            {
                "slug": n.slug,
                "title": n.title,
                "date": n.date,
                "abstract": n.abstract,
                "tags": n.tags,
            }
            for n in site.listing(tag)
        ]
    }


@router.get("/tags")
async def list_tags():
    return {"tags": cached_site().tags()}


@router.get("/graph")
async def graph():
    return cached_site().graph()


@router.get("/notes/{slug:path}")
async def get_note(slug: str):
    document = cached_site().document(slug)
    if document is None:
        raise HTTPException(status_code=404, detail="not found")
    return document


@router.get("/search")
async def search(q: str = Query(min_length=1), n: int = 10, semantic: bool = True):
    """Substring always; semantic when the index is available.

    Semantic search is the one thing that needs a live server — it is why this
    API exists at all alongside the static build.
    """
    site = cached_site()
    results = _substring(site, q, n)

    if semantic:
        try:
            results = _merge(results, _semantic(site, q, n))
        except Exception as e:  # index missing or model mismatch
            return {"results": results[:n], "semantic": False, "reason": str(e)}
        return {"results": results[:n], "semantic": True}

    return {"results": results[:n], "semantic": False}


def _substring(site, q: str, n: int) -> list[dict]:
    needle = q.lower()
    hits = []
    for note in site.listing():
        haystack = f"{note.title} {note.abstract} {' '.join(note.tags)}".lower()
        if needle in haystack:
            hits.append({"slug": note.slug, "title": note.title,
                         "abstract": note.abstract, "score": 1.0, "how": "text"})
    return hits[: n * 2]


def _semantic(site, q: str, n: int) -> list[dict]:
    from notekit.config import DEFAULT_DB_PATH
    from notekit.embedding import default_embedding
    from notekit.embedding.index import open_collection, retrieve

    embedding = default_embedding()
    collection = open_collection(DEFAULT_DB_PATH, embedding)

    out = []
    for hit in retrieve(q, n * 3, collection, embedding):
        slug = hit["path"][:-3] if hit["path"].endswith(".md") else hit["path"]
        note = site.notes.get(slug)
        if note is None:
            continue  # unpublished: never surface it
        out.append({"slug": slug, "title": note.title, "abstract": note.abstract,
                    "score": hit["score"], "how": "semantic"})
    return out


def _merge(primary: list[dict], secondary: list[dict]) -> list[dict]:
    seen = {r["slug"] for r in primary}
    return primary + [r for r in secondary if r["slug"] not in seen]
