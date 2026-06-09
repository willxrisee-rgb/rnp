# Rose n Petals — PHASE 4: Landing Page Content Quality
# File: ~/Documents/rnp/PHASE4_LANDING_CONTENT.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first.
3. Do NOT implement until plan is confirmed.
4. Do NOT change server routes, sitemap.xml,
   robots.txt, homepage, policies page, or CSS
   beyond what is listed here.

---

## CONTEXT

Each landing page currently uses a template that:
1. Sets the correct unique title and H1 (server rendered)
2. Loads the page body content via JavaScript

Google can see the title and H1 but the main
text content (FAQs, area description, bouquet list)
only appears after JavaScript runs.

This change adds a static HTML content block to
the landing-page.html template so Google sees
real text content on first load, before any JS runs.

---

## CHANGE 1 — Add static content block to
             landing-page.html template

In landing-page.html, find the <main> tag:
<main id="app" class="app-main"></main>

Replace it with this:
<main id="app" class="app-main">
  <section class="lp-static-intro">
    <div class="lp-static-inner">
      <h1>{{H1}}</h1>
      <p class="lp-lead">{{LEAD_TEXT}}</p>
      <div class="lp-trust-row">
        <span>✦ Delivered in under 1 hour</span>
        <span>✦ Starting from ₹200</span>
        <span>✦ Order on WhatsApp</span>
        <span>✦ Fresh handmade bouquets</span>
      </div>
      
        href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet.%20Please%20help%20me."
        class="lp-whatsapp-btn"
        rel="noopener noreferrer">
        Order on WhatsApp — +91 7289996804
      </a>
    </div>
  </section>
</main>

---

## CHANGE 2 — Add {{H1}} and {{LEAD_TEXT}} tokens
             to serveLandingPage function in server.js

The serveLandingPage function currently injects
these tokens: PAGE_TITLE, META_DESCRIPTION,
CANONICAL_URL, BREADCRUMB_SCHEMA, PAGE_SLUG

Add two new tokens: H1 and LEAD_TEXT

Update the function to also replace {{H1}} and
{{LEAD_TEXT}} in the template.

---

## CHANGE 3 — Add H1 and LEAD_TEXT values to
             every landing page route in server.js

For each of the 36 routes, add h1 and leadText
values as shown in these examples. Follow the
same pattern for all 36 routes.

BATCH 1 EXAMPLES:

/flower-delivery-ghaziabad:
h1: "Flower Delivery in Ghaziabad"
leadText: "Rose n Petals delivers fresh handmade bouquets across all of Ghaziabad in under 1 hour. Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara and more. Orders via WhatsApp — no app needed. Starting from ₹200."

/same-day-flower-delivery-ghaziabad:
h1: "Same Day Flower Delivery in Ghaziabad"
leadText: "Need flowers delivered today in Ghaziabad? We offer same-day delivery in under 1 hour for orders placed before 9 PM. WhatsApp us your order — bouquets start from ₹200."

/birthday-flowers-ghaziabad:
h1: "Birthday Flowers in Ghaziabad"
leadText: "Surprise someone special with fresh birthday flowers delivered in Ghaziabad in under 1 hour. Handmade birthday bouquets starting from ₹200. Order on WhatsApp — fast, simple, and personal."

/anniversary-flowers-ghaziabad:
h1: "Anniversary Flowers in Ghaziabad"
leadText: "Celebrate your anniversary with beautiful fresh flowers delivered anywhere in Ghaziabad in under 1 hour. Romantic bouquets starting from ₹200. WhatsApp us to order."

/flower-delivery-indirapuram:
h1: "Flower Delivery in Indirapuram, Ghaziabad"
leadText: "Rose n Petals delivers fresh bouquets to Indirapuram in under 1 hour. We cover all sectors and societies in Indirapuram. Handmade bouquets from ₹200. Order on WhatsApp."

/flower-delivery-vaishali-ghaziabad:
h1: "Flower Delivery in Vaishali, Ghaziabad"
leadText: "Get fresh flowers delivered to your door in Vaishali, Ghaziabad in under 1 hour. Rose n Petals serves all of Vaishali Sector 1, 2, 3, 4, 5 and 6. Bouquets from ₹200."

/flower-delivery-raj-nagar-ghaziabad:
h1: "Flower Delivery in Raj Nagar, Ghaziabad"
leadText: "Fresh bouquet delivery in Raj Nagar and Raj Nagar Extension, Ghaziabad. Delivered in under 1 hour by Rose n Petals. Handmade bouquets starting from ₹200."

/flower-delivery-kavi-nagar-ghaziabad:
h1: "Flower Delivery in Kavi Nagar, Ghaziabad"
leadText: "Rose n Petals is your local florist in Kavi Nagar, Ghaziabad. We are based in KD Market, Sector 18, Kavi Nagar and deliver fresh handmade bouquets starting from ₹200."

For all other 28 routes, follow the same pattern:
- H1 = the main keyword phrase for that page
- leadText = 2-3 sentences describing the service
  for that specific page, mentioning Ghaziabad,
  the area or occasion, under 1 hour, and ₹200.
  Write natural sentences, not keyword stuffing.

---

## CHANGE 4 — Add CSS for the static intro block

Add to css/styles.css:

.lp-static-intro {
  background: #FFF5F5;
  border-bottom: 1px solid #FDDEDE;
  padding: 48px 20px 40px 20px;
}

.lp-static-inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.lp-static-inner h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 16px;
  line-height: 1.2;
}

.lp-lead {
  font-size: 16px;
  color: #444444;
  line-height: 1.7;
  margin-bottom: 24px;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.lp-trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 28px;
  font-size: 13px;
  color: #CC0000;
  font-weight: 500;
}

.lp-whatsapp-btn {
  display: inline-block;
  background: #CC0000;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
}

.lp-whatsapp-btn:hover {
  background: #AA0000;
}

@media (max-width: 767px) {
  .lp-static-inner h1 {
    font-size: 24px;
  }
  .lp-lead {
    font-size: 14px;
  }
  .lp-trust-row {
    gap: 10px;
    font-size: 12px;
  }
}

---

## VERIFICATION CHECKLIST

[ ] 1. Visit rosenpetals.com/birthday-flowers-ghaziabad
       The page must show the H1 "Birthday Flowers in
       Ghaziabad" BEFORE any JS loads (right-click →
       View Page Source → search for the H1 text —
       it must be in the raw HTML source)
[ ] 2. The static intro section is visible on desktop
[ ] 3. The static intro section looks correct on mobile
[ ] 4. The trust row (4 ✦ items) is visible
[ ] 5. The WhatsApp button works on the landing page
[ ] 6. Test 5 different landing pages — all show
       their unique H1 and leadText in page source
[ ] 7. The JS-loaded content (bouquet cards, accordions)
       still loads below the static intro section
[ ] 8. No homepage, policies page, or other page changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Verify all 8 items when done.