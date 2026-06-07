# Rose n Petals — CHUNK 5: Landing Pages Routing Fix
# File: ~/Documents/rnp/CHUNK5_LANDING_PAGES.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will
   change and exactly what you will change.
3. Do NOT implement until plan is confirmed.
4. After implementing verify every checklist item.
5. Do NOT change the homepage, catalog page,
   policies page, or any other existing page.
6. Do NOT change any existing hash routes that
   the SPA currently uses for navigation.
7. Only add new server-side routes for the
   36 landing pages listed below.

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Ghaziabad
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JS, Node.js, Express
The site is a SPA using hash routing (#/).
The 36 landing pages currently exist as hash routes
like /#/flower-delivery-ghaziabad but Google cannot
index them because they are hash URLs.
The fix is to add real Express server routes that
serve each landing page as a real URL path.

---

## THE PROBLEM

Currently:
rosenpetals.com/#/flower-delivery-ghaziabad
→ Google sees this as rosenpetals.com only
→ The landing page is invisible to Google

After this fix:
rosenpetals.com/flower-delivery-ghaziabad
→ Google sees this as a real unique URL
→ The landing page gets indexed

---

## HOW THE FIX WORKS

Each of the 36 landing pages already has its
content defined in the JS files:
- js/coreServiceRoutes.js (Batch 1 pages)
- js/localAreaRoutes.js (Batch 2 pages)
- js/urgencyServiceRoutes.js (Batch 3 pages)
- js/occasionRoutes.js (Batch 4 pages)

Each page already has HTML content, title, H1,
FAQ section, and bouquet listings.

The fix requires:
1. For each of the 36 landing pages, add an
   Express route in server.js that serves a
   new HTML file specific to that page
2. Each HTML file must include:
   - Unique title tag for that page
   - Unique meta description for that page
   - Unique H1 for that page
   - Canonical tag pointing to the real URL
   - BreadcrumbList JSON-LD schema
   - The existing page content already built
     in the JS route files
   - Same navbar and footer as main site

IMPORTANT: The simplest correct approach is to
create a single landing-page-template.html file
that the server uses for all 36 pages, injecting
the unique meta data per page via the server route.
This avoids creating 36 separate HTML files.

---

## RECOMMENDED APPROACH

Create ONE template HTML file: landing-page.html

In server.js, create a route handler function
that accepts page data and renders the template
with unique values injected.

The template uses placeholder tokens that the
server replaces before sending:

{{PAGE_TITLE}} — unique title per page
{{META_DESCRIPTION}} — unique description per page
{{H1}} — unique H1 per page
{{CANONICAL_URL}} — unique canonical per page
{{BREADCRUMB_SCHEMA}} — unique schema per page
{{PAGE_SLUG}} — the URL slug for this page

---

## LANDING PAGE TEMPLATE FILE

Create file: landing-page.html in project root

Content:

<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
  content="width=device-width, initial-scale=1.0">
  <title>{{PAGE_TITLE}}</title>
  <meta name="description"
  content="{{META_DESCRIPTION}}">
  >
  /png"
  href="/assets/favicon.png">
  <meta property="og:title"
  content="{{PAGE_TITLE}}">
  <meta property="og:description"
  content="{{META_DESCRIPTION}}">
  <meta property="og:url"
  content="{{CANONICAL_URL}}">
  <meta property="og:type"
  content="business.business">
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name"
  content="Rose n Petals">
  <script type="application/ld+json">
  {{BREADCRUMB_SCHEMA}}
  </script>
  /css/styles.css">
  
  href="/css/rnp-templates.css">
  
  href="https://fonts.googleapis.com">
  
  href="https://fonts.gstatic.com" crossorigin>
  //fonts.googleapis.com/css2?
  family=Outfit:wght@300;400;500;600;700&
  display=swap" rel="stylesheet">
</head>
<body>
  [COPY EXACT NAVBAR FROM index.html HERE]
  <main id="app" class="app-main"></main>
  [COPY EXACT FOOTER FROM index.html HERE]
  <script src="/js/store.js"></script>
  <script src="/js/whatsapp.js"></script>
  <script src="/js/components.js"></script>
  <script src="/js/corePagesData.js"></script>
  <script src="/js/coreServiceRoutes.js"></script>
  <script src="/js/urgencyPagesData.js"></script>
  <script src="/js/urgencyServiceRoutes.js"></script>
  <script src="/js/occasionPagesData.js"></script>
  <script src="/js/occasionRoutes.js"></script>
  <script src="/js/localAreaPagesData.js"></script>
  <script src="/js/localAreaRoutes.js"></script>
  <script src="/js/pages.js"></script>
  <script src="/js/app.js"></script>
  <script>
    // Set the current year in footer
    document.getElementById('current-year')
    .textContent = new Date().getFullYear();
    
    // Navigate to the correct hash route
    // so the SPA loads the right page content
    if (window.location.hash === '' ||
        window.location.hash === '#') {
      window.location.hash =
      '#/{{PAGE_SLUG}}';
    }
  </script>
</body>
</html>

---

## SERVER ROUTE HANDLER

In server.js add this function BEFORE all the
landing page routes:

function serveLandingPage(res, data) {
  const fs = require('fs');
  const templatePath =
    path.join(__dirname, 'landing-page.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html.replace(/{{PAGE_TITLE}}/g,
    data.title);
  html = html.replace(/{{META_DESCRIPTION}}/g,
    data.description);
  html = html.replace(/{{CANONICAL_URL}}/g,
    data.canonical);
  html = html.replace(/{{BREADCRUMB_SCHEMA}}/g,
    data.breadcrumb);
  html = html.replace(/{{PAGE_SLUG}}/g,
    data.slug);
  res.send(html);
}

---

## ALL 36 ROUTES — Add to server.js

Add ALL of these routes BEFORE the SPA catch-all
route (app.get('*', ...)).

Each route calls serveLandingPage with unique data.

--- BATCH 1: GENERAL PAGES ---

app.get('/flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Ghaziabad | Same Day – Rose n Petals',
    description: 'Order fresh flower bouquets in Ghaziabad with 1-hour delivery. Starting ₹200. Serving all of Ghaziabad. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-ghaziabad',
    slug: 'flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery in Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"}]}'
  });
});

