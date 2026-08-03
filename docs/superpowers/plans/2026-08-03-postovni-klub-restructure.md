# Poštovní klub Restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three monthly membership tiers with a single bi-monthly edition at 149 Kč across the whole site, and remove every trace of subscription/recurring-payment language.

**Architecture:** Static HTML site with three shared JS files (`cms-config.js` data, `components.js` markup templates, `global.js` behaviour). Per-edition data moves into `cms-config.js` so publishing a new edition is a one-file change. A Python checker script (`tools/check_site.py`) provides the test cycle: it fails on forbidden copy and broken internal links, and every task drives failures down.

**Tech Stack:** Plain HTML + inline CSS, vanilla JS (IIFE, no build step), SimpleShop embedded forms, Python 3.14 for the verification script only.

## Global Constraints

- **Visual identity is frozen.** Fonts Fraunces + Mulish, paper canvas `#F4F2EB`, dark `#3A2C31`, accents `#FC7B35` and `#FF6752`. Change structure and copy only — never colors, fonts, spacing scale, or component styling.
- **Price:** `149 Kč` + postage. Postage `19 / 36 / 42 Kč` (CZ / Evropa / Svět).
- **Cadence copy:** "každé dva měsíce" — never "měsíčně", never "každý měsíc".
- **Product noun:** "edice". Never "úroveň", "tier", "členství" as a product name. "Člen klubu" describing a person is fine.
- **No recurring-payment language.** ComGate blocks auto-billing; every order is one-off.
- **Negated subscription copy stays.** "Žádné předplatné, žádný algoritmus, žádné automatické strhávání" is true and desirable. Never delete it.
- **No build step.** Files are served as-is. Do not add bundlers, frameworks, or npm.
- All copy is Czech. Match the existing voice: second person singular ("ty"), warm, unhurried.
- Commit after every task.

**Reference:** `docs/superpowers/specs/2026-08-03-postovni-klub-restructure-design.md`

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `tools/check_site.py` | Verification: forbidden copy + link integrity | Create |
| `cms-config.js` | Per-edition data (the one file Filip edits) | Modify |
| `global.js` | Behaviour: CMS injection, countdown, order links | Modify |
| `components.js` | Banner / nav / footer markup | Modify |
| `postovni-klub-objednavka.html` | Single order page, 3 region forms | Create |
| `edice.html` | Edition catalog | Create |
| `postovni-klub.html` | Club page — current edition, contents, how it works, FAQ | Modify (heavy) |
| `index.html` | Homepage — single-edition block replaces tier grid | Modify |
| `sprava-predplatneho.html` | "Moje objednávka" support form | Modify |
| `dobro.html` | Charity ledger + essay figures | Modify |
| `dekuji.html` | Post-order thank-you copy | Modify |
| `edice-vitej.html`, `nas-svet.html` | Copy alignment | Modify |
| `postovni-klub-uroven-{1,2,3}-objednavka.html` | Redirect stubs | Replace |
| `opakovane-platby.html` | Delete | Delete |
| `sitemap.xml` | URL inventory | Modify |

---

## Task 1: Verification script

Builds the test harness the remaining tasks are graded against. It must fail loudly right now — that failing output is the to-do list for Tasks 2–11.

**Files:**
- Create: `tools/check_site.py`

**Interfaces:**
- Consumes: nothing.
- Produces: CLI `python tools/check_site.py`. Exit code `0` = clean, `1` = violations. Functions `find_forbidden_copy(root) -> list[Violation]`, `find_broken_links(root) -> list[Violation]`, where `Violation` is a `NamedTuple` with fields `path: str`, `line: int`, `rule: str`, `text: str`.

- [ ] **Step 1: Write the script**

```python
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
```

- [ ] **Step 2: Run it and confirm it fails against the current site**

Run: `python tools/check_site.py`
Expected: exit 1, with violations grouped under `tier-name`, `old-price`, `subscription-copy`, `recurring-payment`, `cancelled-item`. Record the total — it is the baseline.

Sanity-check a few classifications by eye before trusting the script:
- `index.html` "Úroveň 2 je můj favorit" → `tier-name` ✅
- `dobro.html` "Členské · 139 Kč / měsíc" → `old-price` ✅
- `dekuji.html` "Předplatné Poštovního klubu se opakuje…" → `subscription-copy` ✅
- `o-mne.html` "žádné předplatné, jen první ochutnávka" → **not flagged** ✅ (negation survives)

If a negated "žádné předplatné" line is flagged, the regex is wrong — fix it before continuing, not the copy.

- [ ] **Step 3: Commit**

```bash
git add tools/check_site.py
git commit -m "Add site copy and link checker for club restructure"
```

---

## Task 2: Edition data model

**Files:**
- Modify: `cms-config.js:33-54` (replace the `tiers` object)

**Interfaces:**
- Consumes: nothing.
- Produces: `CMS_CONFIG.edition` and `CMS_CONFIG.archive`. Field contract used by every later task:
  - `edition.number: string` — e.g. `"A02"`
  - `edition.name: string` — theme, e.g. `"Ticho"`
  - `edition.price: number` — CZK excluding postage
  - `edition.postage: {cz: number, eu: number, world: number}`
  - `edition.status: "available" | "last_pieces" | "sold_out"`
  - `edition.dispatchDate: string` — ISO 8601 with offset
  - `edition.cover: string` — image path
  - `edition.formIds: {cz: string, eu: string, world: string}` — SimpleShop form IDs
  - `archive: Array<same shape>` — newest first

- [ ] **Step 1: Replace the `tiers` block**

Delete lines 33–54 of `cms-config.js` (the `// 3. TIER IMAGES & PRICES` comment through the closing `}` of `tiers`) and put this in its place:

```js
    // 3. CURRENT EDITION
    // The only block that changes when a new edition ships.
    edition: {
        number: "A02",
        name: "Ticho",
        price: 149,
        postage: { cz: 19, eu: 36, world: 42 },
        status: "available",          // available | last_pieces | sold_out
        dispatchDate: "2026-10-05T08:00:00+02:00",
        cover: "assets/edice-a02.png",
        // SimpleShop form IDs — replace with the real ones once the
        // 149 Kč product exists. Empty string renders the fallback notice.
        formIds: { cz: "", eu: "", world: "" }
    },

    // 4. ARCHIVE — newest first. Same shape as `edition`.
    // An edition with status "sold_out" needs no formIds.
    archive: [
        {
            number: "A01",
            name: "Přítomnost",
            price: 149,
            postage: { cz: 19, eu: 36, world: 42 },
            status: "sold_out",
            dispatchDate: "2026-07-20T08:00:00+02:00",
            cover: "assets/edice-a01.png",
            formIds: { cz: "", eu: "", world: "" }
        }
    ]
```

- [ ] **Step 2: Update the banner block above it**

