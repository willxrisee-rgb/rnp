// ─────────────────────────────────────────────────────────────────────────────
// Template 4 — Urgency / Express Delivery Page
// ─────────────────────────────────────────────────────────────────────────────
// USE FOR keywords like:
//   "same day flower delivery Ghaziabad"     → /same-day-flower-delivery-ghaziabad
//   "2 hour flower delivery Ghaziabad"        → /2-hour-flower-delivery-ghaziabad
//   "midnight flower delivery Ghaziabad"      → /midnight-flower-delivery-ghaziabad
//   "express flower delivery Ghaziabad"       → /express-flower-delivery-ghaziabad
//   "same day bouquet delivery Ghaziabad"     → /same-day-bouquet-delivery-ghaziabad
//
// KEY DIFFERENCES from other templates:
//   → Every section reinforces speed and reliability — this is a confidence page.
//   → Hero has a prominent delivery promise badge (e.g. "Order by 6 PM → delivered today").
//   → "How fast it works" replaces the generic "How it works" with time-specific steps.
//   → Urgency FAQs address cut-off times, late orders, midnight availability.
//   → Bottom CTA has maximum urgency copy.
//
// IMPORT CSS: <link rel="stylesheet" href="/rnp-templates.css" />
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

// ── DEFAULT PROPS ─────────────────────────────────────────────────────────────

