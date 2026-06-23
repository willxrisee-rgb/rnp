// js/urgencyServiceRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Renderer + route mapping for all Urgency / Express SEO pages (Template 4).
// Works alongside CoreServiceRoutes — never modifies it.
// ─────────────────────────────────────────────────────────────────────────────

window.UrgencyServiceRoutes = {

    // All urgency slugs (must match hash routes without #/)
    SLUGS: [
        'same-day-flower-delivery-ghaziabad',
        'express-flower-delivery-ghaziabad',
        '2-hour-flower-delivery-ghaziabad',
        'midnight-flower-delivery-ghaziabad',
        'urgent-flower-delivery-ghaziabad',
        'last-minute-flower-delivery-ghaziabad',
        'flower-delivery-today-ghaziabad',
        'emergency-flower-delivery-ghaziabad',
    ],

    /**
     * Returns true if the slug matches an urgency page.
     * @param {string} slug — e.g. 'same-day-flower-delivery-ghaziabad'
     * @returns {boolean}
     */
    isUrgencyPage(slug) {
        return this.SLUGS.includes(slug);
    },

    /**
     * Render a full urgency SEO page into the given container.
     * Layout mirrors Template4_Urgency.jsx, rendered as vanilla HTML.
     * @param {HTMLElement} container — #app element
     * @param {string}      slug      — e.g. 'same-day-flower-delivery-ghaziabad'
     */
    render(container, slug) {
        let data = window.UrgencyPagesData ? window.UrgencyPagesData[slug] : null;

        // Fallback data if slug is in SLUGS but no data entry exists yet
        if (!data) {
            const fallbackTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            data = {
                pageTitle: `${fallbackTitle} | Rose n Petals`,
                mainKeyword: fallbackTitle,
                urgencyType: 'express',
                deliveryPromise: 'Order Now → Delivered Today',
                cutoffTime: 'Order before 8 PM for same-day delivery in Ghaziabad',
                guaranteeText: 'We confirm your slot on WhatsApp before we start.',
                headline: `${fallbackTitle} – Fast & Fresh`,
                subheadline: 'Fresh handmade bouquets delivered fast across Ghaziabad. WhatsApp us to place your order now.',
                benefits: [
                    { icon: '🌹', title: 'Fresh & Handmade', text: 'Every bouquet made to order' },
                    { icon: '⚡', title: 'Priority Dispatch', text: 'Urgent orders handled first' },
                    { icon: '💰', title: 'Starting ₹200', text: 'No express surcharge' },
                    { icon: '📲', title: 'WhatsApp Booking', text: 'Slot confirmed in 10 minutes' },
                ],
                speedProof: [
                    { icon: '⚡', stat: 'Under 1 hr', label: 'Delivery from confirmation', note: 'Across Ghaziabad' },
                    { icon: '📦', stat: '8 PM', label: 'Same-day cut-off', note: '7 days a week' },
                    { icon: '✅', stat: '10 min', label: 'Slot confirmation time', note: 'Via WhatsApp' },
                ],
                areas: ['Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali', 'Vasundhara', 'Mohan Nagar'],
                steps: [
                    { number: '01', title: 'WhatsApp Us', text: 'Share your bouquet choice and delivery address.', time: 'Takes 2 minutes' },
                    { number: '02', title: 'Slot Confirmed', text: 'We confirm your delivery slot on WhatsApp.', time: 'Within 10 minutes' },
                    { number: '03', title: 'Delivered to Your Door', text: 'Fresh bouquet delivered same day to your Ghaziabad address in under 1 hour.', time: 'Under 1 hour from confirmation' },
                ],
                faqs: [],
                ctaText: 'Order on WhatsApp Now',
                whatsappNumber: '917289996804',
                whatsappMessage: `Hi! I need ${fallbackTitle} — please help.`,
                relatedUrgency: [],
            };
        }

        document.title = data.pageTitle;

        const waLink = `https://api.whatsapp.com/send?phone=${data.whatsappNumber}&text=${encodeURIComponent(data.whatsappMessage || 'Hi! I need urgent flower delivery in Ghaziabad.')}`;

        // ── Pick random hero image from catalog (same as core pages) ──────────
        let heroImageUrl = '';
        let heroImageAlt = '';
        if (window.Store && window.Store.getAllProducts) {
            const productsWithImages = window.Store.getAllProducts().filter(p => p.image_url);
            if (productsWithImages.length > 0) {
                const randomProduct = productsWithImages[Math.floor(Math.random() * productsWithImages.length)];
                heroImageUrl = randomProduct.image_url;
                heroImageAlt = `${randomProduct.name} — available for express delivery in Ghaziabad`;
            }
        }

        // ── Speed proof strip ─────────────────────────────────────────────────
        const speedProofHtml = (data.speedProof || []).map(item => `
            <li class="rnp-speed-proof__item">
                <span class="rnp-speed-proof__icon" aria-hidden="true">${item.icon}</span>
                <strong class="rnp-speed-proof__stat">${item.stat}</strong>
                <span class="rnp-speed-proof__label">${item.label}</span>
                <span class="rnp-speed-proof__note">${item.note}</span>
            </li>
        `).join('');

        // ── Best-sellers product grid (same pattern as core pages) ────────────
        let productsHtml = '';
        if (window.Store && window.Store.getAllProducts && window.Store.getAllProducts().length > 0) {
            const bestSellers = window.Store.getAllProducts().filter(b => b.is_best_seller).slice(0, 6);
            if (bestSellers.length > 0 && window.Components) {
                productsHtml = `
                    <section class="section section-light">
                        <div class="container">
                            <h2 class="section-title">Bouquets Available for Fast Delivery in Ghaziabad</h2>
                            <div class="product-grid">
                                ${bestSellers.map(b => window.Components.createProductCard(b)).join('')}
                            </div>
                        </div>
                    </section>
                `;
            }
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

        // ── Steps with time badge ─────────────────────────────────────────────
        const stepsHtml = (data.steps || []).map(s => `
            <li class="rnp-steps__item">
                <span class="rnp-steps__num" aria-hidden="true">${s.number}</span>
                <div>
                    <h3 class="rnp-steps__title">${s.title}</h3>
                    <p class="rnp-steps__text">${s.text}</p>
                    ${s.time ? `<span class="rnp-steps__time-badge">⏱ ${s.time}</span>` : ''}
                </div>
            </li>
        `).join('');

        // ── Areas ─────────────────────────────────────────────────────────────
        const areasHtml = (data.areas || []).map(area => `<li class="rnp-areas__pill">${area}</li>`).join('');

        // ── FAQs ──────────────────────────────────────────────────────────────
        let faqsHtml = '';
        if (data.whyContent || (data.faqs && data.faqs.length > 0)) {
            faqsHtml = `
                ${data.whyContent ? `
                <section class="rnp-section lp-why-section" aria-labelledby="why-h2">
                    <div class="lp-content-inner">
                        ${data.whyContent}
                    </div>
                </section>
                ` : ''}
                ${data.faqs && data.faqs.length > 0 ? `
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    <h2 id="faqs-h2" class="rnp-section__h2">Common Questions</h2>
                    <dl class="rnp-faqs__list">
                        ${data.faqs.map(faq => `
                            <details class="rnp-faqs__item">
                                <summary class="rnp-faqs__q">${faq.q}</summary>
                                <dd class="rnp-faqs__a">${faq.a}</dd>
                            </details>
                        `).join('')}
                    </dl>
                </section>
                ` : ''}
            `;
        }

        // ── Related urgency cross-links ────────────────────────────────────────
        let relatedHtml = '';
        if (data.relatedUrgency && data.relatedUrgency.length > 0) {
            relatedHtml = `
                <section class="rnp-section rnp-related" aria-labelledby="related-h2">
                    <h2 id="related-h2" class="rnp-section__h2">Other Delivery Options</h2>
                    <ul class="rnp-related__list" role="list">
                        ${data.relatedUrgency.map(item => `
                            <li>
                                <a class="rnp-btn rnp-btn--ghost rnp-btn--sm" href="${item.href}">⚡ ${item.label}</a>
                            </li>
                        `).join('')}
                    </ul>
                </section>
            `;
        }

        // ── Bottom CTA heading (urgency-aware) ────────────────────────────────
        const ctaH2 = data.urgencyType === 'midnight'
            ? `Book Midnight Flower Delivery in Ghaziabad`
            : data.urgencyType === '2-hour'
                ? `Order Under 1 Hour Flower Delivery in Ghaziabad Now`
                : `Order ${data.mainKeyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} — Act Fast`;

        // ── Full page HTML ─────────────────────────────────────────────────────
        container.innerHTML = `
            <main class="rnp-page rnp-page--urgency">

                <!-- ── HERO ──────────────────────────────────────────────── -->
                <section class="rnp-hero rnp-hero--urgency" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <div class="rnp-hero__promise-badge" role="status">
                            ⚡ ${data.deliveryPromise}
                        </div>
                        <h1 class="rnp-hero__h1">${data.headline}</h1>
                        <p class="rnp-hero__sub">${data.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>₹200</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                           href="${waLink}"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="${data.ctaText} — opens WhatsApp"
                           onclick="if(window.gtag) gtag('event', 'whatsapp_urgency_click', { event_category: 'Urgency SEO Page', page_slug: '${slug}' });">
                            ${data.ctaText}
                        </a>
                        ${data.cutoffTime ? `<p class="rnp-hero__cutoff">⏰ ${data.cutoffTime}</p>` : ''}
                    </div>
                    <div class="rnp-hero__media" aria-hidden="${heroImageUrl ? 'false' : 'true'}">
                        ${heroImageUrl
                ? `<img class="rnp-hero__img" src="${heroImageUrl}" alt="${heroImageAlt}" loading="lazy">`
                : `<div class="rnp-placeholder rnp-placeholder--hero">🌸 Fresh Bouquets</div>`
            }
                    </div>
                </section>

                <!-- ── SPEED PROOF STRIP ──────────────────────────────────── -->
                <section class="rnp-speed-proof" aria-label="Delivery speed proof">
                    <ul class="rnp-speed-proof__list" role="list">
                        ${speedProofHtml}
                    </ul>
                    ${data.guaranteeText ? `<p class="rnp-speed-proof__guarantee">✅ ${data.guaranteeText}</p>` : ''}
                </section>

                <!-- ── BEST SELLERS (if loaded) ───────────────────────────── -->
                ${productsHtml}

                <!-- ── TRUST BAR ──────────────────────────────────────────── -->
                <section class="rnp-trust-bar" aria-label="Why our express delivery is reliable">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${benefitsHtml}
                    </ul>
                </section>

                <!-- ── HOW FAST ORDERING WORKS ────────────────────────────── -->
                <section class="rnp-section rnp-steps rnp-steps--urgency" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">How Express Ordering Works — Step by Step</h2>
                    <ol class="rnp-steps__list" role="list">
                        ${stepsHtml}
                    </ol>
                </section>

                <!-- ── AREAS COVERED ──────────────────────────────────────── -->
                <section class="rnp-section rnp-areas" aria-labelledby="areas-h2">
                    <h2 id="areas-h2" class="rnp-section__h2">Express Delivery Available Across Ghaziabad</h2>
                    <p class="rnp-areas__intro">
                        We cover all major localities in Ghaziabad for same-day and express flower delivery.
                    </p>
                    <ul class="rnp-areas__grid" role="list">
                        ${areasHtml}
                    </ul>
                </section>

                <!-- ── FAQs ──────────────────────────────────────────────── -->
                ${faqsHtml}

                <!-- ── RELATED URGENCY CROSS-LINKS ────────────────────────── -->
                ${relatedHtml}

                <!-- ── BOTTOM CTA ─────────────────────────────────────────── -->
                <section class="rnp-section rnp-cta-block rnp-cta-block--urgency" aria-label="Order now">
                    <div class="rnp-cta-block__promise">${data.deliveryPromise}</div>
                    <h2 class="rnp-cta-block__h2">${ctaH2}</h2>
                    <p class="rnp-cta-block__sub">
                        ${data.cutoffTime ? `${data.cutoffTime} · ` : ''}Starting ₹200 · Easy WhatsApp order
                    </p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                       href="${waLink}"
                       target="_blank"
                       rel="noopener noreferrer"
                       onclick="if(window.gtag) gtag('event', 'whatsapp_urgency_click', { event_category: 'Urgency SEO Page CTA Bottom', page_slug: '${slug}' });">
                        ${data.ctaText}
                    </a>
                </section>

            </main>
        `;
    }
};
