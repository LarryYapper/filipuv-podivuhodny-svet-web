#!/usr/bin/env python3
"""Verify the site carries no stale Poštovní klub copy and no broken links.

Run: python tools/check_site.py
Exit 0 when clean, 1 when violations are found.
"""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import NamedTuple

# The Windows console defaults to cp1252 and cannot print "ň" or "ě";
# without this the script dies with UnicodeEncodeError on its own output.
sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent

# Historical edition pages and the one-off VÍTEJ funnel are exempt: they
# describe past sends or negate subscriptions, which stays true.
EXEMPT = {
    "edice-alfa-vitej.html",
    "edice-alfa-zvykovnik.html",
    "edice-alfa-postovne.html",
    "edice-alfa-dekuji.html",
    "edice-vitej-objednavka.html",
    "test-button.html",
    "404.html",
}

# Redirect stubs legitimately name the old URLs they replace.
REDIRECT_STUBS = {
    "postovni-klub-uroven-1-objednavka.html",
    "postovni-klub-uroven-2-objednavka.html",
    "postovni-klub-uroven-3-objednavka.html",
}

# Elements with no closing tag in HTML. A bare "<br>" or "<img ...>" must
# never be treated as an opener waiting for a "</br>"/"</img>" that will
# never come.
VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

FORBIDDEN = [
    # Catches every declension: Úroveň 2, Úrovně 3, z Úrovně 1, Úrovní 2 ...
    (r"[Úú]rov(?:eň|ně|ni|ní)\s*[123]\b", "tier-name"),
    (r"[Úú]rovn[ěí]\s+členství", "tier-name"),
    (r"\b(119|139|250)\s*Kč", "old-price"),
    (r"Správa předplatného", "subscription-ui"),
    (r"opakovan[éý]ch?\s+plat", "recurring-payment"),
    (r"narozenin", "cancelled-item"),
    (r"měsíční\s+předplatné", "recurring-payment"),
    (r"jedním\s+klikem", "cancel-promise"),
    # "Become a member" no longer matches the model — visitors order an
    # edition, they don't join. Catches the infinitive ("Stát se členem")
    # and the imperative ("staň (se) členem"), both found live on the site.
    (r"[Ss]tát\s+se\s+členem|staň\s+(?:se\s+)?(?:\w+\s+)?členem", "membership-cta"),
    # Editions ship every two months. Matches the bare cadence claim
    # ("každý měsíc", "každého měsíce") but deliberately NOT the adjective
    # "měsíční", because the planned tear-off calendar is genuinely a
    # monthly product ("Stolní odtrhávací, měsíční foto, A3") and that copy
    # is correct as written.
    (r"každ[ýého]{1,3}\s+měsíc", "wrong-cadence"),
]

# "Žádné předplatné" / "bez předplatného" are fine and must survive; an
# affirmative promise of one is not. The negation has to sit right in front
# of the word — a stray "bez závazku" later in the sentence must not excuse
# "Předplatné se opakuje každý měsíc". IGNORECASE matters: both words start
# sentences, so "Předplatné" and "Bez" appear capitalised.
SUBSCRIPTION = re.compile(r"předplatn", re.IGNORECASE)
NEGATED_SUBSCRIPTION = re.compile(
    r"(?:žádn\w*|\bbez\b)\s+(?:\w+\s+){0,2}předplatn", re.IGNORECASE
)


class Violation(NamedTuple):
    path: str
    line: int
    rule: str
    text: str


def html_files(root: Path) -> list[Path]:
    return sorted(
        p for p in root.glob("*.html")
        if p.name not in EXEMPT
    )


def find_forbidden_copy(root: Path) -> list[Violation]:
    out: list[Violation] = []
    for path in html_files(root):
        if path.name in REDIRECT_STUBS:
            continue
        for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            for pattern, rule in FORBIDDEN:
                if re.search(pattern, line):
                    out.append(Violation(path.name, n, rule, line.strip()[:110]))
            if SUBSCRIPTION.search(line) and not NEGATED_SUBSCRIPTION.search(line):
                out.append(Violation(path.name, n, "subscription-copy", line.strip()[:110]))
    return out


