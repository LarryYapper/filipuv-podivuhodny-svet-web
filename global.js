/**
 * Global JavaScript for Filipův podivuhodný svět
 * Handles shared elements like Back to Top button, unified mobile menu, 
 * reveal animations, smooth scrolling, and sticky navigation.
 */

(function() {
    const GA_MEASUREMENT_ID = 'G-7MFENEZZ3N';

    function getCookieConsent() {
        try {
            return localStorage.getItem('fpvs-cookie-consent');
        } catch (error) {
            return null;
        }
    }

    function setAnalyticsConsent(choice) {
        if (typeof window.gtag !== 'function') return;

        window.gtag('consent', 'update', {
            analytics_storage: choice === 'accepted' ? 'granted' : 'denied'
        });
    }

    function initAnalytics() {
        if (window.__fpvsAnalyticsLoaded) return;
        if (getCookieConsent() !== 'accepted') return;

        window.__fpvsAnalyticsLoaded = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        script.setAttribute('data-fpvs-analytics', 'true');
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('consent', 'default', {
            analytics_storage: 'denied'
        });
        window.gtag('config', GA_MEASUREMENT_ID);

        setAnalyticsConsent('accepted');
    }

    // 1. BACK TO TOP BUTTON
    function initBackToTop() {
        if (document.querySelector('.back-to-top')) return;

        const btn = document.createElement('div');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Zpět nahoru');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 4l-8 8h6v8h4v-8h6z"></path>
            </svg>
        `;
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 2. UNIFIED MOBILE MENU LOGIC
    function initMobileMenu() {
        const details = document.querySelector('.mobile-nav-menu');
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (!details || !overlay) return;

        const panel = details.querySelector('.mobile-nav-panel');
        const closeBtn = panel && panel.querySelector('.mobile-nav-close');

        function updateOverlay() {
            if (details.open) {
                overlay.classList.add('visible');
                document.body.style.overflow = 'hidden'; 
            } else {
                overlay.classList.remove('visible');
                document.body.style.overflow = '';
            }
        }

        details.addEventListener('toggle', updateOverlay);

        overlay.addEventListener('click', () => {
            details.removeAttribute('open');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                details.removeAttribute('open');
            });
        }

        details.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close the main menu if clicking a summary (which opens a submenu)
                if (e.target.closest('summary')) return;
                
                details.removeAttribute('open');
            });
        });
    }

    // 3. STICKY NAVIGATION LOGIC (toggle after passing banner)
    function initStickyNav() {
        const nav = document.querySelector('.main-navigation');
        if (!nav) return;

        const banner = document.getElementById('global-banner');
        const bannerHeight = banner ? banner.offsetHeight : 0;

        function updateSticky() {
            if (window.pageYOffset > bannerHeight) {
                nav.classList.add('is-sticky');
            } else {
                nav.classList.remove('is-sticky');
            }
        }

        // run on init and on scroll
        updateSticky();
        window.addEventListener('scroll', updateSticky);
    }

    // 4. REVEAL ANIMATIONS (Intersection Observer)
    function initRevealSystem() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal, .step-border-anim, .sig-slide, .ornament-bounce').forEach(el => {
            revealObserver.observe(el);
        });

        const canvas = document.querySelector('.paper-canvas');
        if (canvas) {
            const sections = Array.from(canvas.children).slice(3);
            sections.forEach(section => {
                if (section.classList.contains('reveal') || section.classList.contains('reveal-fade')) return;

                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const children = entry.target.querySelectorAll(':scope > div > div, :scope > div');
                            children.forEach((child, index) => {
                                if (index >= 8 || child.offsetHeight < 20) return;
                                if (child.classList.contains('step-card')) return; 
                                
                                child.style.opacity = '0';
                                child.style.transform = 'translateY(16px)';
                                child.style.transition = 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
                                child.style.transitionDelay = (index * 100) + 'ms';
                                requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                        child.style.opacity = '1';
                                        child.style.transform = 'translateY(0)';
                                    });
                                });
                            });
                            sectionObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
                sectionObserver.observe(section);
            });
        }
    }

    // 5. STEP BORDER ANIMATION
    function initStepAnimations() {
        const steps = document.querySelectorAll('.step-card');
        steps.forEach((step, index) => {
            const stepObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const border = entry.target.querySelector('.step-border-anim');
                        if (border) {
                            border.style.transform = 'scaleX(0)';
                            border.style.transformOrigin = 'left';
                            border.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
                            border.style.transitionDelay = (index * 150) + 'ms';
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    border.style.transform = 'scaleX(1)';
                                });
                            });
                        }
                        
                        const children = entry.target.querySelectorAll(':scope > div:not(.step-border-anim)');
                        children.forEach((child, ci) => {
                            child.style.opacity = '0';
                            child.style.transform = 'translateY(12px)';
                            child.style.transition = 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
                            child.style.transitionDelay = (index * 150 + 200 + ci * 100) + 'ms';
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    child.style.opacity = '1';
                                    child.style.transform = 'translateY(0)';
                                });
                            });
                        });
                        stepObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            stepObs.observe(step);
        });
    }

    // 6. COMMON UI ENHANCEMENTS (Auto-detect)
    function initUIEnhancements() {
        document.querySelectorAll('[style*="grid-template-columns: repeat(3"]').forEach(grid => {
            const cards = grid.children;
            const gridObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(cards).forEach((card, index) => {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(24px)';
                            card.style.transition = 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.transitionDelay = (index * 100) + 'ms';
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                });
                            });
                        });
                        gridObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            gridObserver.observe(grid);
        });

        document.querySelectorAll('[style*="background-color: #FC7B35"][style*="border-radius: 999px"]').forEach(btn => btn.classList.add('btn-primary'));
        document.querySelectorAll('[style*="border-radius: 999px"][style*="border-style: solid"][style*="border-width: 1.5px"]').forEach(btn => {
            if (!btn.style.backgroundColor || btn.style.backgroundColor === '') btn.classList.add('btn-outline');
        });
        document.querySelectorAll('div').forEach(el => {
            if (el.children.length === 0 && el.textContent.trim() === '→' && !el.classList.contains('arrow-slide')) {
                el.classList.add('arrow-slide');
                if (el.parentElement && !el.parentElement.classList.contains('link-hover')) {
                    el.parentElement.classList.add('link-hover');
                }
            }
        });
    }

    // 7. COUNTDOWN TIMER
    function initCountdown() {
        if (typeof CMS_CONFIG === 'undefined' || !CMS_CONFIG.banner) return;

        const cfg = CMS_CONFIG.banner;
        // Dispatch date lives on the edition; the banner date is the fallback.
        const edition = (typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG.edition) || null;
        const LAUNCH = new Date(
            (edition && edition.dispatchDate) || cfg.deadlineDate
        ).getTime();

        // Two countdowns shown together in the bar:
        //  • launch row (#cd-launch)  -> Velký odesílací den (deadlineDate)
        //  • recurring row (#cd-recurring) -> Den odeslání (weekly recurringWeekday)
        const launchRow = document.getElementById('cd-launch');
        const launchVal = document.getElementById('cd-launch-val');
        const recurringRow = document.getElementById('cd-recurring');
        const recurringVal = document.getElementById('cd-recurring-val');

        if (!launchVal && !recurringVal) return;

        // The regular-edition row should stay visible in the banner so visitors
        // can always see the current A01–A05 line next to the Monday VÍTEJ row.
        // Hide it only when there is no real edition configured at all.
        const launchDayEnd = (function () {
            const d = new Date(LAUNCH);
            d.setHours(23, 59, 59, 999);
            return d.getTime();
        })();
        const hasRegularEdition = !!(typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG.edition && CMS_CONFIG.edition.number);

        // Czech accusative "za N <jednotka>" with correct inflection.
        function inflect(n, one, few, many) {
            if (n === 1) return one;
            if (n >= 2 && n <= 4) return few;
            return many;
        }
        function remainingText(diff) {
            if (diff <= 0) return 'dnes ✦';
            const days = Math.floor(diff / 86400000);
            if (days > 0) return 'za ' + days + ' ' + inflect(days, 'den', 'dny', 'dní');
            const hours = Math.floor(diff / 3600000);
            if (hours > 0) return 'za ' + hours + ' ' + inflect(hours, 'hodinu', 'hodiny', 'hodin');
            const minutes = Math.max(1, Math.floor(diff / 60000));
            return 'za ' + minutes + ' ' + inflect(minutes, 'minutu', 'minuty', 'minut');
        }

        // Next recurring dispatch weekday (e.g. every pondělí) at recurringTime.
        function nextRecurring(now) {
            if (cfg.recurringWeekday == null) return null;
            const parts = String(cfg.recurringTime || '08:00').split(':');
            const h = Number(parts[0]) || 0;
            const m = Number(parts[1]) || 0;
            const t = new Date(now);
            t.setHours(h, m, 0, 0);
            let delta = (cfg.recurringWeekday - t.getDay() + 7) % 7;
            if (delta === 0 && now >= t.getTime()) {
                // Dispatch day, time passed: celebrate for the rest of today.
                return t.getTime();
            }
            t.setDate(t.getDate() + delta);
            return t.getTime();
        }

        function update() {
            const now = Date.now();

            if (launchVal) {
                if (!hasRegularEdition) {
                    if (launchRow) launchRow.style.display = 'none';
                } else {
                    if (launchRow) launchRow.style.display = '';
                    if (now > launchDayEnd) {
                        launchVal.textContent = 'aktuální edice';
                    } else {
                        launchVal.textContent = remainingText(LAUNCH - now);
                    }
                }
            }

            if (recurringVal) {
                const target = nextRecurring(now);
                if (target == null) {
                    if (recurringRow) recurringRow.style.display = 'none';
                } else {
                    if (recurringRow) recurringRow.style.display = '';
                    recurringVal.textContent = remainingText(target - now);
                }
            }
        }
        update();
        setInterval(update, 60000);
    }

    // 8. SMOOTH SCROLL
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId.startsWith('##')) return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - 120;
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 9. SHARED COMPONENT LOADER
    function initComponents() {
        const bannerPlaceholder = document.getElementById('global-banner');
        const headerPlaceholder = document.getElementById('global-header');
        const footerPlaceholder = document.getElementById('global-footer');

        if (bannerPlaceholder && typeof SHARED_COMPONENTS !== 'undefined' && SHARED_COMPONENTS.banner) {
            bannerPlaceholder.innerHTML = SHARED_COMPONENTS.banner;
        }

        if (headerPlaceholder && typeof SHARED_COMPONENTS !== 'undefined') {
            headerPlaceholder.innerHTML = SHARED_COMPONENTS.header;
            highlightActiveLinks();
        }

        if (footerPlaceholder && typeof SHARED_COMPONENTS !== 'undefined') {
            footerPlaceholder.innerHTML = SHARED_COMPONENTS.footer;
        }
    }

    function highlightActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        links.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === 'index.html')) {
                link.classList.add('is-active');
                if (link.dataset.page === 'postovni-klub') {
                    link.style.color = '#FC7B35';
                    link.style.fontWeight = '700';
                }
            }
        });
    }

    function initFavicon() {
        const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = 'https://raw.githubusercontent.com/LarryYapper/filipuv-podivuhodny-svet-web/main/assets/logo.png';
        if (!document.head.contains(favicon)) {
            document.head.appendChild(favicon);
        }
    }

    // 10. CMS DATA INJECTION

    // Czech months in genitive — "10. srpna", ne "10. srpen".
    const CZ_MONTHS_GENITIVE = ['ledna', 'února', 'března', 'dubna', 'května', 'června',
        'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

    function formatCzechDate(date) {
        return date.getDate() + '. ' + CZ_MONTHS_GENITIVE[date.getMonth()];
    }

    // "17.–24. srpna" uvnitř jednoho měsíce, "27. srpna – 3. září" přes měsíce.
    function formatCzechRange(from, to) {
        if (from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()) {
            return from.getDate() + '.–' + formatCzechDate(to);
        }
        return formatCzechDate(from) + ' – ' + formatCzechDate(to);
    }

    function addDays(date, days) {
        const d = new Date(date.getTime());
        d.setDate(d.getDate() + days);
        return d;
    }

    // Nejbližší pravidelná expedice (např. každé pondělí v 08:00) — stejné
    // pravidlo, jaké používá odpočet v liště, aby si datum a časovač
    // neodporovaly. Rozdíl: když dnešní expedice už proběhla, posouváme se na
    // další týden — "pošlu" nesmí ukazovat na dávku, která je už pryč.
    function nextDispatchDate(now) {
        const cfg = (typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG.banner) || {};
        if (cfg.recurringWeekday == null) return null;
        const parts = String(cfg.recurringTime || '08:00').split(':');
        const t = new Date(now.getTime());
        t.setHours(Number(parts[0]) || 0, Number(parts[1]) || 0, 0, 0);
        let delta = (cfg.recurringWeekday - t.getDay() + 7) % 7;
        if (delta === 0 && now.getTime() >= t.getTime()) delta = 7;
        t.setDate(t.getDate() + delta);
        return t;
    }

    // Data odvozená z CMS_CONFIG. Díky tomu není žádné datum napsané ve dvou
    // místech — v configu se mění jen dispatchDate / delivery a stránky se
    // přepočítají samy.
    function computedDates() {
        const cfg = (typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG) || {};
        const delivery = cfg.delivery || {};
        const minDays = Number(delivery.minDays) || 0;
        const maxDays = Number(delivery.maxDays) || 0;
        const hasWindow = minDays > 0 && maxDays > 0;
        const out = {};

        if (hasWindow) out.deliveryDays = minDays + '–' + maxDays + ' dní';

        const dispatch = nextDispatchDate(new Date());
        if (dispatch) {
            out.nextDispatch = formatCzechDate(dispatch);
            // Uzávěrka = večer před expedicí.
            out.orderCutoff = formatCzechDate(addDays(dispatch, -1)) + ' 23:59';
            if (hasWindow) {
                out.deliveryWindow = formatCzechRange(addDays(dispatch, minDays), addDays(dispatch, maxDays));
            }
        }

        const editionDispatch = cfg.edition && cfg.edition.dispatchDate
            ? new Date(cfg.edition.dispatchDate)
            : null;
        if (editionDispatch && !isNaN(editionDispatch.getTime())) {
            out.editionDispatch = formatCzechDate(editionDispatch);
            if (hasWindow) {
                out.editionDelivery = formatCzechRange(
                    addDays(editionDispatch, minDays),
                    addDays(editionDispatch, maxDays)
                );
            }
        }

        return out;
    }

    function initCMS() {
        if (typeof CMS_CONFIG === 'undefined') return;

        const derivedDates = computedDates();

        // Auto-inject dates into elements with data-cms attribute
        document.querySelectorAll('[data-cms]').forEach(el => {
            const key = el.getAttribute('data-cms');

            // Handle Dates — ruční řetězec v CMS_CONFIG.dates má přednost,
            // jinak se použije odvozené datum.
            if (key.startsWith('date-')) {
                const dateKey = key.replace('date-', '');
                const value = (CMS_CONFIG.dates && CMS_CONFIG.dates[dateKey]) || derivedDates[dateKey];
                if (value) {
                    el.textContent = value;
                }
            }

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
                        // FIX: Remove background-image style directly and replace with a properly formatted url()
                        el.style.backgroundImage = "url('" + value + "')";
                        // Ensure it behaves like a cover image
                        el.style.backgroundSize = "cover";
                        el.style.backgroundPosition = "center";
                        el.innerHTML = ''; // Remove placeholder text if any
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
        });

        const bannerOrderLink = document.getElementById('banner-order-link');
        const bannerOrderCta = document.getElementById('banner-order-cta');
        if (bannerOrderLink && CMS_CONFIG.edition && CMS_CONFIG.edition.orderPage) {
            bannerOrderLink.setAttribute('href', CMS_CONFIG.edition.orderPage);
        }
        if (bannerOrderCta && CMS_CONFIG.edition) {
            bannerOrderCta.textContent = 'Edici ' + CMS_CONFIG.edition.number + ' ' + CMS_CONFIG.edition.name;
        }

        // Handle Dynamic Gallery
        const galleryContainer = document.getElementById('edition-gallery');
        if (galleryContainer && CMS_CONFIG.edition && CMS_CONFIG.edition.detailImages && CMS_CONFIG.edition.detailImages.length > 0) {
            galleryContainer.innerHTML = ''; // Clear placeholder if any
            CMS_CONFIG.edition.detailImages.forEach(imgSrc => {
                const imgWrap = document.createElement('div');
                imgWrap.style.flex = "0 0 calc(33.333% - 11px)";
                imgWrap.style.minWidth = "280px";
                imgWrap.style.minHeight = "280px"; /* Guarantees height */
                imgWrap.style.aspectRatio = "1/1";
                imgWrap.style.borderRadius = "16px";
                imgWrap.style.backgroundColor = "#3A2C310D"; /* Shows a light gray box if the image 404s */
                imgWrap.style.backgroundImage = "url('" + imgSrc + "')";
                imgWrap.style.backgroundSize = "cover";
                imgWrap.style.backgroundPosition = "center";
                imgWrap.style.scrollSnapAlign = "start";
                galleryContainer.appendChild(imgWrap);
            });
        } else if (galleryContainer) {
            galleryContainer.style.display = 'none'; // Hide if no detail images exist
        }
    }

    // 11. COOKIE CONSENT BANNER
    function initCookieConsent() {
        if (getCookieConsent()) return;

        const style = document.createElement('style');
        style.textContent = `
            #cookie-banner {
                position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
                background: #2A201F; border-top: 2px solid #FC7B35;
                padding: 18px clamp(20px, 5vw, 80px);
                transform: translateY(100%);
                transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
                box-sizing: border-box;
            }
            #cookie-banner.cookie-visible { transform: translateY(0); }
            .cookie-inner {
                display: flex; align-items: center; justify-content: space-between;
                gap: 20px; flex-wrap: wrap; max-width: 1280px; margin: 0 auto;
            }
            .cookie-text {
                color: #F4F2EB; font-family: 'Fraunces', serif;
                font-size: 15px; font-style: italic; line-height: 22px;
                flex: 1; min-width: 200px;
            }
            .cookie-text a { color: #FC7B35; text-decoration: underline; }
            .cookie-kicker {
                display: block; margin-bottom: 4px; font-style: normal;
                font-family: 'Mulish', sans-serif; font-size: 11px;
                font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
                color: #FC7B35;
            }
            .cookie-actions { display: flex; gap: 10px; flex-shrink: 0; align-items: center; }
            .cookie-accept {
                background: #FC7B35; border: none; color: #2A201F; cursor: pointer;
                font-family: 'Mulish', sans-serif; font-size: 12px; font-weight: 700;
                letter-spacing: 0.12em; padding: 10px 22px; text-transform: uppercase;
                transition: background 0.2s; white-space: nowrap;
            }
            .cookie-accept:hover { background: #E86B2A; }
            .cookie-reject {
                background: transparent; border: 1px solid rgba(244,242,235,0.25);
                color: rgba(244,242,235,0.65); cursor: pointer;
                font-family: 'Mulish', sans-serif; font-size: 12px; font-weight: 600;
                letter-spacing: 0.08em; padding: 10px 16px; text-transform: uppercase;
                transition: border-color 0.2s, color 0.2s; white-space: nowrap;
            }
            .cookie-reject:hover { border-color: rgba(244,242,235,0.5); color: rgba(244,242,235,0.9); }
            @media (max-width: 600px) {
                .cookie-text { font-size: 13px; }
                .cookie-actions { width: 100%; justify-content: flex-end; }
            }
        `;
        document.head.appendChild(style);

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-inner">
                <div class="cookie-text">
                    <span class="cookie-kicker">✦ Cookies &amp; soukromí</span>
                    Používám cookies pro zajištění základní funkčnosti webu. Více v <a href="assets/Zasady_ochrany_osobnich_udaju_Web.pdf" target="_blank">Zásadách ochrany osobních údajů</a>.
                </div>
                <div class="cookie-actions">
                    <button class="cookie-reject" id="cookie-reject">Odmítnout</button>
                    <button class="cookie-accept" id="cookie-accept">Přijmout vše</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        setTimeout(() => banner.classList.add('cookie-visible'), 800);

        function dismiss(choice) {
            try {
                localStorage.setItem('fpvs-cookie-consent', choice);
            } catch (error) {
                // Ignore storage failures and keep the popup flow working.
            }
            setAnalyticsConsent(choice);
            if (choice === 'accepted') {
                initAnalytics();
            }
            banner.classList.remove('cookie-visible');
            setTimeout(() => banner.remove(), 400);
        }
        document.getElementById('cookie-accept').addEventListener('click', () => dismiss('accepted'));
        document.getElementById('cookie-reject').addEventListener('click', () => dismiss('rejected'));
    }

    // 12. EDITION ORDER WIRING
    function initEditionCheckout() {
        // Each edition owns a permanent order page (so SimpleShop orders and
        // MailerLite webhooks can tell editions apart, and older editions stay
        // sellable from stock). The config names the current one; the generic
        // postovni-klub-objednavka.html URL remains as a fallback rocker.
        const ORDER_URL = (typeof CMS_CONFIG !== 'undefined'
            && CMS_CONFIG.edition
            && CMS_CONFIG.edition.orderPage) || 'postovni-klub-objednavka.html';
        const soldOut = typeof CMS_CONFIG !== 'undefined'
            && CMS_CONFIG.edition
            && CMS_CONFIG.edition.status === 'sold_out';

        document.querySelectorAll('.edition-order-btn').forEach(el => {
            const isAnchor = el.tagName === 'A';
            const existingHref = isAnchor ? (el.getAttribute('href') || '').trim() : '';

            // Keep explicit per-edition links (e.g. card grids on edice.html).
            if (isAnchor && existingHref && existingHref !== '#') {
                return;
            }

            if (soldOut) {
                el.setAttribute('aria-disabled', 'true');
                el.style.opacity = '0.5';
                el.style.pointerEvents = 'none';
                return;
            }

            if (isAnchor) {
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

    // INITIALIZE ALL
    function init() {
        initFavicon();
        // initComponents() injects the banner, and the banner template is the
        // only place [data-cms] elements exist (components.js). initCMS() scans
        // for them once and never re-runs, so it MUST come after — otherwise
        // the top bar renders "Edice ·" with no number and no name on every
        // page. Do not move initCMS() back above initComponents().
        initComponents();
        initCMS();
        initBackToTop();
        initMobileMenu();
        initStickyNav();
        initRevealSystem();
        initStepAnimations();
        initUIEnhancements();
        initCountdown();
        initSmoothScroll();
        initEditionCheckout();
        initCookieConsent();
        initAnalytics();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