const DEFAULTS = {
  pageTitle:        '[PAGE TITLE — e.g. "Same Day Flower Delivery Ghaziabad | Rose n Petals"]',
  mainKeyword:      '[KEYWORD — e.g. "Same Day Flower Delivery Ghaziabad"]',

  // Urgency type — drives copy variations across the page
  // One of: 'same-day' | '2-hour' | 'midnight' | 'express'
  urgencyType:      'same-day',

  // The big promise shown in the hero badge
  // This is the single most important trust signal on the page
  deliveryPromise:  '[PROMISE — e.g. "Order by 6 PM → Delivered Today"]',

  // A one-line cutoff rule shown prominently near CTA
  cutoffTime:       '[CUTOFF — e.g. "Order before 6 PM for same-day delivery"]',

  // A hard guarantee (only add if you can back it up)
  guaranteeText:    '[GUARANTEE — e.g. "If we miss the slot, we'll call you. No hidden delays."]',

  // Hero copy — speed is the #1 message
  headline:         '[H1 — e.g. "Same Day Flower Delivery in Ghaziabad"]',
  subheadline:      '[Subheadline — e.g. "Order by 6 PM and your bouquet arrives today. Starting ₹200."]',
  startingPrice:    '₹200',

  // WhatsApp CTA
  ctaText:          'Order on WhatsApp Now',
  whatsappNumber:   '917289996804',
  whatsappMessage:  '[Pre-filled WA — e.g. "Hi! I need same-day flower delivery in Ghaziabad."]',

  // Speed proof — 3 specific, credible signals that back up the speed claim
  speedProof: [
    {
      icon:  '⚡',
      stat:  '[e.g. "2–4 hrs"]',
      label: '[e.g. "Average delivery time"]',
      note:  '[e.g. "Across Ghaziabad"]',
    },
    {
      icon:  '📦',
      stat:  '[e.g. "6 PM"]',
      label: '[e.g. "Same-day order cutoff"]',
      note:  '[e.g. "7 days a week"]',
    },
    {
      icon:  '🌙',
      stat:  '[e.g. "12 AM"]',
      label: '[e.g. "Midnight delivery available"]',
      note:  '[e.g. "With advance order"]',
    },
  ],

  // Trust benefits
  benefits: [
    { icon: '🌹', title: '[Benefit 1]', text: '[e.g. Freshly made, not pre-packaged]' },
    { icon: '⚡', title: '[Benefit 2]', text: '[e.g. Fastest delivery in Ghaziabad]' },
    { icon: '💰', title: '[Benefit 3]', text: '[e.g. Same price as standard — no surge]' },
    { icon: '📲', title: '[Benefit 4]', text: '[e.g. Confirm your slot on WhatsApp]' },
  ],

  // Delivery coverage
  areas: [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
  ],

  // Urgency-specific steps — include time references
  steps: [
    {
      number: '01',
      title:  '[Step 1 — e.g. "WhatsApp us your order"]',
      text:   '[e.g. "Send us your bouquet choice, address, and delivery time on WhatsApp"]',
      time:   '[e.g. "Takes 2 minutes"]',
    },
    {
      number: '02',
      title:  '[Step 2 — e.g. "We confirm your slot"]',
      text:   '[e.g. "We confirm availability for your requested time and prepare fresh"]',
      time:   '[e.g. "Within 15 minutes"]',
    },
    {
      number: '03',
      title:  '[Step 3 — e.g. "Delivered to your door"]',
      text:   '[e.g. "Your bouquet is delivered fresh at your requested time"]',
      time:   '[e.g. "2–4 hours from order"]',
    },
  ],

  // Urgency-specific FAQs — cut-off times, midnight slots, etc.
  faqs: [
    { q: '[e.g. What is the cut-off time for same-day delivery?]',         a: '[Answer]' },
    { q: '[e.g. Do you charge extra for express or midnight delivery?]',    a: '[Answer]' },
    { q: '[e.g. What if I order after the same-day cut-off time?]',         a: '[Answer]' },
    { q: '[e.g. Can I pick a specific delivery time slot?]',                a: '[Answer]' },
    { q: '[e.g. Is midnight flower delivery available every day?]',         a: '[Answer]' },
  ],

  // Cross-links to other urgency variants
  relatedUrgency: [
    { label: '2 Hour Delivery',    href: '/2-hour-flower-delivery-ghaziabad' },
    { label: 'Midnight Delivery',  href: '/midnight-flower-delivery-ghaziabad' },
    { label: 'Express Delivery',   href: '/express-flower-delivery-ghaziabad' },
  ],
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function UrgencyPage(props) {
  const p = { ...DEFAULTS, ...props };
  const waLink = `https://api.whatsapp.com/send?phone=${p.whatsappNumber}&text=${encodeURIComponent(p.whatsappMessage)}`;

  return (
    <>
      {/*
        ── SEO HEAD ─────────────────────────────────────────────────────────────
        <title>{p.pageTitle}</title>
        <meta name="description" content={p.metaDescription} />
        <link rel="canonical" href={p.canonicalUrl} />

        JSON-LD: LocalBusiness schema + FAQPage schema.
        For midnight/express, consider openingHours to signal extended hours.
      */}

      <main className="rnp-page rnp-page--urgency">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        {/*
          The delivery promise badge is the #1 element on this page.
          Must be above the fold. WhatsApp CTA immediately below.
          No fluff between the badge and the CTA.
        */}
        <section className="rnp-hero rnp-hero--urgency" aria-label="Hero">
          <div className="rnp-hero__copy">
            {/* ── THE PROMISE BADGE — most important element ── */}
            <div className="rnp-hero__promise-badge" role="status">
              ⚡ {p.deliveryPromise}
            </div>
            <h1 className="rnp-hero__h1">{p.headline}</h1>
            <p className="rnp-hero__sub">{p.subheadline}</p>
            <p className="rnp-hero__price">Starting at <strong>{p.startingPrice}</strong></p>
            {/* ── CTA with cutoff copy just below it ── */}
            <a
              className="rnp-btn rnp-btn--wa rnp-btn--lg"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.ctaText}
            </a>
            {p.cutoffTime && (
              <p className="rnp-hero__cutoff">⏰ {p.cutoffTime}</p>
            )}
          </div>
          <div className="rnp-hero__media" aria-hidden="true">
            <div className="rnp-placeholder rnp-placeholder--hero">[URGENT DELIVERY HERO IMAGE]</div>
          </div>
        </section>

        {/* ── SPEED PROOF STRIP ─────────────────────────────────────────────── */}
        {/*
          Stats-based trust section — backs up the speed claim with specifics.
          Three stat cards: delivery time / cut-off time / midnight availability.
        */}
        <section className="rnp-section rnp-speed-proof" aria-label="Delivery speed proof">
          <ul className="rnp-speed-proof__list" role="list">
            {p.speedProof.map((item, i) => (
              <li key={i} className="rnp-speed-proof__item">
                <span className="rnp-speed-proof__icon" aria-hidden="true">{item.icon}</span>
                <strong className="rnp-speed-proof__stat">{item.stat}</strong>
                <span className="rnp-speed-proof__label">{item.label}</span>
                <span className="rnp-speed-proof__note">{item.note}</span>
              </li>
            ))}
          </ul>
          {p.guaranteeText && (
            <p className="rnp-speed-proof__guarantee">✅ {p.guaranteeText}</p>
          )}
        </section>

        {/* ── PRODUCT GRID ──────────────────────────────────────────────────── */}
        {/*
          Show only products available for fast delivery.
          If all products qualify, show your 4–6 best sellers.
          Label them "Available for same-day delivery" or similar.
        */}
        <section className="rnp-section rnp-products" aria-labelledby="products-h2">
          <h2 id="products-h2" className="rnp-section__h2">
            {/* e.g. "Bouquets Available for Same Day Delivery in Ghaziabad" */}
            [H2 — Products available for {p.urgencyType} delivery]
          </h2>
          <div className="rnp-products__grid">
            {/* REPLACE WITH: <ProductGrid tag="express" limit={6} /> */}
            <div className="rnp-placeholder">[PRODUCT GRID — AVAILABLE FOR QUICK DELIVERY]</div>
          </div>
          <div className="rnp-section__footer">
            <a className="rnp-btn rnp-btn--ghost" href="/catalog">See All Bouquets →</a>
          </div>
        </section>

        {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
        <section className="rnp-trust-bar" aria-label="Why our express delivery is reliable">
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

        {/* ── HOW FAST ORDERING WORKS ───────────────────────────────────────── */}
        {/*
          Time-stamped steps — the "time" field on each step reinforces speed.
        */}
        <section className="rnp-section rnp-steps rnp-steps--urgency" aria-labelledby="steps-h2" id="how-it-works">
          <h2 id="steps-h2" className="rnp-section__h2">
            How Express Ordering Works — Step by Step
          </h2>
          <ol className="rnp-steps__list" role="list">
            {p.steps.map((s, i) => (
              <li key={i} className="rnp-steps__item">
                <span className="rnp-steps__num" aria-hidden="true">{s.number}</span>
                <div>
                  <h3 className="rnp-steps__title">{s.title}</h3>
                  <p className="rnp-steps__text">{s.text}</p>
                  {s.time && (
                    <span className="rnp-steps__time-badge">⏱ {s.time}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── AREAS COVERED ─────────────────────────────────────────────────── */}
        <section className="rnp-section rnp-areas" aria-labelledby="areas-h2">
          <h2 id="areas-h2" className="rnp-section__h2">
            Express Delivery Available Across Ghaziabad
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
            Express Delivery — Common Questions
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

        {/* ── RELATED URGENCY TYPES ─────────────────────────────────────────── */}
        {/*
          Cross-link between same-day / 2-hour / midnight / express pages.
          Good internal linking + helps users self-select their urgency level.
        */}
        {p.relatedUrgency && p.relatedUrgency.length > 0 && (
          <section className="rnp-section rnp-related" aria-labelledby="related-h2">
            <h2 id="related-h2" className="rnp-section__h2">Other Delivery Options</h2>
            <ul className="rnp-related__list" role="list">
              {p.relatedUrgency.map((item, i) => (
                <li key={i} className="rnp-related__item">
                  <a className="rnp-btn rnp-btn--ghost rnp-btn--sm" href={item.href}>
                    ⚡ {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── BOTTOM CTA — MAXIMUM URGENCY ──────────────────────────────────── */}
        {/*
          Last chance to convert. Repeat the promise + cutoff time.
          This section captures users who scrolled through and are now convinced.
        */}
        <section className="rnp-section rnp-cta-block rnp-cta-block--urgency" aria-label="Order now">
          <div className="rnp-cta-block__promise">{p.deliveryPromise}</div>
          <h2 className="rnp-cta-block__h2">
            {/* e.g. "Order Now — Same Day Delivery in Ghaziabad" */}
            [CTA H2 — keyword + urgency + action]
          </h2>
          <p className="rnp-cta-block__sub">
            {p.cutoffTime && <span>{p.cutoffTime} · </span>}
            Starting {p.startingPrice} · Easy WhatsApp order
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

export default UrgencyPage;

// ─────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLES — one route per urgency type:
// ─────────────────────────────────────────────────────────────────────────────
//
// import UrgencyPage from './Template4_Urgency';
// import { URGENCY_DEFAULTS } from './content/urgencyDefaults'; // shared data
//
// <Route path="/same-day-flower-delivery-ghaziabad" element={
//   <UrgencyPage
//     {...URGENCY_DEFAULTS}
//     pageTitle="Same Day Flower Delivery Ghaziabad | Rose n Petals"
//     urgencyType="same-day"
//     deliveryPromise="Order by 6 PM → Delivered Today"
//     cutoffTime="Order before 6 PM for same-day delivery"
//     headline="Same Day Flower Delivery in Ghaziabad"
//     subheadline="Order now, delivered fresh today. Starting ₹200."
//     whatsappMessage="Hi! I need same-day flower delivery in Ghaziabad."
//   />
// } />
//
// <Route path="/midnight-flower-delivery-ghaziabad" element={
//   <UrgencyPage
//     {...URGENCY_DEFAULTS}
//     pageTitle="Midnight Flower Delivery Ghaziabad | Rose n Petals"
//     urgencyType="midnight"
//     deliveryPromise="Midnight Delivery — Book Your Slot Now"
//     cutoffTime="Order by 10 PM for midnight delivery"
//     headline="Midnight Flower Delivery in Ghaziabad"
//     subheadline="Surprise them at midnight. Fresh bouquets delivered between 11 PM – 1 AM."
//     whatsappMessage="Hi! I need midnight flower delivery in Ghaziabad."
//   />
// } />