app.get('/online-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Online Flower Delivery Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Order flowers online in Ghaziabad. Fresh handmade bouquets delivered in 1 hour. Starting ₹200. WhatsApp +91 7289996804. No app needed.',
    canonical: 'https://rosenpetals.com/online-flower-delivery-ghaziabad',
    slug: 'online-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Online Flower Delivery Ghaziabad","item":"https://rosenpetals.com/online-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/bouquet-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Bouquet Delivery in Ghaziabad | Fresh – Rose n Petals',
    description: 'Fresh handmade bouquets delivered across Ghaziabad in 1 hour. Starting ₹200. Order on WhatsApp — fast, easy, personal.',
    canonical: 'https://rosenpetals.com/bouquet-delivery-ghaziabad',
    slug: 'bouquet-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Bouquet Delivery Ghaziabad","item":"https://rosenpetals.com/bouquet-delivery-ghaziabad"}]}'
  });
});

app.get('/send-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Send Flowers in Ghaziabad | 1-Hour Delivery – Rose n Petals',
    description: 'Send fresh flowers anywhere in Ghaziabad in 1 hour. Handmade bouquets from ₹200. WhatsApp us to order — +91 7289996804.',
    canonical: 'https://rosenpetals.com/send-flowers-ghaziabad',
    slug: 'send-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Send Flowers Ghaziabad","item":"https://rosenpetals.com/send-flowers-ghaziabad"}]}'
  });
});

app.get('/order-flowers-online-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Order Flowers Online Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers online in Ghaziabad. Delivered in 1 hour. Bouquets from ₹200. Simple WhatsApp ordering — no app or account needed.',
    canonical: 'https://rosenpetals.com/order-flowers-online-ghaziabad',
    slug: 'order-flowers-online-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Order Flowers Online Ghaziabad","item":"https://rosenpetals.com/order-flowers-online-ghaziabad"}]}'
  });
});

app.get('/florist-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Florist in Ghaziabad | Fresh Bouquets – Rose n Petals',
    description: 'Looking for a florist in Ghaziabad? Rose n Petals offers fresh handmade bouquets with 1-hour delivery. Starting ₹200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/florist-ghaziabad',
    slug: 'florist-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Florist in Ghaziabad","item":"https://rosenpetals.com/florist-ghaziabad"}]}'
  });
});

