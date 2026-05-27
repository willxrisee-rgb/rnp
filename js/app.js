// js/app.js

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

        // Handle route changes
        window.addEventListener('hashchange', this.handleRouting.bind(this));

        // Load data then trigger initial route
        this.loadDataAndStart();
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
        } catch (error) {
            console.error('Failed to load data', error);
            appEl.innerHTML = `
                <div class="loader-container">
                    <p style="color: red;">Failed to load bouquet catalog. Please check your internet connection and reload the page.</p>
                </div>
            `;
        }
    },

    handleRouting() {
        const hash = window.location.hash || '#/';
        const paramsStr = hash.split('?')[1] || '';
        const urlParams = new URLSearchParams(paramsStr);
        const path = hash.split('?')[0];

        const appEl = document.getElementById('app');
        appEl.innerHTML = ''; // clear current view
        window.scrollTo(0, 0); // scroll to top on nav

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash || link.getAttribute('href').split('?')[0] === path) {
                link.classList.add('active');
            }
        });

        // Simple hash-based router
        if (path === '#/' || path === '') {
            window.Pages.renderHomePage(appEl);
            const scrollTo = urlParams.get('scrollTo');
            if (scrollTo) {
                setTimeout(() => {
                    const el = document.getElementById(scrollTo);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
        else if (path === '#/catalog') {
            const filterParam = urlParams.get('filter') || 'All';
            window.Pages.renderCatalogPage(appEl, filterParam);
        }
        else if (path.startsWith('#/bouquet/')) {
            const id = path.replace('#/bouquet/', '');
            window.Pages.renderBouquetDetailPage(appEl, id);
        }
        else {
            // 404
            appEl.innerHTML = `<div class="container section"><div class="section-title"><h2>Page Not Found</h2><a href="#/" class="btn btn-primary">Go Home</a></div></div>`;
        }
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
