"""notekit blocks → HTML.

notekit's own `to_html` is close, but it hard-codes `/visualize/` link targets
and leaves math for a client to typeset. Here links go through the site's
resolver and math becomes MathML at build time, so the site ships no
JavaScript at all.
"""
from __future__ import annotations

import re
from html import escape
from typing import Callable

from notekit.render import markdown, obsidian
from notekit.render import patterns as pat

Resolver = Callable[[str], str | None]

# Inline kinds that wrap further markdown, and which group holds it.
NESTED = {"bold": 0, "italic": 0, "bolditalic": 0, "strike": 0, "highlight": 0}

WRAPPER = {
    "bold": ("<strong>", "</strong>"),
    "italic": ("<em>", "</em>"),
    "bolditalic": ("<strong><em>", "</em></strong>"),
    "strike": ("<del>", "</del>"),
    "highlight": ("<mark>", "</mark>"),
}

HEADINGS = {f"h{i}" for i in range(1, 7)}


# Personal shorthands. A converter only knows standard LaTeX, so `\R` came
# through as the literal text "\R". Expand before converting.
# The negative lookahead stops `\R` from eating `\Rightarrow`.
MACROS = {
    r"\R": r"\mathbb{R}",
    r"\N": r"\mathbb{N}",
    r"\Z": r"\mathbb{Z}",
    r"\Q": r"\mathbb{Q}",
    r"\C": r"\mathbb{C}",
    r"\eps": r"\varepsilon",
}
_MACRO_RE = re.compile(
    "|".join(re.escape(k) + r"(?![A-Za-z])" for k in sorted(MACROS, key=len, reverse=True))
)


def expand_macros(tex: str) -> str:
    return _MACRO_RE.sub(lambda m: MACROS[m.group(0)], tex)


def math(tex: str, display: bool) -> str:
    """LaTeX → MathML. Falls back to the source so nothing is ever swallowed."""
    try:
        from latex2mathml.converter import convert

        out = convert(expand_macros(tex))
        if display:
            out = out.replace('display="inline"', 'display="block"', 1)
            return f'<div class="math-display">{out}</div>'
        return out
    except Exception:
        tag = "div" if display else "span"
        return f'<{tag} class="math-raw">{escape(tex)}</{tag}>'


def inline(text: str, resolve: Resolver) -> str:
    out: list[str] = []
    for token in pat.tokenize(text, obsidian.OBSIDIAN_INLINE_PATTERNS):
        if isinstance(token, str):
            out.append(escape(token))
            continue

        kind, groups = token

        if kind in NESTED:
            open_tag, close_tag = WRAPPER[kind]
            out.append(open_tag + inline(groups[0], resolve) + close_tag)
        elif kind == "escaped":
            out.append(escape(groups[0]))
        elif kind == "code":
            out.append(f"<code>{escape(groups[0])}</code>")
        elif kind == "math_inline":
            out.append(math(groups[0], display=False))
        elif kind == "math_display":
            out.append(math(groups[0], display=True))
        elif kind == "wikilink":
            target, alias = groups
            out.append(_wikilink(target, alias or target, resolve))
        elif kind == "embed":
            target, _section, alias = groups
            out.append(_embed(target, alias or target, resolve))
        elif kind == "tag":
            name = groups[0]
            out.append(f'<a class="tag" href="/tags/{escape(name)}/">#{escape(name)}</a>')
        elif kind == "link":
            label, href = groups
            out.append(f'<a href="{escape(href, quote=True)}">{inline(label, resolve)}</a>')
        elif kind == "image":
            alt, src = groups
            out.append(f'<img alt="{escape(alt, quote=True)}" src="{escape(src, quote=True)}">')
        else:
            out.append(escape("".join(groups)))
    return "".join(out)


def _wikilink(target: str, label: str, resolve: Resolver) -> str:
    # An unpublished target is plain text, never a link. A private note must
    # not reveal that it exists.
    href = resolve(target)
    if not href:
        return escape(label)
    return f'<a href="{escape(href, quote=True)}">{escape(label)}</a>'


def _embed(target: str, label: str, resolve: Resolver) -> str:
    href = resolve(target)
    if not href:
        return escape(label)
    return (
        f'<aside class="embed"><a href="{escape(href, quote=True)}">'
        f"{escape(label)}</a></aside>"
    )


def blocks_to_html(blocks: list[markdown.Block], resolve: Resolver) -> str:
    """Render blocks, grouping runs of list items into real lists.

    Embeddable blocks carry `data-index`, in the same order `to_text` uses, so
    a search hit can point at the block it came from.
    """
    out: list[str] = []
    index = 0
    run: list[tuple[markdown.Block, int]] = []

    def flush() -> None:
        nonlocal run
        if not run:
            return
        tag = "ol" if run[0][0].ordered else "ul"
        items = "".join(
            f'<li data-index="{i}">{inline(b.text, resolve)}</li>' for b, i in run
        )
        out.append(f"<{tag}>{items}</{tag}>")
        run = []

    for block in blocks:
        if block.kind == "li":
            run.append((block, index))
            index += 1
            continue
        flush()

        if block.kind == "code":
            out.append(f"<pre><code>{escape(block.text)}</code></pre>")
        elif block.kind == "hr":
            out.append("<hr>")
        elif block.kind in HEADINGS:
            out.append(f'<{block.kind} data-index="{index}">'
                       f"{inline(block.text, resolve)}</{block.kind}>")
            index += 1
        elif block.kind == "blockquote":
            out.append(f'<blockquote data-index="{index}">'
                       f"{inline(block.text, resolve)}</blockquote>")
            index += 1
        else:
            out.append(f'<p data-index="{index}">{inline(block.text, resolve)}</p>')
            index += 1

    flush()
    return "\n".join(out)


def note_to_html(text: str, resolve: Resolver) -> str:
    _, blocks = obsidian.parse(text)
    return blocks_to_html(blocks, resolve)
