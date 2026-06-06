// ─────────────────────────────────────────────────────────────────────────────
// Template 2 — Occasion Page
// ─────────────────────────────────────────────────────────────────────────────
// USE FOR keywords like:
//   "birthday flower delivery Ghaziabad"   → /birthday-flower-delivery-ghaziabad
//   "anniversary bouquet delivery Ghaziabad"→ /anniversary-bouquet-delivery-ghaziabad
//   "valentines bouquet Ghaziabad"          → /valentines-bouquet-ghaziabad
//   "apology flowers Ghaziabad"             → /apology-flowers-ghaziabad
//   "sympathy flowers Ghaziabad"            → /sympathy-flowers-ghaziabad
//   "congratulations flowers Ghaziabad"     → /congratulations-flowers-ghaziabad
//
// KEY DIFFERENCE from Template 1:
//   → Hero leads with the EMOTION of the occasion, not just the service.
//   → Adds an "About This Occasion" section to capture emotional intent.
//   → Products section filtered/labeled for the specific occasion.
//
// IMPORT CSS: <link rel="stylesheet" href="/rnp-templates.css" />
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

// ── DEFAULT PROPS ─────────────────────────────────────────────────────────────

const DEFAULTS = {
  pageTitle:        '[PAGE TITLE — e.g. "Birthday Flower Delivery Ghaziabad | Rose n Petals"]',

  // The occasion — drives h1, product filter, and emotional section
  occasionName:     '[OCCASION NAME — e.g. "Birthday"]',
  occasionEmoji:    '🎂',         // shown in hero alongside headline
  mainKeyword:      '[MAIN KEYWORD — e.g. "Birthday Flower Delivery Ghaziabad"]',

  // Hero copy — lead with emotion, back it with speed/price
  headline:         '[H1 — e.g. "Surprise Them with a Birthday Bouquet in Ghaziabad"]',
  subheadline:      '[Subheadline — e.g. "Same-day delivery, starting ₹200. Order on WhatsApp in 2 minutes."]',
  startingPrice:    '₹200',

  // WhatsApp CTA
  ctaText:          'Order on WhatsApp',
  whatsappNumber:   '917289996804',
  whatsappMessage:  '[Pre-filled WA message — e.g. "Hi! I want to order a birthday bouquet."]',

  // Occasion-specific emotional section
  // Appears between hero and products — ~2–3 sentences, no fluff
  occasionSection: {
    headline:  '[Occasion headline — e.g. "Make Their Birthday Unforgettable"]',
    text:      '[2–3 sentences: why flowers matter for this occasion, what emotion it creates. Be specific, not generic.]',
    callout:   '[One bold line — e.g. "Delivered fresh. On time. Every time."]',
  },

  // Product grid label — shown above the product grid
  productSectionHeadline: '[H2 — e.g. "Our Best Birthday Bouquets — Pick Your Favourite"]',

  // Delivery details for this occasion
  deliveryNote:   '[e.g. "Same-day delivery available for orders placed before 6 PM"]',

  // Trust benefits — keep 3–4, occasion-relevant
  benefits: [
    { icon: '🌸', title: '[Benefit 1]', text: '[e.g. Handmade fresh for every order]' },
    { icon: '⚡', title: '[Benefit 2]', text: '[e.g. Same-day delivery in Ghaziabad]' },
    { icon: '💰', title: '[Benefit 3]', text: '[e.g. Budgets from ₹200 to ₹2000+]' },
    { icon: '📲', title: '[Benefit 4]', text: '[e.g. Personal WhatsApp support]' },
  ],

  // Delivery coverage
  areas: [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
  ],

  // How it works — keep it fast-feeling for emotional/urgent occasions
  steps: [
    { number: '01', title: '[Step 1]', text: '[e.g. Choose a bouquet below or on Instagram]' },
    { number: '02', title: '[Step 2]', text: '[e.g. WhatsApp us with address + delivery time]' },
    { number: '03', title: '[Step 3]', text: '[e.g. We deliver fresh, on time, every time]' },
  ],

  // FAQs — occasion-specific questions
  faqs: [
    { q: '[e.g. Can you add a birthday card or message?]', a: '[Answer]' },
    { q: '[e.g. Do you do midnight birthday deliveries?]', a: '[Answer]' },
    { q: '[e.g. How early should I order for a birthday?]', a: '[Answer]' },
    { q: '[e.g. Can I customise the bouquet for the occasion?]', a: '[Answer]' },
  ],

  // Related occasions — shown as cross-links at the bottom
  relatedOccasions: [
    { label: '[e.g. Anniversary]',  href: '/anniversary-bouquet-ghaziabad' },
    { label: '[e.g. Valentine\'s]', href: '/valentines-bouquet-ghaziabad' },
    { label: '[e.g. Congratulations]', href: '/congratulations-flowers-ghaziabad' },
  ],
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function OccasionPage(props) {
  const p = { ...DEFAULTS, ...props };
  const waLink = `https://api.whatsapp.com/send?phone=${p.whatsappNumber}&text=${encodeURIComponent(p.whatsappMessage)}`;

  return (
    <>
      {/*
        ── SEO HEAD ─────────────────────────────────────────────────────────────
        <title>{p.pageTitle}</title>
        <meta name="description" content={p.metaDescription} />
        <link rel="canonical" href={p.canonicalUrl} />

        JSON-LD: FAQPage schema + LocalBusiness schema
        Also consider Event schema if occasion is date-specific (Valentine's Day)
      */}

      <main className="rnp-page rnp-page--occasion">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        {/*
          Emotion-first headline. The occasion drives the copy.
          Keep the WhatsApp CTA above the fold on mobile.
        */}
        <section className="rnp-hero rnp-hero--occasion" aria-label="Hero">
          <div className="rnp-hero__copy">
            <span className="rnp-hero__occasion-badge" aria-hidden="true">
              {p.occasionEmoji} {p.occasionName}
            </span>
            <h1 className="rnp-hero__h1">{p.headline}</h1>
            <p className="rnp-hero__sub">{p.subheadline}</p>
            <p className="rnp-hero__price">Starting at <strong>{p.startingPrice}</strong></p>
            <a
              className="rnp-btn rnp-btn--wa rnp-btn--lg"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.ctaText}
            </a>
            {p.deliveryNote && (
              <p className="rnp-hero__delivery-note">📦 {p.deliveryNote}</p>
            )}
          </div>
          {/* ── Plug in occasion-specific bouquet image here ── */}
          <div className="rnp-hero__media" aria-hidden="true">
            {/* <img src={p.heroImage} alt={`${p.occasionName} bouquet Ghaziabad`} /> */}
            <div className="rnp-placeholder rnp-placeholder--hero">[OCCASION HERO IMAGE]</div>
          </div>
        </section>

        {/* ── OCCASION EMOTIONAL SECTION ───────────────────────────────────── */}
        {/*
          This is the key differentiator for occasion pages.
          2–3 sentences that speak to the exact emotional state of this buyer.
          NOT generic "flowers are beautiful" copy — be specific to the occasion.
        */}
        <section className="rnp-section rnp-occasion-block" aria-labelledby="occasion-h2">
          <h2 id="occasion-h2" className="rnp-section__h2">
            {p.occasionSection.headline}
          </h2>
          <p className="rnp-occasion-block__text">{p.occasionSection.text}</p>
          {p.occasionSection.callout && (
            <p className="rnp-occasion-block__callout">
              {p.occasionSection.callout}
            </p>
          )}
        </section>

        {/* ── PRODUCT GRID ──────────────────────────────────────────────────── */}
        {/*
          Filter / label products for this occasion.
          Pass the occasion as a filter prop to your Catalog component.
        */}
        <section className="rnp-section rnp-products" aria-labelledby="products-h2">
          <h2 id="products-h2" className="rnp-section__h2">
            {p.productSectionHeadline}
          </h2>
          <div className="rnp-products__grid">
            {/*
              REPLACE WITH:
              <ProductGrid filter={p.occasionName.toLowerCase()} limit={6} />
              OR
              <Catalog filter={`occasion:${p.occasionName}`} />
            */}
            <div className="rnp-placeholder">[PRODUCT GRID — FILTERED FOR {p.occasionName.toUpperCase()}]</div>
          </div>
          <div className="rnp-section__footer">
            <a className="rnp-btn rnp-btn--ghost" href="/catalog">Browse All Bouquets →</a>
          </div>
        </section>

        {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
        <section className="rnp-trust-bar" aria-label={`Why order ${p.occasionName} flowers from us`}>
          <ul className="rnp-trust-bar__list" role="list">
            {p.benefits.map((b, i) => (
              <li key={i} className="rnp-trust-bar__item">
                <span className="rnp-trust-bar__icon" aria-hidden="true">{b.icon}</span>
                <span>
                  <strong className="rnp-trust-bar__title">{b.title}</strong>
                  <span className="rnp-trust-bar__text">{b.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
          <h2 id="steps-h2" className="rnp-section__h2">
            {/* e.g. "Order a Birthday Bouquet in 3 Steps" */}
            Order Your {p.occasionName} Bouquet in 3 Steps
          </h2>
          <ol className="rnp-steps__list" role="list">
            {p.steps.map((s, i) => (
              <li key={i} className="rnp-steps__item">
                <span className="rnp-steps__num" aria-hidden="true">{s.number}</span>
                <div>
                  <h3 className="rnp-steps__title">{s.title}</h3>
                  <p className="rnp-steps__text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── AREAS COVERED ─────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-areas" aria-labelledby="areas-h2">
          <h2 id="areas-h2" className="rnp-section__h2">
            {p.occasionName} Flower Delivery — All of Ghaziabad
          </h2>
          <ul className="rnp-areas__grid" role="list">
            {p.areas.map((area, i) => (
              <li key={i} className="rnp-areas__pill">{area}</li>
            ))}
          </ul>
        </section>

        {/* ── FAQs ──────────────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
          <h2 id="faqs-h2" className="rnp-section__h2">
            FAQs — {p.occasionName} Flower Delivery
          </h2>
          <dl className="rnp-faqs__list">
            {p.faqs.map((faq, i) => (
              <details key={i} className="rnp-faqs__item">
                <summary className="rnp-faqs__q">{faq.q}</summary>
                <dd className="rnp-faqs__a">{faq.a}</dd>
              </details>
            ))}
          </dl>
        </section>

        {/* ── RELATED OCCASIONS ─────────────────────────────────────────────── */}
        {/*
          Cross-links to other occasion pages.
          Good for internal linking + keeps users on site.
        */}
        {p.relatedOccasions && p.relatedOccasions.length > 0 && (
          <section className="rnp-section rnp-related" aria-labelledby="related-h2">
            <h2 id="related-h2" className="rnp-section__h2">
              Shop by Occasion
            </h2>
            <ul className="rnp-related__list" role="list">
              {p.relatedOccasions.map((occ, i) => (
                <li key={i} className="rnp-related__item">
                  <a className="rnp-btn rnp-btn--ghost rnp-btn--sm" href={occ.href}>
                    {occ.label} →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-cta-block" aria-label="Order now">
          <h2 className="rnp-cta-block__h2">
            {/* e.g. "Order Birthday Flowers in Ghaziabad Right Now" */}
            [CTA H2 — repeat occasion + keyword + urgency]
          </h2>
          <p className="rnp-cta-block__sub">
            [e.g. "Same-day delivery · Starting ₹200 · Order in 2 minutes on WhatsApp"]
          </p>
          <a
            className="rnp-btn rnp-btn--wa rnp-btn--lg"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {p.ctaText}
          </a>
        </section>

      </main>
    </>
  );
}

export default OccasionPage;

// ─────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLE:
// ─────────────────────────────────────────────────────────────────────────────
//
// import OccasionPage from './Template2_Occasion';
//
// <Route path="/birthday-flower-delivery-ghaziabad" element={
//   <OccasionPage
//     pageTitle="Birthday Flower Delivery Ghaziabad | Rose n Petals"
//     occasionName="Birthday"
//     occasionEmoji="🎂"
//     mainKeyword="Birthday Flower Delivery Ghaziabad"
//     headline="Surprise Them with a Birthday Bouquet in Ghaziabad"
//     subheadline="Fresh, handmade bouquets delivered same day. Starting ₹200."
//     whatsappMessage="Hi! I want to order a birthday bouquet in Ghaziabad."
//     occasionSection={{
//       headline: "Make Their Birthday One to Remember",
//       text: "A surprise bouquet says more than a text message ever could ...",
//       callout: "Delivered fresh, on time, every time."
//     }}
//     faqs={[ ... ]}
//   />
// } />
