# Rose n Petals — CHUNK 2: Homepage Content + UI Refresh
# File: ~/Documents/rnp/CHUNK2_HOMEPAGE_CONTENT.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will change
   and exactly what you will change in each one.
3. Do NOT implement until plan is confirmed.
4. After implementing, go through VERIFICATION CHECKLIST.
5. Do NOT change routing, server.js, product data,
   or any SEO head tags — those are handled in Chunk 3.

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Kavi Nagar, Ghaziabad
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JS, Node.js, Express
The homepage content is rendered dynamically via js/pages.js
and js/app.js. All content changes must go into the correct
JS file that renders the homepage, not into index.html body.

---

## SECTION 1 — UI REFRESH (Homepage Only)

The current homepage UI looks basic and dated.
Modernise it using these principles:

DESIGN DIRECTION:
- Keep the existing red (#CC0000) as primary brand color
- Use clean white backgrounds with soft grey sections
- Add subtle card shadows: box-shadow: 0 2px 12px rgba(0,0,0,0.08)
- Use rounded corners: border-radius: 12px on cards and sections
- Add gentle hover effects on bouquet cards:
  transform: translateY(-4px) on hover with transition: 0.2s ease
- Use the Outfit font already loaded — it is modern enough
- Make section headings larger and bolder: font-size 28-32px
  on desktop, 22-24px on mobile
- Add more breathing room between sections:
  padding: 60px 20px on desktop, 40px 16px on mobile
- Hero section: add a subtle gradient overlay or a soft
  background pattern — keep it clean, not busy
- Trust signals bar: make it a clean horizontal strip
  with a light grey background (#F8F8F8) and subtle
  border-bottom: 1px solid #EEEEEE

DO NOT:
- Change the red brand color
- Change any fonts
- Change any routing or navigation logic
- Add any animations that slow down the page
- Change the mobile catalog grid (already fixed in Chunk 1)

---

## SECTION 2 — HERO SECTION

Find the hero section in the homepage JS/HTML.
Replace ALL text content with exactly the following:

H1 TAG:
<h1>Fresh Flower Delivery in Ghaziabad</h1>

SUBHEADLINE:
Handmade bouquets delivered to your door in under 1 hour.
Serving all of Ghaziabad — Kavi Nagar, Raj Nagar,
Indirapuram, Vaishali & more.

PRICE ANCHOR LINE (below subheadline):
Starting from ₹200 · Order on WhatsApp · No app needed

PRIMARY CTA BUTTON TEXT:
Order on WhatsApp

SECONDARY CTA BUTTON TEXT:
Browse Bouquets

IMPORTANT: Replace every instance of delivery time
on the entire homepage. Wherever the site currently
says "1 hour" or "60 minutes" or "under an hour",
standardise all of them to: "under 1 hour"

---

## SECTION 3 — TRUST SIGNALS BAR

Add a horizontal trust signals bar immediately below
the hero section and above the product catalog section.

This bar should contain 4 items displayed in a row:

Item 1: ✦ Delivered in Under 1 Hour
Item 2: ✦ Fresh Handmade Bouquets Daily
Item 3: ✦ Starting from ₹200
Item 4: ✦ Order on WhatsApp — No App Needed

STYLING:
- Background: #FFF8F8 (very light pink-white)
- Border top and bottom: 1px solid #FDDEDE
- Padding: 14px 20px
- Each item: font-size 13px, color #CC0000, font-weight 500
- Display as flexbox row, justify-content: center,
  gap: 32px
- On mobile (max-width 767px): wrap to 2x2 grid,
  gap: 12px, text-align: center

---

## SECTION 4 — DELIVERY AREA SECTION

Add a new section between the hero/trust bar and
the product catalog. Use a light grey background.

SECTION HEADING (H2):
We Deliver Across All of Ghaziabad

SECTION TEXT:
Rose n Petals delivers fresh bouquets to every corner
of Ghaziabad in under 1 hour of order confirmation.

AREA TAGS (display as pill/chip tags in a wrap row):
Kavi Nagar · Raj Nagar · Indirapuram · Vaishali ·
Vasundhara · Mohan Nagar · Vijay Nagar ·
Crossing Republik · and all surrounding areas

BELOW AREA TAGS:
Not sure if we deliver to your area?
Just WhatsApp us — if we can reach you, we will.

Same-day delivery available for orders placed before 9 PM.

STYLING FOR AREA TAGS:
- background: #FFF0F0
- border: 1px solid #FDDEDE
- color: #CC0000
- border-radius: 20px
- padding: 6px 14px
- font-size: 13px
- display: inline-flex, flex-wrap: wrap, gap: 8px

---

## SECTION 5 — HOW IT WORKS (Update Text Only)

Find the existing "How it Works" section.
Update the 3 steps text to exactly this:

Step 1 heading: Browse Bouquets
Step 1 text: Explore our fresh handmade arrangements
online or WhatsApp us your idea.

Step 2 heading: WhatsApp Your Order
Step 2 text: Send us your bouquet choice, delivery
address in Ghaziabad, and preferred time.

Step 3 heading: Delivered in Under 1 Hour
Step 3 text: We confirm your order and deliver fresh
to your door — anywhere in Ghaziabad.

Do not change the layout or icons of this section.
Only change the text content.

---

## SECTION 6 — ABOUT US (Full Rewrite)

Find the existing About Us section on the homepage.
Replace ALL its text content with exactly this:

HEADING (H2):
About Rose n Petals

BODY TEXT:
Rose n Petals is a local flower shop based in
Kavi Nagar, Ghaziabad — run with love and a genuine
passion for fresh flowers.

We are not a big national brand with a call centre.
We are your neighbourhood florist. Every bouquet we
make is handcrafted fresh — not pre-packaged, not
mass-produced. When you order from us, a real person
reads your WhatsApp message, makes your bouquet, and
sends it out to you in under 1 hour.

Our shop is located at KD Market, Block D, Sector 18,
Kavi Nagar, Ghaziabad. We deliver across all of
Ghaziabad — from Indirapuram and Vaishali to
Raj Nagar, Vasundhara, Crossing Republik, and every
neighbourhood in between.

Whether it is a last-minute birthday bouquet, a
romantic anniversary surprise, a farewell for a friend,
or simply a bunch of flowers to brighten someone's
day — we are here, open from 8 AM to 10 PM,
every single day.

Bouquets start at ₹200. Orders are placed on
WhatsApp — simple, fast, and personal.

CONTACT DETAILS BELOW BODY TEXT:
📍 KD Market, Block D, Sector 18, Kavi Nagar,
   Ghaziabad – 201002
📞 +91 9810244455
💬 WhatsApp: +91 7289996804
📸 @_rosenpetals_
   (link to https://www.instagram.com/_rosenpetals_)

---

## SECTION 7 — FAQ SECTION (New Section)

Add a new FAQ section on the homepage after the
About Us section and before the footer.

SECTION HEADING (H2):
Frequently Asked Questions

Display as expandable accordion items
(click to open/close each answer).

FAQ ITEM 1:
Q: Do you deliver flowers to all areas of Ghaziabad?
A: Yes. Rose n Petals delivers across all of Ghaziabad
including Kavi Nagar, Raj Nagar, Indirapuram, Vaishali,
Vasundhara, Mohan Nagar, Vijay Nagar, Crossing Republik
and surrounding areas.

FAQ ITEM 2:
Q: How long does delivery take?
A: We deliver in under 1 hour of order confirmation.
Same-day delivery is available for orders placed
before 9 PM.

FAQ ITEM 3:
Q: What is the minimum order price?
A: Bouquets start from ₹200. We have options for
every budget including premium arrangements.

FAQ ITEM 4:
Q: How do I place an order?
A: WhatsApp us at +91 7289996804. No app download,
no complicated form. Just message us your bouquet
choice, delivery address, and preferred time.

FAQ ITEM 5:
Q: Do you accept Cash on Delivery?
A: No. We accept UPI and Bank Transfer only.
Payment is made after order confirmation on WhatsApp.

FAQ ITEM 6:
Q: Can I get a custom bouquet?
A: Yes. WhatsApp us with your idea — flowers, colours,
budget, occasion — and we will create it for you
starting from ₹200.

FAQ ITEM 7:
Q: What are your shop hours?
A: We are open every day from 8 AM to 10 PM.
WhatsApp orders are accepted during shop hours.

FAQ ITEM 8:
Q: How quickly do you respond on WhatsApp?
A: We respond within 15–30 minutes during shop hours.
For urgent orders write URGENT in your first message
and we will prioritise your order immediately.

STYLING:
- Clean accordion, no JavaScript libraries needed
- Use CSS details/summary elements or simple JS toggle
- Border: 1px solid #EEEEEE on each item
- Question: font-weight 600, font-size 15px
- Answer: font-size 14px, color #555, padding 12px 16px
- Add + / - icon on right side to show open/closed state

---

## SECTION 8 — CUSTOM BOUQUET SECTION (Update Text)

Find the existing custom bouquet section.
Update its text to exactly this:

HEADING:
Can't Find What You're Looking For?

BODY TEXT:
We make custom bouquets starting from ₹200.
Tell us your occasion, preferred flowers, colour,
and budget — and we will create something beautiful
just for you.

BUTTON TEXT:
Order a Custom Bouquet on WhatsApp

Do not change the WhatsApp link — keep existing logic.

---

## SECTION 9 — DELIVERY INFO BLOCK

Add a small info block directly above the
"Confirm on WhatsApp" button on the order form
(on the bouquet detail page, not homepage).

Content:
🕐 Delivered in under 1 hour after confirmation
📦 Delivered by our third-party delivery partner
💬 WhatsApp reply within 15–30 minutes (8 AM–10 PM)
✅ Same-day delivery available before 9 PM

STYLING:
- Background: #F8FFF8
- Border: 1px solid #D4EDDA
- Border-radius: 8px
- Padding: 12px 16px
- Font-size: 13px
- Color: #2D6A4F
- Each line as a separate paragraph with icon

---

## SECTION 10 — FOOTER UPDATES

Find the footer in index.html.
Make these exact text changes only:

1. Update address to standardised NAP format:
OLD: KD 14 Market, Block D, Sector 18, Kavi Nagar,
     Ghaziabad, Uttar Pradesh 201002
NEW: Shop No. 14, KD Market, Block D, Sector 18,
     Kavi Nagar, Ghaziabad, Uttar Pradesh – 201002

2. Hours are already fixed to 8 AM – 10 PM from Chunk 1.
   Verify this is correct and do not change it again.

3. Add these two links to the footer bottom bar
   next to the copyright line:
   - Policies → href="/policies"
   - Sitemap → href="/sitemap"

   Display as:
   © 2026 Rose n Petals. All rights reserved.
   | Policies | Sitemap

---

## VERIFICATION CHECKLIST

After implementing all changes confirm every item:

[ ] 1. H1 tag on homepage reads exactly:
       "Fresh Flower Delivery in Ghaziabad"
[ ] 2. Hero subheadline mentions "under 1 hour"
[ ] 3. Price anchor "Starting from ₹200" visible in hero
[ ] 4. Trust signals bar appears below hero with 4 items
[ ] 5. Delivery area section exists with area pill tags
[ ] 6. How it Works step 3 says "Delivered in Under 1 Hour"
[ ] 7. About Us section has full rewritten text
[ ] 8. FAQ accordion section exists with 8 questions
[ ] 9. Custom bouquet section text updated
[ ] 10. Delivery info block above WhatsApp button
        on order form page
[ ] 11. Footer address updated to standardised NAP
[ ] 12. Footer has Policies and Sitemap links
[ ] 13. Every delivery time on homepage says "under 1 hour"
[ ] 14. UI looks visually improved — cards have shadows,
        sections have more padding, headings are bolder
[ ] 15. No routing, server logic, or SEO head tags changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation. Then implement.
Verify all 15 checklist items when done.
Do not touch anything not listed in this document.