In the same file, replace the `banner` object's text fields (lines 11–22) so the bar describes an edition rather than a weekly recurring send. Keep `deadlineDate` — Task 3 repoints it at the edition.

```js
    banner: {
        desktopText: "Edice A02 Ticho · objednávky otevřené",
        mobileText: "Edice A02 Ticho · objednávky otevřené",
        deadlineDate: "2026-10-05T08:00:00+02:00", // shodné s edition.dispatchDate
        link: "postovni-klub.html",

        // Expedice probíhá jeden pevný den v týdnu ze zásoby.
        recurringWeekday: 1,          // 0=neděle, 1=pondělí ...
        recurringTime: "08:00",
        recurringDesktopText: "Objednávky otevřené · expedice každé pondělí",
        recurringMobileText: "Expedice každé pondělí"
    },
```

- [ ] **Step 3: Verify the file parses**

Run: `node --check cms-config.js`
Expected: no output (success). If `node` is not installed, instead open `index.html` in a browser and confirm the console shows no `SyntaxError`.

- [ ] **Step 4: Commit**

```bash
git add cms-config.js
git commit -m "Replace tier config with single edition + archive"
```

---

## Task 3: Behaviour — CMS injection, countdown, order links

**Files:**
- Modify: `global.js:440-457` (tier branch of `initCMS`)
- Modify: `global.js:275-357` (`initCountdown`)
- Modify: `global.js:549-587` (`initTierCheckout`)
- Modify: `global.js:590-605` (`init`)

**Interfaces:**
- Consumes: `CMS_CONFIG.edition` from Task 2.
- Produces:
  - `data-cms="edition-<prop>"` attribute support, where `<prop>` is any key of `edition`. Tasks 4–8 use exactly five: `edition-number`, `edition-name`, `edition-price`, `edition-cover`, `edition-status`.
  - `initEditionCheckout()` replaces `initTierCheckout()`; binds `.edition-order-btn` elements to `postovni-klub-objednavka.html`.

- [ ] **Step 1: Replace the tier branch in `initCMS`**

Swap the `if (key.startsWith('tier-'))` block (lines 440–457) for:

```js
            // Handle Edition (name, number, price, cover, status)
            if (key.startsWith('edition-')) {
                const ed = CMS_CONFIG.edition;
                if (!ed) return;

                const prop = key.slice('edition-'.length);
                const value = ed[prop];
                if (value === undefined || value === null) return;

                if (prop === 'cover') {
                    if (el.tagName === 'IMG') {
                        el.src = value;
                    } else {
                        el.style.backgroundImage = `url('${value}')`;
                    }
                } else if (prop === 'price') {
                    el.textContent = value + ' Kč';
                } else if (prop === 'status') {
                    const labels = {
                        available: 'k dispozici',
                        last_pieces: 'poslední kusy',
                        sold_out: 'doprodáno'
                    };
                    el.textContent = labels[value] || value;
                    el.setAttribute('data-status', value);
                } else {
                    el.textContent = value;
                }
            }
```

- [ ] **Step 2: Point the countdown at the edition**

In `initCountdown`, replace line 280:

```js
        const LAUNCH = new Date(cfg.deadlineDate).getTime();
```

with:

```js
        // Dispatch date lives on the edition; the banner date is the fallback.
        const edition = (typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG.edition) || null;
        const LAUNCH = new Date(
            (edition && edition.dispatchDate) || cfg.deadlineDate
        ).getTime();
```

Leave the rest of the function alone — the weekly recurring row now means the weekly expedition day, which is exactly the new model.

- [ ] **Step 3: Replace `initTierCheckout`**

Delete the whole function (lines 549–587) and put this in its place:

```js
    // 12. EDITION ORDER WIRING
    function initEditionCheckout() {
        const ORDER_URL = 'postovni-klub-objednavka.html';
        const soldOut = typeof CMS_CONFIG !== 'undefined'
            && CMS_CONFIG.edition
            && CMS_CONFIG.edition.status === 'sold_out';

        document.querySelectorAll('.edition-order-btn').forEach(el => {
            if (soldOut) {
                el.setAttribute('aria-disabled', 'true');
                el.style.opacity = '0.5';
                el.style.pointerEvents = 'none';
                return;
            }
            if (el.tagName === 'A') {
                el.setAttribute('href', ORDER_URL);
                return;
            }
            el.style.cursor = 'pointer';
            el.setAttribute('role', 'link');
            el.setAttribute('tabindex', '0');
            el.addEventListener('click', () => { window.location.href = ORDER_URL; });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = ORDER_URL;
                }
            });
        });
    }
```

- [ ] **Step 4: Update the init list**

In `init()` (line ~602) change `initTierCheckout();` to `initEditionCheckout();`.

- [ ] **Step 5: Verify no stale references remain**

Run: `grep -n "initTierCheckout\|CMS_CONFIG.tiers\|'tier-'" global.js`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add global.js
git commit -m "Wire behaviour to edition data instead of tiers"
```

---

## Task 4: Shared chrome — banner, nav, footer

**Files:**
- Modify: `components.js:32-57` (banner rows)
- Modify: `components.js:94-97`, `components.js:138-141` (nav dropdowns)
- Modify: `components.js:103`, `components.js:111`, `components.js:147` (labels and CTA)
- Modify: `components.js:159-161` (footer tagline)
- Modify: `components.js:174-190`, `components.js:211` (footer links)

**Interfaces:**
- Consumes: `data-cms="edition-*"` from Task 3, `edice.html` and `postovni-klub-objednavka.html` from Tasks 5 and 6 (links resolve once those exist; Task 11 verifies).
- Produces: nav and footer link sets that later tasks link into.

- [ ] **Step 1: Rewrite the two banner rows**

Replace the contents of `#cd-launch` and `#cd-recurring` (lines 32–57) with:

```html
                    <div id="cd-launch" class="edition-row">
                        <div class="edition-info">
                            <span class="edition-mark">✦</span>
                            <span class="edition-name">Edice <span data-cms="edition-number"></span> <span data-cms="edition-name"></span></span>
                            <span class="edition-sep">·</span>
                            <span class="edition-desc">odesílám <span id="cd-launch-val" class="edition-val">za pár dní</span></span>
                        </div>
                        <a href="postovni-klub.html" class="link-hover edition-cta">
                            <span class="desktop-copy">Do poštovního klubu</span>
                            <span class="mobile-copy">Do klubu</span>
                            <span class="arrow-slide" style="line-height:18px;">→</span>
                        </a>
                    </div>
                    <div id="cd-recurring" class="edition-row">
                        <div class="edition-info">
                            <span class="edition-mark">✦</span>
                            <span class="edition-name">Edice VÍTEJ</span>
                            <span class="edition-sep">·</span>
                            <span class="edition-desc">expeduji každé pondělí (<span id="cd-recurring-val" class="edition-val">za pár dní</span>)</span>
                        </div>
                        <a href="edice-vitej.html" class="link-hover edition-cta">
                            <span class="desktop-copy">Vyzkoušej za 99 Kč</span>
                            <span class="mobile-copy">99 Kč</span>
                            <span class="arrow-slide" style="line-height:18px;">→</span>
                        </a>
                    </div>
```