app.get('/flower-shop-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Shop in Ghaziabad | Rose n Petals',
    description: 'Rose n Petals is Ghaziabads local flower shop. Fresh handmade bouquets from ₹200. 1-hour delivery across all of Ghaziabad. Order on WhatsApp.',
    canonical: 'https://rosenpetals.com/flower-shop-ghaziabad',
    slug: 'flower-shop-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Shop Ghaziabad","item":"https://rosenpetals.com/flower-shop-ghaziabad"}]}'
  });
});

app.get('/fresh-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Fresh Flowers Ghaziabad | Daily Delivery – Rose n Petals',
    description: 'Get fresh flowers delivered daily across Ghaziabad. Handmade bouquets starting Rs.200. 1-hour delivery. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/fresh-flowers-ghaziabad',
    slug: 'fresh-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Fresh Flowers Ghaziabad","item":"https://rosenpetals.com/fresh-flowers-ghaziabad"}]}'
  });
});

app.get('/rose-bouquet-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Rose Bouquet Delivery Ghaziabad | Rose n Petals',
    description: 'Order rose bouquets in Ghaziabad with 1-hour delivery. Red roses, pink roses, mixed rose bouquets from Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/rose-bouquet-delivery-ghaziabad',
    slug: 'rose-bouquet-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Rose Bouquet Delivery Ghaziabad","item":"https://rosenpetals.com/rose-bouquet-delivery-ghaziabad"}]}'
  });
});

app.get('/mixed-flower-bouquet-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Mixed Flower Bouquet Ghaziabad | Rose n Petals',
    description: 'Order mixed flower bouquets in Ghaziabad. Colourful handmade arrangements from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/mixed-flower-bouquet-ghaziabad',
    slug: 'mixed-flower-bouquet-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Mixed Flower Bouquet Ghaziabad","item":"https://rosenpetals.com/mixed-flower-bouquet-ghaziabad"}]}'
  });
});

--- BATCH 2: LOCAL AREA PAGES ---

app.get('/flower-delivery-indirapuram',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Indirapuram | 1-Hour – Rose n Petals',
    description: 'Fresh bouquets delivered in Indirapuram, Ghaziabad in 1 hour. Near Shipra Mall and Gyan Khand. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-indirapuram',
    slug: 'flower-delivery-indirapuram',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Indirapuram","item":"https://rosenpetals.com/flower-delivery-indirapuram"}]}'
  });
});

app.get('/flower-delivery-vaishali-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vaishali Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Vaishali, Ghaziabad. Delivered in 1 hour. Bouquets from Rs.200. Near Vaishali Metro. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vaishali-ghaziabad',
    slug: 'flower-delivery-vaishali-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vaishali","item":"https://rosenpetals.com/flower-delivery-vaishali-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-vasundhara-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vasundhara Ghaziabad | Rose n Petals',
    description: 'Fresh bouquets delivered in Vasundhara, Ghaziabad in 1 hour. Starting Rs.200. Handmade with care. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad',
    slug: 'flower-delivery-vasundhara-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vasundhara","item":"https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-raj-nagar-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Raj Nagar Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Raj Nagar, Ghaziabad. Delivered in 1 hour. Near RDC Zone. Bouquets from Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad',
    slug: 'flower-delivery-raj-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Raj Nagar","item":"https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-kavi-nagar-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Kavi Nagar Ghaziabad | Rose n Petals',
    description: 'Rose n Petals is based in Kavi Nagar, Ghaziabad. Fresh bouquets delivered in 1 hour. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad',
    slug: 'flower-delivery-kavi-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Kavi Nagar","item":"https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-mohan-nagar-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Mohan Nagar Ghaziabad | Rose n Petals',
    description: 'Fresh flowers delivered in Mohan Nagar, Ghaziabad in 1 hour. Handmade bouquets from Rs.200. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad',
    slug: 'flower-delivery-mohan-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Mohan Nagar","item":"https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-vijay-nagar-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vijay Nagar Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Vijay Nagar, Ghaziabad. Delivered in 1 hour. Bouquets from Rs.200. Handmade daily. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad',
    slug: 'flower-delivery-vijay-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vijay Nagar","item":"https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-crossing-republik-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery Crossing Republik Ghaziabad | Rose n Petals',
    description: 'Fresh bouquets delivered in Crossing Republik, Ghaziabad in 1 hour. Starting Rs.200. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad',
    slug: 'flower-delivery-crossing-republik-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Crossing Republik","item":"https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad"}]}'
  });
});

