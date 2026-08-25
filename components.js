/**
 * Shared Components for Filipův podivuhodný svět
 * Use this file to manage the Header and Footer across all pages.
 */

const SHARED_COMPONENTS = {
    banner: `
        <div class="top-banner banner-load"
            style="align-items: center; background-color: #3A2C310D; border-bottom-color: #3A2C311F; border-bottom-style: solid; border-bottom-width: 1px; box-sizing: border-box; display: flex; gap: 18px; justify-content: space-between; padding-block: 14px; padding-inline: clamp(20px, 5vw, 80px); flex-wrap: wrap; width: 100%;">
            <div class="top-banner-inner"
                style="align-items: stretch; box-sizing: border-box; display: flex; flex-direction: column; width: 100%; max-width: 1280px; margin: 0 auto; gap: 10px;">
                <style>
                    .banner-panel,.banner-split,.banner-half{box-sizing:border-box;}
                    .banner-panel{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;width:100%;background:rgba(244,242,235,0.74);border:1px solid rgba(58,44,49,0.12);border-radius:20px;padding:14px 18px;box-shadow:0 8px 24px rgba(58,44,49,0.04);}
                    .banner-panel-primary{background:linear-gradient(180deg,rgba(255,248,240,0.92),rgba(255,244,232,0.74));}
                    .banner-panel-current{background:linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,242,235,0.86));}
                    .banner-panel-copy{display:flex;align-items:baseline;gap:8px 10px;flex-wrap:wrap;min-width:0;font-family:'Mulish',system-ui,sans-serif;flex:1 1 auto;}
                    .banner-mark{color:#FC7B35;font-family:'Fraunces',system-ui,sans-serif;font-size:15px;font-weight:580;line-height:1;align-self:center;}
                    .banner-heading{color:#3A2C31;font-size:13px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;white-space:nowrap;}
                    .banner-sep{color:#3A2C3140;}
                    .banner-text{color:#3A2C31CC;font-size:13px;font-weight:600;}
                    .banner-val{color:#FC7B35;font-weight:800;white-space:nowrap;}
                    .banner-side{display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;max-width:360px;}
                    .banner-mini{color:#3A2C3199;font-family:'Mulish',system-ui,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;}
                    .banner-cta{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;border-bottom:1.5px solid #3A2C31;padding-bottom:2px;color:#3A2C31;font-family:'Mulish',system-ui,sans-serif;font-size:14px;font-weight:700;line-height:18px;text-decoration:none;cursor:pointer;}
                    .banner-split{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
                    .banner-half{display:flex;min-width:0;flex-direction:column;gap:5px;background:rgba(244,242,235,0.62);border:1px solid rgba(58,44,49,0.10);border-radius:16px;padding:10px 14px;box-shadow:0 6px 18px rgba(58,44,49,0.03);text-decoration:none;transition:transform 180ms ease, border-color 180ms ease, background-color 180ms ease;}
                    .banner-half:hover{transform:translateY(-1px);border-color:rgba(58,44,49,0.2);background:rgba(255,255,255,0.6);}
                    .banner-half-kicker{color:#3A2C3199;font-family:'Mulish',system-ui,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;}
                    .banner-half-title{color:#3A2C31;font-family:'Fraunces',serif;font-size:17px;font-variation-settings:'wght' 580;line-height:1.05;letter-spacing:-0.01em;}
                    .banner-half-note{color:#3A2C31CC;font-family:'Mulish',system-ui,sans-serif;font-size:12px;font-weight:600;line-height:1.3;}
                    @media (max-width:767px){
                        .top-banner{padding-block:10px !important;}
                        .top-banner-inner{gap:8px !important;}
                        .banner-panel{padding:10px 12px;gap:8px;border-radius:16px;}
                        .banner-panel-copy{gap:4px 8px;}
                        .banner-heading{font-size:11px;letter-spacing:0.02em;white-space:normal;}
                        .banner-text,.banner-mini{font-size:11px;}
                        .banner-side{width:100%;justify-content:space-between;}
                        .banner-cta{font-size:12px;}
                        .banner-split{grid-template-columns:1fr;gap:8px;}
                        .banner-half{padding:10px 12px;border-radius:14px;}
                        .banner-half-title{font-size:16px;}
                        .banner-half-note{font-size:12px;}
                    }
                    @media (min-width:768px) and (max-width:980px){
                        .banner-panel{align-items:flex-start;}
                        .banner-side{width:100%;justify-content:flex-start;}
                    }
                </style>
                <div class="banner-panel banner-panel-primary">
                    <div class="banner-panel-copy">
                        <span class="banner-mark">✦</span>
                        <span class="banner-heading">Objednávky odesílám každé pondělí</span>
                        <span class="banner-sep">·</span>
                        <span class="banner-text">další expedice <span id="cd-recurring-val" class="banner-val">za pár dní</span></span>
                    </div>
                    <div class="banner-side">
                        <span class="banner-mini">Poštovní klub i Edice VÍTEJ</span>
                        <span class="banner-mini" style="letter-spacing:0.08em;font-weight:600;">variabilní časovač a design</span>
                        <a href="postovni-klub.html#jak-to-funguje" class="link-hover banner-cta">
                            <span class="desktop-copy">Jak to funguje</span>
                            <span class="mobile-copy">Jak to funguje</span>
                            <span class="arrow-slide" style="line-height:18px;">→</span>
                        </a>
                    </div>
                </div>
                <div class="banner-panel banner-panel-current">
                    <div class="banner-panel-copy">
                        <span class="banner-mark">✦</span>
                        <span class="banner-heading">Aktuální edice</span>
                        <span class="banner-sep">·</span>
                        <span class="banner-heading"><span data-cms="edition-number"></span> <span data-cms="edition-name"></span></span>
                        <span class="banner-sep">·</span>
                        <span class="banner-text"><span data-cms="edition-status"></span> · <span data-cms="edition-price"></span></span>
                    </div>
                    <div class="banner-side">
                        <span class="banner-mini">Edice VÍTEJ jede každé pondělí</span>
                        <a href="postovni-klub.html" class="link-hover banner-cta">
                            <span class="desktop-copy">Více o edici</span>
                            <span class="mobile-copy">Více</span>
                            <span class="arrow-slide" style="line-height:18px;">→</span>
                        </a>
                    </div>
                </div>
                <div class="banner-split">
                    <a id="banner-released-link" class="banner-half" href="edice.html#vydane">
                        <span class="banner-half-kicker">Vydané edice</span>
                        <span id="banner-released-title" class="banner-half-title">Edice A01 Přítomnost</span>
                        <span id="banner-released-note" class="banner-half-note">1 vydaná edice</span>
                    </a>
                    <a id="banner-upcoming-link" class="banner-half" href="edice.html#priprava">
                        <span class="banner-half-kicker">Edice v přípravě</span>
                        <span id="banner-upcoming-title" class="banner-half-title">Edice A02 Tvrdá práce</span>
                        <span id="banner-upcoming-note" class="banner-half-note">4 připravované edice</span>
                    </a>
                </div>
            </div>
        </div>
    `,
    header: `
        <!-- Sticky Navigation Container -->
        <div class="nav-load main-navigation">
            <a href="index.html" class="logo-hover">
                <img src="https://raw.githubusercontent.com/LarryYapper/filipuv-podivuhodny-svet-web/main/assets/logo.png" alt="Filipův podivuhodniý svět">
                <div class="logo-text">Filipův podivuhodný svět</div>
            </a>

            <!-- Mobile Nav Burger -->
            <details class="mobile-nav-menu">
                <summary style="display: block !important; list-style: none !important;">
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%;">Menu</div>
                </summary>
                <div class="mobile-nav-panel">
                    <div class="mobile-nav-header">
                        <div class="mobile-logo-wrap">
                            <img src="https://raw.githubusercontent.com/LarryYapper/filipuv-podivuhodny-svet-web/main/assets/logo.png" alt="Logo">
                            <div class="mobile-logo-text">Filipův podivuhodný svět</div>
                        </div>
                        <button class="mobile-nav-close" aria-label="Zavřít">×</button>
                    </div>
                    <div class="mobile-nav-links">
                        <a href="index.html" class="mobile-nav-link">Domů</a>
                        <details class="mobile-nav-details">
                            <summary class="mobile-nav-link" style="display: block !important; list-style: none !important;">
                                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                    Poštovní klub
                                    <span class="nav-arrow">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </div>
                            </summary>
                            <div class="mobile-submenu">
                                <a href="postovni-klub.html" class="mobile-nav-link sub-link">Aktuální edice</a>
                                <a href="edice.html" class="mobile-nav-link sub-link">Všechny edice</a>
                                <a href="edice-vitej.html" class="mobile-nav-link sub-link">Edice VÍTEJ</a>
                            </div>
                        </details>
                        <a href="nas-svet.html" class="mobile-nav-link">Náš svět</a>
                        <a href="dobro.html" class="mobile-nav-link">Dobro</a>
                        <a href="o-mne.html" class="mobile-nav-link">O mně</a>
                        <a href="kontakt.html" class="mobile-nav-link">Kontakt</a>
                        <a href="sprava-predplatneho.html" class="mobile-nav-link mobile-nav-utility">Moje objednávka</a>
                    </div>
                    <div class="mobile-nav-footer">
                        <a href="edice-vitej.html" class="btn-line-shared">
                            <span>Vyzkoušej Edici VÍTEJ</span>
                        </a>
                        <a href="postovni-klub-objednavka.html" class="btn-primary-shared">
                            <span>Objednat edici</span>
                        </a>
                        <div class="mobile-nav-socials">
                            <a href="#" aria-label="TikTok">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="#F4F2EB"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.75.51-1.24 1.32-1.35 2.22-.13.96.12 1.95.7 2.72.6.83 1.56 1.37 2.58 1.42 1.02.07 2.09-.28 2.84-1 .76-.76 1.13-1.84 1.1-2.91V.02z"></path></svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="#F4F2EB"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </details>
            <div class="mobile-nav-overlay" aria-hidden="true"></div>
            
            <!-- Desktop Links -->
            <div class="nav-desktop-links">
                <a href="index.html" class="nav-link">Domů</a>
                <details class="nav-desktop-details">
                    <summary class="nav-link" style="display: block !important; list-style: none !important;">
                        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                            <img src="assets/Filipův%20podivuhodný%20svět_PK_logo%202.0.png" alt="" class="nav-pk-logo">
                            Poštovní klub
                            <span class="nav-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </div>
                    </summary>
                    <div class="dropdown-menu">
                        <a href="postovni-klub.html" class="dropdown-link">Aktuální edice</a>
                        <a href="edice.html" class="dropdown-link">Všechny edice</a>
                        <a href="edice-vitej.html" class="dropdown-link">Edice VÍTEJ</a>
                    </div>
                </details>
                <a href="nas-svet.html" class="nav-link">Náš svět</a>
                <a href="dobro.html" class="nav-link">Dobro</a>
                <a href="o-mne.html" class="nav-link">O mně</a>
                <div class="nav-utility-wrap">
                    <a href="sprava-predplatneho.html" class="nav-utility" style="text-decoration: none;">Moje objednávka</a>
                </div>
            </div>
        </div>
    `,
    footer: `
        <div class="main-footer">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo-wrap">
                        <img src="https://raw.githubusercontent.com/LarryYapper/filipuv-podivuhodny-svet-web/main/assets/logo.png" alt="Filipův podivuhodniý svět">
                    </div>
                    <div class="footer-tagline">
                        Úkryt před ruchem světa. <br />Obálka každé dva měsíce, která tě vytrhne z proudu.
                    </div>
                    <div class="footer-newsletter">
                        <div class="footer-label">DEJ MI VĚDĚT</div>
                        <div class="footer-input-group">
                            <div class="footer-input">
                                <span>tvůj@email.cz</span>
                            </div>
                            <div class="footer-submit">
                                <span>→</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-links-container">
                    <div class="footer-link-col">
                        <div class="footer-label">KLUB</div>
                        <a href="postovni-klub.html">Aktuální edice</a>
                        <a href="edice.html">Všechny edice</a>
                        <a href="edice-vitej.html">Edice VÍTEJ</a>
                        <a href="postovni-klub-objednavka.html">Objednat</a>
                    </div>
                    <div class="footer-link-col">
                        <div class="footer-label">POMOC</div>
                        <a href="postovni-klub.html#faq">Časté dotazy</a>
                        <a href="#">Doprava</a>
                        <a href="sprava-predplatneho.html">Moje objednávka</a>
                        <a href="reklamace.html">Reklamace</a>
                        <a href="odstoupeni-od-smlouvy.html">Odstoupení od smlouvy</a>
                        <a href="kontakt.html">Kontakt</a>
                    </div>
                    <div class="footer-link-col">
                        <div class="footer-label">SLEDUJ</div>
                        <a href="#">Instagram</a>
                        <a href="#">TikTok</a>
                        <a href="#">Threads</a>
                        <a href="#">YouTube</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-copyright">
                    © 2026 Filipův podivuhodný svět · OSVČ Bc. Filip Kubík
                </div>
                <a href="dobro.html" class="footer-charity" style="color: #FF6752;">
                    ❤️ Květen-červen 2026: 3 % z hrubé marže podporuje Člověk v tísni →
                </a>
                <div class="footer-legal">
                    <a href="assets/Všeobecené obchodní podmínky.pdf" target="_blank">Všeobecné obchodní podmínky</a>
                    <a href="assets/Reklamační řád.pdf" target="_blank">Reklamační řád</a>
                    <a href="assets/Zasady_ochrany_osobnich_udaju_Web.pdf" target="_blank">Zásady ochrany osobních údajů</a>
                </div>
            </div>
        </div>
    `
};
