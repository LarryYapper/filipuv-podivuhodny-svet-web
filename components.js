/**
 * Shared Components for Filipův podivuhodný svět
 * Use this file to manage the Header and Footer across all pages.
 */

const SHARED_COMPONENTS = {
    banner: `
        <div class="top-banner banner-load"
            style="align-items: center; background-color: #3A2C310D; border-bottom-color: #3A2C311F; border-bottom-style: solid; border-bottom-width: 1px; box-sizing: border-box; display: flex; gap: 32px; justify-content: space-between; padding-block: 14px; padding-inline: clamp(20px, 5vw, 80px); flex-wrap: wrap; width: 100%;">
            <div class="top-banner-inner"
                style="align-items: center; box-sizing: border-box; display: flex; justify-content: space-between; flex-wrap: wrap; width: 100%; max-width: 1280px; margin: 0 auto; gap: 32px;">
                <div class="top-banner-copy" style="align-items: center; box-sizing: border-box; display: flex; gap: 16px;">
                    <div
                        style="box-sizing: border-box; color: #FC7B35; display: inline-block; font-family: 'Fraunces', system-ui, sans-serif; font-size: 14px; font-variation-settings: 'wght' 580; font-weight: 580; line-height: 18px;">
                        ✦
                    </div>
                    <div class="top-banner-text"
                        style="box-sizing: border-box; color: #3A2C31; display: inline-block; font-family: 'Mulish', system-ui, sans-serif; font-size: 14px; font-weight: 600; line-height: 18px;">
                        <span class="desktop-copy">${(typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG.banner) ? CMS_CONFIG.banner.desktopText : 'Edice VÍTEJ se uzavírá 5. června · doručuju 10. června'}</span>
                        <span class="mobile-copy">${(typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG.banner) ? CMS_CONFIG.banner.mobileText : 'Edice VÍTEJ končí 5. června'}</span>
                    </div>
                </div>
                <div class="top-banner-actions" style="align-items: center; box-sizing: border-box; display: flex; gap: 40px; flex-wrap: wrap;">
                    <div style="align-items: baseline; box-sizing: border-box; display: flex; gap: 8px;">
                        <div id="countdown-prefix"
                            style="box-sizing: border-box; color: #3A2C31; display: inline-block; font-family: 'Mulish', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; line-height: 14px;">
                            ZBÝVÁ
                        </div>
                        <div id="countdown-num" class="countdown-num"
                            style="box-sizing: border-box; color: #FC7B35; display: inline-block; font-family: 'Fraunces', system-ui, sans-serif; font-size: 24px; font-variation-settings: 'wght' 580; font-weight: 580; letter-spacing: -0.02em; line-height: 28px;">
                            28
                        </div>
                        <div id="countdown-label"
                            style="box-sizing: border-box; color: #3A2C31; display: inline-block; font-family: 'Mulish', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; line-height: 14px;">
                            DNÍ
                        </div>
                    </div>
                    <a href="edice-vitej.html" class="link-hover"
                        style="align-items: center; border-bottom-color: #3A2C31; border-bottom-style: solid; border-bottom-width: 1.5px; box-sizing: border-box; display: flex; gap: 6px; padding-bottom: 2px; cursor: pointer; text-decoration: none;">
                        <div
                            style="box-sizing: border-box; color: #3A2C31; display: inline-block; font-family: 'Mulish', system-ui, sans-serif; font-size: 14px; font-weight: 700; line-height: 18px;">
                            <span class="desktop-copy">Vyzkoušej za 99 Kč</span>
                            <span class="mobile-copy">99 Kč</span>
                        </div>
                        <div class="arrow-slide"
                            style="box-sizing: border-box; color: #3A2C31; display: inline-block; font-family: 'Mulish', system-ui, sans-serif; font-size: 14px; line-height: 18px;">
                            →
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `,
    header: `
        <!-- Sticky Navigation Container -->
        <div class="nav-load main-navigation">
            <a href="index.html" class="logo-hover">
                <img src="assets/Filip%C3%BAv%20podivuhodn%C3%BD%20sv%C4%9Bt_logo%202.0.png" alt="Filipův podivuhodniý svět">
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
                            <img src="assets/Filip%C3%BAv%20podivuhodn%C3%BD%20sv%C4%9Bt_logo%202.0.png" alt="Logo">
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
                                <a href="postovni-klub.html" class="mobile-nav-link sub-link">O klubu</a>
                                <a href="edice-vitej.html" class="mobile-nav-link sub-link">Edice VÍTEJ</a>
                            </div>
                        </details>
                        <a href="nas-svet.html" class="mobile-nav-link">Náš svět</a>
                        <a href="dobro.html" class="mobile-nav-link">Dobro</a>
                        <a href="o-mne.html" class="mobile-nav-link">O mně</a>
                        <a href="#" class="mobile-nav-link">Účet</a>
                    </div>
                    <div class="mobile-nav-footer">
                        <a href="postovni-klub.html" class="btn-primary-shared">
                            <span>Stát se členem</span>
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
                            Poštovní klub
                            <span class="nav-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </div>
                    </summary>
                    <div class="dropdown-menu">
                        <a href="postovni-klub.html" class="dropdown-link">O klubu</a>
                        <a href="edice-vitej.html" class="dropdown-link">Edice VÍTEJ</a>
                    </div>
                </details>
                <a href="nas-svet.html" class="nav-link">Náš svět</a>
                <a href="dobro.html" class="nav-link">Dobro</a>
                <a href="o-mne.html" class="nav-link">O mně</a>
                <div class="nav-utility-wrap">
                    <div class="nav-utility">Účet</div>
                </div>
            </div>
        </div>
    `,
    footer: `
        <div class="main-footer">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo-wrap">
                        <img src="assets/Filip%C3%BAv%20podivuhodn%C3%BD%20sv%C4%9Bt_logo%202.0.png" alt="Filipův podivuhodniý svět">
                    </div>
                    <div class="footer-tagline">
                        Úkryt před ruchem světa. <br />Měsíční obálka, která tě vytrhne z proudu.
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
                        <a href="edice-vitej.html">Edice VÍTEJ</a>
                        <a href="postovni-klub.html">Úrovně členství</a>
                        <a href="#">Všechny edice</a>
                        <a href="postovni-klub.html">Stát se členem</a>
                    </div>
                    <div class="footer-link-col">
                        <div class="footer-label">SVĚT</div>
                        <a href="nas-svet.html">Náš rostoucí svět</a>
                        <a href="#" class="disabled">Zápisníky · brzy</a>
                        <a href="#" class="disabled">Kalendáře · brzy</a>
                        <a href="#" class="disabled">3D tisk · brzy</a>
                    </div>
                    <div class="footer-link-col">
                        <div class="footer-label">POMOC</div>
                        <a href="#">Časté dotazy</a>
                        <a href="#">Doprava</a>
                        <a href="#">Zrušení</a>
                        <a href="#">Kontakt</a>
                    </div>
                    <div class="footer-link-col">
                        <div class="footer-label">SLEDUJ</div>
                        <a href="#">Instagram</a>
                        <a href="#">TikTok</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-copyright">
                    © 2026 Filipův podivuhodný svět · OSVČ Bc. Filip Kubík
                </div>
                <div class="footer-charity">
                    ❤️ Červenec-září 2026: 3 % z hrubé marže podporuje Člověk v tísni →
                </div>
                <div class="footer-legal">
                    <a href="#">Obchodní podmínky</a>
                </div>
            </div>
        </div>
    `
};
