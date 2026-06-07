# Rose n Petals — CHUNK 3: SEO & Technical Head Tags
# File: ~/Documents/rnp/CHUNK3_SEO_HEAD_TAGS.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will 
   change and exactly what you will change.
3. Do NOT implement until plan is confirmed.
4. After implementing verify every checklist item.
5. Do NOT change any page content, routing, 
   server.js, product data, CSS, or JS logic.
6. All changes in this chunk are ONLY to the 
   <head> section of index.html and to two new 
   files: robots.txt and sitemap.xml

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Ghaziabad
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JS, Node.js, Express
Instagram handle: _rosenpetals_ (underscores on both sides)
WhatsApp: +91 7289996804
Phone: +91 9810244455
Address: Shop No. 14, KD Market, Block D, Sector 18,
         Kavi Nagar, Ghaziabad, Uttar Pradesh – 201002
Shop hours: Every day 8 AM to 10 PM

---

## CHANGE 1 — Update Title Tag

File: index.html

Find the existing title tag:
<title>Rose n Petals - Fresh Bouquets in Kavi Nagar 
& Raj Nagar</title>

Replace with exactly this:
<title>Flower Delivery in Ghaziabad | Fresh Bouquets 
– Rose n Petals</title>

---

## CHANGE 2 — Update Meta Description

File: index.html

Find the existing meta description tag:
<meta name="description" content="A fast, mobile-first 
bouquet ecommerce website for Rose n Petals. Local 
delivery available in Kavi Nagar & Raj Nagar.">

Replace with exactly this:
<meta name="description" content="Order fresh flower 
bouquets in Ghaziabad with 1-hour delivery. Serving 
Kavi Nagar, Raj Nagar, Indirapuram, Vaishali & more. 
Starting ₹200. Order on WhatsApp +91 7289996804.">

---

## CHANGE 3 — Add OpenGraph Meta Tags

File: index.html

Add ALL of these lines inside the <head> tag,
after the existing meta description tag:

<meta property="og:title" content="Flower Delivery 
in Ghaziabad | Fresh Bouquets – Rose n Petals">
<meta property="og:description" content="Fresh 
handmade bouquets delivered in 1 hour across 
Ghaziabad. Starting ₹200. Order on WhatsApp – 
no app, no website form needed.">
<meta property="og:image" 
content="https://rosenpetals.com/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="business.business">
<meta property="og:locale" content="en_IN">
<meta property="og:site_name" content="Rose n Petals">
<meta property="og:url" content="https://rosenpetals.com">

NOTE FOR OG IMAGE:
For the og:image, use the best available bouquet 
image from Cloudinary. Find the Cloudinary URL of 
the Royal Sunflower bouquet or the Blush Carnation 
bouquet from the existing product data JS files 
and use that URL for og:image instead of 
/assets/og-image.jpg. Update the og:image:width 
and og:image:height to match the actual image 
dimensions if known, or leave as 1200 and 630.

---

## CHANGE 4 — Add LocalBusiness JSON-LD Schema

File: index.html

Add this exact script block inside the <head> tag,
after the OpenGraph tags:

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Florist",
  "name": "Rose n Petals",
  "description": "Fresh handmade bouquets delivered 
in 1 hour across Ghaziabad and surrounding areas. 
Starting from Rs.200. Order on WhatsApp.",
  "image": "https://rosenpetals.com/assets/og-image.jpg",
  "logo": "https://rosenpetals.com/Logo.jpg",
  "url": "https://rosenpetals.com",
  "telephone": "+919810244455",
  "priceRange": "Rs.Rs.",
  "@id": "https://rosenpetals.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop No. 14, KD Market, 
Block D, Sector 18, Kavi Nagar",
    "addressLocality": "Ghaziabad",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "201002",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "28.6692",
    "longitude": "77.4538"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday","Tuesday","Wednesday",
        "Thursday","Friday","Saturday","Sunday"
      ],
      "opens": "08:00",
      "closes": "22:00"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+917289996804",
    "contactType": "customer service",
    "availableLanguage": ["Hindi","English"]
  },
  "sameAs": [
    "https://www.instagram.com/_rosenpetals_",
    "https://www.justdial.com/Ghaziabad/Rose-N-Petals-Opp-Nagar-Nigam-Kavi-Nagar/0120PX120-X120-180516163257-D7U1_BZDET"
  ],
  "currenciesAccepted": "INR",
  "paymentAccepted": "UPI, Bank Transfer",
  "areaServed": {
    "@type": "City",
    "name": "Ghaziabad"
  }
}
</script>

---

## CHANGE 5 — Add FAQPage JSON-LD Schema

File: index.html

