/**
 * Simplified CMS Configuration for Filipův podivuhodný svět
 * Use this file to update global dates, deadlines, images, and prices.
 */

const CMS_CONFIG = {
    // 1. TOP BANNER & COUNTDOWN
    banner: {
        // --- Launch dispatch (Velký den odeslání) ---
        // Countdown targets this date first. Copy below is shown until it passes.
        desktopText: "Edice VÍTEJ · objednávky otevřené · Velký den odeslání 15. června",
        mobileText: "Objednávky otevřené · Velký den odeslání 15. 6.",
        deadlineDate: "2026-06-15T08:00:00+02:00", // ISO 8601 (YYYY-MM-DDTHH:MM:SS+HH:MM) — Velký den odeslání
        link: "edice-vitej.html",

        // --- Recurring dispatch (Den odeslání) ---
        // After deadlineDate passes, the countdown automatically rolls to this
        // weekday every week. To STOP recurring, set recurringWeekday to null.
        recurringWeekday: 1,          // 0=neděle, 1=pondělí, 2=úterý ... (1 = každé pondělí)
        recurringTime: "08:00",       // local dispatch time HH:MM
        recurringDesktopText: "Edice VÍTEJ · objednávky otevřené · Den odeslání každé pondělí",
        recurringMobileText: "Objednávky otevřené · Den odeslání každé pondělí"
    },

    // 2. GLOBAL DEADLINES & DATES
    // Use these strings in your HTML with data-cms="deadline-vitej" etc.
    dates: {
        vitejClosure: "10. června 23:59",
        nextShipping: "15. června",
        currentMonth: "Červen"
    },

    // 3. TIER IMAGES & PRICES
    // Used on postovni-klub.html and in dynamic overviews
    tiers: {
        listek: {
            name: "Start",
            image: "assets/L%C3%ADstek.png", // Ensure this path is correct
            price: "119 Kč",
            frequency: "měsíčně"
        },
        dopis: {
            name: "Klasik",
            image: "assets/Dopis.png",
            price: "139 Kč",
            frequency: "měsíčně"
        },
        balicek: {
            name: "Sběratel",
            image: "assets/Bal%C3%ADek.png",
            price: "250 Kč",
            frequency: "měsíčně"
        }
    }
};

// Export for use in global.js and other scripts if needed
if (typeof module !== 'undefined') {
    module.exports = CMS_CONFIG;
}