- [ ] **Step 2: Update both nav dropdowns**

Mobile submenu (lines 94–97) currently lists `Edice VÍTEJ` and `Úrovně členství`. Replace its links with:

```html
                                <a href="postovni-klub.html" class="mobile-nav-link sub-link">Aktuální edice</a>
                                <a href="edice.html" class="mobile-nav-link sub-link">Všechny edice</a>
                                <a href="edice-vitej.html" class="mobile-nav-link sub-link">Edice VÍTEJ</a>
```

Desktop dropdown (lines 138–141) — same three links with `class="dropdown-link"`:

```html
                        <a href="postovni-klub.html" class="dropdown-link">Aktuální edice</a>
                        <a href="edice.html" class="dropdown-link">Všechny edice</a>
                        <a href="edice-vitej.html" class="dropdown-link">Edice VÍTEJ</a>
```

- [ ] **Step 3: Retarget the utility link and mobile CTA**

- Line 103 (`mobile-nav-utility`) and line 147 (`nav-utility`): change the label `Členství` to `Moje objednávka` in both. Keep `href="sprava-predplatneho.html"` — Task 9 repurposes that page.
- Line 111: change the mobile footer CTA text `Stát se členem` to `Objednat edici`, and its `href` from `postovni-klub.html` to `postovni-klub-objednavka.html`.

- [ ] **Step 4: Fix the footer tagline and links**

Line 160 — replace `Měsíční obálka, která tě vytrhne z proudu.` with `Obálka každé dva měsíce, která tě vytrhne z proudu.`

Replace the KLUB column links (lines 177–180):

```html
                        <a href="postovni-klub.html">Aktuální edice</a>
                        <a href="edice.html">Všechny edice</a>
                        <a href="edice-vitej.html">Edice VÍTEJ</a>
                        <a href="postovni-klub-objednavka.html">Objednat</a>
```

In the POMOC column: change `<a href="sprava-predplatneho.html">Správa předplatného</a>` to `<a href="sprava-predplatneho.html">Moje objednávka</a>`, and point `Časté dotazy` (currently `href="#"`) at `postovni-klub.html#faq`.

Delete line 211 entirely — `<a href="opakovane-platby.html">Opakované platby</a>`.

- [ ] **Step 5: Verify**

Run: `grep -n "Úrovně členství\|Správa předplatného\|opakovane-platby\|Měsíční obálka\|Stát se členem" components.js`
Expected: no output.

**Expected transient failure:** `python tools/check_site.py` will now report `broken-link` for `edice.html` and `postovni-klub-objednavka.html` from `components.js`, because those pages do not exist until Tasks 5 and 6. That is correct behaviour, not a defect — do not "fix" it by removing the links. Every other rule must be clean.

- [ ] **Step 6: Commit**

```bash
git add components.js
git commit -m "Point shared banner, nav and footer at the single edition"
```

---

## Task 5: Order page

**Files:**
- Create: `postovni-klub-objednavka.html`
- Reference (read, do not modify): `postovni-klub-uroven-2-objednavka.html`

**Interfaces:**
- Consumes: `CMS_CONFIG.edition` (Task 2), `data-cms="edition-*"` (Task 3).
- Produces: URL `postovni-klub-objednavka.html`, linked from Tasks 4, 6, 7, 8.

**Note on postage (confirmed by Filip):** real shipping costs 31 / 48 / 54 Kč (CZ / Evropa / Svět); Filip absorbs 12 Kč of every one, so the customer pays **19 / 36 / 42 Kč**. The `19 / 29 / 35 Kč` on the old order pages is stale — use 19 / 36 / 42.

- [ ] **Step 1: Copy the existing page as the base**

```bash
cp postovni-klub-uroven-2-objednavka.html postovni-klub-objednavka.html
```

This inherits the full stylesheet, region-toggle CSS, and script wiring — do not rewrite them.

- [ ] **Step 2: Replace the head metadata**

In `postovni-klub-objednavka.html`, set:

```html
  <title>Objednávka edice · Filipův podivuhodný svět</title>
  <meta name="description" content="Objednávka aktuální edice Poštovního klubu — 149 Kč a poštovné. Jednorázově, bez předplatného.">
```

and update the canonical plus the three `og:` tags to `postovni-klub-objednavka.html`, with the title `Poštovní klub · Objednávka edice`.

- [ ] **Step 3: Remove the launch gate**

Delete the entire `<div class="launch-gate" data-launch-gate ...>` block and its children. Orders are always open now, so the gate must not exist.

- [ ] **Step 4: Rewrite the intro and aside copy**

Replace the `<section class="intro">` block with:

```html
      <section class="intro">
        <div class="kicker">Poštovní klub · Objednávka</div>
        <h1>Edice <span data-cms="edition-number"></span> <span data-cms="edition-name"></span> za 149 Kč.</h1>
        <p class="lead">Jedna obálka: ZINE, ručně psaný dopis, fotopohlednice a karta s citátem. Jednorázová objednávka — nic se neopakuje, nic se nestrhává.</p>

        <div class="intro-photo" aria-hidden="true">
          <span>Foto · aktuální edice</span>
        </div>

        <a class="back-link" href="postovni-klub.html">
          <span aria-hidden="true">←</span> Zpět na stránku klubu
        </a>
      </section>
```

Replace the `.order-summary`, `.region-toggle` and `.trust-list` blocks with:

```html
        <div class="order-summary">
          <div class="order-summary-row">
            <span>Edice <span data-cms="edition-number"></span></span>
            <strong data-cms="edition-price"></strong>
          </div>
          <p class="order-summary-note" data-region-note>+ poštovné po Česku 19 Kč · jednorázově</p>
        </div>
        <div class="region-toggle" role="tablist" aria-label="Region doručení">
          <button type="button" data-region="cz" class="is-active" role="tab" aria-selected="true" data-note="+ poštovné po Česku 19 Kč · jednorázově">Česko</button>
          <button type="button" data-region="eu" role="tab" aria-selected="false" data-note="+ poštovné do Evropy 36 Kč · jednorázově">Evropa</button>
          <button type="button" data-region="world" role="tab" aria-selected="false" data-note="+ poštovné do Světa 42 Kč · jednorázově">Svět</button>
        </div>
        <ul class="trust-list">
          <li>Jednorázová objednávka — žádné předplatné, žádné automatické strhávání</li>
          <li>Platba bezpečně přes SimpleShop</li>
          <li>Odesílám ze zásoby, expedice každé pondělí</li>
        </ul>
```

