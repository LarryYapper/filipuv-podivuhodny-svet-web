# Poštovní klub — restrukturalizace a přestavba webu

**Datum:** 2026-08-03
**Stav:** návrh k odsouhlasení
**Autor:** Filip Kubík + Claude

---

## 1. Proč

Klub v současné podobě stojí víc energie, než kolik vrací. Tři úrovně členství se
liší obsahem, takže každé odeslání znamená tři různé výrobní série. Měsíční
rytmus nedává prostor nadechnout se. K tomu videa na sociální sítě, která Filipa
vyčerpávají nejvíc ze všeho. Za měsíc začíná škola.

Zároveň se změnily vnější podmínky: **ComGate zakázal automatické měsíční
strhávání**, takže „předplatné" na webu už fakticky neexistuje — všechno se platí
po jedné obálce. Web ale pořád mluví jazykem předplatného, úrovní a
opakovaných plateb. Tenhle rozpor je potřeba narovnat.

Dosavadní čísla: rozesláno **~11 kusů Edice VÍTEJ** (+ ~3 rodině). Žádné aktivní
měsíční předplatné. Kontakty na příjemce jsou v MailerLite, mají slevové kódy.

**Cíl:** klub zachovat, ale zmenšit jeho provozní zátěž na zlomek — a web tomu
přizpůsobit tak, aby jedna edice znamenala úpravu **jednoho konfiguračního
souboru**, ne dvaceti stránek.

---

## 2. Nová podoba nabídky

### 2.1 Jeden produkt místo tří

| | Dnes | Nově |
|---|---|---|
| Produkty | Úroveň 1 / 2 / 3 | **jedna edice** |
| Rytmus | měsíčně | **jednou za dva měsíce (6× ročně)** |
| Cena | 119 / 139 / 250 Kč | **149 Kč + poštovné** |
| Platba | „předplatné" (fakticky jednorázově) | **jednorázově za edici** |

Edice se čísluje a pojmenovává tématem — navazuje na dnešní `Edice A01
Přítomnost`.

### 2.2 Co je v obálce

Čtyři věci, každá s jasnou rolí. Nic víc.

- **ZINE** (~12 stran, ručně sešitý) — srdce obálky, nositel tématu
- **Ručně psaný dopis** — osobní spojení s příjemcem
- **Fotopohlednice** — hmatatelná věc, kterou jde ukázat a poslat dál
- **Karta s citátem** — filozofický dozvuk, který v obálce zůstane nejdéle

**Vyřazeno:** mini plakát, stírací los, receptová karta, oznámení o eshopu,
samostatný článek (jeho obsah se přesouvá dovnitř ZINE).

**Narozeninové přání** se ruší.

### 2.3 Edice VÍTEJ zůstává beze změny

Jednorázový vstupní produkt za 99 Kč (80 Kč + poštovné). Je hotový, nestojí
žádnou novou tvůrčí práci a plní roli vstupní branky do klubu.

---

## 3. Provoz

### 3.1 Jak běží „always-open" model bez toho, aby vyčerpával

Objednávky jsou otevřené pořád — ale **výroba probíhá 6× ročně, nikdy na
vyžádání**. To je celý trik.

1. **Výrobní víkend** (jednou za dva měsíce): vymyslet a vyrobit edici, pak
   vytisknout, sešít a zabalit **celou sérii najednou** — známí odběratelé +
   rezerva (orientačně ~15 kusů).
2. **Expediční den** — jeden pevný den v týdnu (např. pondělí). Objednávky se
   odesílají ze zásoby, nikdy ne ihned po objednání.
3. Když série dojde, edice se v katalogu překlopí na **doprodáno**.

Rezervní kusy stojí ~35 Kč materiálu — přetisknout pár navíc je levné pojištění.

### 3.2 Propagace

Na edici: **jedno jednoduché video + jeden e-mail v MailerLite.** Fotky pro
sociální sítě se nafotí dávkově během výrobního víkendu. Nic dalšího se
neslibuje.

---

## 4. Ekonomika

Spočítáno **zdola z jednotlivých položek**, ne z mezisoučtů — aby nezáleželo na
tom, co přesně obsahuje řádek „(+) Úroveň 1".

**Výrobní náklady na obálku**

| Položka | Kč |
|---|---|
| Fotopohlednice | 3,81 |
| Dopis | 0,80 |
| ZINE obal | 3,81 |
| ZINE obsah | 1,09 |
| Karta s citátem | 0,41 |
| Samolepka | 0,65 |
| Obálka C5 | 5,00 |
| Odesílatel samolepka | 0,75 |
| Inkoust | 5,50 |
| Poštovné | 11,00 |
| **Výroba celkem** | **32,82** |