Add this exact script block inside the <head> tag,
after the LocalBusiness schema:

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you deliver flowers to all areas 
of Ghaziabad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Rose n Petals delivers fresh 
bouquets across all of Ghaziabad including Kavi 
Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, 
Mohan Nagar, Vijay Nagar, Crossing Republik and 
surrounding areas."
      }
    },
    {
      "@type": "Question",
      "name": "How long does flower delivery take 
in Ghaziabad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We deliver in under 1 hour of order 
confirmation across Ghaziabad. Same-day delivery 
is available for orders placed before 9 PM."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum order price?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bouquets at Rose n Petals start from 
Rs.200. We have options for all budgets including 
premium arrangements."
      }
    },
    {
      "@type": "Question",
      "name": "How do I place an order?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply WhatsApp us at +91 7289996804. 
No app download needed, no website form to fill. 
Just message us your bouquet choice, delivery 
address, and preferred time."
      }
    },
    {
      "@type": "Question",
      "name": "Can I get flowers delivered the 
same day?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We offer same-day delivery 
across Ghaziabad for orders placed before 9 PM. 
For urgent deliveries, WhatsApp us immediately 
and we will confirm availability."
      }
    },
    {
      "@type": "Question",
      "name": "Do you accept Cash on Delivery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. We accept UPI and Bank Transfer 
only. No Cash on Delivery."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customize a bouquet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. WhatsApp us at +91 7289996804 
and describe what you have in mind — flowers, 
colours, budget, and occasion. We will create 
a custom bouquet for you starting from Rs.200."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept UPI (Google Pay, PhonePe, 
Paytm) and direct Bank Transfer. Payment is made 
after order confirmation on WhatsApp."
      }
    }
  ]
}
</script>

---

## CHANGE 6 — Create robots.txt

Create a new file called robots.txt in the ROOT 
of the project (same level as package.json).

File content — write exactly this:

User-agent: *
Allow: /

Sitemap: https://rosenpetals.com/sitemap.xml

Then make sure the Express server in server.js 
serves this file as a static file. Check if there 
is already a line like:
app.use(express.static(...))

If static files are already being served from 
the root or public folder, place robots.txt 
in that folder. If not, add this route to server.js:

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

---

## CHANGE 7 — Create sitemap.xml

Create a new file called sitemap.xml in the ROOT 
of the project (same level as package.json).

File content — write exactly this:

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>oc>https://rosenpetals.com/</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>weekly</changefreq>
  <priority>1.0</priority></url>

  <url>oc>https://rosenpetals.com/catalog</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>weekly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/policies</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.5</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/online-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/bouquet-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/send-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/order-flowers-online-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/florist-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/flower-shop-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/fresh-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.7</priority></url>

  <url>oc>https://rosenpetals.com/rose-bouquet-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.7</priority></url>

  <url>oc>https://rosenpetals.com/mixed-flower-bouquet-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.7</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-indirapuram</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-vaishali-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/same-day-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/express-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/2-hour-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/midnight-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/urgent-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/last-minute-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/flower-delivery-today-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/emergency-flower-delivery-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/birthday-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/anniversary-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.9</priority></url>

  <url>oc>https://rosenpetals.com/get-well-soon-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/congratulations-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/sorry-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/romantic-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/new-baby-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/housewarming-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/sympathy-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/diwali-flowers-ghaziabad</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.8</priority></url>

  <url>oc>https://rosenpetals.com/blog/how-to-keep-bouquet-fresh-north-indian-summer</loc>
  astmod>2026-06-07</lastmod>
  hangefreq>monthly</changefreq>
  <priority>0.6</priority></url>

</urlset>
Then serve sitemap.xml as a static file the same 
way as robots.txt. Add this route to server.js 
if not already served statically:

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

---

## VERIFICATION CHECKLIST

After implementing all 7 changes confirm every item:

[ ] 1. Title tag reads: "Flower Delivery in Ghaziabad
       | Fresh Bouquets – Rose n Petals"
[ ] 2. Meta description contains "Ghaziabad" and
       "1-hour delivery" and "₹200"
[ ] 3. All 8 OpenGraph tags are present in <head>
[ ] 4. og:image points to a real Cloudinary URL
       of a bouquet photo
[ ] 5. LocalBusiness JSON-LD script is in <head>
       with type Florist
[ ] 6. FAQPage JSON-LD script is in <head>
       with 8 questions
[ ] 7. robots.txt is accessible at
       rosenpetals.com/robots.txt
[ ] 8. robots.txt contains Sitemap: line pointing
       to rosenpetals.com/sitemap.xml
[ ] 9. sitemap.xml is accessible at
       rosenpetals.com/sitemap.xml
[ ] 10. sitemap.xml contains all 36 landing page
        URLs plus homepage and catalog
[ ] 11. No page content, routing, CSS, or JS
        logic was changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Then implement. Verify all 11 items when done.
Do not touch anything not listed here.