- [ ] **Step 5: Replace the three SimpleShop embeds with config-driven ones**

The old page hardcodes form IDs `jDe3z` / `qGMrN` / `5QzP2`, which belong to the retired 139 Kč product. Delete all three `<div class="form-region" ...>` blocks together with their inline `<script>` tags, and put this in their place:

```html
          <div class="form-region" data-region="cz"></div>
          <div class="form-region" data-region="eu" hidden></div>
          <div class="form-region" data-region="world" hidden></div>
          <p class="form-note" data-form-missing hidden>
            Objednávkový formulář se právě připravuje. Napiš mi na
            <a href="mailto:filipkubik.mail@gmail.com">filipkubik.mail@gmail.com</a>
            a pošlu ti odkaz ručně.
          </p>
          <script>
          (function () {
            if (typeof CMS_CONFIG === 'undefined' || !CMS_CONFIG.edition) return;
            var ids = CMS_CONFIG.edition.formIds || {};
            var missing = false;

            Object.keys(ids).forEach(function (region) {
              var host = document.querySelector('.form-region[data-region="' + region + '"]');
              if (!host) return;
              if (!ids[region]) { missing = true; return; }
              var mount = document.createElement('div');
              mount.setAttribute('data-SimpleShopForm', ids[region]);
              host.appendChild(mount);
            });

            if (missing) {
              var notice = document.querySelector('[data-form-missing]');
              if (notice) notice.hidden = false;
              return;
            }

            (function (i, s, o, g, r, a, m) {
              i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments); };
              i[r].l = 1 * new Date();
              a = s.createElement(o); m = s.getElementsByTagName(o)[0];
              a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
            })(window, document, "script", "https://form.simpleshop.cz/prj/js/SimpleShopService.js", "sss");

            Object.keys(ids).forEach(function (region) {
              if (ids[region]) sss("createForm", ids[region]);
            });
          })();
          </script>
```

- [ ] **Step 6: Verify in a browser**

Run: `python -m http.server 8000` then open `http://localhost:8000/postovni-klub-objednavka.html`
Expected: page renders in house style; edition number and price fill in from config; the region toggle switches the three panels; because `formIds` are still empty the "formulář se právě připravuje" notice is visible and no console error appears. Stop the server with Ctrl-C.

- [ ] **Step 7: Commit**

```bash
git add postovni-klub-objednavka.html
git commit -m "Add single edition order page"
```

---

## Task 6: Edition catalog

**Files:**
- Create: `edice.html`

**Interfaces:**
- Consumes: `CMS_CONFIG.edition` and `CMS_CONFIG.archive` (Task 2).
- Produces: URL `edice.html`, linked from Task 4's nav and footer.

- [ ] **Step 1: Create the page shell**

Use `kontakt.html` as the structural reference — copy its `<head>` (fonts, `styles.css`, `<base href="/">`) and its three trailing script tags (`cms-config.js`, `components.js`, `global.js`). Set the title to `Všechny edice · Filipův podivuhodný svět`. Body content:

```html
  <div class="paper-canvas"
    style="background-color: #F4F2EB; box-sizing: border-box; display: flex; flex-direction: column; font-size: 12px; width: 100%;">
    <div id="global-banner"></div>
    <div id="global-header"></div>

    <div style="box-sizing: border-box; display: flex; flex-direction: column; gap: 48px; padding-bottom: 120px; padding-inline: clamp(20px, 5vw, 80px); padding-top: clamp(40px, 10vw, 100px);">
      <div style="width: 100%; max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
        <div style="color: #FC7B35; font-family: 'Mulish', system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; line-height: 16px;">
          ✦ VŠECHNY EDICE
        </div>
        <div style="color: #3A2C31; font-family: 'Fraunces', system-ui, sans-serif; font-size: clamp(40px, 8vw, 96px); font-variation-settings: 'wght' 580; font-weight: 580; letter-spacing: -0.032em; line-height: 1.1;">
          Každá edice<br />je jednou.
        </div>
        <div style="max-width: 480px; color: #3A2C31B3; font-family: 'Fraunces', system-ui, sans-serif; font-size: 22px; font-style: italic; line-height: 32px;">
          Nová edice vychází každé dva měsíce. Tisknu je v malé sérii — když série dojde, edice je pryč.
        </div>
      </div>

      <div id="edice-grid"
        style="width: 100%; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px;">
      </div>
    </div>

    <div id="global-footer"></div>
  </div>
```

- [ ] **Step 2: Add the rendering script**

Place this *after* the three shared script tags at the bottom of the page:

```html
  <script>
  (function () {
    var grid = document.getElementById('edice-grid');
    if (!grid || typeof CMS_CONFIG === 'undefined') return;

    var LABELS = {
      available: 'k dispozici',
      last_pieces: 'poslední kusy',
      sold_out: 'doprodáno'
    };

    function card(ed, isCurrent) {
      var orderable = ed.status !== 'sold_out';
      var accent = orderable ? '#FC7B35' : '#3A2C3166';
      return ''
        + '<div class="reveal" style="display: flex; flex-direction: column; gap: 16px; background-color: #FFFFFF80; border: 1px solid #3A2C311F; border-radius: 24px; padding: 24px;">'
        + '  <div style="aspect-ratio: 3/2; border-radius: 16px; background-color: #3A2C310D; background-size: cover; background-position: center;"'
        + (ed.cover ? ' data-cover="' + ed.cover + '"' : '') + '></div>'
        + '  <div style="display: flex; align-items: baseline; gap: 8px;">'
        + '    <span style="color: ' + accent + '; font-family: \'Mulish\', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em;">EDICE ' + ed.number + '</span>'
        + (isCurrent ? '<span style="color: #FF6752; font-family: \'Mulish\', sans-serif; font-size: 11px; font-weight: 700;">· AKTUÁLNÍ</span>' : '')
        + '  </div>'
        + '  <div style="color: #3A2C31; font-family: \'Fraunces\', serif; font-size: 28px; font-variation-settings: \'wght\' 580; line-height: 1.15;">' + ed.name + '</div>'
        + '  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px;">'
        + '    <span style="color: #3A2C3199; font-family: \'Mulish\', sans-serif; font-size: 13px; font-weight: 600;">' + (LABELS[ed.status] || ed.status) + '</span>'
        + '    <span style="color: #3A2C31; font-family: \'Fraunces\', serif; font-size: 20px; font-variation-settings: \'wght\' 580;">' + ed.price + ' Kč</span>'
        + '  </div>'
        + (orderable
            ? '  <a class="edition-order-btn" href="postovni-klub-objednavka.html" style="text-align: center; border-radius: 999px; background-color: #FC7B35; color: #F4F2EB; font-family: \'Mulish\', sans-serif; font-size: 14px; font-weight: 700; padding: 14px 24px; text-decoration: none;">Objednat</a>'
            : '  <div style="text-align: center; border: 1px solid #3A2C3133; border-radius: 999px; color: #3A2C3166; font-family: \'Mulish\', sans-serif; font-size: 14px; font-weight: 700; padding: 14px 24px;">Doprodáno</div>')
        + '</div>';
    }

    var all = [];
    if (CMS_CONFIG.edition) all.push({ ed: CMS_CONFIG.edition, current: true });
    (CMS_CONFIG.archive || []).forEach(function (ed) { all.push({ ed: ed, current: false }); });

    grid.innerHTML = all.map(function (x) { return card(x.ed, x.current); }).join('');

    grid.querySelectorAll('[data-cover]').forEach(function (el) {
      el.style.backgroundImage = "url('" + el.getAttribute('data-cover') + "')";
    });
  })();
  </script>
```

