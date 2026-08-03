/**
 * Simplified CMS Configuration for Filipův podivuhodný svět
 * Use this file to update global dates, deadlines, images, and prices.
 */

const CMS_CONFIG = {
    // 1. TOP BANNER & COUNTDOWN
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

    // 2. GLOBAL DEADLINES & DATES
    // Use these strings in your HTML with data-cms="deadline-vitej" etc.
    dates: {
        vitejClosure: "10. června 23:59",
        nextShipping: "15. června",
        currentMonth: "Červen"
    },

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
};

// Export for use in global.js and other scripts if needed
if (typeof module !== 'undefined') {
    module.exports = CMS_CONFIG;
}
