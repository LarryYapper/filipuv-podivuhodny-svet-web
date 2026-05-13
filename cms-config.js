/**
 * Simplified CMS Configuration for Filipův podivuhodný svět
 * Use this file to update global dates, deadlines, images, and prices.
 */

const CMS_CONFIG = {
    // 1. TOP BANNER & COUNTDOWN
    banner: {
        desktopText: "Edice VÍTEJ – objednávky do 5. června 20:00 · doručení od 10. června",
        mobileText: "Edice VÍTEJ – objednávky",
        deadlineDate: "2026-06-05T20:00:00+02:00", // ISO 8601 format (YYYY-MM-DDTHH:MM:SS+HH:MM)
        link: "edice-vitej.html"
    },

    // 2. GLOBAL DEADLINES & DATES
    // Use these strings in your HTML with data-cms="deadline-vitej" etc.
    dates: {
        vitejClosure: "5. června",
        nextShipping: "10. června",
        currentMonth: "Květen"
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
            name: "Plnohodnotný",
            image: "assets/Dopis.png",
            price: "139 Kč",
            frequency: "měsíčně"
        },
        balicek: {
            name: "Sběratelský",
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