The cards carry a literal `href` because `initEditionCheckout()` (Task 3) runs on `DOMContentLoaded`, before this script injects them — so it cannot wire them up.

- [ ] **Step 3: Verify in a browser**

Run: `python -m http.server 8000` then open `http://localhost:8000/edice.html`
Expected: two cards — A02 Ticho marked AKTUÁLNÍ with an orange "Objednat" button linking to the order page, and A01 Přítomnost showing "Doprodáno" with no link. No console errors.

- [ ] **Step 4: Commit**

```bash
git add edice.html
git commit -m "Add edition catalog page"
```

---

## Task 7: Club page rebuild

The heaviest task. `postovni-klub.html` is 2 155 lines; roughly 780 of them are tier machinery that goes away.

**Files:**
- Modify: `postovni-klub.html` — hero (79–161), sticky tier bar (163–280), comparison table (282–1055), item detail (1056–1590), editions (1591–1799), how-it-works (1800–1923), FAQ (1924–2186)

**Interfaces:**
- Consumes: `data-cms="edition-*"` (Task 3), `postovni-klub-objednavka.html` (Task 5), `edice.html` (Task 6).
- Produces: `#faq` anchor referenced by Task 4's footer link.

- [ ] **Step 1: Delete the sticky tier bar**

Remove lines 163–280 entirely: the `<style>` block defining `.sticky-bar` / `.sticky-tier-btn` and the `<div class="sticky-bar">` element. Nothing replaces it — the order CTA lives in the hero and in the contents section.

- [ ] **Step 2: Replace the comparison table section**

Delete the whole `<div id="srovnani-tieru" ...>` section (lines 282–1055, ending at the `</div>` immediately before `<!-- Detail of Every Item Section -->`). Replace with:

```html
        <!-- Current Edition Section -->
        <div id="aktualni-edice"
            style="background-color: #F4F2EB; box-sizing: border-box; display: flex; flex-direction: column; gap: 64px; padding-bottom: 120px; padding-inline: clamp(20px, 5vw, 80px); padding-top: 140px;">
            <div style="width: 100%; max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
                <div style="color: #FF6752; font-family: 'Mulish', system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; line-height: 16px;">
                    ✦ CO DOSTANEŠ
                </div>
                <div style="color: #3A2C31; font-family: 'Fraunces', system-ui, sans-serif; font-size: clamp(32px, 6vw, 72px); font-variation-settings: 'wght' 580; font-weight: 580; letter-spacing: -0.025em; line-height: 1.1;">
                    Jedna obálka.<br />Čtyři věci, které v ní zůstanou.
                </div>
            </div>

            <div style="width: 100%; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px;">
                <div class="reveal" style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #3A2C3126; padding-top: 20px;">
                    <div style="color: #3A2C31; font-family: 'Fraunces', serif; font-size: 22px; font-variation-settings: 'wght' 580; line-height: 28px;">ZINE</div>
                    <div style="color: #3A2C3199; font-family: 'Mulish', sans-serif; font-size: 13px; font-weight: 500; line-height: 20px;">~12 stran · ručně sešitý · srdce obálky</div>
                </div>
                <div class="reveal" style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #3A2C3126; padding-top: 20px;">
                    <div style="color: #3A2C31; font-family: 'Fraunces', serif; font-size: 22px; font-variation-settings: 'wght' 580; line-height: 28px;">Ručně psaný dopis</div>
                    <div style="color: #3A2C3199; font-family: 'Mulish', sans-serif; font-size: 13px; font-weight: 500; line-height: 20px;">A5 · psaný rukou k tématu edice</div>
                </div>
                <div class="reveal" style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #3A2C3126; padding-top: 20px;">
                    <div style="color: #3A2C31; font-family: 'Fraunces', serif; font-size: 22px; font-variation-settings: 'wght' 580; line-height: 28px;">Fotopohlednice</div>
                    <div style="color: #3A2C3199; font-family: 'Mulish', sans-serif; font-size: 13px; font-weight: 500; line-height: 20px;">A6 · originál z mého archivu</div>
                </div>
                <div class="reveal" style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #3A2C3126; padding-top: 20px;">
                    <div style="color: #3A2C31; font-family: 'Fraunces', serif; font-size: 22px; font-variation-settings: 'wght' 580; line-height: 28px;">Karta s citátem</div>
                    <div style="color: #3A2C3199; font-family: 'Mulish', sans-serif; font-size: 13px; font-weight: 500; line-height: 20px;">A7 · plotter na premium papír</div>
                </div>
            </div>

            <div style="width: 100%; max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; background-color: #3A2C310A; border: 1px dashed #3A2C3140; padding: 32px 40px;">
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div style="display: flex; align-items: baseline; gap: 8px;">
                        <span style="color: #3A2C31; font-family: 'Fraunces', serif; font-size: 36px; font-variation-settings: 'wght' 580; line-height: 36px;" data-cms="edition-price"></span>
                        <span style="color: #3A2C3199; font-family: 'Mulish', sans-serif; font-size: 12px; font-weight: 500;">+ poštovné 19 / 36 / 42 Kč</span>
                    </div>
                    <div style="color: #3A2C31BF; font-family: 'Fraunces', serif; font-size: 18px; font-style: italic; line-height: 26px;">
                        Jednorázově. Žádné předplatné, žádné automatické strhávání.
                    </div>
                </div>
                <a class="edition-order-btn" href="postovni-klub-objednavka.html"
                    style="align-items: center; background-color: #FC7B35; border-radius: 999px; display: flex; flex-shrink: 0; gap: 10px; padding-block: 16px; padding-inline: 28px; text-decoration: none;">
                    <span style="color: #F4F2EB; font-family: 'Mulish', sans-serif; font-size: 14px; font-weight: 700; line-height: 18px;">Objednat edici</span>
                    <span style="color: #F4F2EB; font-family: 'Mulish', sans-serif; font-size: 14px; line-height: 18px;">→</span>
                </a>
            </div>
        </div>
```

- [ ] **Step 3: Fix the hero and sub-nav**

