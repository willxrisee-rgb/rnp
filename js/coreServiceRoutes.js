// js/coreServiceRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Renderer + route mapping for all Core Service SEO pages.
// Renders HTML matching Template1_CoreService.jsx + rnp-templates.css classes.
// ─────────────────────────────────────────────────────────────────────────────

window.CoreServiceRoutes = {

    // All slug → data key mappings (slug must match the hash route without #/)
    SLUGS: [
        'flower-delivery-ghaziabad',
        'online-flower-delivery-ghaziabad',
        'bouquet-delivery-ghaziabad',
        'send-flowers-ghaziabad',
        'order-flowers-online-ghaziabad',
        'florist-ghaziabad',
        'flower-shop-ghaziabad',
        'fresh-flowers-ghaziabad',
        'rose-bouquet-delivery-ghaziabad',
        'mixed-flower-bouquet-ghaziabad',
    ],

    /**
     * Check if a given path (without #/) is a core service page.
     * @param {string} slug — e.g. 'flower-delivery-ghaziabad'
     * @returns {boolean}
     */
    isCorePage(slug) {
        return this.SLUGS.includes(slug);
    },

    /**
     * Render a core service page into the given container.
     * @param {HTMLElement} container — #app element
     * @param {string} slug — e.g. 'flower-delivery-ghaziabad'
     */
    render(container, slug) {
        let data = window.CorePagesData ? window.CorePagesData[slug] : null;

        // Fallback SEO block if data for this slug is missing
        if (!data) {
            const fallbackTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            data = {
                pageTitle: `${fallbackTitle} | Rose n Petals`,
                mainKeyword: fallbackTitle,
                headline: `${fallbackTitle} – Fresh & Fast Delivery`,
                subheadline: 'Order fresh, handmade bouquets delivered to your door in Ghaziabad. Quick and easy on WhatsApp.',
                benefits: [
                    { icon: '🌹', title: 'Fresh & Handmade', text: 'Every bouquet made to order' },
                    { icon: '⚡', title: 'Fast Delivery', text: 'Delivered fresh to your door' },
                    { icon: '💰', title: 'Starting ₹200', text: 'Bouquets for every budget' },
                    { icon: '📲', title: 'WhatsApp Order', text: 'Simple, personal, fast' }
                ],
                areas: ['Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali', 'Vasundhara', 'Mohan Nagar'],
                steps: [
                    { number: '01', title: 'Browse & Pick', text: 'Choose your bouquet from our catalog' },
                    { number: '02', title: 'WhatsApp Us', text: 'Send your choice + delivery address' },
                    { number: '03', title: 'We Deliver', text: 'Fresh flowers to your door, same day' }
                ],
                faqs: [],
                ctaText: 'Order on WhatsApp',
                whatsappNumber: '917289996804',
                whatsappMessage: `Hi! I want to inquire about ${fallbackTitle}.`
            };
        }

        document.title = data.pageTitle;

        const waLink = `https://api.whatsapp.com/send?phone=${data.whatsappNumber}&text=${encodeURIComponent(data.whatsappMessage || 'Hi! I want to order a bouquet.')}`;

        // Pick random hero image from catalog
        let heroImageUrl = '';
        let heroImageAlt = '';
        if (window.Store && window.Store.getAllProducts) {
            const productsWithImages = window.Store.getAllProducts().filter(p => p.image_url);
            if (productsWithImages.length > 0) {
                const randomProduct = productsWithImages[Math.floor(Math.random() * productsWithImages.length)];
                heroImageUrl = randomProduct.image_url;
                heroImageAlt = `${randomProduct.name} bouquet in Ghaziabad`;
            }
        }

        // Build best-sellers grid if Store has products loaded
        let productsHtml = '';
        if (window.Store && window.Store.getAllProducts && window.Store.getAllProducts().length > 0) {
            const bestSellers = window.Store.getAllProducts().filter(b => b.is_best_seller).slice(0, 6);
            if (bestSellers.length > 0 && window.Components) {
                productsHtml = `
                    <section class="section section-light">
                        <div class="container">
                            <h2 class="section-title">Our Most-Loved Bouquets in Ghaziabad</h2>
                            <div class="product-grid">
                                ${bestSellers.map(b => window.Components.createProductCard(b)).join('')}
                            </div>
                        </div>
                    </section>
                `;
            }
        }

        // Build FAQ HTML (only if there are FAQs)
        let faqsHtml = '';
        if (data.faqs && data.faqs.length > 0) {
            faqsHtml = `
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    <h2 id="faqs-h2" class="rnp-section__h2">Frequently Asked Questions</h2>
                    <dl class="rnp-faqs__list">
                        ${data.faqs.map(faq => `
                            <details class="rnp-faqs__item">
                                <summary class="rnp-faqs__q">${faq.q}</summary>
                                <dd class="rnp-faqs__a">${faq.a}</dd>
                            </details>
                        `).join('')}
                    </dl>
                </section>
            `;
        }

        // Dynamic CTA H2 based on keyword
        const ctaH2 = data.mainKeyword.includes('rose')
            ? 'Order Rose Bouquets in Ghaziabad Today'
            : data.mainKeyword.includes('bouquet')
                ? 'Order a Beautiful Bouquet in Ghaziabad Today'
                : data.mainKeyword.includes('florist') || data.mainKeyword.includes('shop')
                    ? 'Visit Rose n Petals — Your Ghaziabad Florist'
                    : 'Order Fresh Flowers in Ghaziabad Today';

        container.innerHTML = `
            <main class="rnp-page rnp-page--core">

                <!-- ── HERO ──────────────────────────────────────────────────── -->
                <section class="rnp-hero" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <h1 class="rnp-hero__h1">${data.headline}</h1>
                        <p class="rnp-hero__sub">${data.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>₹200</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                           href="${waLink}"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="${data.ctaText} — opens WhatsApp"
                           onclick="if(window.gtag) gtag('event', 'whatsapp_seo_click', { event_category: 'SEO Page', page_slug: '${slug}' });">
                            ${data.ctaText}
                        </a>
                    </div>
                    <div class="rnp-hero__media" aria-hidden="${heroImageUrl ? 'false' : 'true'}">
                        ${heroImageUrl 
                            ? `<img class="rnp-hero__img" src="${heroImageUrl}" alt="${heroImageAlt}" loading="lazy">` 
                            : `<div class="rnp-placeholder rnp-placeholder--hero">🌸 Fresh Bouquets</div>`
                        }
                    </div>
                </section>

                <!-- ── TRUST BAR ─────────────────────────────────────────────── -->
                <section class="rnp-trust-bar" aria-label="Why Rose n Petals">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${data.benefits.map(b => `
                            <li class="rnp-trust-bar__item">
                                <span class="rnp-trust-bar__icon" aria-hidden="true">${b.icon}</span>
                                <span>
                                    <strong class="rnp-trust-bar__title">${b.title}</strong>
                                    <span class="rnp-trust-bar__text">${b.text}</span>
                                </span>
                            </li>
                        `).join('')}
                    </ul>
                </section>

                <!-- ── BEST SELLERS (if loaded) ──────────────────────────────── -->
                ${productsHtml}

                <!-- ── AREAS COVERED ─────────────────────────────────────────── -->
                <section class="rnp-section rnp-areas" aria-labelledby="areas-h2">
                    <h2 id="areas-h2" class="rnp-section__h2">We Deliver Flowers Across Ghaziabad</h2>
                    <p class="rnp-areas__intro">
                        From Kavi Nagar to Crossing Republik — we cover all major areas of Ghaziabad for same-day flower delivery.
                    </p>
                    <ul class="rnp-areas__grid" role="list">
                        ${data.areas.map(area => `<li class="rnp-areas__pill">${area}</li>`).join('')}
                    </ul>
                </section>

                <!-- ── HOW IT WORKS ──────────────────────────────────────────── -->
                <section class="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">Order Flowers in 3 Easy Steps</h2>
                    <ol class="rnp-steps__list" role="list">
                        ${data.steps.map(s => `
                            <li class="rnp-steps__item">
                                <span class="rnp-steps__num" aria-hidden="true">${s.number}</span>
                                <div>
                                    <h3 class="rnp-steps__title">${s.title}</h3>
                                    <p class="rnp-steps__text">${s.text}</p>
                                </div>
                            </li>
                        `).join('')}
                    </ol>
                </section>

                <!-- ── FAQs ──────────────────────────────────────────────────── -->
                ${faqsHtml}

                <!-- ── BOTTOM CTA ────────────────────────────────────────────── -->
                <section class="rnp-section rnp-cta-block" aria-label="Order now">
                    <h2 class="rnp-cta-block__h2">${ctaH2}</h2>
                    <p class="rnp-cta-block__sub">
                        Same-day delivery available · Starting ₹200 · Easy WhatsApp ordering
                    </p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                       href="${waLink}"
                       target="_blank"
                       rel="noopener noreferrer"
                       onclick="if(window.gtag) gtag('event', 'whatsapp_seo_click', { event_category: 'SEO Page CTA Bottom', page_slug: '${slug}' });">
                        ${data.ctaText}
                    </a>
                </section>

            </main>
        `;
    }
};