--- BATCH 3: URGENCY PAGES ---

app.get('/same-day-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Same Day Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Same-day flower delivery across Ghaziabad. Order before 9 PM. Fresh bouquets from Rs.200. WhatsApp us now — +91 7289996804.',
    canonical: 'https://rosenpetals.com/same-day-flower-delivery-ghaziabad',
    slug: 'same-day-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Same Day Flower Delivery Ghaziabad","item":"https://rosenpetals.com/same-day-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/express-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Express Flower Delivery Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Express flower delivery in Ghaziabad in just 1 hour. Fresh handmade bouquets from Rs.200. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/express-flower-delivery-ghaziabad',
    slug: 'express-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Express Flower Delivery Ghaziabad","item":"https://rosenpetals.com/express-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/2-hour-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: '2 Hour Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Need flowers fast? We deliver across Ghaziabad within 1-2 hours. Fresh bouquets from Rs.200. WhatsApp +91 7289996804 right now.',
    canonical: 'https://rosenpetals.com/2-hour-flower-delivery-ghaziabad',
    slug: '2-hour-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"2 Hour Flower Delivery Ghaziabad","item":"https://rosenpetals.com/2-hour-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/midnight-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Midnight Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Midnight flower delivery in Ghaziabad for surprise moments. Fresh bouquets from Rs.200. WhatsApp us to check availability — +91 7289996804.',
    canonical: 'https://rosenpetals.com/midnight-flower-delivery-ghaziabad',
    slug: 'midnight-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Midnight Flower Delivery Ghaziabad","item":"https://rosenpetals.com/midnight-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/urgent-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Urgent Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Urgent flower delivery in Ghaziabad. WhatsApp us now and we will deliver within 1 hour. Fresh bouquets from Rs.200. +91 7289996804.',
    canonical: 'https://rosenpetals.com/urgent-flower-delivery-ghaziabad',
    slug: 'urgent-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Urgent Flower Delivery Ghaziabad","item":"https://rosenpetals.com/urgent-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/last-minute-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Last Minute Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Forgot a special occasion? We do last-minute flower delivery in Ghaziabad in 1 hour. From Rs.200. WhatsApp +91 7289996804 now.',
    canonical: 'https://rosenpetals.com/last-minute-flower-delivery-ghaziabad',
    slug: 'last-minute-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Last Minute Flower Delivery Ghaziabad","item":"https://rosenpetals.com/last-minute-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-today-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery Today in Ghaziabad | Rose n Petals',
    description: 'Need flowers delivered today in Ghaziabad? We deliver in 1 hour. Fresh bouquets from Rs.200. WhatsApp +91 7289996804 right now.',
    canonical: 'https://rosenpetals.com/flower-delivery-today-ghaziabad',
    slug: 'flower-delivery-today-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Today Ghaziabad","item":"https://rosenpetals.com/flower-delivery-today-ghaziabad"}]}'
  });
});

app.get('/emergency-flower-delivery-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Emergency Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Emergency flower delivery in Ghaziabad. WhatsApp us instantly and we will deliver within 1 hour. Bouquets from Rs.200. +91 7289996804.',
    canonical: 'https://rosenpetals.com/emergency-flower-delivery-ghaziabad',
    slug: 'emergency-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Emergency Flower Delivery Ghaziabad","item":"https://rosenpetals.com/emergency-flower-delivery-ghaziabad"}]}'
  });
});

--- BATCH 4: OCCASION PAGES ---

app.get('/birthday-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Birthday Flowers in Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Surprise someone with birthday flowers in Ghaziabad. Fresh bouquets delivered in 1 hour. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/birthday-flowers-ghaziabad',
    slug: 'birthday-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Birthday Flowers Ghaziabad","item":"https://rosenpetals.com/birthday-flowers-ghaziabad"}]}'
  });
});

app.get('/anniversary-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Anniversary Flowers in Ghaziabad | Rose n Petals',
    description: 'Celebrate your anniversary with fresh flowers in Ghaziabad. Handmade bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/anniversary-flowers-ghaziabad',
    slug: 'anniversary-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Anniversary Flowers Ghaziabad","item":"https://rosenpetals.com/anniversary-flowers-ghaziabad"}]}'
  });
});

