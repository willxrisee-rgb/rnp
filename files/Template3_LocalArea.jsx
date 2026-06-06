// ─────────────────────────────────────────────────────────────────────────────
// Template 3 — Local / Area Page
// ─────────────────────────────────────────────────────────────────────────────
// USE FOR keywords like:
//   "flower delivery Indirapuram"             → /flower-delivery-indirapuram
//   "flower delivery Vaishali Ghaziabad"      → /flower-delivery-vaishali-ghaziabad
//   "flower delivery Vasundhara Ghaziabad"    → /flower-delivery-vasundhara-ghaziabad
//   "flower delivery Raj Nagar Ghaziabad"     → /flower-delivery-raj-nagar-ghaziabad
//   "flower delivery Kavi Nagar Ghaziabad"    → /flower-delivery-kavi-nagar-ghaziabad
//   "local florist Indirapuram"               → /local-florist-indirapuram
//
// KEY DIFFERENCE from Template 1:
//   → Area name appears in h1, trust signals, and SEO schema.
//   → Adds a "Local Delivery Proof" section with specific delivery time for that area.
//   → Nearby areas section for lateral internal linking.
//   → FAQs are area-specific (delivery time, coverage radius, etc.)
//
// IMPORT CSS: <link rel="stylesheet" href="/rnp-templates.css" />
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

// ── DEFAULT PROPS ─────────────────────────────────────────────────────────────

