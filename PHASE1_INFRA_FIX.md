# Rose n Petals — PHASE 1: Infrastructure Fix
# File: ~/Documents/rnp/PHASE1_INFRA_FIX.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will
   change and exactly what you will change.
3. Do NOT implement until plan is confirmed.
4. After implementing verify every checklist item.
5. Do NOT change any existing page content, CSS,
   routing logic, or JS files beyond what is listed.

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Ghaziabad
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JS, Node.js, Express
GitHub: willxrisee-rgb/rnp
Local folder: ~/Documents/rnp

---

## CHANGE 1 — Rebuild sitemap.xml with correct XML

The current sitemap.xml may have malformed XML tags
due to how it was written. Rebuild it completely.

Replace the entire content of sitemap.xml with
this exact content. Every tag must be correct XML:

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://rosenpetals.com/</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/catalog</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/policies</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/online-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/bouquet-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/send-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/order-flowers-online-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/florist-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-shop-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/fresh-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/rose-bouquet-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/mixed-flower-bouquet-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-indirapuram</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-vaishali-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/same-day-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/express-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/2-hour-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/midnight-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/urgent-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/last-minute-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/flower-delivery-today-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/emergency-flower-delivery-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/birthday-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/anniversary-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/get-well-soon-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/congratulations-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/sorry-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/romantic-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/new-baby-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/housewarming-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/sympathy-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rosenpetals.com/diwali-flowers-ghaziabad</loc>
    <lastmod>2026-06-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>

---

## CHANGE 2 — Add canonical tag to homepage

File: index.html

Find the existing <head> section.
Add this line after the existing canonical tag
if one exists, or after the meta description
if no canonical exists:

<link rel="canonical" href="https://rosenpetals.com/">

---

## CHANGE 3 — Fix the footer Sitemap link

The footer currently has a link to /sitemap which
shows the wrong page. Find every file that contains
the footer (index.html and any other HTML files
like policies.html and landing-page.html).

In each file, find the footer link that says Sitemap.
It will look like one of these:
<a href="/sitemap">Sitemap</a>
or
<a href="https://rosenpetals.com/sitemap">Sitemap</a>

Replace every occurrence with exactly this:
<a href="/sitemap.xml" target="_blank" 
   rel="noopener">Sitemap</a>

---

## CHANGE 4 — Fix all WhatsApp links to pre-populate a message

Find every WhatsApp link in the project.
They will look like:
https://api.whatsapp.com/send?phone=917289996804
or
https://wa.me/917289996804

Replace every occurrence with exactly this URL:
https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me.

IMPORTANT: Do not change the WhatsApp number.
Only add the ?text= parameter.
The cart WhatsApp message in CHUNK 6 has its own
dynamic message — do NOT change that one.
Only change the simple single-item and CTA
WhatsApp links that currently have no message.

---

## VERIFICATION CHECKLIST

After implementing all 4 changes confirm every item:

[ ] 1. Open https://rosenpetals.com/sitemap.xml
       in a browser — it must show valid XML
       with proper <loc>, <lastmod>, <priority> tags.
       No broken tag names.
[ ] 2. sitemap.xml contains exactly 38 URLs
       (homepage, catalog, policies, 35 landing pages)
[ ] 3. Every file that has a footer now shows
       Sitemap link going to /sitemap.xml
[ ] 4. Clicking the Sitemap footer link opens
       the XML sitemap, not an HTML page
[ ] 5. Homepage <head> has canonical tag pointing
       to https://rosenpetals.com/
[ ] 6. Clicking any simple WhatsApp button opens
       WhatsApp with the pre-filled message
[ ] 7. No existing page content, routing,
       CSS, or JS logic was changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Then implement. Verify all 7 items when done.
Do not touch anything not listed here.