// ─────────────────────────────────────────────────────────────────────────────
// Template 1 — Core / General Service Page
// ─────────────────────────────────────────────────────────────────────────────
// USE FOR keywords like:
//   "flower delivery Ghaziabad"       → /flower-delivery-ghaziabad
//   "online flower delivery Ghaziabad" → /online-flower-delivery-ghaziabad
//   "bouquet delivery Ghaziabad"       → /bouquet-delivery-ghaziabad
//   "send flowers to Ghaziabad"        → /send-flowers-ghaziabad
//   "order flowers online Ghaziabad"   → /order-flowers-online-ghaziabad
//
// IMPORT CSS: <link rel="stylesheet" href="/rnp-templates.css" />
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

// ── DEFAULT PROPS ─────────────────────────────────────────────────────────────
// All keys below are placeholders. Pass real values when you call the component.
// Example usage at bottom of this file.

const DEFAULTS = {
  // <title> tag — wire up via your helmet/head solution
  pageTitle:      '[PAGE TITLE — e.g. "Flower Delivery Ghaziabad | Rose n Petals"]',

  // The exact target keyword — used in SEO-sensitive spots (h1, breadcrumb)
  mainKeyword:    '[MAIN KEYWORD — e.g. "Flower Delivery Ghaziabad"]',

  // Hero copy
  headline:       '[H1 — exact keyword phrase, emotional spin — e.g. "Fresh Flower Delivery in Ghaziabad, Starting ₹200"]',
  subheadline:    '[Subheadline — one emotional support line — e.g. "Handmade bouquets delivered same day across Ghaziabad"]',
  startingPrice:  '₹200',

  // WhatsApp CTA
  ctaText:        'Order on WhatsApp',
  whatsappNumber: '917289996804', // no + or spaces
  whatsappMessage:'[Pre-filled WA message — e.g. "Hi! I want to order a bouquet."]',

  // Trust bar — 3-4 short proof points shown below hero
  benefits: [
    { icon: '🌹', title: '[Benefit 1 title]', text: '[e.g. Fresh, handmade daily]' },
    { icon: '⚡', title: '[Benefit 2 title]', text: '[e.g. Same-day delivery]' },
    { icon: '💰', title: '[Benefit 3 title]', text: '[e.g. Starting ₹200]' },
    { icon: '📲', title: '[Benefit 4 title]', text: '[e.g. Easy WhatsApp ordering]' },
  ],

  // Delivery coverage — shown as pill grid
  areas: [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
  ],

  // How it works — 3 ordered steps
  steps: [
    { number: '01', title: '[Step 1 title]', text: '[e.g. Browse bouquets below or on Instagram]' },
    { number: '02', title: '[Step 2 title]', text: '[e.g. WhatsApp us your choice + address]' },
    { number: '03', title: '[Step 3 title]', text: '[e.g. We deliver fresh to your door]' },
  ],

  // FAQs — <details>/<summary> accordion, no JS needed
  faqs: [
    { q: '[FAQ 1 — e.g. Which areas in Ghaziabad do you deliver to?]', a: '[Answer]' },
    { q: '[FAQ 2 — e.g. What is the minimum order?]', a: '[Answer]' },
    { q: '[FAQ 3 — e.g. How do I pay?]', a: '[Answer — UPI / Bank Transfer, no CoD]' },
    { q: '[FAQ 4 — e.g. Can I schedule a delivery time?]', a: '[Answer]' },
  ],
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function CoreServicePage(props) {
  const p = { ...DEFAULTS, ...props };
  const waLink = `https://api.whatsapp.com/send?phone=${p.whatsappNumber}&text=${encodeURIComponent(p.whatsappMessage)}`;

  return (
    <>
      {/*
        ── SEO HEAD ────────────────────────────────────────────────────────────
        Wire up pageTitle + metaDescription via react-helmet or your <Head>:
          <title>{p.pageTitle}</title>
          <meta name="description" content={p.metaDescription} />
          <link rel="canonical" href={p.canonicalUrl} />

        JSON-LD schema — paste into a <script type="application/ld+json"> tag:
          LocalBusiness schema with address, phone, openingHours
      */}

      <main className="rnp-page rnp-page--core">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        {/*
          The h1 must contain the exact target keyword.
          Keep it above the fold. WhatsApp CTA must be visible without scrolling.
        */}
        <section className="rnp-hero" aria-label="Hero">
          <div className="rnp-hero__copy">
            <h1 className="rnp-hero__h1">{p.headline}</h1>
            <p className="rnp-hero__sub">{p.subheadline}</p>
            <p className="rnp-hero__price">Starting at <strong>{p.startingPrice}</strong></p>
            <a
              className="rnp-btn rnp-btn--wa rnp-btn--lg"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.ctaText} — opens WhatsApp`}
            >
              {p.ctaText}
            </a>
          </div>
          {/* ── Plug in your hero / product showcase image here ── */}
          <div className="rnp-hero__media" aria-hidden="true">
            {/* <img src={p.heroImage} alt={p.heroImageAlt} /> */}
            <div className="rnp-placeholder rnp-placeholder--hero">[HERO BOUQUET IMAGE]</div>
          </div>
        </section>

        {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
        {/*
          Short proof strip: icons + one-liners.
          Converts fence-sitters right after the hero.
        */}
        <section className="rnp-trust-bar" aria-label="Why Rose n Petals">
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

        {/* ── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
        {/*
          Drop your existing product/catalog component here.
          For core pages, show your 4-6 best sellers.
        */}
        <section className="rnp-section rnp-products" aria-labelledby="products-h2">
          <h2 id="products-h2" className="rnp-section__h2">
            {/* e.g. "Our Most-Loved Bouquets in Ghaziabad" */}
            [H2 — Products section headline — include keyword naturally]
          </h2>
          <div className="rnp-products__grid">
            {/* ── REPLACE WITH: <ProductGrid limit={6} /> or <Catalog filter="bestseller" /> ── */}
            <div className="rnp-placeholder">[PRODUCT GRID COMPONENT]</div>
          </div>
          <div className="rnp-section__footer">
            <a className="rnp-btn rnp-btn--ghost" href="/catalog">View All Bouquets →</a>
          </div>
        </section>

        {/* ── AREAS COVERED ─────────────────────────────────────────────────── */}
        {/*
          Shows Google which localities you serve.
          Link each area pill to its dedicated local page (/flower-delivery-indirapuram).
        */}
        <section className="rnp-section rnp-areas" aria-labelledby="areas-h2">
          <h2 id="areas-h2" className="rnp-section__h2">
            We Deliver Flowers Across Ghaziabad
          </h2>
          <p className="rnp-areas__intro">
            {/* e.g. "From Kavi Nagar to Indirapuram — we cover all of Ghaziabad" */}
            [Supporting copy — mention coverage breadth + same-day availability]
          </p>
          <ul className="rnp-areas__grid" role="list">
            {p.areas.map((area, i) => (
              <li key={i} className="rnp-areas__pill">
                {/* Make these links if you have local area pages */}
                {/* <a href={`/flower-delivery-${area.toLowerCase().replace(' ', '-')}`}>{area}</a> */}
                {area}
              </li>
            ))}
          </ul>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
          <h2 id="steps-h2" className="rnp-section__h2">
            Order Flowers in 3 Easy Steps
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

        {/* ── FAQs ──────────────────────────────────────────────────────────── */}
        {/*
          Uses native <details>/<summary> — no JS needed, accessible by default.
          Google indexes FAQ content and may show rich results.
          Also add FAQ schema in JSON-LD for rich snippets.
        */}
        <section className="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
          <h2 id="faqs-h2" className="rnp-section__h2">Frequently Asked Questions</h2>
          <dl className="rnp-faqs__list">
            {p.faqs.map((faq, i) => (
              <details key={i} className="rnp-faqs__item">
                <summary className="rnp-faqs__q">{faq.q}</summary>
                <dd className="rnp-faqs__a">{faq.a}</dd>
              </details>
            ))}
          </dl>
        </section>

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        {/*
          Repeat the WhatsApp CTA after content — users who scroll to bottom are high intent.
        */}
        <section className="rnp-section rnp-cta-block" aria-label="Order now">
          <h2 className="rnp-cta-block__h2">
            {/* e.g. "Order Fresh Flowers in Ghaziabad Today" */}
            [CTA H2 — repeat keyword, add urgency/emotion]
          </h2>
          <p className="rnp-cta-block__sub">
            {/* e.g. "Same-day delivery available · Starting ₹200 · Easy WhatsApp order" */}
            [CTA subline — delivery time + price + ease]
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

export default CoreServicePage;

// ─────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLE (inside your router):
// ─────────────────────────────────────────────────────────────────────────────
//
// import CoreServicePage from './Template1_CoreService';
//
// <Route path="/flower-delivery-ghaziabad" element={
//   <CoreServicePage
//     pageTitle="Flower Delivery in Ghaziabad | Rose n Petals"
//     mainKeyword="Flower Delivery Ghaziabad"
//     headline="Flower Delivery in Ghaziabad — Fresh Bouquets from ₹200"
//     subheadline="Handmade, same-day delivery across all of Ghaziabad. WhatsApp order in 2 minutes."
//     startingPrice="₹200"
//     ctaText="Order on WhatsApp"
//     whatsappMessage="Hi! I want to order a bouquet for delivery in Ghaziabad."
//     benefits={[ ... ]}
//     areas={[ ... ]}
//     steps={[ ... ]}
//     faqs={[ ... ]}
//   />
// } />
