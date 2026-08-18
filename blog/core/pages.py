"""Page templates. Plain functions returning strings.

This replaces the React layer. The old one shipped no client JavaScript
either — it ran `renderToStaticMarkup` once at build time — so nothing is lost
by writing the same output directly.
"""
from __future__ import annotations

from html import escape

SITE_TITLE = "bziger"


def layout(title: str, body: str, description: str = "") -> str:
    meta = (
        f'<meta name="description" content="{escape(description, quote=True)}">'
        if description else ""
    )
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)}</title>
{meta}
<link rel="stylesheet" href="/style.css">
</head>
<body>
<nav><a class="home" href="/">{SITE_TITLE}</a></nav>
<main>
{body}
</main>
</body>
</html>
"""


def _tag_links(tags: list[str]) -> str:
    if not tags:
        return ""
    links = " ".join(
        f'<a class="tag" href="/tags/{escape(t)}/">#{escape(t)}</a>' for t in tags
    )
    return f'<span class="tags">{links}</span>'


def note_page(note: dict, body_html: str) -> str:
    date = (
        f'<time datetime="{escape(note["date"], quote=True)}">{escape(note["date"])}</time>'
        if note.get("date") else ""
    )
    backlinks = ""
    if note.get("backlinks"):
        items = "".join(
            f'<li><a href="/n/{escape(b["slug"], quote=True)}/">{escape(b["title"])}</a></li>'
            for b in note["backlinks"]
        )
        backlinks = f'<footer class="backlinks"><h2>Linked from</h2><ul>{items}</ul></footer>'

    body = f"""<article>
<header>
<h1>{escape(note['title'])}</h1>
<div class="meta">{date} {_tag_links(note.get('tags') or [])}</div>
</header>
{body_html}
</article>
{backlinks}"""
    return layout(note["title"], body, note.get("abstract", ""))


def listing_page(heading: str, notes: list[dict]) -> str:
    if not notes:
        items = '<p class="empty">Nothing published yet.</p>'
    else:
        items = "<ul class='listing'>" + "".join(
            f"""<li>
<a class="title" href="/n/{escape(n['slug'], quote=True)}/">{escape(n['title'])}</a>
{f'<time>{escape(n["date"])}</time>' if n.get('date') else ''}
{f'<p>{escape(n["abstract"])}</p>' if n.get('abstract') else ''}
</li>""" for n in notes
        ) + "</ul>"
    return layout(heading, f"<h1>{escape(heading)}</h1>{items}")
