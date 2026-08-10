/**
 * Simplified CMS Configuration for Filipův podivuhodný svět
 * Use this file to update global dates, deadlines, images, and prices.
 *
 * VYDÁNÍ NOVÉ EDICE — co udělat:
 *   1. V SimpleShopu vytvoř produkt "Filipova Edice <číslo> <téma>" a zkopíruj
 *      jeho ID z odkazu (https://form.simpleshop.cz/<ID>/buy/).
 *   2. Zkopíruj objednávkovou stránku předchozí edice na
 *      edice-<číslo>-objednavka.html a přepiš v ní číslo, téma a formId.
 *      Každá edice má vlastní stránku i formulář — díky tomu je v SimpleShopu
 *      i v MailerLite (webhooky) poznáš od sebe a starší edice jde doprodat.
 *   3. Přesuň dosavadní `edition` na začátek `archive` a nastav jí status.
 *   4. Sem doplň novou `edition` z `upcoming` a nahraj obálku do assets/.
 */

const CMS_CONFIG = {
    // 1. TOP BANNER & COUNTDOWN
    banner: {
        deadlineDate: "2026-08-20T08:00:00+02:00", // shodné s edition.dispatchDate
        link: "postovni-klub.html",

        // Expedice probíhá jeden pevný den v týdnu ze zásoby.
        recurringWeekday: 1,          // 0=neděle, 1=pondělí ...
        recurringTime: "08:00",
        recurringDesktopText: "Objednávky otevřené · expedice každé pondělí",
        recurringMobileText: "Expedice každé pondělí"
    },

    // 2. DORUČENÍ — jak dlouho jde zásilka po expedici. Jediné místo, kde je
    // tahle lhůta napsaná; stránky si z ní počítají i konkrétní data.
    delivery: {
        minDays: 7,
        maxDays: 14
    },

    // 3. GLOBAL DATES
    // V HTML se používají přes data-cms="date-<klíč>". Většina klíčů se
    // POČÍTÁ SAMA z `edition.dispatchDate`, `banner.recurring*` a `delivery`,
    // takže se žádné datum nepíše do stránky ručně a nemůže zestárnout:
    //
    //   date-nextDispatch    → nejbližší pravidelná expedice    "10. srpna"
    //   date-orderCutoff     → večer před expedicí              "9. srpna 23:59"
    //   date-deliveryWindow  → kdy dorazí po nejbližší expedici "17.–24. srpna"
    //   date-editionDispatch → odeslání aktuální edice          "20. srpna"
    //   date-editionDelivery → kdy dorazí aktuální edice        "27. srpna – 3. září"
    //   date-deliveryDays    → doručovací lhůta                 "7–14 dní"
    //
    // Sem se píše jen datum, které chceš natvrdo přebít (ruční hodnota má
    // přednost před vypočítanou). Normálně nech prázdné.
    dates: {},

    // 4. CURRENT EDITION — the block that changes when a new edition ships.
    edition: {
        number: "A01",
        name: "Přítomnost",
        price: 149,
        postage: { cz: 19, eu: 36, world: 42 }, // volí se uvnitř formuláře
        status: "available",          // available | last_pieces | sold_out
        dispatchDate: "2026-08-20T08:00:00+02:00",
        cover: "assets/edice-a01.png",
        orderPage: "edice-a01-objednavka.html",
        formId: "YPDQ4"               // SimpleShop: "Filipova Edice"
    },

    // 5. UPCOMING — plánované edice, nejbližší první. Zatím bez formuláře.
    // Odesílám každé dva měsíce; přes zimu je delší pauza (říjen → leden).
    upcoming: [
        { number: "A02", name: "Tvrdá práce",  dispatchDate: "2026-10-20T08:00:00+02:00" },
        { number: "A03", name: "Přátelství",   dispatchDate: "2027-01-20T08:00:00+01:00" },
        { number: "A04", name: "Smysl života", dispatchDate: "2027-03-20T08:00:00+01:00" },
        { number: "A05", name: "Láska",        dispatchDate: "2027-05-20T08:00:00+02:00" }
    ],

    // 6. ARCHIVE — doprodané nebo odeslané edice, nejnovější první.
    // Stejný tvar jako `edition`. Edice se statusem "sold_out" nepotřebuje
    // formId ani orderPage — v katalogu se zobrazí jako doprodaná.
    archive: []
};

// Export for use in global.js and other scripts if needed
if (typeof module !== 'undefined') {
    module.exports = CMS_CONFIG;
}