In the hero (lines 79–161):
- Replace the heading `Tři úrovně.<br />Jeden klub.` with `Jedna edice.<br />Každé dva měsíce.`
- Replace the lead paragraph (`Začni jednorázově s Edicí VÍTEJ … rušíš jedním klikem.`) with: `Začni jednorázově s Edicí VÍTEJ, nebo si rovnou objednej aktuální edici. Nic se neopakuje — objednáváš vždycky jen tu jednu obálku.`
- Change the kicker `✦ POŠTOVNÍ KLUB · ÚROVNĚ ČLENSTVÍ` to `✦ POŠTOVNÍ KLUB · AKTUÁLNÍ EDICE`.
- In the sub-nav, change the first link from `href="#srovnani-tieru"` / `Srování Úrovní` to `href="#aktualni-edice"` / `Co dostaneš`.

- [ ] **Step 4: Strip removed items from the detail section**

In `#co-je-v-kuse` (line 1056 onward), delete the detail cards for **Mini plakát**, **Stírací los**, **Receptová karta**, **Oznámení o eshopu**, and **Narozeninové přání**. Keep ZINE, dopis, fotopohlednice, karta s citátem, samolepka — exactly the five things the envelope still contains.

Also delete the now-dead CSS rule at lines 43–45 (`.edice-grid > div:nth-child(n+3) { display: none !important; }`) if the grid it hid no longer exists.

- [ ] **Step 5: Update the remaining sections' copy**

These three sections keep their existing markup — replace text content only, never the surrounding `<div>` structure or inline styles.

- `#prehled-edic` (1591): change monthly framing to "každé dva měsíce"; point its CTA at `edice.html`.
- `#jak-to-funguje` (1800): the section holds four `.step-card` elements. Keep all four and rewrite their text to — 1. Vybereš edici. 2. Zaplatíš jednorázově přes SimpleShop. 3. Expeduju ze zásoby, každé pondělí. 4. Obálka dorazí do schránky. If the section has a different number of steps, match the copy to the count rather than adding or removing cards.
- `#faq` (1924): delete every question about changing or cancelling a tier or subscription, reusing the existing question/answer markup for the replacements. Add two entries: `Opakuje se platba?` → `Ne. Každá objednávka je jednorázová — nic se nestrhává.` and `Jak často vychází edice?` → `Každé dva měsíce, šestkrát za rok.`

- [ ] **Step 6: Verify**

Run: `python tools/check_site.py 2>&1 | grep postovni-klub.html`
Expected: no output.

Then run `python -m http.server 8000` and open the page. Confirm the layout holds at 1280 px and 375 px width, no section is left empty, and there is no dangling `</div>` (an unbalanced tag usually shows as content escaping the page background).

- [ ] **Step 7: Commit**

```bash
git add postovni-klub.html
git commit -m "Rebuild club page around a single bi-monthly edition"
```

---

## Task 8: Homepage

**Files:**
- Modify: `index.html:487-822` (tier section), `:10-12` (meta), `:49` (kicker), `:231-232`, `:847`, `:1108`, `:1114`, `:1206-1212`, `:1227`

**Interfaces:**
- Consumes: `data-cms="edition-*"` (Task 3), `postovni-klub-objednavka.html` (Task 5), `edice.html` (Task 6).

- [ ] **Step 1: Replace the tier section**

Delete lines 487–822 — the `background-color: #EFE9DC` section holding the tier grid and the "KOMPLETNÍ POROVNÁNÍ" callout — and insert:

```html
    <div
      style="background-color: #EFE9DC; border-top-color: #3A2C311F; border-top-style: solid; border-top-width: 1px; box-sizing: border-box; display: flex; flex-direction: column; gap: clamp(24px, 4vw, 64px); padding-bottom: 120px; padding-inline: clamp(20px, 5vw, 80px); padding-top: 140px;">
      <div
        style="align-items: flex-end; box-sizing: border-box; display: flex; gap: clamp(32px, 5vw, 80px); flex-wrap: wrap; justify-content: space-between; width: 100%; max-width: 1280px; margin: 0 auto;">
        <div style="box-sizing: border-box; display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 720px;">
          <div style="color: #FC7B35; font-family: 'Mulish', system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; line-height: 16px;">
            ✦ AKTUÁLNÍ EDICE · KAŽDÉ DVA MĚSÍCE
          </div>
          <div style="color: #3A2C31; font-family: 'Fraunces', system-ui, sans-serif; font-size: clamp(32px, 6vw, 72px); font-variation-settings: 'wght' 580; font-weight: 580; letter-spacing: -0.025em; line-height: 1.1;">
            Vstup do podivuhodného světa
          </div>
        </div>
        <div style="box-sizing: border-box; width: 100%; max-width: 380px; padding-bottom: 8px;">
          <div style="color: #3A2C31B3; font-family: 'Fraunces', system-ui, sans-serif; font-size: 20px; font-style: italic; line-height: 30px;">
            Jedna obálka, jedna cena. Objednáváš vždycky jen tu edici, která právě vyšla.
          </div>
        </div>
      </div>

      <div style="width: 100%; max-width: 1280px; margin: 0 auto; display: flex; gap: clamp(32px, 5vw, 64px); flex-wrap: wrap; align-items: center; background-color: #F4F2EB; border: 1px solid #3A2C311F; border-radius: 24px; padding: clamp(24px, 4vw, 48px);">
        <div class="reveal" data-cms="edition-cover"
          style="flex: 1 1 320px; min-width: 280px; aspect-ratio: 3/2; border-radius: 16px; background-color: #3A2C310D; background-size: cover; background-position: center;"></div>
        <div style="flex: 1 1 320px; min-width: 280px; display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span style="color: #FF6752; font-family: 'Mulish', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em;">EDICE</span>
            <span style="color: #FF6752; font-family: 'Mulish', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em;" data-cms="edition-number"></span>
          </div>
          <div style="color: #3A2C31; font-family: 'Fraunces', serif; font-size: clamp(28px, 4vw, 44px); font-variation-settings: 'wght' 580; line-height: 1.1;" data-cms="edition-name"></div>
          <div style="color: #3A2C31B3; font-family: 'Fraunces', serif; font-size: 18px; font-style: italic; line-height: 28px;">
            ZINE, ručně psaný dopis, fotopohlednice a karta s citátem. Jednorázově, bez předplatného.
          </div>
          <div style="display: flex; align-items: baseline; gap: 10px;">
            <span style="color: #3A2C31; font-family: 'Fraunces', serif; font-size: 36px; font-variation-settings: 'wght' 580; line-height: 36px;" data-cms="edition-price"></span>
            <span style="color: #3A2C3199; font-family: 'Mulish', sans-serif; font-size: 12px; font-weight: 500;">+ poštovné 19 / 36 / 42 Kč</span>
          </div>
          <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
            <a class="edition-order-btn" href="postovni-klub-objednavka.html"
              style="align-items: center; background-color: #FC7B35; border-radius: 999px; display: flex; gap: 10px; padding-block: 16px; padding-inline: 28px; text-decoration: none;">
              <span style="color: #F4F2EB; font-family: 'Mulish', sans-serif; font-size: 14px; font-weight: 700; line-height: 18px;">Objednat edici</span>
              <span style="color: #F4F2EB; font-family: 'Mulish', sans-serif; font-size: 14px; line-height: 18px;">→</span>
            </a>
            <a href="postovni-klub.html" class="link-hover"
              style="color: #3A2C31; font-family: 'Mulish', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none;">Co je uvnitř →</a>
          </div>
        </div>
      </div>

      <div
        style="align-items: center; background-color: #3A2C310A; border-color: #3A2C3140; border-style: dashed; border-width: 1px; box-sizing: border-box; display: flex; gap: 40px; justify-content: space-between; padding-block: 32px; padding-inline: 40px; flex-wrap: wrap; width: 100%; max-width: 1280px; margin: 32px auto 0 auto;">
        <div style="box-sizing: border-box; display: flex; flex-direction: column; gap: 6px;">
          <div style="color: #FC7B35; font-family: 'Mulish', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; line-height: 14px;">
            ✦ STARŠÍ EDICE
          </div>
          <div style="color: #3A2C31BF; font-family: 'Fraunces', system-ui, sans-serif; font-size: 18px; font-style: italic; line-height: 26px;">
            Každá edice vyšla jednou v malé sérii. Co zbylo, je v katalogu.
          </div>
        </div>
        <a href="edice.html"
          style="align-items: center; border-color: #3A2C31; border-radius: 999px; border-style: solid; border-width: 1.5px; box-sizing: border-box; display: flex; flex-shrink: 0; gap: 10px; padding-block: 14px; padding-inline: 24px; text-decoration: none;">
          <div style="color: #3A2C31; font-family: 'Mulish', system-ui, sans-serif; font-size: 14px; font-weight: 700; line-height: 18px;">Všechny edice</div>
          <div style="color: #3A2C31; font-family: 'Mulish', system-ui, sans-serif; font-size: 14px; line-height: 18px;">→</div>
        </a>
      </div>
    </div>
```

