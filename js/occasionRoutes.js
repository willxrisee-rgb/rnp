// js/occasionRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Renderer + route mapping for all Occasion SEO pages (Template 2).
// Works alongside CoreServiceRoutes and UrgencyServiceRoutes.
// ─────────────────────────────────────────────────────────────────────────────

window.OccasionRoutes = {

    // Helper to get SLUGS from the data object dynamically
    get SLUGS() {
        return window.OccasionPagesData ? Object.keys(window.OccasionPagesData) : [];
    },

    /**
     * Returns true if the slug matches an occasion page.
     */
    isOccasionPage(slug) {
        return this.SLUGS.includes(slug);
    },

    /**
     * Render a full occasion SEO page into the given container.
     */
    render(container, slug) {
        const data = window.OccasionPagesData ? window.OccasionPagesData[slug] : null;
        if (!data) return;

        document.title = data.pageTitle;

        const waLink = `https://api.whatsapp.com/send?phone=${data.whatsappNumber}&text=${encodeURIComponent(data.whatsappMessage)}`;

        // ── Featured Products Grid ────────────────────────────────────────────
        let productsHtml = '';
        if (data.featuredProducts && data.featuredProducts.length > 0) {
            productsHtml = data.featuredProducts.map(p => `
                <article class="product-card">
                    ${p.image ? `
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="product-card__image">
                        <img src="${p.image}" alt="${p.name}" class="rnp-product-card-image" loading="lazy">
                    </a>
                    ` : `
                    <div class="product-card__image" style="background: var(--rnp-bg-secondary, #fff5f8); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                        <span style="font-size: 3rem;">${data.occasionEmoji}</span>
                    </div>
                    `}
                    <div class="product-card__content" style="flex: 1; display: flex; flex-direction: column;">
                        <h3 class="product-card__title">${p.name}</h3>
                        <p class="product-card__desc" style="flex: 1; margin-bottom: 1rem;">${p.desc}</p>
                        <div class="product-card__price-row" style="margin-top: auto; display: flex;">
                            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm product-card__btn" style="width: 100%; text-align: center;">Order on WhatsApp</a>
                        </div>
                    </div>
                </article>
            `).join('');
        }

        // ── Trust bar ─────────────────────────────────────────────────────────
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
        const stepsHtml = (data.steps || []).map(s => `
            <li class="rnp-steps__item">
                <span class="rnp-steps__num" aria-hidden="true">${s.number}</span>
                <div>
                    <h3 class="rnp-steps__title">${s.title}</h3>
                    <p class="rnp-steps__text">${s.text}</p>
                </div>
            </li>
        `).join('');

        // ── Areas ─────────────────────────────────────────────────────────────
        const areasHtml = (data.areas || []).map(area => `<li class="rnp-areas__pill">${area}</li>`).join('');

        // ── FAQs ──────────────────────────────────────────────────────────────
        const faqsHtml = (data.faqs || []).map(faq => `
            <details class="rnp-faqs__item">
                <summary class="rnp-faqs__q">${faq.q}</summary>
                <dd class="rnp-faqs__a">${faq.a}</dd>
            </details>
        `).join('');

        // ── Related Occasions ─────────────────────────────────────────────────
        let relatedHtml = '';
        if (data.relatedOccasions && data.relatedOccasions.length > 0) {
            relatedHtml = `
                <section class="rnp-section rnp-related" aria-labelledby="related-h2">
                    <h2 id="related-h2" class="rnp-section__h2">Shop by Occasion</h2>
                    <ul class="rnp-related__list" role="list">
                        ${data.relatedOccasions.map(occ => `
                            <li class="rnp-related__item">
                                <a class="rnp-btn rnp-btn--ghost rnp-btn--sm" href="${occ.href}">${occ.label} →</a>
                            </li>
                        `).join('')}
                    </ul>
                </section>
            `;
        }

        // ── Bottom CTA heading ────────────────────────────────────────────────
        const mainKeywordCap = data.mainKeyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const ctaH2 = `Order ${mainKeywordCap} Right Now`;

        // ── Full page HTML ─────────────────────────────────────────────────────
        container.innerHTML = `
            <main class="rnp-page rnp-page--occasion">

                <!-- ── HERO ──────────────────────────────────────────────── -->
                <section class="rnp-hero rnp-hero--occasion" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <span class="rnp-hero__occasion-badge" aria-hidden="true">
                            ${data.occasionEmoji} ${data.occasionName}
                        </span>
                        <h1 class="rnp-hero__h1">${data.headline}</h1>
                        <p class="rnp-hero__sub">${data.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>${data.startingPrice}</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${waLink}" target="_blank" rel="noopener noreferrer">
                            ${data.ctaText}
                        </a>
                        ${data.deliveryNote ? `<p class="rnp-hero__delivery-note">📦 ${data.deliveryNote}</p>` : ''}
                    </div>
                    <div class="rnp-hero__media" aria-hidden="true">
                        ${data.heroImage ? `
                        <img src="${data.heroImage}" alt="${data.heroImageAlt || data.occasionName}" style="width: 100%; height: auto; object-fit: contain;">
                        ` : `
                        <div class="rnp-placeholder rnp-placeholder--hero" style="background: var(--rnp-bg-dark); color: var(--rnp-pink); font-weight: 600;">${data.occasionName.toUpperCase()} BOUQUETS</div>
                        `}
                    </div>
                </section>

                <!-- ── OCCASION EMOTIONAL SECTION ────────────────────────── -->
                <section class="rnp-section rnp-occasion-block" aria-labelledby="occasion-h2">
                    <h2 id="occasion-h2" class="rnp-section__h2">${data.occasionSection.headline}</h2>
                    <p class="rnp-occasion-block__text">${data.occasionSection.text}</p>
                    ${data.occasionSection.callout ? `<p class="rnp-occasion-block__callout">${data.occasionSection.callout}</p>` : ''}
                </section>

                <!-- ── PRODUCT GRID ──────────────────────────────────────── -->
                <section class="rnp-section rnp-products" aria-labelledby="products-h2">
                    <h2 id="products-h2" class="rnp-section__h2">${data.productSectionHeadline}</h2>
                    <div class="product-grid" style="margin-top: 2rem;">
                        ${productsHtml}
                    </div>
                    <div class="rnp-section__footer" style="margin-top: 2rem; text-align: center;">
                        <a class="rnp-btn rnp-btn--ghost" href="#/catalog">Browse All Bouquets →</a>
                    </div>
                </section>

                <!-- ── TRUST BAR ─────────────────────────────────────────── -->
                <section class="rnp-trust-bar" aria-label="Why order ${data.occasionName} flowers from us">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${benefitsHtml}
                    </ul>
                </section>

                <!-- ── HOW IT WORKS ──────────────────────────────────────── -->
                <section class="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">Order Your ${data.occasionName} Bouquet in 3 Steps</h2>
                    <ol class="rnp-steps__list" role="list">
                        ${stepsHtml}
                    </ol>
                </section>

                <!-- ── AREAS COVERED ─────────────────────────────────────── -->
                <section class="rnp-section rnp-areas" aria-labelledby="areas-h2">
                    <h2 id="areas-h2" class="rnp-section__h2">${data.occasionName} Flower Delivery — All of Ghaziabad</h2>
                    <ul class="rnp-areas__grid" role="list">
                        ${areasHtml}
                    </ul>
                </section>

                <!-- ── FAQs ──────────────────────────────────────────────── -->
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    <h2 id="faqs-h2" class="rnp-section__h2">FAQs — ${data.occasionName} Flower Delivery</h2>
                    <dl class="rnp-faqs__list">
                        ${faqsHtml}
                    </dl>
                </section>

                <!-- ── RELATED OCCASIONS ─────────────────────────────────── -->
                ${relatedHtml}

                <!-- ── BOTTOM CTA ────────────────────────────────────────── -->
                <section class="rnp-section rnp-cta-block" aria-label="Order now">
                    <h2 class="rnp-cta-block__h2">${ctaH2}</h2>
                    <p class="rnp-cta-block__sub">Order before 8 PM to get under 1 hour delivery · Starting ${data.startingPrice} · WhatsApp confirmation in about 10 minutes</p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${waLink}" target="_blank" rel="noopener noreferrer">${data.ctaText}</a>
                </section>

            </main>
        `;
    }
};
