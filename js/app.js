// js/app.js

function getCurrentRoute() {
  if (window.INITIAL_PAGE) {
    return '/' + window.INITIAL_PAGE;
  }
  var path = window.location.pathname;
  var search = window.location.search;
  return path + (search ? search : '');
}

const App = {
    init() {
        // Init Mobile Menu
        this.initMobileMenu();

        // Hidden Admin Entrance
        const logo = document.querySelector('.logo');
        if (logo) {
            let clickCount = 0;
            let clickTimer = null;
            logo.addEventListener('click', (e) => {
                clickCount++;
                if (clickCount === 3) {
                    e.preventDefault();
                    window.location.href = '/admin/login';
                }
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 2000);
            });
        }

        // Handle route changes using History API
        window.addEventListener('popstate', function() { App.handleRouting(); });

        // Intercept local link clicks for SPA routing
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;

            // Skip external links, tel, mailto, whatsapp, target="_blank", anchors, sitemap
            if (link.getAttribute('target') === '_blank' || 
                href.startsWith('http') || 
                href.startsWith('tel:') || 
                href.startsWith('mailto:') || 
                href.startsWith('#') ||
                href.endsWith('.xml')) {
                return;
            }

            // Must be same origin
            if (link.origin && link.origin !== window.location.origin) {
                return;
            }

            // Only intercept internal paths (starting with /)
            if (href.startsWith('/')) {
                e.preventDefault();
                window.history.pushState(null, '', href);
                App.handleRouting();
            }
        });

        // Load data then trigger initial route
        this.loadDataAndStart();

        // Check for Promo QR
        this.checkPromoPopup();
    },

    checkPromoPopup() {
        if (window.location.href.includes('promo=QR')) {
            // Build popup HTML
            const popupHtml = `
                <div class="voucher-overlay" id="voucherPopup">
                    <div class="voucher-card">
                        <div class="voucher-title">Thanks for visiting our shop! 🌸</div>
                        <div class="voucher-subtitle">Here is ₹50 OFF your first online order.</div>
                        <div class="voucher-code-box">ROSE50</div>
                        <button class="btn btn-primary btn-block btn-lg" id="voucherCopyBtn">Copy Code & Browse Bouquets</button>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', popupHtml);

            const overlay = document.getElementById('voucherPopup');
            const copyBtn = document.getElementById('voucherCopyBtn');

            // Show it smoothly
            setTimeout(() => {
                overlay.classList.add('show');
            }, 100);

            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText("ROSE50").then(() => {
                    copyBtn.textContent = "Copied! Taking you to shop...";

                    // Confetti burst
                    if (window.confetti) {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }

                    // Wait 1.5s, then close and navigate to catalog
                    setTimeout(() => {
                        overlay.classList.remove('show');

                        // Navigate to catalog
                        window.location.href = '/catalog';

                        setTimeout(() => {
                            overlay.remove();
                        }, 400); // Clean up after transition
                    }, 1500);
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            });
        }
    },

    initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const nav = document.getElementById('main-nav');

        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('is-open');
            });

            // Close menu when a link is clicked
            nav.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('is-open');
                });
            });
        }

        // Dynamic year for footer
        const yearEl = document.getElementById('current-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    },

    async loadDataAndStart() {
        const appEl = document.getElementById('app');
        appEl.innerHTML = '<div class="loader-container"><div class="spinner"></div><p>Loading fresh bouquets...</p></div>';

        try {
            await window.Store.fetchProducts();
            this.handleRouting();
            if (window.CartUI) window.CartUI.init();
        } catch (error) {
            console.error('Failed to load data', error);
            // Even if products fail to load, we still route so SEO pages can render without products
            this.handleRouting();
            if (window.CartUI) window.CartUI.init();
        }
    },

    handleRouting() {
        const route = getCurrentRoute();
        const urlParams = new URLSearchParams(window.location.search);
        const path = route.split('?')[0];
        const slug = path.replace(/^\//, '');

        const appEl = document.getElementById('app');
        appEl.innerHTML = ''; // clear current view
        
        const scrollTo = urlParams.get('scrollTo');
        if (!scrollTo) {
            window.scrollTo(0, 0); // scroll to top only if not jumping to a section
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === route || link.getAttribute('href').split('?')[0] === path) {
                link.classList.add('active');
            }
        });

        // Simple path-based router
        if (path === '/' || path === '') {
            window.Pages.renderHomePage(appEl);
            if (scrollTo) {
                setTimeout(() => {
                    const el = document.getElementById(scrollTo);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
        else if (path === '/catalog') {
            const filterParam = urlParams.get('filter') || 'All';
            window.Pages.renderCatalogPage(appEl, filterParam);
        }
        else if (path.startsWith('/bouquet/')) {
            const id = path.replace('/bouquet/', '');
            window.Pages.renderBouquetDetailPage(appEl, id);
        }
        else {
            // ── Core Service SEO pages (dynamic slug matching) ──
            const slug = path.replace(/^\//, '');
            if (window.CoreServiceRoutes && window.CoreServiceRoutes.isCorePage(slug)) {
                window.CoreServiceRoutes.render(appEl, slug);
            } else if (window.UrgencyServiceRoutes && window.UrgencyServiceRoutes.isUrgencyPage(slug)) {
                window.UrgencyServiceRoutes.render(appEl, slug);
            } else if (window.OccasionRoutes && window.OccasionRoutes.isOccasionPage(slug)) {
                window.OccasionRoutes.render(appEl, slug);
            } else if (window.LocalAreaRoutes && window.LocalAreaRoutes.isLocalAreaPage(slug)) {
                window.LocalAreaRoutes.render(appEl, slug);
            } else {
                // 404
                appEl.innerHTML = `<div class="container section"><div class="section-title"><h2>Page Not Found</h2><a href="/" class="btn btn-primary">Go Home</a></div></div>`;
            }
        }
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
