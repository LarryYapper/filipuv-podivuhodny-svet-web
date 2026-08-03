#!/usr/bin/env python3
"""Verify the site carries no stale Poštovní klub copy and no broken links.

Run: python tools/check_site.py
Exit 0 when clean, 1 when violations are found.
"""
from __future__ import annotations

import re
import sys
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


def main() -> int:
    violations = find_forbidden_copy(ROOT) + find_broken_links(ROOT)
    if not violations:
        print("OK — no stale copy, no broken links.")
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
