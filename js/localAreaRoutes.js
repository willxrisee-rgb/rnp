// js/localAreaRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Renderer + route mapping for all Local Area SEO pages (Template 3).
// Works alongside CoreServiceRoutes, OccasionRoutes, and UrgencyServiceRoutes.
// ─────────────────────────────────────────────────────────────────────────────

window.LocalAreaRoutes = {

    // Helper to get SLUGS from the data object dynamically
    get SLUGS() {
        return window.LocalAreaPagesData ? Object.keys(window.LocalAreaPagesData) : [];
    },

    /**
     * Returns true if the slug matches a local area page.
     */
    isLocalAreaPage(slug) {
        return this.SLUGS.includes(slug);
    },

    /**
     * Render a full local area SEO page into the given container.
     */
    render(container, slug) {
        const data = window.LocalAreaPagesData ? window.LocalAreaPagesData[slug] : null;
        if (!data) return;

        document.title = data.pageTitle;

        // WhatsApp Link Setup
        const defaultMessage = `Hi! I want flower delivery in ${data.areaName}.`;
        const waLink = `https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent(defaultMessage)}`;

        // ── Delivery Proof ──────────────────────────────────────────────────
        const deliveryProofHtml = (data.deliveryProof || []).map(item => `
            <li class="rnp-local-proof__item">
                <span class="rnp-local-proof__icon" aria-hidden="true">${item.icon}</span>
                <span class="rnp-local-proof__text">${item.text}</span>
            </li>
        `).join('');

        // ── Featured Products Grid (Random from Catalog) ────────────────────
        let productsHtml = '';
        if (window.Store && window.Store.getAllProducts && window.Store.getAllProducts().length > 0) {
            const bestSellers = window.Store.getAllProducts().filter(b => b.is_best_seller).slice(0, 6);
            if (bestSellers.length > 0 && window.Components) {
                productsHtml = `
                    <div class="product-grid">
                        ${bestSellers.map(b => window.Components.createProductCard(b)).join('')}
                    </div>
                `;
            }
        }
        if (!productsHtml) {
            productsHtml = `<div class="rnp-placeholder">[PRODUCT GRID COMPONENT]</div>`;
        }

        // ── Trust bar ───────────────────────────────────────────────────────
        const benefitsHtml = (data.benefits || []).map(b => `
            <li class="rnp-trust-bar__item">
                <span class="rnp-trust-bar__icon" aria-hidden="true">${b.icon}</span>
                <span>
                    <strong class="rnp-trust-bar__title">${b.title}</strong>
                    <span class="rnp-trust-bar__text">${b.text}</span>
                </span>
            </li>
        `).join('');

        // ── Steps ─────────────────────────────────────────────────────────────
        const renderStep = (text) => text.replace('{areaName}', data.areaName);
        const stepsHtml = (data.steps || []).map(s => `
            <li class="rnp-steps__item">
                <span class="rnp-steps__num" aria-hidden="true">${s.number}</span>
                <div>
                    <h3 class="rnp-steps__title">${s.title}</h3>
                    <p class="rnp-steps__text">${renderStep(s.text)}</p>
                </div>
            </li>
        `).join('');

        // ── FAQs ──────────────────────────────────────────────────────────────
        const faqsHtml = (data.faqs || []).map(faq => `
            <details class="rnp-faqs__item">
                <summary class="rnp-faqs__q">${faq.q}</summary>
                <dd class="rnp-faqs__a">${faq.a}</dd>
            </details>
        `).join('');

        // ── Nearby Areas ──────────────────────────────────────────────────────
        const nearbyAreasHtml = (data.nearbyAreas || []).map(area => `
            <li class="rnp-nearby__item">
                <a class="rnp-btn rnp-btn--ghost rnp-btn--sm" href="${area.href}">🌸 ${area.label}</a>
            </li>
        `).join('');

        // ── Hero Image (Random from Catalog) ──────────────────────────────────
        let heroImageUrl = '';
        let heroImageAlt = '';
        if (window.Store && window.Store.getAllProducts) {
            const productsWithImages = window.Store.getAllProducts().filter(p => p.image_url);
            if (productsWithImages.length > 0) {
                const randomProduct = productsWithImages[Math.floor(Math.random() * productsWithImages.length)];
                heroImageUrl = randomProduct.image_url;
                heroImageAlt = `${randomProduct.name} delivered to ${data.areaName}`;
            }
        }

        // ── Full page HTML ─────────────────────────────────────────────────────
        container.innerHTML = `
            <main class="rnp-page rnp-page--local">

                <!-- ── HERO ──────────────────────────────────────────────── -->
                <section class="rnp-hero rnp-hero--local" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <span class="rnp-hero__local-badge">
                            📍 Delivering to ${data.areaName} in ${data.deliveryTime}
                        </span>
                        <h1 class="rnp-hero__h1">${data.headline}</h1>
                        <p class="rnp-hero__sub">${data.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>${data.startingPrice}</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${waLink}" target="_blank" rel="noopener noreferrer">
                            Order on WhatsApp
                        </a>
                    </div>
                    <div class="rnp-hero__media" aria-hidden="${heroImageUrl ? 'false' : 'true'}">
                        ${heroImageUrl
                            ? `<img class="rnp-hero__img" src="${heroImageUrl}" alt="${heroImageAlt}" loading="lazy" style="width:100%;height:auto;border-radius:12px;">`
                            : `<div class="rnp-placeholder rnp-placeholder--hero">[BOUQUET IMAGE]</div>`
                        }
                    </div>
                </section>

                <!-- ── LOCAL DELIVERY PROOF ──────────────────────────────── -->
                <section class="rnp-section rnp-local-proof" aria-labelledby="local-h2">
                    <h2 id="local-h2" class="rnp-section__h2">
                        Flower Delivery in ${data.areaName} — Why Choose Us
                    </h2>
                    <ul class="rnp-local-proof__list" role="list">
                        ${deliveryProofHtml}
                    </ul>
                </section>

                <!-- ── PRODUCT GRID ──────────────────────────────────────── -->
                <section class="rnp-section rnp-products" aria-labelledby="products-h2">
                    <h2 id="products-h2" class="rnp-section__h2">
                        Bouquets Delivered to ${data.areaName}
                    </h2>
                    ${productsHtml}
                    <div class="rnp-section__footer" style="margin-top:2rem;text-align:center;">
                        <a class="rnp-btn rnp-btn--ghost" href="#/catalog">View All Bouquets →</a>
                    </div>
                </section>

                <!-- ── TRUST BAR ─────────────────────────────────────────── -->
                <section class="rnp-trust-bar" aria-label="Why order from us">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${benefitsHtml}
                    </ul>
                </section>

                <!-- ── HOW IT WORKS ──────────────────────────────────────── -->
                <section class="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">
                        How to Order Flowers to ${data.areaName}
                    </h2>
                    <ol class="rnp-steps__list" role="list">
                        ${stepsHtml}
                    </ol>
                </section>

                <!-- ── WHY CONTENT ───────────────────────────────────────── -->
                ${data.whyContent ? `
                <section class="rnp-section lp-why-section" aria-labelledby="why-h2">
                    <div class="lp-content-inner">
                        ${data.whyContent}
                    </div>
                </section>
                ` : ''}

                <!-- ── FAQs ──────────────────────────────────────────────── -->
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    ${data.faqContent ? `
                    <div class="lp-content-inner">
                        ${data.faqContent}
                    </div>
                    ` : `
                    <h2 id="faqs-h2" class="rnp-section__h2">
                        FAQs — Flower Delivery in ${data.areaName}
                    </h2>
                    <dl class="rnp-faqs__list">
                        ${faqsHtml}
                    </dl>
                    `}
                </section>

                <!-- ── NEARBY AREAS ──────────────────────────────────────── -->
                <section class="rnp-section rnp-nearby" aria-labelledby="nearby-h2">
                    <h2 id="nearby-h2" class="rnp-section__h2">
                        We Also Deliver to Nearby Areas
                    </h2>
                    <ul class="rnp-nearby__list" role="list">
                        ${nearbyAreasHtml}
                    </ul>
                </section>

                <!-- ── BOTTOM CTA ────────────────────────────────────────── -->
                <section class="rnp-section rnp-cta-block" aria-label="Order now">
                    <h2 class="rnp-cta-block__h2">
                        Order Fresh Flowers in ${data.areaName} Today
                    </h2>
                    <p class="rnp-cta-block__sub">
                        Delivered in ${data.deliveryTime} · Starting ${data.startingPrice} · Easy WhatsApp order
                    </p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${waLink}" target="_blank" rel="noopener noreferrer">
                        Order on WhatsApp
                    </a>
                </section>

            </main>
        `;
    }
};