app.get('/get-well-soon-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Get Well Soon Flowers Ghaziabad | Rose n Petals',
    description: 'Send get well soon flowers in Ghaziabad. Cheerful fresh bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/get-well-soon-flowers-ghaziabad',
    slug: 'get-well-soon-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Get Well Soon Flowers Ghaziabad","item":"https://rosenpetals.com/get-well-soon-flowers-ghaziabad"}]}'
  });
});

app.get('/congratulations-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Congratulations Flowers Ghaziabad | Rose n Petals',
    description: 'Celebrate achievements with congratulations flowers in Ghaziabad. Fresh bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/congratulations-flowers-ghaziabad',
    slug: 'congratulations-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Congratulations Flowers Ghaziabad","item":"https://rosenpetals.com/congratulations-flowers-ghaziabad"}]}'
  });
});

app.get('/sorry-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Sorry Flowers in Ghaziabad | Rose n Petals',
    description: 'Say sorry with fresh flowers in Ghaziabad. Heartfelt bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/sorry-flowers-ghaziabad',
    slug: 'sorry-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Sorry Flowers Ghaziabad","item":"https://rosenpetals.com/sorry-flowers-ghaziabad"}]}'
  });
});

app.get('/romantic-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Romantic Flowers in Ghaziabad | Rose n Petals',
    description: 'Surprise your partner with romantic flowers in Ghaziabad. Red roses and love bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/romantic-flowers-ghaziabad',
    slug: 'romantic-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Romantic Flowers Ghaziabad","item":"https://rosenpetals.com/romantic-flowers-ghaziabad"}]}'
  });
});

app.get('/new-baby-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'New Baby Flowers in Ghaziabad | Rose n Petals',
    description: 'Welcome a new baby with fresh flowers in Ghaziabad. Soft pastel bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/new-baby-flowers-ghaziabad',
    slug: 'new-baby-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"New Baby Flowers Ghaziabad","item":"https://rosenpetals.com/new-baby-flowers-ghaziabad"}]}'
  });
});

app.get('/housewarming-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Housewarming Flowers in Ghaziabad | Rose n Petals',
    description: 'Send housewarming flowers in Ghaziabad. Beautiful fresh bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804 to order.',
    canonical: 'https://rosenpetals.com/housewarming-flowers-ghaziabad',
    slug: 'housewarming-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Housewarming Flowers Ghaziabad","item":"https://rosenpetals.com/housewarming-flowers-ghaziabad"}]}'
  });
});

app.get('/sympathy-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Sympathy Flowers in Ghaziabad | Rose n Petals',
    description: 'Send sympathy flowers in Ghaziabad with care and respect. Thoughtful bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/sympathy-flowers-ghaziabad',
    slug: 'sympathy-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Sympathy Flowers Ghaziabad","item":"https://rosenpetals.com/sympathy-flowers-ghaziabad"}]}'
  });
});

app.get('/diwali-flowers-ghaziabad',
(req, res) => {
  serveLandingPage(res, {
    title: 'Diwali Flowers in Ghaziabad | Rose n Petals',
    description: 'Celebrate Diwali with fresh flowers in Ghaziabad. Festive bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/diwali-flowers-ghaziabad',
    slug: 'diwali-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Diwali Flowers Ghaziabad","item":"https://rosenpetals.com/diwali-flowers-ghaziabad"}]}'
  });
});

---

## VERIFICATION CHECKLIST

After implementing confirm every item:

[ ] 1. landing-page.html template file exists 
       in project root
[ ] 2. serveLandingPage function exists in server.js
[ ] 3. All 36 routes exist in server.js
[ ] 4. All 36 routes are BEFORE the catch-all route
[ ] 5. Test these 5 URLs load correctly on localhost:
       /flower-delivery-ghaziabad
       /flower-delivery-indirapuram
       /same-day-flower-delivery-ghaziabad
       /birthday-flowers-ghaziabad
       /diwali-flowers-ghaziabad
[ ] 6. Each page shows correct unique title in 
       browser tab
[ ] 7. Each page loads the correct landing page 
       content from the existing JS routes
[ ] 8. Canonical tag on each page points to its 
       own real URL
[ ] 9. BreadcrumbList schema present on each page
[ ] 10. Navbar and footer display correctly on 
        all landing pages
[ ] 11. No existing pages or routes were changed
[ ] 12. The SPA hash routes still work normally
        e.g. /#/flower-delivery-ghaziabad still 
        works for internal navigation

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Then implement. Verify all 12 items when done.
Do not touch anything not listed here.