**Poplatky** (sazby odvozené z tabulky: SimpleShop 4,72 % a ComGate 1,0 %
z částky včetně poštovného, referenční kód 2 % z ceny)

| Položka | Kč |
|---|---|
| SimpleShop (4,72 % ze 168) | 7,93 |
| ComGate (1,0 % ze 168) | 1,68 |
| Elektřina | 0,50 |
| Členský / referenční kód | 2,98 |
| **Poplatky celkem** | **13,09** |

**Výsledek**

| | Úroveň 2 (dnes) | Nová edice |
|---|---|---|
| Cena | 139 Kč | **149 Kč** |
| Variabilní náklady | 48,80 Kč | **45,91 Kč** |
| Superhrubý zisk 1 | 90,20 Kč (64,9 %) | **103,09 Kč (69,2 %)** |
| Charita 3 % | 2,71 Kč | 3,09 Kč |
| Honoráře | 6,50 Kč | 6,50 Kč |
| **Hrubý zisk** | **80,99 Kč (58,3 %)** | **93,50 Kč (62,8 %)** |

Náklady klesají o vyřazený mini plakát (3,27 Kč) a oznámení o eshopu (0,39 Kč);
poplatky mírně rostou s vyšší cenou.

Při 11 obálkách na edici a 6 edicích ročně to dělá **~6 200 Kč hrubého zisku za
rok** — za šest výrobních víkendů a zhruba hodinu týdně na expedici.

> **Nesrovnalost v tabulce, kterou stojí za to jednou zkontrolovat.** Podle
> zadání má „(+) Úroveň 1" obsahovat jen výrobní náklady. Ty ale dávají 25,90 Kč
> (26,40 Kč s elektřinou), zatímco v buňce je **36,66 Kč** — tedy přesně
> celkový variabilní náklad Úrovně 1 včetně poplatků (řádek 24). Že se do
> mezisoučtu dostala plná částka, potvrzuje i součet: 59,56 Kč u Úrovně 2 vyjde
> jen s 36,66; s 25,90 by vyšlo 48,80 Kč. Buď je popisek řádku, nebo odkaz ve
> vzorci mimo. Čísla výše počítají s výrobou 25,90 Kč, protože to odpovídá
> zadanému záměru. (Čtu exportované hodnoty, ne vzorce — ověření zabere minutu.)

---

## 5. Přestavba webu

### 5.1 Řídící princip

**Jedna edice = úprava jednoho souboru.** Všechna data, která se mění mezi
edicemi (číslo, název, téma, cena, stav skladu, datum expedice, ID
objednávkových formulářů), žijí v `cms-config.js`. Stránky si je čtou. Žádné
ruční přepisování HTML.

Vizuální identita zůstává beze změny — Fraunces + Mulish, papírové plátno
`#F4F2EB`, oranžové akcenty `#FC7B35` / `#FF6752`. Mění se **struktura a texty**,
ne vzhled.

### 5.2 Datový model v `cms-config.js`

Objekt `tiers` (tři úrovně) se ruší a nahrazuje:

```js
edition: {
  number: "A02",
  name: "Ticho",                          // téma edice
  price: 149,
  postage: { cz: 19, eu: 36, world: 42 },
  status: "available",                    // available | last_pieces | sold_out
  dispatchDate: "2026-10-05T08:00:00+02:00",  // ISO 8601, stejný formát jako dnešní deadlineDate
  cover: "assets/edice-a02.png",
  formIds: { cz: "xxxxx", eu: "xxxxx", world: "xxxxx" }  // z SimpleShopu
},
archive: [ /* stejná struktura pro starší edice, včetně A01 Přítomnost */ ]
```

### 5.3 Stránky

**Přestavět**

| Soubor | Co se s ním stane |
|---|---|
| `postovni-klub.html` | Jádro práce (2 155 řádků). Pryč: lepivá lišta úrovní, třísloupcová srovnávací tabulka, karty úrovní. Nově: hero aktuální edice → co je uvnitř (4 položky) → cena a objednávka → jak to funguje → časté dotazy. |
| `index.html` | Sekce „Úrovně členství" (~ř. 495–800) nahrazena blokem jedné edice. Hero a meta popisky „měsíční" → „každé dva měsíce". Časté dotazy přepsány. |
| `sprava-predplatneho.html` | Z „Správy předplatného" se stává **„Moje objednávka"** — změna adresy, dotaz k zásilce, reklamace. Volba „Změna úrovně předplatného" se ruší. Formulářová mechanika (odeslání e-mailem) zůstává. |
| `edice-vitej.html` | Jen texty: odkazy na „úrovně" → „edice", sjednocení jazyka. |
| `nas-svet.html` | Klub je tu popsaný jako „první kapitola. Když se nás sejde dost, otevřu druhou, třetí i další." Ten růstový slib je v rozporu se zmenšováním provozu — přeformulovat na klidnější ambici. Sjednotit rytmus („měsíční" → „každé dva měsíce") a odkazy na klub. |
| `components.js` | Lišta edice = stav aktuální edice z configu. V navigaci „Úrovně členství" → „Aktuální edice", přibývá „Všechny edice". Patička: pryč „Správa předplatného" a „Opakované platby", tagline „Měsíční obálka" → „Obálka každé dva měsíce". |
| `global.js` | Odpočet míří na `dispatchDate` edice místo týdenního opakování. |
| `cms-config.js` | Viz 5.2. |
| `sitemap.xml` | Nové stránky přidat, zrušené odebrat. |