const DEFAULTS = {
  pageTitle:       '[PAGE TITLE — e.g. "Flower Delivery in Indirapuram | Rose n Petals"]',
  mainKeyword:     '[KEYWORD — e.g. "Flower Delivery Indirapuram"]',

  // The local area — used throughout headings, copy, schema
  areaName:        '[AREA NAME — e.g. "Indirapuram"]',
  cityName:        'Ghaziabad',

  // Hero copy — area-first, then service
  headline:        '[H1 — e.g. "Flower Delivery in Indirapuram — Fresh Bouquets from ₹200"]',
  subheadline:     '[Subheadline — e.g. "Fast delivery to Indirapuram · Handmade bouquets · WhatsApp order"]',
  startingPrice:   '₹200',

  // How fast we deliver to this specific area
  deliveryTime:    '[DELIVERY TIME — e.g. "2–4 hours"]',

  // Delivery proof — specific to this area, builds local trust
  // 2–3 short items that prove you actually serve this area
  deliveryProof: [
    { icon: '📍', text: '[e.g. We deliver directly to Indirapuram from our Kavi Nagar shop]' },
    { icon: '⏱️', text: '[e.g. Average delivery time: 2–4 hours to Indirapuram]' },
    { icon: '📞', text: '[e.g. Local WhatsApp support — call or chat anytime]' },
  ],

  // WhatsApp CTA
  ctaText:         'Order on WhatsApp',
  whatsappNumber:  '917289996804',
  whatsappMessage: '[Pre-filled WA — e.g. "Hi! I want flower delivery in Indirapuram."]',

  // Trust benefits
  benefits: [
    { icon: '🌹', title: '[Benefit 1]', text: '[e.g. Fresh handmade bouquets daily]' },
    { icon: '⚡', title: '[Benefit 2]', text: '[e.g. Fast local delivery]' },
    { icon: '💰', title: '[Benefit 3]', text: '[e.g. Starting ₹200]' },
    { icon: '📲', title: '[Benefit 4]', text: '[e.g. Easy WhatsApp order]' },
  ],

  // Other areas we cover — shown as cross-links (lateral internal links)
  nearbyAreas: [
    { label: 'Vaishali',   href: '/flower-delivery-vaishali-ghaziabad' },
    { label: 'Vasundhara', href: '/flower-delivery-vasundhara-ghaziabad' },
    { label: 'Raj Nagar',  href: '/flower-delivery-raj-nagar-ghaziabad' },
    { label: 'Kavi Nagar', href: '/flower-delivery-kavi-nagar-ghaziabad' },
    { label: 'Mohan Nagar',href: '/flower-delivery-mohan-nagar-ghaziabad' },
  ],

  // How it works — identical across all local pages (reuse same data object)
  steps: [
    { number: '01', title: '[Step 1]', text: '[e.g. Browse our bouquets below]' },
    { number: '02', title: '[Step 2]', text: '[e.g. WhatsApp us your address in {areaName}]' },
    { number: '03', title: '[Step 3]', text: '[e.g. We deliver fresh, on time]' },
  ],

  // FAQs — area-specific
  faqs: [
    { q: '[e.g. Do you deliver to all parts of Indirapuram?]',      a: '[Answer]' },
    { q: '[e.g. How long does delivery take to Indirapuram?]',      a: '[Answer — reference deliveryTime]' },
    { q: '[e.g. Is same-day delivery available in Indirapuram?]',   a: '[Answer]' },
    { q: '[e.g. What is the minimum order for Indirapuram delivery?]', a: '[Answer]' },
  ],
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function LocalAreaPage(props) {
  const p = { ...DEFAULTS, ...props };
  const waLink = `https://api.whatsapp.com/send?phone=${p.whatsappNumber}&text=${encodeURIComponent(p.whatsappMessage)}`;

  // Interpolate {areaName} in step text if needed
  const renderStep = (text) => text.replace('{areaName}', p.areaName);

  return (
    <>
      {/*
        ── SEO HEAD ─────────────────────────────────────────────────────────────
        <title>{p.pageTitle}</title>
        <meta name="description" content={p.metaDescription} />
        <link rel="canonical" href={p.canonicalUrl} />

        JSON-LD: LocalBusiness schema with serviceArea pointing to {areaName}.
        This is the most important schema for local SEO.
        Example:
        {
          "@type": "LocalBusiness",
          "name": "Rose n Petals",
          "address": { "@type": "PostalAddress", "addressLocality": "Ghaziabad" },
          "areaServed": { "@type": "City", "name": "areaName" }
        }
      */}

      <main className="rnp-page rnp-page--local">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        {/*
          Area name must appear in the h1.
          The delivery time badge is a key trust signal for local pages.
        */}
        <section className="rnp-hero rnp-hero--local" aria-label="Hero">
          <div className="rnp-hero__copy">
            {/* Local trust badge — shows how fast you deliver to this area */}
            <span className="rnp-hero__local-badge">
              📍 Delivering to {p.areaName} in {p.deliveryTime}
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
          </div>
          {/* ── Plug in your product image here ── */}
          <div className="rnp-hero__media" aria-hidden="true">
            <div className="rnp-placeholder rnp-placeholder--hero">[BOUQUET IMAGE]</div>
          </div>
        </section>

        {/* ── LOCAL DELIVERY PROOF ──────────────────────────────────────────── */}
        {/*
          This section is the key differentiator for local pages.
          It answers: "Can they ACTUALLY deliver to MY area?"
          Be specific: mention the area name, real delivery time, and your address.
        */}
        <section className="rnp-section rnp-local-proof" aria-labelledby="local-h2">
          <h2 id="local-h2" className="rnp-section__h2">
            {/* e.g. "Why Order Flowers from Rose n Petals in Indirapuram?" */}
            Flower Delivery in {p.areaName} — Why Choose Us
          </h2>
          <ul className="rnp-local-proof__list" role="list">
            {p.deliveryProof.map((item, i) => (
              <li key={i} className="rnp-local-proof__item">
                <span className="rnp-local-proof__icon" aria-hidden="true">{item.icon}</span>
                <span className="rnp-local-proof__text">{item.text}</span>
              </li>
            ))}
          </ul>
          {/* Optional: embed a Google Maps iframe showing your shop → delivery area */}
          <div className="rnp-local-proof__map-slot">
            {/*
              OPTIONAL MAP:
              <iframe
                title={`Rose n Petals delivery area map — ${p.areaName}`}
                src="https://www.google.com/maps/embed?pb=..."
                width="100%" height="300" loading="lazy"
              />
            */}
            <div className="rnp-placeholder rnp-placeholder--map">[OPTIONAL: Google Maps embed]</div>
          </div>
        </section>

        {/* ── PRODUCT GRID ──────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-products" aria-labelledby="products-h2">
          <h2 id="products-h2" className="rnp-section__h2">
            {/* e.g. "Order Bouquets Delivered to Indirapuram" */}
            Bouquets Delivered to {p.areaName}
          </h2>
          <div className="rnp-products__grid">
            {/* REPLACE WITH: <ProductGrid limit={6} /> */}
            <div className="rnp-placeholder">[PRODUCT GRID COMPONENT]</div>
          </div>
          <div className="rnp-section__footer">
            <a className="rnp-btn rnp-btn--ghost" href="/catalog">View All Bouquets →</a>
          </div>
        </section>

        {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
        <section className="rnp-trust-bar" aria-label="Why order from us">
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
            How to Order Flowers to {p.areaName}
          </h2>
          <ol className="rnp-steps__list" role="list">
            {p.steps.map((s, i) => (
              <li key={i} className="rnp-steps__item">
                <span className="rnp-steps__num" aria-hidden="true">{s.number}</span>
                <div>
                  <h3 className="rnp-steps__title">{s.title}</h3>
                  <p className="rnp-steps__text">{renderStep(s.text)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── FAQs ──────────────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
          <h2 id="faqs-h2" className="rnp-section__h2">
            FAQs — Flower Delivery in {p.areaName}
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

        {/* ── NEARBY AREAS ──────────────────────────────────────────────────── */}
        {/*
          Lateral internal links to other local area pages.
          Critical for crawl depth and distributing link equity across local pages.
        */}
        <section className="rnp-section rnp-nearby" aria-labelledby="nearby-h2">
          <h2 id="nearby-h2" className="rnp-section__h2">
            We Also Deliver to Nearby Areas
          </h2>
          <ul className="rnp-nearby__list" role="list">
            {p.nearbyAreas.map((area, i) => (
              <li key={i} className="rnp-nearby__item">
                <a className="rnp-btn rnp-btn--ghost rnp-btn--sm" href={area.href}>
                  🌸 {area.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-cta-block" aria-label="Order now">
          <h2 className="rnp-cta-block__h2">
            {/* e.g. "Order Fresh Flowers in Indirapuram Today" */}
            Order Fresh Flowers in {p.areaName} Today
          </h2>
          <p className="rnp-cta-block__sub">
            {/* e.g. "Delivered in 2–4 hours · Starting ₹200 · WhatsApp order" */}
            Delivered in {p.deliveryTime} · Starting {p.startingPrice} · Easy WhatsApp order
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

export default LocalAreaPage;

// ─────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLE — create one route per area, reuse the same template:
// ─────────────────────────────────────────────────────────────────────────────
//
// import LocalAreaPage from './Template3_LocalArea';
// import { LOCAL_AREA_DEFAULTS } from './content/localDefaults'; // shared steps/benefits
//
// <Route path="/flower-delivery-indirapuram" element={
//   <LocalAreaPage
//     {...LOCAL_AREA_DEFAULTS}         // shared data (steps, benefits, etc.)
//     pageTitle="Flower Delivery in Indirapuram | Rose n Petals"
//     areaName="Indirapuram"
//     headline="Flower Delivery in Indirapuram — Fresh Bouquets from ₹200"
//     subheadline="Same-day delivery to Indirapuram · Handmade bouquets · WhatsApp order"
//     deliveryTime="2–4 hours"
//     whatsappMessage="Hi! I want flower delivery in Indirapuram."
//     deliveryProof={[ ... indirapuram-specific proof ... ]}
//     faqs={[ ... indirapuram-specific FAQs ... ]}
//   />
// } />
//
// TIP: Store shared data (steps, benefits, areas) in a localDefaults.js file
// and spread it into each area page. Only override area-specific fields.