- [ ] **Step 2: Fix the head metadata and hero kicker**

- Line 10 `description`: `Poštovní klub — ručně dělaná obálka každé dva měsíce. Žádné notifikace, žádný algoritmus. Vyzkoušej Edici VÍTEJ za 99 Kč.`
- Line 12 `og:description`: `Poštovní klub. Ručně dělaná obálka každé dva měsíce.`
- Line 49 kicker: `✦ TÉMATICKÝ POŠTOVNÍ KLUB`

- [ ] **Step 3: Fix the remaining copy**

- Lines 231–232 describe VÍTEJ as `Jako Úroveň 2 — ale ZINE je o klubu samotném … A navíc Receptová karta z Úrovně 3.` Rewrite on its own terms: `Šest fyzických kusů — fotopohlednice, ZINE o klubu, samolepka, citát, dopis a receptová karta. Jednorázově, bez závazku.`
- Line 847: `Každé Tvé předplatné posouvá svět dál` → `Každá Tvá objednávka posouvá svět dál`
- Line 1108: → `Vybereš Edici VÍTEJ za 99 Kč, nebo aktuální edici za 149 Kč. Platíš online, jednorázově.`
- Line 1114: → `Žádné automatické odběry. Každá objednávka je jednorázová.`
- Lines 1206–1212 and 1227: replace the two subscription FAQ entries with `Opakuje se platba?` → `Ne. Každá objednávka je jednorázová — nic se nestrhává.` and `Jak často vychází edice?` → `Každé dva měsíce, šestkrát za rok.`
- Line 935 (`Stolní odtrhávací / Měsíční foto / A3`) describes a future calendar product, not the club. **Leave it.**
- Line 1339 (`99 Kč jednorázově. Bez předplatného…`) is already correct. **Leave it.**

- [ ] **Step 4: Verify**

Run: `python tools/check_site.py 2>&1 | grep index.html`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Replace homepage tier grid with current edition block"
```

---

## Task 9: Support page, thank-you page, charity ledger

Three smaller pages that each promise something the new model cannot deliver.

**Files:**
- Modify: `sprava-predplatneho.html:8`, `:161-164`, `:177`, `:203`, `:212`, `:255-265`, `:459`, `:475`, `:491`
- Modify: `dekuji.html:449`
- Modify: `dobro.html:1428`, `:1434`, `:1447-1470`, `:1497-1498`

- [ ] **Step 1: Repurpose `sprava-predplatneho.html`**

- Line 8 title and lines 161–164 meta: `Moje objednávka · Filipův podivuhodný svět`. While here, fix the two `https://example.com/` placeholders in the canonical and `og:url` tags to `https://filipuvpodivuhodnysvet.cz/sprava-predplatneho.html`.
- Line 177 `<h1 class="page-title">`: `Moje objednávka.`
- Line 203: replace the SimpleShop subscription explanation with `Objednávky vyřizuju ručně. Napiš mi, co potřebuješ, a ozvu se ti.`
- Line 212: delete the `<option value="Změna úrovně předplatného" data-key="tier">` option.
- Lines 255–265: delete the whole `<!-- Změna úrovně předplatného -->` fieldset, including the `t-level` select and its `t-level-err` span.
- Line 459: delete `'Nová úroveň: ' + v('t-level') + '\n' +` from the message builder.
- Line 475: `'MOJE OBJEDNÁVKA\n\n' +`
- Line 491: `subject: 'Moje objednávka – ' + type,`

Confirm the remaining request types still make sense (change of address, question about a shipment, complaint).

- [ ] **Step 2: Fix `dekuji.html`**

Line 449 currently reads `Předplatné Poštovního klubu se opakuje každý měsíc. Úroveň změníš nebo zrušíš kdykoli ve svém účtu — bez závazku.` — a promise of an account and a recurring charge, neither of which exists.

Replace with: `Objednávka je jednorázová — nic se neopakuje a nic se nestrhává. Až vyjde další edice, dám ti vědět e-mailem.`

- [ ] **Step 3: Rewrite the `dobro.html` ledger**

Replace the three tier rows (lines 1447–1470) with a single edition row, keeping the `Edice VÍTEJ` row above it untouched:

```html
        <div class="ledger-row">
          <div class="ledger-row-content">
            <div class="ledger-row-title">Edice · jednorázové</div>
            <div class="ledger-row-subtitle">Členské · 149 Kč</div>
          </div>
          <div class="ledger-row-count">0 obálek</div>
          <div class="ledger-row-amount">+ 0 Kč</div>
        </div>
```

Every count is currently `0`, so no real donation history is being rewritten. **If any row shows a non-zero count when you get here, stop and ask** — that would be a historical record, not a template.