def find_broken_links(root: Path) -> list[Violation]:
    """Check every internal .html link, including the nav and footer.

    components.js holds the site's primary navigation as a template string,
    so it must be scanned too — a typo there breaks every page at once.
    """
    out: list[Violation] = []
    href = re.compile(r'href="([^"#?:]+\.html)')
    targets = sorted(root.glob("*.html")) + [root / "components.js"]
    for path in targets:
        if not path.exists():
            continue
        for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            for target in href.findall(line):
                if not (root / target).exists():
                    out.append(Violation(path.name, n, "broken-link", target))
    return out


class _TagBalanceParser(HTMLParser):
    """Walks one file's tags and flags anything that doesn't nest cleanly.

    HTMLParser already puts <script>/<style> bodies into CDATA mode (verified
    against this repo's inline scripts, several of which contain "<" from
    comparisons like `if (y < 0)` inside template literals), so their
    contents never reach handle_starttag/handle_endtag in the first place —
    no special-casing needed here for that.
    """

    def __init__(self, filename: str) -> None:
        super().__init__(convert_charrefs=True)
        self.filename = filename
        self.stack: list[tuple[str, int]] = []
        self.violations: list[Violation] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in VOID_ELEMENTS:
            return
        self.stack.append((tag, self.getpos()[0]))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        # Explicit XHTML-style self-close ("<br />", "<div />") never opens
        # anything, even for tags that aren't in VOID_ELEMENTS.
        return

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID_ELEMENTS:
            return
        line = self.getpos()[0]
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
            return
        for i in range(len(self.stack) - 2, -1, -1):
            if self.stack[i][0] == tag:
                open_tag, open_line = self.stack[-1]
                self.violations.append(Violation(
                    self.filename, line, "unbalanced-html",
                    f"</{tag}> closes out of order: <{open_tag}> opened at "
                    f"line {open_line} is still open",
                ))
                del self.stack[i:]
                return
        self.violations.append(Violation(
            self.filename, line, "unbalanced-html",
            f"</{tag}> has no matching opening tag",
        ))


def find_unbalanced_html(root: Path) -> list[Violation]:
    """Catch unclosed/mismatched tags a line-range deletion could introduce.

    Upcoming edits delete large HTML regions by line number. There is no
    browser available here to render the result, so a "</div>" that gets
    deleted along with everything else in its range would silently break the
    page layout and nobody would notice until a human opened it. This walks
    every root-level page with a real HTML parser and a tag stack so that
    kind of breakage shows up as a violation instead.
    """
    out: list[Violation] = []
    for path in sorted(root.glob("*.html")):
        parser = _TagBalanceParser(path.name)
        parser.feed(path.read_text(encoding="utf-8"))
        out.extend(parser.violations)
        for tag, line in reversed(parser.stack):
            out.append(Violation(
                path.name, line, "unbalanced-html",
                f"Unclosed <{tag}> opened at line {line}",
            ))
    return out


def main() -> int:
    violations = (
        find_forbidden_copy(ROOT)
        + find_broken_links(ROOT)
        + find_unbalanced_html(ROOT)
    )
    if not violations:
        print("OK — no stale copy, no broken links, no unbalanced HTML.")
        return 0
    by_rule: dict[str, list[Violation]] = {}
    for v in violations:
        by_rule.setdefault(v.rule, []).append(v)
    for rule in sorted(by_rule):
        items = by_rule[rule]
        print(f"\n{rule}  ({len(items)})")
        for v in items:
            print(f"  {v.path}:{v.line}  {v.text}")
    print(f"\n{len(violations)} violation(s).")
    return 1


if __name__ == "__main__":
    sys.exit(main())
