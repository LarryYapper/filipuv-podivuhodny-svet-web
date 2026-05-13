/**
 * Global JavaScript for Filipův podivuhodný svět
 * Handles shared elements like Back to Top button, unified mobile menu, 
 * reveal animations, smooth scrolling, and sticky navigation.
 */

(function() {
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

    // 3. STICKY NAVIGATION LOGIC (Robust Fixed Fallback)
    function initStickyNav() {
        const nav = document.querySelector('.main-navigation');
        if (!nav) return;

        // Create a spacer to prevent content jump when nav becomes fixed
        const spacer = document.createElement('div');
        spacer.className = 'nav-spacer';
        spacer.style.display = 'none';
        spacer.style.height = nav.offsetHeight + 'px';
        nav.parentNode.insertBefore(spacer, nav);

        const banner = document.querySelector('.top-banner');
        const stickyThreshold = banner ? banner.offsetHeight : 50;

        function handleScroll() {
            if (window.pageYOffset > stickyThreshold) {
                if (!nav.classList.contains('is-sticky')) {
                    nav.classList.add('is-sticky');
                    spacer.style.display = 'block';
                    spacer.style.height = nav.offsetHeight + 'px';
                }
            } else {
                if (nav.classList.contains('is-sticky')) {
                    nav.classList.remove('is-sticky');
                    spacer.style.display = 'none';
                }
            }
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            if (!nav.classList.contains('is-sticky')) {
                spacer.style.height = nav.offsetHeight + 'px';
            }
        });
        
        // Run once on load
        handleScroll();
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
        
        const DEADLINE = new Date(CMS_CONFIG.banner.deadlineDate).getTime();
        const countdownPrefix = document.getElementById('countdown-prefix');
        const countdownNum = document.getElementById('countdown-num');
        const countdownLabel = document.getElementById('countdown-label');
        
        if (!countdownNum || !countdownLabel) return;

        function update() {
            const now = Date.now();
            const diff = DEADLINE - now;
            if (diff <= 0) {
                if (countdownPrefix) countdownPrefix.textContent = '';
                countdownNum.textContent = '0';
                countdownLabel.textContent = 'UZAVŘENO';
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (countdownPrefix) {
                // Correct Czech inflection for "Zbývá":
                // 1 unit: ZBÝVÁ
                // 2-4 units: ZBÝVAJÍ
                // 5+ units: ZBÝVÁ
                const val = days > 0 ? days : (hours > 0 ? hours : minutes);
                if (val === 1 || val >= 5 || val === 0) {
                    countdownPrefix.textContent = 'ZBÝVÁ';
                } else {
                    countdownPrefix.textContent = 'ZBÝVAJÍ';
                }
            }

            if (days > 0) {
                countdownNum.textContent = days;
                countdownLabel.textContent = days === 1 ? 'DEN' : (days < 5 ? 'DNY' : 'DNÍ');
            } else if (hours > 0) {
                countdownNum.textContent = hours;
                countdownLabel.textContent = hours === 1 ? 'HODINA' : (hours < 5 ? 'HODINY' : 'HODIN');
            } else {
                countdownNum.textContent = minutes;
                countdownLabel.textContent = minutes === 1 ? 'MINUTA' : (minutes < 5 ? 'MINUTY' : 'MINUT');
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
    function initCMS() {
        if (typeof CMS_CONFIG === 'undefined') return;

        // Auto-inject dates into elements with data-cms attribute
        document.querySelectorAll('[data-cms]').forEach(el => {
            const key = el.getAttribute('data-cms');
            
            // Handle Dates
            if (key.startsWith('date-')) {
                const dateKey = key.replace('date-', '');
                if (CMS_CONFIG.dates[dateKey]) {
                    el.textContent = CMS_CONFIG.dates[dateKey];
                }
            }

            // Handle Tiers (Images, Prices, Names)
            if (key.startsWith('tier-')) {
                const parts = key.split('-'); // [tier, tierId, property]
                const tierId = parts[1];
                const prop = parts[2];
                if (CMS_CONFIG.tiers[tierId] && CMS_CONFIG.tiers[tierId][prop]) {
                    const value = CMS_CONFIG.tiers[tierId][prop];
                    if (prop === 'image') {
                        if (el.tagName === 'IMG') {
                            el.src = value;
                        } else {
                            el.style.backgroundImage = `url('${value}')`;
                        }
                    } else {
                        el.textContent = value;
                    }
                }
            }
        });
    }

    // INITIALIZE ALL
    function init() {
        initCMS();
        initFavicon();
        initComponents();
        initBackToTop();
        initMobileMenu();
        initStickyNav();
        initRevealSystem();
        initStepAnimations();
        initUIEnhancements();
        initCountdown();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