Line 1428 and 1434 frame the ledger as monthly. Change the subtitle to `Počty objednávek za tuto edici — a kolik z nich půjde Člověk v tísni. Žádná jména, žádné záznamy.` and the period label `2026 · měsíc 1 z Q2` to `2026 · edice 1`.

- [ ] **Step 4: Recompute the essay figures**

Line 1497 has three faults: it cites `Úroveň 2`, it doubles the currency (`3 469,48 Kč Kč`), and its VÍTEJ figure of `2,48 Kč` contradicts the cost sheet, which gives `1,22 Kč`.

Replace the paragraph with:

```html
        <p class="essay-paragraph">Tři procenta jsou dost, aby to znamenalo reálné peníze — z jedné edice to dělá 3,06 Kč, za celý rok šesti edic 18,38 Kč, z jedné Edice VÍTEJ 1,22 Kč. Když přijde sto členů, je to 1 838 Kč za rok. A když jich přijde tisíc, je to 18 376 Kč.</p>
```

(3 % ze superhrubého zisku 1, jak to Filip počítá: 149 − 46,91 = 102,09 Kč, z toho 3 % = 3,06 Kč. Figure for Edice VÍTEJ comes straight from the cost sheet.)

Line 1498 contains the typo `Každá koruna má se počítá.` — fix to `Každá koruna se počítá.`

- [ ] **Step 5: Verify**

Run: `python tools/check_site.py 2>&1 | grep -E "sprava-predplatneho|dekuji|dobro"`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add sprava-predplatneho.html dekuji.html dobro.html
git commit -m "Align support, thank-you and charity pages with one-off edition orders"
```

---

## Task 10: Remaining copy — VÍTEJ and Náš svět

**Files:**
- Modify: `edice-vitej.html` (10 matches)
- Modify: `nas-svet.html:193`

- [ ] **Step 1: Align `edice-vitej.html`**

Run `grep -n "Úrove\|předplatn\|měsíčn\|139 Kč\|119 Kč\|250 Kč" edice-vitej.html` and work through each hit:
- Any "pokračuj Úrovní 2"-style upsell becomes "pokračuj aktuální edicí za 149 Kč", linking to `postovni-klub.html`.
- Any "každý měsíc" describing the club becomes "každé dva měsíce".
- **Keep every "Žádné předplatné" negation exactly as written.**

- [ ] **Step 2: Soften the growth promise in `nas-svet.html`**

Line 193 reads `Poštovní klub je první kapitola. Když se nás sejde dost, otevřu druhou, třetí i další.` — a promise of expansion that contradicts a restructure whose purpose is doing less.

Replace with: `Poštovní klub je první kapitola. Píšu ji pomalu a poctivě — a až přijde čas, otevřu druhou.`

Line 341 (`Stolní odtrhávací, měsíční foto, A3.`) describes a future calendar, not the club. **Leave it.**

- [ ] **Step 3: Verify**

Run: `python tools/check_site.py 2>&1 | grep -E "edice-vitej.html|nas-svet"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add edice-vitej.html nas-svet.html
git commit -m "Align VÍTEJ and Náš svět copy with the new edition rhythm"
```

---

## Task 11: Retire old URLs and finish

**Files:**
- Replace: `postovni-klub-uroven-1-objednavka.html`, `postovni-klub-uroven-2-objednavka.html`, `postovni-klub-uroven-3-objednavka.html`
- Delete: `opakovane-platby.html`
- Modify: `sitemap.xml`

- [ ] **Step 1: Turn the three tier order pages into redirect stubs**

Overwrite each of the three files with exactly this, and nothing else:

```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Objednávka edice · Filipův podivuhodný svět</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="https://filipuvpodivuhodnysvet.cz/postovni-klub-objednavka.html">
  <meta http-equiv="refresh" content="0; url=postovni-klub-objednavka.html">
  <style>
    body { background:#F4F2EB; color:#3A2C31; font-family:'Fraunces',Georgia,serif;
           display:flex; align-items:center; justify-content:center; min-height:100vh;
           margin:0; padding:24px; text-align:center; }
    a { color:#FC7B35; }
  </style>
</head>
<body>
  <p>Tři úrovně nahradila jedna edice.<br>
     Přesměrovávám tě na <a href="postovni-klub-objednavka.html">objednávku edice</a>.</p>
</body>
</html>
```

- [ ] **Step 2: Delete the recurring-payments page**

```bash
git rm opakovane-platby.html
```

Confirm nothing still links to it:

Run: `grep -rn "opakovane-platby" --include=*.html --include=*.js .`
Expected: no output (Task 4 already removed the footer link).

- [ ] **Step 3: Update `sitemap.xml`**

- Remove the `<url>` entries for `opakovane-platby.html`, `test-button.html`, and the three `postovni-klub-uroven-*-objednavka.html` pages.
- Add entries for `https://filipuvpodivuhodnysvet.cz/postovni-klub-objednavka.html` and `https://filipuvpodivuhodnysvet.cz/edice.html`.
- Set `<lastmod>2026-08-03</lastmod>` on every page this plan touched.

- [ ] **Step 4: Full verification**

Run: `python tools/check_site.py`
Expected: `OK — no stale copy, no broken links.` and exit 0.

Then run `python -m http.server 8000` and click through `index.html` → `postovni-klub.html` → `postovni-klub-objednavka.html` → `edice.html` → `sprava-predplatneho.html`. Confirm on every page: the banner countdown renders, the nav dropdown lists three entries, the footer has no "Opakované platby", and the browser console is clean.

Finally open `http://localhost:8000/postovni-klub-uroven-2-objednavka.html` and confirm it redirects to the new order page.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Retire tier URLs and recurring payments page"
```

---

## Post-implementation: what Filip must do

These block the site from taking money and cannot be done in code:

1. **Create the SimpleShop product** "Edice — 149 Kč" with three region forms, and paste the IDs into `cms-config.js` → `edition.formIds`. Until then the order page shows the fallback notice instead of a form.
2. **Set the real edition** — `number`, `name`, `dispatchDate`, `cover` in `cms-config.js`. The plan ships `A02 Ticho` as a placeholder.
3. **Add cover images** `assets/edice-a01.png` and `assets/edice-a02.png`.
4. **Check the VOP PDF** (`assets/Všeobecené obchodní podmínky.pdf`) for subscription and recurring-payment clauses.
5. **Email the VÍTEJ recipients** via MailerLite about the new format.
6. ~~Confirm the postage figures.~~ **Resolved 2026-08-03** — 19 / 36 / 42 Kč is correct (31 / 48 / 54 Kč real cost minus the 12 Kč Filip absorbs). The `19 / 29 / 35 Kč` on the old order pages was stale and dies with them.
7. **Fix the postage line in the cost sheet.** It carries 11 Kč; the real out-of-pocket is 12 Kč per envelope.
