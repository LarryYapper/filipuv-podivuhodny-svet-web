/**
 * Simplified CMS Configuration for Filipův podivuhodný svět
 * Use this file to update global dates, deadlines, images, and prices.
 */

const CMS_CONFIG = {
    // 1. TOP BANNER & COUNTDOWN
    banner: {
        desktopText: "Edice VÍTEJ – objednávky do 10. června 23:59 · odesílám 15. června",
        mobileText: "Edice VÍTEJ · objednávky do 10. 6. 23:59 · odesílám 15. 6.",
        deadlineDate: "2026-06-10T23:59:00+02:00", // ISO 8601 format (YYYY-MM-DDTHH:MM:SS+HH:MM)
        link: "edice-vitej.html"
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
