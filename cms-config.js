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

const SHARED_PRICE = 149;
const SHARED_POSTAGE = { cz: 19, eu: 36, world: 42 };

function makeOrderPage(number) {
    return "edice-" + String(number).toLowerCase() + "-objednavka.html";
}

const EDITIONS = [
    {
        number: "A01",
        name: "Přítomnost",
        price: SHARED_PRICE,
        postage: SHARED_POSTAGE,
        status: "available",
        dispatchDate: "2026-08-24T08:00:00+02:00",
        gradient: "#a7c957",
        cover: "assets/edice-a01/edice.JPG",
        detailImages: ["assets/edice-a01/zine.JPG", "assets/edice-a01/postcard.JPG", "assets/edice-a01/sticker.JPG"],
        orderPage: makeOrderPage("A01"),
        formId: "YPDQ4"
    },
    {
        number: "A02",
        name: "Tvrdá práce",
        price: SHARED_PRICE,
        postage: SHARED_POSTAGE,
        status: "preorder",
        dispatchDate: "2026-10-20T08:00:00+02:00",
        gradient: "#a96737",
        cover: "assets/edice-a02/edice.JPG",
        detailImages: ["assets/edice-a02/zine.JPG", "assets/edice-a02/postcard.JPG", "assets/edice-a02/sticker.JPG"],
        orderPage: makeOrderPage("A02"),
        formId: "5Q4zw"
    },
    {
        number: "A03",
        name: "Přátelství",
        price: SHARED_PRICE,
        postage: SHARED_POSTAGE,
        status: "upcoming",
        dispatchDate: "2027-01-20T08:00:00+01:00",
        gradient: "#5878da",
        cover: "assets/edice-a03.png",
        detailImages: [],
        orderPage: makeOrderPage("A03"),
        formId: ""
    },
    {
        number: "A04",
        name: "Smysl života",
        price: SHARED_PRICE,
        postage: SHARED_POSTAGE,
        status: "upcoming",
        dispatchDate: "2027-03-20T08:00:00+01:00",
        gradient: "#eecf6d",
        cover: "assets/edice-a04.png",
        detailImages: [],
        orderPage: makeOrderPage("A04"),
        formId: ""
    },
    {
        number: "A05",
        name: "Láska",
        price: SHARED_PRICE,
        postage: SHARED_POSTAGE,
        status: "upcoming",
        dispatchDate: "2027-05-20T08:00:00+02:00",
        gradient: "#e15181",
        cover: "assets/edice-a05.png",
        detailImages: [],
        orderPage: makeOrderPage("A05"),
        formId: ""
    }
];

const CURRENT_EDITION = EDITIONS.find(function (edition) {
    return edition.status === "available";
}) || EDITIONS.find(function (edition) {
    return edition.status === "last_pieces";
}) || EDITIONS[0];

// --- SHOP STATUS & HOLIDAY SWITCH ---
const SHOP_STATUS = {
    status: "holiday", // Options: "open" | "holiday"
    startday: 3,
    endday: 9,
    month: "září",
    opendate: "10. 9." 
};

// --- AUTOMATIC BANNER TEXT & TIMER GENERATION ---
const isHoliday = SHOP_STATUS.status === "holiday";

// 1. Automatický převod "10. 9." na "YYYY-MM-DDT08:00:00+02:00"
const dateParts = SHOP_STATUS.opendate.split('.');
const openDay = (dateParts[0] || "1").trim().padStart(2, '0');
const openMonth = (dateParts[1] || "1").trim().padStart(2, '0');
const currentYear = new Date().getFullYear();
const dynamicTimerDate = `${currentYear}-${openMonth}-${openDay}T08:00:00+02:00`;

// 2. Automatické složení textů
const dynamicDesktopText = isHoliday 
    ? `🧳 Dovolená ${SHOP_STATUS.startday}.–${SHOP_STATUS.endday}. ${SHOP_STATUS.month} (odesílám ${SHOP_STATUS.opendate}) • Běžně odesílám každé pondělí`
    : "Obálky odesílám každé pondělí";

const dynamicMobileText = isHoliday 
    ? `🧳 Dovolená ${SHOP_STATUS.startday}.–${SHOP_STATUS.endday}. ${SHOP_STATUS.month} (odesílám ${SHOP_STATUS.opendate})`
    : "Obálky odesílám každé pondělí";

const CMS_CONFIG = {
    shopstatus: SHOP_STATUS,

    // 1. TOP BANNER & COUNTDOWN
    banner: {
        deadlineDate: isHoliday ? dynamicTimerDate : "2026-08-20T08:00:00+02:00", 
        link: "postovni-klub.html",

        recurringWeekday: 1,
        recurringTime: "08:00",
        
        recurringDesktopText: dynamicDesktopText,
        recurringMobileText: dynamicMobileText
    },

    // 2. DORUČENÍ
    delivery: {
        minDays: 7,
        maxDays: 14
    },

    // 3. GLOBAL DATES
    dates: {},

    // 4. CENTRAL EDITION LIST
    editions: EDITIONS,

    // 5. CURRENT EDITION
    edition: CURRENT_EDITION,

    // 6. UPCOMING
    upcoming: EDITIONS.filter(function (edition) {
        return edition.number !== CURRENT_EDITION.number
            && edition.status !== "sold_out"
            && edition.status !== "archive";
    }),

    // 7. ARCHIVE
    archive: EDITIONS.filter(function (edition) {
        return edition.status === "sold_out" || edition.status === "archive";
    })
};

// Export for use in global.js and other scripts if needed
if (typeof module !== 'undefined') {
    module.exports = CMS_CONFIG;
}