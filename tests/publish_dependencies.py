"""The publish gate must hold in both directions.

Two failures matter and neither raises on its own:

1. A published page links to a page that does not exist. That is a build fault.
2. A published page leaks the existence of an unpublished note — by linking to
   it, or by repeating its title.

Run against a built site:

    python -m pytest tests/ --site dist
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest

from blog.app.site import load_site

HREF = re.compile(r'href="(/[^"#?]*)"')


@pytest.fixture(scope="session")
def site(request):
    return load_site(Path(request.config.getoption("--vault")))


@pytest.fixture(scope="session")
def built(request):
    out = Path(request.config.getoption("--site"))
    if not out.is_dir():
        pytest.skip(f"{out} not built — run `python -m core.build --out {out}`")
    return out


@pytest.fixture(scope="session")
def routes(built):
    """Every route the built site actually serves."""
    return {
        "/" + p.parent.relative_to(built).as_posix().strip(".") + "/"
        for p in built.rglob("index.html")
    } | {"/"}


def test_something_is_published(site):
    assert site.notes, "no note has `publish: true`"


def test_every_internal_link_resolves(built, routes):
    broken: set[tuple[str, str]] = set()
    for page in built.rglob("*.html"):
        for href in HREF.findall(page.read_text(encoding="utf-8")):
            if href.startswith(("//", "http")) or "." in href.rsplit("/", 1)[-1]:
                continue
            if not href.endswith("/"):
                href += "/"
            if href not in routes:
                broken.add((page.relative_to(built).as_posix(), href))
    assert not broken, f"links to pages that do not exist: {sorted(broken)}"


def test_no_link_points_at_an_unpublished_note(site, built):
    """Unpublished targets must render as text, never as an anchor."""
    published_slugs = set(site.notes)
    offenders: set[str] = set()
    for page in built.rglob("*.html"):
        for href in HREF.findall(page.read_text(encoding="utf-8")):
            if not href.startswith("/n/"):
                continue
            slug = href[len("/n/"):].strip("/")
            if slug not in published_slugs:
                offenders.add(href)
    assert not offenders, f"anchors into unpublished notes: {sorted(offenders)}"


def test_unpublished_titles_do_not_appear(site, built):
    """A private note's title should not be readable on the public site.

    Wikilinks fall back to the *target* text, which is the filename, so a
    private note named `divorce_plans` would still print those words. This is
    the check that catches it.
    """
    vault = site.vault
    published = set(site.published_paths)
    published_stems = {p.stem for p in published}
    private_stems = {
        p.stem for p in vault.notes
        if p not in published
        and len(p.stem) > 12          # short stems collide with ordinary prose
        and p.stem not in published_stems  # a name shared with a public note is not private
    }
    if not private_stems:
        pytest.skip("no private notes with distinctive names")

    leaked: dict[str, str] = {}
    for page in built.rglob("*.html"):
        text = page.read_text(encoding="utf-8")
        for stem in private_stems:
            if stem in text:
                leaked[stem] = page.relative_to(built).as_posix()
    assert not leaked, f"private note names appear on public pages: {leaked}"