**Nové**

| Soubor | Účel |
|---|---|
| `edice.html` | Katalog všech edic — obálka, téma, stav (k dispozici / poslední kusy / doprodáno). Srdce „always-open" modelu. |
| `postovni-klub-objednavka.html` | Jediná objednávková stránka. Přebírá osvědčený vzor přepínání regionů (`.form-region[hidden]`, CZ / Evropa / Svět) z dnešních stránek úrovní. |

**Zrušit / přesměrovat**

| Soubor | Co s ním |
|---|---|
| `postovni-klub-uroven-{1,2,3}-objednavka.html` | Nahradit přesměrovacím útržkem (meta refresh + odkaz) na novou objednávkovou stránku. Staré URL nesmí končit 404. |
| `opakovane-platby.html` | Žádné opakované platby neexistují — ComGate je zakázal. Stránku smazat, odkaz v patičce odebrat, URL přesměrovat na obchodní podmínky. |

**Beze změny:** `dobro.html`, `o-mne.html`, `kontakt.html`,
`reklamace.html`, `odstoupeni-od-smlouvy.html`, `dekuji.html`, `404.html`,
`edice-alfa-*.html` (archiv), `emails/`, `styles.css` (drobnosti podle potřeby).

nas-svet.html and the explainer on the home page about the new sub-brands. Keep them, but do not base them on subscriber count. Make them as future sub-brands. and reorder them. It is Poštovní klub now, 3D tisk jako druhý. Keep the rest. 

### 5.4 Jazyk napříč webem

Systematicky odstranit: „předplatné", „měsíční", „úroveň", „členství",
„zrušíš jedním klikem", „automatické strhávání". Nahradit: „edice",
„každé dva měsíce", „objednávka", „člen klubu".

Zrušené narozeninové přání zmizí i z textů — dnes je slíbené v `postovni-klub.html`
(ř. 597 a 601, „v měsíci tvých narozenin"). Je to jediný výskyt na webu, ale je
to slib, který by po změně nebyl splněn.

Celkem 171 výskytů v 16 souborech — projít všechny, ne jen ty zjevné.

---

## 6. Co musí udělat Filip mimo kód

Tyhle věci kód nevyřeší a bez nich web nebude fungovat:

1. **Vytvořit v SimpleShopu nový produkt** „Edice — 149 Kč" a tři objednávkové
   formuláře (CZ / Evropa / Svět). Jejich ID patří do `cms-config.js`.
2. **Zkontrolovat obchodní podmínky** (`assets/Všeobecené obchodní
   podmínky.pdf`) — pokud zmiňují předplatné nebo opakované platby, je potřeba
   je upravit. PDF nejde měnit z kódu.
3. **Poslat e-mail příjemcům Edice VÍTEJ** přes MailerLite s vysvětlením nové
   podoby klubu; slevové kódy platí dál.
4. **Zkontrolovat buňku „(+) Úroveň 1"** v tabulce nákladů — má obsahovat
   25,90 Kč (jen výroba), je v ní 36,66 Kč (viz poznámka v části 4).

---

## 7. Jak poznáme, že je hotovo

- Na webu není jediná zmínka o úrovních, předplatném ani opakovaných platbách.
- Objednat edici jde ze tří míst (úvod, stránka klubu, katalog) a všechny vedou
  na jednu objednávkovou stránku.
- Stará URL úrovní i opakovaných plateb přesměrovávají, nikde není 404.
- Vydání nové edice = úprava `cms-config.js` a nahrání obrázku. Nic víc.
- Web vypadá stejně jako dřív — mění se, co říká, ne jak vypadá.

---

## 8. Vědomě odloženo

Věci, které by dávaly smysl, ale teď by jen přidaly práci: uživatelské účty,
automatické hlídání skladu, vícejazyčná verze, e-shop s jednotlivými kusy ze
starých edic, návrat automatických plateb přes jiného poskytovatele. Až bude
klub běžet klidně a škola bude zvládnutá, dá se k nim vrátit.
