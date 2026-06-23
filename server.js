require('dotenv').config();
const express = require('express');
const path = require('path');

// ─── SSR: Server-side product cache ───────────────────────────────────────
const fs = require('fs');

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHd0751qQ03HhhAmQhVE32BlLZXOO1g40tqB3XPv_9WZCUwW4iQwZ6mNWUnf0Pvf0aD1HkRBAuOQQu/pub?output=csv';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
let productsCache = null;
let cacheTimestamp = 0;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

function csvToArray(str) {
  const arr = [];
  let quote = false;
  for (let row = 0, col = 0, c = 0; c < str.length; c++) {
    let cc = str[c], nc = str[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';
    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc; c++; continue;
    }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { col++; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { row++; col = 0; c++; continue; }
    if (cc === '\n' && !quote) { row++; col = 0; continue; }
    if (cc === '\r' && !quote) { row++; col = 0; continue; }
    arr[row][col] += cc;
  }
  return arr;
}

function parseProductsCSV(csvText) {
  const rows = csvToArray(csvText);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const products = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < headers.length) continue;
    const rowData = {};
    headers.forEach((h, idx) => { if (h) rowData[h] = row[idx] ? row[idx].trim() : ''; });

    const idVal = rowData['product no.'] || rowData['id'];
    if (!idVal) continue;

    const statusVal = (rowData['status'] || '').toLowerCase();
    if (!statusVal.includes('in') || !statusVal.includes('stock')) continue;

    const nameVal = rowData['product name'] || rowData['name'] || '';
    const cleanSlug = nameVal.toString().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const priceVal = rowData['price'] || '';
    let imgVal = rowData['image url'] || rowData['imageurl'] || '';
    const descVal = rowData['description'] || rowData['shortdescription'] || '';
    const occVal = rowData['occasion'] || rowData['occasiontags'] || '';
    const bestSellerVal = (rowData['isbestseller'] || rowData['is best seller'] || rowData['best seller'] || '').toLowerCase();

    if (imgVal && imgVal.includes('drive.google.com')) {
      const match = imgVal.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) imgVal = `https://lh3.googleusercontent.com/d/${match[1]}`;
    }

    const occasionTags = occVal ? occVal.split(',').map(t => t.trim()) : [];
    const isBestSeller = bestSellerVal === 'true' || bestSellerVal === 'yes' || bestSellerVal === '1'
      || occasionTags.some(tag => tag.toLowerCase() === 'best sellers');

    products.push({
      id: idVal,
      slug: cleanSlug,
      name: nameVal,
      price: parseFloat(priceVal) || 0,
      imageurl: imgVal,
      shortdescription: descVal,
      occasiontags: occasionTags,
      isbestseller: isBestSeller,
      status: statusVal
    });
  }
  return products;
}

async function getProducts() {
  const now = Date.now();
  if (productsCache && (now - cacheTimestamp < CACHE_TTL_MS)) return productsCache;
  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    if (text.trim().startsWith('<')) throw new Error('Received HTML instead of CSV');
    productsCache = parseProductsCSV(text);
    cacheTimestamp = now;
    console.log(`[SSR] Products refreshed: ${productsCache.length} items`);
  } catch (err) {
    console.error('[SSR] Failed to fetch products:', err.message);
    if (!productsCache) productsCache = [];
  }
  return productsCache;
}

// Warm the cache on server start
getProducts().catch(() => {});
// ─────────────────────────────────────────────────────────────────────────────

// ─── SSR: HTML builders ───────────────────────────────────────────────────
function getIndexTemplate() {
  return fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
}

function productCardHTML(p, index = 0) {
  const isPriority = index < 2;
  const imgAttrs = isPriority
    ? 'loading="eager" fetchpriority="high"'
    : 'loading="lazy"';
  const href = `/bouquet/${p.slug}`;
  const price = p.price ? `<p class="product-price">&#8377;${escapeHtml(String(p.price))}</p>` : '';
  const img = p.imageurl
    ? `<img src="${escapeHtml(p.imageurl)}"
          alt="${escapeHtml(p.name)} — Flower Bouquet for Delivery in Ghaziabad"
          class="product-image"
          ${imgAttrs}
          width="400"
          height="400">`
    : `<div class="product-image-placeholder"></div>`;
  const tags = p.occasiontags.map(t =>
    `<span class="badge">${escapeHtml(t)}</span>`
  ).join('');
  return `
    <div class="product-card" data-id="${escapeHtml(p.slug)}">
      <a href="${href}" class="product-card-link">
        <div class="product-image-wrapper">${img}</div>
        <div class="product-info">
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          ${price}
          <div class="product-tags">${tags}</div>
        </div>
      </a>
      <button class="btn btn-primary btn-block add-to-cart-btn"
        data-id="${escapeHtml(String(p.id))}">Order on WhatsApp</button>
    </div>`;
}

function catalogGridHTML(products) {
  if (!products.length) return '<p>No products available.</p>';
  return `<div class="product-grid">${products.map((p, i) => productCardHTML(p, i)).join('')}</div>`;
}

function bouquetDetailHTML(p) {
  const price = p.price ? `<p class="detail-price">&#8377;${escapeHtml(String(p.price))}</p>` : '';
  const desc = p.shortdescription
    ? `<p class="detail-desc">${escapeHtml(p.shortdescription)}</p>` : '';
  const img = p.imageurl
    ? `<img src="${escapeHtml(p.imageurl)}"
          alt="${escapeHtml(p.name)} — Fresh Bouquet Delivery Ghaziabad Rose n Petals"
          class="detail-image"
          fetchpriority="high"
          width="600"
          height="600">`
    : '';
  const waText = encodeURIComponent(`Hi, I want to order ${p.name} from Rose n Petals. Please help me.`);
  const tags = p.occasiontags.map(t =>
    `<span class="badge detail-badge">${escapeHtml(t)}</span>`
  ).join('');

  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://rosenpetals.com/bouquet/${p.slug}`,
    "name": p.name,
    "description": p.shortdescription || `Order ${p.name} with 1-hour delivery in Ghaziabad.`,
    "image": [p.imageurl],
    "sku": escapeHtml(String(p.id)),
    "brand": { "@type": "Brand", "name": "Rose n Petals" },
    "url": `https://rosenpetals.com/bouquet/${p.slug}`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": p.price,
      "priceValidUntil": priceValidUntil.toISOString().slice(0, 10),
      "availability": "https://schema.org/InStock",
      "url": `https://rosenpetals.com/bouquet/${p.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "Rose n Petals",
        "url": "https://rosenpetals.com"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "currency": "INR",
          "value": 0
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "HUR"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "HUR"
          }
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN",
          "addressRegion": "UP",
          "addressLocality": "Ghaziabad"
        }
      }
    }
  });

  const breadcrumbJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rosenpetals.com" },
      { "@type": "ListItem", "position": 2, "name": "Bouquets", "item": "https://rosenpetals.com/catalog" },
      { "@type": "ListItem", "position": 3, "name": p.name, "item": `https://rosenpetals.com/bouquet/${p.slug}` }
    ]
  });

  return `
    <script type="application/ld+json">${jsonLd}</script>
    <script type="application/ld+json">${breadcrumbJson}</script>
    <section class="section container detail-section">
      <div class="detail-grid">
        <div class="detail-image-wrapper">${img}</div>
        <div class="detail-info">
          <div class="detail-tags">${tags}</div>
          <h1 class="detail-title">${escapeHtml(p.name)}</h1>
          ${price}
          <div class="detail-desc">${desc}</div>
          <a href="https://wa.me/917289996804?text=${waText}"
            target="_blank" rel="noopener noreferrer"
            class="btn btn-primary"
            style="width:100%;padding:14px;font-size:15px;font-weight:700;display:block;text-align:center;margin-top:16px;">
            Order on WhatsApp
          </a>
        </div>
      </div>
    </section>`;
}

function buildSSRPage(ssrContent, products, title, description, canonicalUrl) {
  let html = getIndexTemplate();

  if (title)
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

  if (description)
    html = html.replace(
      /(<meta\s+name=["']description["']\s+content=["'])[^"']*["']/i,
      `$1${escapeHtml(description)}"`
    );

  if (canonicalUrl)
    html = html.replace(
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${canonicalUrl}">`
    );

  const hydrationScript = `<script>window.__SSR_PRODUCTS__=${JSON.stringify(products)};window.__SSR_HYDRATED__=false;</script>`;
  html = html.replace('</body>', `${hydrationScript}</body>`);

  html = html.replace(
    /<main\s+id=["']app["'][^>]*>[\s\S]*?<\/main>/,
    `<main id="app" class="app-main"><div id="ssr-marker" style="display:none"></div>${ssrContent}</main>`
  );

  return html;
}
// ─────────────────────────────────────────────────────────────────────────────
const app = express();
// Render automatically provides the PORT environment variable
const PORT = process.env.PORT || 8080;
// Must bind to 0.0.0.0 for Render deployments instead of localhost
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to parse cookies manually
const parseCookies = (req) => {
  const list = {};
  const rc = req.headers.cookie;
  rc && rc.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
};

// Protect admin views from being served statically
app.use('/admin_views', (req, res) => res.status(403).send('Forbidden'));

// Serve all static assets from the current directory (index.html, css, js, etc.)
app.use(express.static(path.join(__dirname), { index: false }));

// Admin Auth Middleware
const requireAdmin = (req, res, next) => {
  const cookies = parseCookies(req);
  if (cookies.admin_session === 'authenticated') {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Admin Routes
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin_views', 'login.html'));
});

app.post('/admin/login', (req, res) => {

  const password = req.body.password;
  const correctPassword = process.env.ADMINPASSWORD || 'admin123';

  if (password === correctPassword) {
    res.cookie('admin_session', 'authenticated', { httpOnly: true });
    res.redirect('/admin');
  } else {
    res.redirect('/admin/login?error=1');
  }
});

app.get('/admin/logout', (req, res) => {
  res.clearCookie('admin_session');
  res.redirect('/admin/login');
});

app.get('/admin', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin_views', 'dashboard.html'));
});

app.post('/api/admin/update', requireAdmin, (req, res) => {
  console.log("Received admin update payload:", JSON.stringify(req.body, null, 2));
  res.status(200).json({ success: true });
});

// API endpoint to securely pass environment variables to the frontend dynamically
app.get('/api/config', (req, res) => {
  res.json({
    sheetUrl: process.env.SHEET_URL || ''
  });
});

// --- COUPON API ROUTES ---
const couponsFilePath = path.join(__dirname, 'coupons.json');

// Helper to read coupons
const getCoupons = () => {
  try {
    if (!fs.existsSync(couponsFilePath)) return [];
    return JSON.parse(fs.readFileSync(couponsFilePath, 'utf8'));
  } catch (error) {
    console.error("Error reading coupons:", error);
    return [];
  }
};

// Helper to write coupons
const saveCoupons = (coupons) => {
  fs.writeFileSync(couponsFilePath, JSON.stringify(coupons, null, 2));
};

// Public Validation Route
app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code || cartTotal == null) {
    return res.json({ valid: false, message: "Invalid request." });
  }

  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return res.json({ valid: false, message: "Invalid coupon code. Please check and try again." });
  }
  if (coupon.status !== 'active') {
    return res.json({ valid: false, message: "This coupon is no longer active." });
  }

  const minOrder = Number(coupon.minOrder) || 0;
  if (cartTotal < minOrder) {
    return res.json({ valid: false, message: `Minimum order of ₹${minOrder} required for this coupon.` });
  }

  let discountAmount = 0;
  if (coupon.type === 'fixed') {
    discountAmount = Number(coupon.value);
  } else if (coupon.type === 'percentage') {
    discountAmount = (cartTotal * Number(coupon.value)) / 100;
    const maxCap = Number(coupon.maxDiscount);
    if (maxCap && discountAmount > maxCap) {
      discountAmount = maxCap;
    }
  }

  discountAmount = Math.min(discountAmount, cartTotal);
  discountAmount = Math.round(discountAmount); // Round to nearest integer

  const finalTotal = cartTotal - discountAmount;

  return res.json({
    valid: true,
    discountAmount,
    finalTotal,
    message: `Coupon applied! You save ₹${discountAmount}.`
  });
});

// Admin Coupon Routes
app.get('/api/admin/coupons', requireAdmin, (req, res) => {
  res.json(getCoupons());
});

app.post('/api/admin/coupons', requireAdmin, (req, res) => {
  const coupons = getCoupons();
  const newCoupon = req.body;

  // Auto-assign next ID
  const maxId = coupons.reduce((max, c) => Math.max(max, c.id || 0), 0);
  newCoupon.id = maxId + 1;
  newCoupon.code = newCoupon.code.toUpperCase();

  coupons.push(newCoupon);
  saveCoupons(coupons);

  res.status(201).json(newCoupon);
});

app.put('/api/admin/coupons/:id', requireAdmin, (req, res) => {
  let coupons = getCoupons();
  const id = parseInt(req.params.id);
  const index = coupons.findIndex(c => c.id === id);

  if (index !== -1) {
    coupons[index] = { ...coupons[index], ...req.body, id };
    coupons[index].code = coupons[index].code.toUpperCase();
    saveCoupons(coupons);
    res.json(coupons[index]);
  } else {
    res.status(404).json({ error: "Coupon not found" });
  }
});

app.delete('/api/admin/coupons/:id', requireAdmin, (req, res) => {
  let coupons = getCoupons();
  const id = parseInt(req.params.id);
  const initialLength = coupons.length;

  coupons = coupons.filter(c => c.id !== id);

  if (coupons.length < initialLength) {
    saveCoupons(coupons);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Coupon not found" });
  }
});

// Policies page route
app.get('/policies', (req, res) => {
  res.sendFile(path.join(__dirname, 'policies.html'));
});

// Landing page template handler
// fs already required at the top
function serveLandingPage(res, data) {
  const templatePath = path.join(__dirname, 'landing-page.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // Build local service schema from page data
  const localSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Florist"],
    "@id": "https://rosenpetals.com",
    "name": "Rose n Petals",
    "url": data.canonical,
    "telephone": "+917289996804",
    "image": "https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505186/Royal_Sunflower_z1zf1o.png",
    "logo": "https://rosenpetals.com/Logo.jpg",
    "foundingDate": "1999",
    "priceRange": "₹200 - ₹2000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No. 14, KD Market, Block D, Sector 18, Kavi Nagar",
      "addressLocality": "Ghaziabad",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.6692,
      "longitude": 77.4538
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "08:00",
        "closes": "22:00"
      }
    ],
    "areaServed": {
      "@type": "Place",
      "name": data.areaName
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": data.h1,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": data.h1,
            "url": data.canonical
          },
          "priceCurrency": "INR",
          "price": "200",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  });

  html = html.replace(/\{\{PAGE_TITLE\}\}/g, data.title);
  html = html.replace(/\{\{META_DESCRIPTION\}\}/g, data.description);
  html = html.replace(/\{\{CANONICAL_URL\}\}/g, data.canonical);
  html = html.replace(/\{\{BREADCRUMB_SCHEMA\}\}/g, data.breadcrumb);
  html = html.replace(/\{\{LOCAL_SCHEMA\}\}/g, localSchema);
  html = html.replace(/\{\{PAGE_SLUG\}\}/g, data.slug);
  html = html.replace(/\{\{H1\}\}/g, data.h1);
  html = html.replace(/\{\{LEAD_TEXT\}\}/g, data.leadText);
  html = html.replace(/\{\{WHY_CONTENT\}\}/g, data.whyContent || '');
  html = html.replace(/\{\{FAQ_CONTENT\}\}/g, data.faqContent || '');
  res.send(html);
}

// --- BATCH 1: GENERAL PAGES ---

app.get('/flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Ghaziabad | Same Day – Rose n Petals',
    description: 'Order fresh flower bouquets in Ghaziabad with 1-hour delivery. Starting ₹200. Serving all of Ghaziabad. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-ghaziabad',
    slug: 'flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery in Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"}]}',
    h1: 'Flower Delivery in Ghaziabad',
    leadText: 'Rose n Petals delivers fresh handmade bouquets across all of Ghaziabad in under 1 hour. Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara and more. Orders via WhatsApp — no app needed. Starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/online-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Online Flower Delivery Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Order flowers online in Ghaziabad. Fresh handmade bouquets delivered in 1 hour. Starting ₹200. WhatsApp +91 7289996804. No app needed.',
    canonical: 'https://rosenpetals.com/online-flower-delivery-ghaziabad',
    slug: 'online-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Online Flower Delivery Ghaziabad","item":"https://rosenpetals.com/online-flower-delivery-ghaziabad"}]}',
    h1: 'Online Flower Delivery in Ghaziabad',
    leadText: 'Experience fast and reliable online flower delivery in Ghaziabad. Fresh handmade bouquets delivered to your doorstep in under 1 hour, starting from just ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/bouquet-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Bouquet Delivery in Ghaziabad | Fresh – Rose n Petals',
    description: 'Fresh handmade bouquets delivered across Ghaziabad in 1 hour. Starting ₹200. Order on WhatsApp — fast, easy, personal.',
    canonical: 'https://rosenpetals.com/bouquet-delivery-ghaziabad',
    slug: 'bouquet-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Bouquet Delivery Ghaziabad","item":"https://rosenpetals.com/bouquet-delivery-ghaziabad"}]}',
    h1: 'Bouquet Delivery in Ghaziabad',
    leadText: 'Get beautiful, fresh bouquet delivery in Ghaziabad. Our handmade floral arrangements are delivered in under 1 hour. Starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/send-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Send Flowers in Ghaziabad | 1-Hour Delivery – Rose n Petals',
    description: 'Send fresh flowers anywhere in Ghaziabad in 1 hour. Handmade bouquets from ₹200. WhatsApp us to order — +91 7289996804.',
    canonical: 'https://rosenpetals.com/send-flowers-ghaziabad',
    slug: 'send-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Send Flowers Ghaziabad","item":"https://rosenpetals.com/send-flowers-ghaziabad"}]}',
    h1: 'Send Flowers in Ghaziabad',
    leadText: 'Send flowers to your loved ones anywhere in Ghaziabad with ease. Delivered fresh in under 1 hour, starting from ₹200. Order via WhatsApp.',
    areaName: 'Ghaziabad'
  });
});

app.get('/order-flowers-online-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Order Flowers Online Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers online in Ghaziabad. Delivered in 1 hour. Bouquets from ₹200. Simple WhatsApp ordering — no app or account needed.',
    canonical: 'https://rosenpetals.com/order-flowers-online-ghaziabad',
    slug: 'order-flowers-online-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Order Flowers Online Ghaziabad","item":"https://rosenpetals.com/order-flowers-online-ghaziabad"}]}',
    h1: 'Order Flowers Online in Ghaziabad',
    leadText: 'Order flowers online in Ghaziabad seamlessly through WhatsApp. Fresh handmade bouquets delivered in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/florist-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Florist in Ghaziabad | Fresh Bouquets – Rose n Petals',
    description: 'Looking for a florist in Ghaziabad? Rose n Petals offers fresh handmade bouquets with 1-hour delivery. Starting ₹200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/florist-ghaziabad',
    slug: 'florist-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Florist in Ghaziabad","item":"https://rosenpetals.com/florist-ghaziabad"}]}',
    h1: 'Local Florist in Ghaziabad',
    leadText: 'Rose n Petals is your trusted local florist in Ghaziabad. Enjoy fresh handmade bouquets delivered in under 1 hour, starting at ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/flower-shop-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Shop in Ghaziabad | Rose n Petals',
    description: 'Rose n Petals is Ghaziabads local flower shop. Fresh handmade bouquets from ₹200. 1-hour delivery across all of Ghaziabad. Order on WhatsApp.',
    canonical: 'https://rosenpetals.com/flower-shop-ghaziabad',
    slug: 'flower-shop-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Shop Ghaziabad","item":"https://rosenpetals.com/flower-shop-ghaziabad"}]}',
    h1: 'Flower Shop in Ghaziabad',
    leadText: 'Visit the premier flower shop in Ghaziabad or order via WhatsApp. We deliver fresh, stunning bouquets in under 1 hour from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/fresh-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Fresh Flowers Ghaziabad | Daily Delivery – Rose n Petals',
    description: 'Get fresh flowers delivered daily across Ghaziabad. Handmade bouquets starting Rs.200. 1-hour delivery. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/fresh-flowers-ghaziabad',
    slug: 'fresh-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Fresh Flowers Ghaziabad","item":"https://rosenpetals.com/fresh-flowers-ghaziabad"}]}',
    h1: 'Fresh Flowers in Ghaziabad',
    leadText: 'Discover the best fresh flowers in Ghaziabad. Delivered in under 1 hour across the city, our handmade bouquets start from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/rose-bouquet-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Rose Bouquet Delivery Ghaziabad | Rose n Petals',
    description: 'Order rose bouquets in Ghaziabad with 1-hour delivery. Red roses, pink roses, mixed rose bouquets from Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/rose-bouquet-delivery-ghaziabad',
    slug: 'rose-bouquet-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Rose Bouquet Delivery Ghaziabad","item":"https://rosenpetals.com/rose-bouquet-delivery-ghaziabad"}]}',
    h1: 'Rose Bouquet Delivery in Ghaziabad',
    leadText: 'Specialized rose bouquet delivery in Ghaziabad. Perfect for any occasion, delivered fresh in under 1 hour. Prices starting at ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/mixed-flower-bouquet-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Mixed Flower Bouquet Ghaziabad | Rose n Petals',
    description: 'Order mixed flower bouquets in Ghaziabad. Colourful handmade arrangements from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/mixed-flower-bouquet-ghaziabad',
    slug: 'mixed-flower-bouquet-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Mixed Flower Bouquet Ghaziabad","item":"https://rosenpetals.com/mixed-flower-bouquet-ghaziabad"}]}',
    h1: 'Mixed Flower Bouquet in Ghaziabad',
    leadText: 'Brighten someone\'s day with a vibrant mixed flower bouquet in Ghaziabad. Delivered quickly in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

// --- BATCH 2: LOCAL AREA PAGES ---

app.get('/flower-delivery-indirapuram', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Indirapuram | 1-Hour – Rose n Petals',
    description: 'Fresh bouquets delivered in Indirapuram, Ghaziabad in 1 hour. Near Shipra Mall and Gyan Khand. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-indirapuram',
    slug: 'flower-delivery-indirapuram',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Indirapuram","item":"https://rosenpetals.com/flower-delivery-indirapuram"}]}',
    h1: 'Flower Delivery in Indirapuram, Ghaziabad',
    leadText: 'Rose n Petals delivers fresh bouquets to Indirapuram in under 1 hour. We cover all sectors and societies in Indirapuram. Handmade bouquets from ₹200. Order on WhatsApp.',
    areaName: 'Indirapuram',
    whyContent: `<h2>Why Rose n Petals Delivers to Indirapuram</h2><p>Indirapuram is a large township, and we cover it in full — Nyay Khand, Niti Khand, Vaibhav Khand, Shipra Sun City, and the adjoining residential blocks that have grown around the main Indirapuram grid. From our Kavi Nagar shop in Sector 18, the drive to Indirapuram typically runs 30 to 40 minutes under normal traffic conditions.</p><p>We are not an app or a platform routing your order to whoever is nearest — we make your bouquet in our own shop and our own person brings it to you. That means consistency — what we make is what arrives, and it arrives in the same condition it left the shop. Our florist has been delivering to Indirapuram for years and knows the township's blocks well enough to navigate specific addresses without delay.</p><p>Bouquets start at ₹200 and are made the day you order them. With 26 years of Ghaziabad flower delivery behind us, we have a mapped route and a reliable record for this part of the city.</p><h3>About Our Bouquets</h3><p>At our Kavi Nagar shop, every order begins fresh. We do not store assembled bouquets overnight. Our florist — who has been at this work since 1999 — selects stems and arranges each bouquet after the order is confirmed. Roses, lilies, gerberas, carnations, sunflowers, and seasonal mixed arrangements are all available.</p><p>The starting price of ₹200 puts fresh, handmade flowers within reach for any occasion. We can work within any budget from there, whether you want a simple single-flower bunch or a large multi-stem celebration arrangement.</p><h3>How to Order from Indirapuram</h3><p>Message us on WhatsApp at +91 7289996804. Tell us your Indirapuram block or society name, the occasion, and your budget. We will confirm the delivery time and suggest options if you need guidance. UPI and bank transfer are the only accepted payment methods. Once confirmed, your bouquet is made and dispatched. We are open 8 AM to 10 PM daily, without exception.</p>`,
    faqContent: `<h2>Indirapuram — Frequently Asked Questions</h2><details><summary>How long does delivery take to Indirapuram from your shop?</summary><p>From our Kavi Nagar shop, average delivery to Indirapuram is 30 to 40 minutes. During peak traffic hours in the evening, allow up to 50 minutes for certain blocks. WhatsApp us your address and we will give you an honest time estimate before you confirm.</p></details><details><summary>Do you deliver to Shipra Sun City?</summary><p>Yes. Shipra Sun City is within our regular Indirapuram delivery coverage. Share your tower and flat number when ordering on WhatsApp so we can coordinate entry at the gate without any hold-up on arrival.</p></details><details><summary>Can I order flowers for early morning delivery to an Indirapuram address?</summary><p>We open at 8 AM every day. For early-morning surprises — birthdays, anniversaries — we recommend WhatsApping us the evening before so we can prepare and dispatch as soon as the shop opens.</p></details>`
  });
});

app.get('/flower-delivery-vaishali-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vaishali Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Vaishali, Ghaziabad. Delivered in 1 hour. Bouquets from Rs.200. Near Vaishali Metro. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vaishali-ghaziabad',
    slug: 'flower-delivery-vaishali-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vaishali","item":"https://rosenpetals.com/flower-delivery-vaishali-ghaziabad"}]}',
    h1: 'Flower Delivery in Vaishali, Ghaziabad',
    leadText: 'Get fresh flowers delivered to your door in Vaishali, Ghaziabad in under 1 hour. Rose n Petals serves all of Vaishali Sector 1, 2, 3, 4, 5 and 6. Bouquets from ₹200.',
    areaName: 'Vaishali',
    whyContent: `<h2>Why Rose n Petals Delivers to Vaishali</h2><p>Vaishali is a well-connected part of Ghaziabad — the Metro station brings a mix of residents and commuters, and the residential sectors surrounding it have consistent demand for same-day gifting. We cover Vaishali Sector 3, Sector 4, and the surrounding residential areas. From our Kavi Nagar shop, the route to Vaishali runs approximately 25 to 35 minutes under typical traffic.</p><p>The shop is a known Ghaziabad presence with 26 years of operation — not because of advertising, but because residents who have ordered from us tell others. If you are near Vaishali Metro or in one of the residential towers in Sector 4, we are within a straightforward delivery range.</p><p>Every order is made by hand in our Kavi Nagar shop and brought to your door by our own delivery person. Bouquets start at ₹200. WhatsApp us what you need and we will have it at your Vaishali address before you expect it.</p><h3>About Our Bouquets</h3><p>Our bouquets are made by hand in our Kavi Nagar shop, not assembled in batches or sourced from a shared warehouse. The florist who makes your bouquet has been working with flowers since 1999 and understands which arrangements suit which moments — birthdays call for colour, anniversaries for elegance, get-well visits for something warm and simple.</p><p>Prices begin at ₹200 and there is genuine range and care at every price point. Tell us the occasion and your budget, and we will suggest the right arrangement for both.</p><h3>How to Order from Vaishali</h3><p>Send a WhatsApp message to +91 7289996804 with your sector, society name, and flat number in Vaishali, the occasion, and your budget. We confirm availability and dispatch time, then begin preparation after payment is received via UPI or bank transfer. Open every day, 8 AM to 10 PM.</p>`,
    faqContent: `<h2>Vaishali — Frequently Asked Questions</h2><details><summary>How long does delivery to Vaishali Sector 4 take?</summary><p>From our shop in Kavi Nagar Sector 18, delivery to Vaishali Sector 4 typically takes 25 to 35 minutes. Sector 3 is similar. If traffic is heavy on the NH9 corridor, we will tell you before you confirm the order so you can decide.</p></details><details><summary>Can you deliver flowers to an office near Vaishali Metro?</summary><p>Yes. For office deliveries near Vaishali Metro, share the building name, floor, and recipient's name. We recommend ordering before 5 PM for office addresses to ensure your recipient is still available to receive the bouquet.</p></details><details><summary>Do you deliver on weekends to Vaishali?</summary><p>Every day of the week, including Sundays and public holidays. Our hours are 8 AM to 10 PM seven days a week. Vaishali residents can order any day they need flowers — no exceptions.</p></details>`
  });
});

app.get('/flower-delivery-vasundhara-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vasundhara Ghaziabad | Rose n Petals',
    description: 'Fresh bouquets delivered in Vasundhara, Ghaziabad in 1 hour. Starting Rs.200. Handmade with care. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad',
    slug: 'flower-delivery-vasundhara-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vasundhara","item":"https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad"}]}',
    h1: 'Flower Delivery in Vasundhara, Ghaziabad',
    leadText: 'Rose n Petals delivers fresh bouquets to Vasundhara in under 1 hour. We serve all sectors in Vasundhara. Handmade bouquets start from ₹200.',
    areaName: 'Vasundhara',
    whyContent: `<h2>Why Rose n Petals Delivers to Vasundhara</h2><p>Vasundhara spans a wide number of sectors — from Sector 1 near the Ghaziabad city centre to Sector 16 at the edge closest to Crossing Republik. We cover the full range. From our Kavi Nagar shop, delivery to central Vasundhara sectors 4 through 9 takes approximately 30 to 40 minutes. The outer sectors near the Crossing Republik boundary are slightly farther and may take 40 to 50 minutes depending on the specific address.</p><p>Vasundhara has grown rapidly over the past decade and we have grown with it — adding routes and coverage as the township expanded. Whether you are in one of Vasundhara's older sectors or in a society that has come up recently along the outer ring, we have a delivery route to your door.</p><p>Every bouquet is made fresh at our Kavi Nagar shop and dispatched the same day. Starting at ₹200 and built by hand by a florist with 26 years of experience, the quality holds regardless of which sector you are in.</p><h3>About Our Bouquets</h3><p>Made by hand, made the day you order. That has been the standard at our shop since 1999. The florist does not pre-assemble bouquets for delivery areas in advance — each arrangement is built after your order is confirmed, using whichever flowers are freshest that day. Roses, carnations, lilies, sunflowers, and mixed seasonal arrangements are all available, beginning at ₹200. Whatever your occasion — birthday, anniversary, housewarming, or just because — we can work within your budget and make something that fits the moment.</p><h3>How to Order from Vasundhara</h3><p>WhatsApp +91 7289996804 with your Vasundhara sector number, society name, flat number, and the occasion and budget for the bouquet. We will confirm expected delivery time based on your sector and current conditions. Payment is via UPI or bank transfer. We are open every day, 8 AM to 10 PM.</p>`,
    faqContent: `<h2>Vasundhara — Frequently Asked Questions</h2><details><summary>Do you deliver to all sectors in Vasundhara?</summary><p>Yes — Sector 1 through Sector 16. If you are in an outer sector or a newer housing society, let us know the full address on WhatsApp and we will confirm delivery time before you pay.</p></details><details><summary>I need flowers for a Vasundhara address and I am not in Ghaziabad myself. Can I order remotely?</summary><p>Yes. Many of our orders are placed by people who are in other cities or countries and want to send flowers to someone in Ghaziabad. WhatsApp us the recipient's full Vasundhara address and a contact number for them. We handle the delivery and message you when it is done.</p></details><details><summary>What is the latest I can order for same-day Vasundhara delivery?</summary><p>Same-day orders are accepted until 9 PM for most Vasundhara sectors. For the outer sectors near Crossing Republik, place your order by 8:30 PM to allow delivery by 10 PM. WhatsApp us if you are cutting it close and we will be honest about what is achievable.</p></details>`
  });
});

app.get('/flower-delivery-raj-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Raj Nagar Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Raj Nagar, Ghaziabad. Delivered in 1 hour. Near RDC Zone. Bouquets from Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad',
    slug: 'flower-delivery-raj-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Raj Nagar","item":"https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad"}]}',
    h1: 'Flower Delivery in Raj Nagar, Ghaziabad',
    leadText: 'Fresh bouquet delivery in Raj Nagar and Raj Nagar Extension, Ghaziabad. Delivered in under 1 hour by Rose n Petals. Handmade bouquets starting from ₹200.',
    areaName: 'Raj Nagar',
    whyContent: `<h2>Why Rose n Petals Delivers to Raj Nagar</h2><p>Raj Nagar has grown in two directions over the past decade — along the established roads of Raj Nagar proper and into the wider Raj Nagar Extension that stretches along the NH58 corridor. We cover both. From our Kavi Nagar shop in Sector 18, the route to Raj Nagar takes approximately 20 to 35 minutes depending on traffic and the specific address.</p><p>Raj Nagar Extension, which extends further out toward the highway, typically receives delivery within 35 to 45 minutes. Whether you are in one of the older residential blocks of Raj Nagar proper or one of the newer housing societies that have come up in the Extension, we have made deliveries there.</p><p>This is a shop that has been serving Ghaziabad since 1999 and knows this city's geography well enough to navigate without delays. Every bouquet starts at ₹200 and is made by hand in our own shop — not dispatched from a warehouse or subcontracted to a third party.</p><h3>About Our Bouquets</h3><p>Whether the occasion is a birthday, an anniversary, or something that simply needs flowers, our bouquets are made by hand at our Kavi Nagar shop — not ordered in from a warehouse. We use roses, lilies, carnations, sunflowers, gerberas, and mixed seasonal arrangements depending on what is freshest and what fits the occasion.</p><p>Prices start at ₹200. There is no fixed bouquet menu — tell us what you have in mind and we will build it to your budget and brief. The florist who makes your arrangement has been working with flowers since 1999.</p><h3>How to Order from Raj Nagar</h3><p>WhatsApp +91 7289996804 with your delivery address in Raj Nagar or Raj Nagar Extension, the occasion, and your budget. We will confirm availability and delivery time for your specific address. Payment is via UPI or bank transfer before dispatch. We are open every day from 8 AM to 10 PM.</p>`,
    faqContent: `<h2>Raj Nagar — Frequently Asked Questions</h2><details><summary>Do you deliver to Raj Nagar Extension?</summary><p>Yes. Raj Nagar Extension along the NH58 corridor is within our delivery range. Average delivery time from our Kavi Nagar shop is 35 to 45 minutes to most Extension addresses. WhatsApp us your full address and we will confirm the estimated time before you pay.</p></details><details><summary>What is the latest time I can order for same-day delivery to Raj Nagar?</summary><p>For same-day delivery to Raj Nagar and Raj Nagar Extension, place your order by 9 PM. We are open until 10 PM and will deliver as long as the bouquet can be made and dispatched within operating hours.</p></details><details><summary>Can you deliver to an office address in Raj Nagar for a colleague?</summary><p>Yes. Office deliveries in Raj Nagar are part of our regular coverage. Include the company name, floor, and recipient's name when ordering on WhatsApp. For a discreet desk delivery, mention it when you message us and we will coordinate accordingly.</p></details>`
  });
});

app.get('/flower-delivery-kavi-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Kavi Nagar Ghaziabad | Rose n Petals',
    description: 'Rose n Petals is based in Kavi Nagar, Ghaziabad. Fresh bouquets delivered in 1 hour. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad',
    slug: 'flower-delivery-kavi-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Kavi Nagar","item":"https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad"}]}',
    h1: 'Flower Delivery in Kavi Nagar, Ghaziabad',
    leadText: 'Rose n Petals is your local florist in Kavi Nagar, Ghaziabad. We are based in KD Market, Sector 18, Kavi Nagar and deliver fresh handmade bouquets starting from ₹200.',
    areaName: 'Kavi Nagar',
    whyContent: `<h2>Why Rose n Petals Delivers to Kavi Nagar</h2><p>Our shop is here. Shop No. 14, KD Market, Block D, Sector 18 — that is where every bouquet in this list begins. When you order flowers for a delivery in Kavi Nagar, you are ordering from a shop that sits in the middle of the area it serves. There is no routing, no middleman, no delay from handoff to handoff.</p><p>The florist makes your bouquet and a delivery person walks it out the door, often within 20 minutes. Kavi Nagar residents get the fastest delivery we offer because we have been your Sector 18 neighbours since 1999. We know the lanes behind KD Market, the residential blocks off the main road, the gated societies near Anil Vihar — we have delivered to all of it.</p><p>For a same-day surprise, a spontaneous birthday gesture, or a doorstep delivery that needs to happen in the next 30 minutes, this is your shop. Bouquets start at ₹200 and are made by hand the day you order them — every single one.</p><h3>About Our Bouquets</h3><p>Every bouquet leaving our Kavi Nagar shop is made the same morning or afternoon you place the order. We do not stock pre-arranged bouquets waiting on a shelf. Roses, carnations, lilies, sunflowers, gerberas, and mixed seasonal flowers — all arranged by our florist, who has been doing this since 1999.</p><p>Starting at ₹200, the range covers occasions from a simple thank-you gesture to a full romantic anniversary arrangement. Tell us your budget and what the bouquet is for, and we will make something worth giving.</p><h3>How to Order from Kavi Nagar</h3><p>Send a WhatsApp message to +91 7289996804. Tell us your occasion, budget, and delivery address within Kavi Nagar. We confirm availability, suggest options if helpful, and once payment is received via UPI or bank transfer, we begin preparation immediately. For Kavi Nagar addresses, expect delivery in under 30 minutes in most cases. We are open 8 AM to 10 PM, every day, including Sundays and public holidays.</p>`,
    faqContent: `<h2>Kavi Nagar — Frequently Asked Questions</h2><details><summary>How fast can you deliver within Kavi Nagar?</summary><p>Our shop is in Sector 18, KD Market. For most Kavi Nagar addresses, we deliver in 20 to 30 minutes from the time your order is confirmed. It is the fastest delivery window we offer anywhere in Ghaziabad.</p></details><details><summary>Can I walk in to the shop and order directly?</summary><p>Yes. Shop No. 14, KD Market, Block D, Sector 18 is open every day from 8 AM to 10 PM. You can walk in, choose what you want, and take it with you or arrange same-day delivery from the counter.</p></details><details><summary>Do you deliver to gated societies in Kavi Nagar?</summary><p>Yes. We have delivered to residential societies and gated colonies across Kavi Nagar since 1999. When placing your order on WhatsApp, share the society name, block, and flat number. We coordinate with the gate or the guard as needed.</p></details>`
  });
});

app.get('/flower-delivery-mohan-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Mohan Nagar Ghaziabad | Rose n Petals',
    description: 'Fresh flowers delivered in Mohan Nagar, Ghaziabad in 1 hour. Handmade bouquets from Rs.200. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad',
    slug: 'flower-delivery-mohan-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Mohan Nagar","item":"https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad"}]}',
    h1: 'Flower Delivery in Mohan Nagar, Ghaziabad',
    leadText: 'Send fresh flowers to Mohan Nagar, Ghaziabad with our quick 1-hour delivery service. Handmade beautiful bouquets starting from ₹200.',
    areaName: 'Mohan Nagar',
    whyContent: `<h2>Why Rose n Petals Delivers to Mohan Nagar</h2><p>Mohan Nagar is one of Ghaziabad's busiest commercial and residential zones — the Metro station at Mohan Nagar makes it a well-connected hub, and the mix of offices, markets, and residential societies means there is steady demand for same-day flowers. We deliver across the Mohan Nagar area from our Kavi Nagar shop, with average delivery times in the range of 25 to 40 minutes depending on the address and traffic conditions.</p><p>The commercial character of Mohan Nagar means we handle office deliveries, market deliveries, and residential deliveries in this area regularly. Whether you are sending flowers to a colleague's desk near the Metro or arranging a birthday surprise for someone in one of the housing societies, we have a consistent delivery record here.</p><p>The shop has been operating across Ghaziabad's delivery areas since 1999 — enough time to know the Mohan Nagar routes and the timing at different hours. Every bouquet starts at ₹200 and is handmade in our Kavi Nagar shop.</p><h3>About Our Bouquets</h3><p>Each bouquet is made by hand in our Kavi Nagar shop on the day the order arrives. We do not use pre-packed flower boxes or reuse arrangements from previous orders. The florist selects stems — roses, carnations, gerberas, lilies, sunflowers, seasonal mixed flowers — based on freshness and what the occasion calls for. Starting at ₹200, the range is wide enough to suit both a spontaneous gesture and a considered gift. There is no minimum order amount required to receive the same handmade care.</p><h3>How to Order from Mohan Nagar</h3><p>WhatsApp +91 7289996804 with the full delivery address in Mohan Nagar — building name or society, floor or house number, and the recipient's name — along with the occasion and your budget. We confirm availability and estimated delivery time before you pay. Payment is via UPI or bank transfer only. We are open every day from 8 AM to 10 PM.</p>`,
    faqContent: `<h2>Mohan Nagar — Frequently Asked Questions</h2><details><summary>Can you deliver to office addresses near Mohan Nagar Metro?</summary><p>Yes. Office deliveries near Mohan Nagar Metro are part of our regular coverage. Include the company name, floor, and recipient's name when ordering. For a discreet delivery, mention that when you WhatsApp us and we will ensure the bouquet reaches the right person.</p></details><details><summary>How long does delivery from Kavi Nagar to Mohan Nagar take?</summary><p>Average delivery time from our shop to Mohan Nagar addresses is 25 to 40 minutes. Traffic on the main roads can vary, especially in the evening. We give you an honest time estimate when you place your order, so there are no surprises.</p></details><details><summary>What is the latest order time for Mohan Nagar same-day delivery?</summary><p>Same-day orders for Mohan Nagar are accepted until 9 PM, with delivery by 10 PM. Order by 8:30 PM if you want extra comfort in the timeline. We are open until 10 PM every day.</p></details>`
  });
});

app.get('/flower-delivery-vijay-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vijay Nagar Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Vijay Nagar, Ghaziabad. Delivered in 1 hour. Bouquets from Rs.200. Handmade daily. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad',
    slug: 'flower-delivery-vijay-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vijay Nagar","item":"https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad"}]}',
    h1: 'Flower Delivery in Vijay Nagar, Ghaziabad',
    leadText: 'Reliable flower delivery in Vijay Nagar, Ghaziabad. Get your fresh handmade bouquets delivered in under 1 hour, starting from just ₹200.',
    areaName: 'Vijay Nagar',
    whyContent: `<h2>Why Rose n Petals Delivers to Vijay Nagar</h2><p>Vijay Nagar sits close to our Kavi Nagar base and is one of the areas where we offer some of the fastest delivery windows across Ghaziabad. The main market of Vijay Nagar and the surrounding housing societies and residential blocks are all within straightforward reach — average delivery from our shop in Sector 18 runs 20 to 30 minutes for most Vijay Nagar addresses.</p><p>This part of Ghaziabad has a mix of long-established residential neighbourhoods and newer housing developments, and we have been delivering flowers here throughout our 26 years in business. If you need flowers on short notice — a birthday that came up suddenly, a get-well delivery that cannot wait, a thank-you arrangement before an event — Vijay Nagar is one of our fastest delivery areas.</p><p>Every bouquet starts at ₹200 and is made by hand by a florist who has been at this craft since 1999. WhatsApp us and we will have your arrangement on its way quickly.</p><h3>About Our Bouquets</h3><p>Made by hand, made that day — our florist at the Kavi Nagar shop does not build a backlog of pre-arranged bouquets waiting for orders. Each arrangement is assembled after your order is confirmed and paid. Roses, carnations, sunflowers, lilies, gerberas, and a range of mixed seasonal flowers are available in arrangements from ₹200 upward. The budget you set determines the size and quantity of the arrangement. The handmade quality is consistent regardless of the price point — that has been our standard since 1999.</p><h3>How to Order from Vijay Nagar</h3><p>Send a WhatsApp message to +91 7289996804. Include your Vijay Nagar address — society or lane name and house number — the occasion, and your budget. We will confirm delivery time, usually 20 to 30 minutes for this area, and send payment details. We are open every day from 8 AM to 10 PM.</p>`,
    faqContent: `<h2>Vijay Nagar — Frequently Asked Questions</h2><details><summary>Is Vijay Nagar one of your faster delivery areas?</summary><p>Yes. Vijay Nagar is close to our Kavi Nagar shop in Sector 18. For most Vijay Nagar addresses, we deliver in 20 to 30 minutes from the time the order is confirmed and paid. It is among the shortest delivery windows we offer across Ghaziabad.</p></details><details><summary>Do you cover the housing societies near Vijay Nagar main market?</summary><p>Yes. We deliver to the residential colonies, housing societies, and standalone homes throughout Vijay Nagar. WhatsApp us your exact address and we will confirm delivery without issue.</p></details><details><summary>Can I get flowers delivered to Vijay Nagar on the same evening I order?</summary><p>As long as you order before 9 PM, we can deliver the same evening for Vijay Nagar addresses. We are open until 10 PM and Vijay Nagar's proximity to our shop means even late-evening orders can be fulfilled comfortably.</p></details>`
  });
});

app.get('/flower-delivery-crossing-republik-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery Crossing Republik Ghaziabad | Rose n Petals',
    description: 'Fresh bouquets delivered in Crossing Republik, Ghaziabad in 1 hour. Starting Rs.200. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad',
    slug: 'flower-delivery-crossing-republik-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Crossing Republik","item":"https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad"}]}',
    h1: 'Flower Delivery in Crossing Republik, Ghaziabad',
    leadText: 'Fast and fresh flower delivery in Crossing Republik, Ghaziabad. Delight your loved ones in under 1 hour with bouquets starting from ₹200.',
    areaName: 'Crossing Republik',
    whyContent: `<h2>Why Rose n Petals Delivers to Crossing Republik</h2><p>Crossing Republik is the farthest township we cover, and we want to be upfront about that. It is approximately 45 to 60 minutes from our Kavi Nagar shop, depending on traffic. We say this not as a disclaimer but as a commitment — we have mapped the route, we make the drive, and we have been delivering to Crossing Republik consistently.</p><p>The township is one of Ghaziabad's largest planned residential areas, and the people who live there deserve fresh flowers from a shop that actually makes them — not from a platform that subcontracts out to whoever is available. When you order from us, the same florist who has been making bouquets since 1999 makes yours. The drive takes a bit longer, but what arrives at your door is built with the same care as an order for our next-door Kavi Nagar neighbour.</p><p>Bouquets start at ₹200. For Crossing Republik orders, we recommend placing your order by 8:30 PM to ensure delivery within our 10 PM closing.</p><h3>About Our Bouquets</h3><p>Our flowers are made by hand, in our shop, on the day you order them. For a Crossing Republik delivery, we build the bouquet fresh before dispatching — so even with the travel time, your recipient receives flowers assembled that same day, not pre-packed the night before. Roses, sunflowers, lilies, carnations, gerberas, and mixed arrangements are available starting at ₹200. Tell us the occasion and your budget and we will work with both, producing an arrangement that arrives looking exactly as it did when it left our Kavi Nagar shop.</p><h3>How to Order from Crossing Republik</h3><p>WhatsApp +91 7289996804 with your Crossing Republik society name, tower or block, flat number, and the recipient's contact number. Include your occasion and budget. We will confirm the expected delivery window. Payment via UPI or bank transfer before dispatch. We are open 8 AM to 10 PM every day. For Crossing Republik deliveries, order by 8:30 PM to allow comfortable delivery within operating hours.</p>`,
    faqContent: `<h2>Crossing Republik — Frequently Asked Questions</h2><details><summary>How long does delivery to Crossing Republik take?</summary><p>From our Kavi Nagar shop, delivery to Crossing Republik takes approximately 45 to 60 minutes depending on traffic. We will give you an honest window when you WhatsApp your order. We do not accept Crossing Republik orders after 8:30 PM to ensure delivery within our 10 PM close.</p></details><details><summary>Is Crossing Republik within your delivery coverage area?</summary><p>Yes. It is our farthest delivery area and we cover it by design. We are the Ghaziabad-based florist making your bouquet and sending our own person — so the commitment holds even for the drive to Crossing Republik.</p></details><details><summary>Can you deliver to a specific tower in a large society?</summary><p>Yes. Share the society name, tower, flat number, and a contact number for your recipient when ordering on WhatsApp. For gated townships in Crossing Republik, we coordinate with the gate as needed to ensure smooth entry and delivery.</p></details>`
  });
});

// --- BATCH 3: URGENCY PAGES ---

app.get('/same-day-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Same Day Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Same-day flower delivery across Ghaziabad. Order before 9 PM. Fresh bouquets from Rs.200. WhatsApp us now — +91 7289996804.',
    canonical: 'https://rosenpetals.com/same-day-flower-delivery-ghaziabad',
    slug: 'same-day-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Same Day Flower Delivery Ghaziabad","item":"https://rosenpetals.com/same-day-flower-delivery-ghaziabad"}]}',
    h1: 'Same Day Flower Delivery in Ghaziabad',
    leadText: 'Need flowers delivered today in Ghaziabad? We offer same-day delivery in under 1 hour for orders placed before 9 PM. WhatsApp us your order — bouquets start from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/express-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Express Flower Delivery Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Express flower delivery in Ghaziabad in just 1 hour. Fresh handmade bouquets from Rs.200. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/express-flower-delivery-ghaziabad',
    slug: 'express-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Express Flower Delivery Ghaziabad","item":"https://rosenpetals.com/express-flower-delivery-ghaziabad"}]}',
    h1: 'Express Flower Delivery in Ghaziabad',
    leadText: 'In a rush? Choose our express flower delivery in Ghaziabad. Fresh bouquets delivered in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/2-hour-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: '2 Hour Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Need flowers fast? We deliver across Ghaziabad within 1-2 hours. Fresh bouquets from Rs.200. WhatsApp +91 7289996804 right now.',
    canonical: 'https://rosenpetals.com/2-hour-flower-delivery-ghaziabad',
    slug: '2-hour-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"2 Hour Flower Delivery Ghaziabad","item":"https://rosenpetals.com/2-hour-flower-delivery-ghaziabad"}]}',
    h1: '2-Hour Flower Delivery in Ghaziabad',
    leadText: 'Guaranteed 2-hour flower delivery in Ghaziabad, usually arriving in under 1 hour. Fresh handmade bouquets starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/midnight-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Midnight Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Midnight flower delivery in Ghaziabad for surprise moments. Fresh bouquets from Rs.200. WhatsApp us to check availability — +91 7289996804.',
    canonical: 'https://rosenpetals.com/midnight-flower-delivery-ghaziabad',
    slug: 'midnight-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Midnight Flower Delivery Ghaziabad","item":"https://rosenpetals.com/midnight-flower-delivery-ghaziabad"}]}',
    h1: 'Midnight Flower Delivery in Ghaziabad',
    leadText: 'Surprise them at the stroke of midnight with our midnight flower delivery in Ghaziabad. Fresh bouquets from ₹200. Order now on WhatsApp.',
    areaName: 'Ghaziabad'
  });
});

app.get('/urgent-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Urgent Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Urgent flower delivery in Ghaziabad. WhatsApp us now and we will deliver within 1 hour. Fresh bouquets from Rs.200. +91 7289996804.',
    canonical: 'https://rosenpetals.com/urgent-flower-delivery-ghaziabad',
    slug: 'urgent-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Urgent Flower Delivery Ghaziabad","item":"https://rosenpetals.com/urgent-flower-delivery-ghaziabad"}]}',
    h1: 'Urgent Flower Delivery in Ghaziabad',
    leadText: 'Require flowers right now? Use our urgent flower delivery in Ghaziabad. Delivered fresh in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/last-minute-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Last Minute Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Forgot a special occasion? We do last-minute flower delivery in Ghaziabad in 1 hour. From Rs.200. WhatsApp +91 7289996804 now.',
    canonical: 'https://rosenpetals.com/last-minute-flower-delivery-ghaziabad',
    slug: 'last-minute-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Last Minute Flower Delivery Ghaziabad","item":"https://rosenpetals.com/last-minute-flower-delivery-ghaziabad"}]}',
    h1: 'Last Minute Flower Delivery in Ghaziabad',
    leadText: 'Forgot an important date? Try our last minute flower delivery in Ghaziabad. Fresh handmade bouquets delivered in under 1 hour, from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/flower-delivery-today-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery Today in Ghaziabad | Rose n Petals',
    description: 'Need flowers delivered today in Ghaziabad? We deliver in 1 hour. Fresh bouquets from Rs.200. WhatsApp +91 7289996804 right now.',
    canonical: 'https://rosenpetals.com/flower-delivery-today-ghaziabad',
    slug: 'flower-delivery-today-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Today Ghaziabad","item":"https://rosenpetals.com/flower-delivery-today-ghaziabad"}]}',
    h1: 'Flower Delivery Today in Ghaziabad',
    leadText: 'Looking for flower delivery today in Ghaziabad? We deliver fresh, stunning bouquets in under 1 hour. Prices start from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/emergency-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Emergency Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Emergency flower delivery in Ghaziabad. WhatsApp us instantly and we will deliver within 1 hour. Bouquets from Rs.200. +91 7289996804.',
    canonical: 'https://rosenpetals.com/emergency-flower-delivery-ghaziabad',
    slug: 'emergency-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Emergency Flower Delivery Ghaziabad","item":"https://rosenpetals.com/emergency-flower-delivery-ghaziabad"}]}',
    h1: 'Emergency Flower Delivery in Ghaziabad',
    leadText: 'For urgent needs, count on our emergency flower delivery in Ghaziabad. Speedy delivery in under 1 hour for bouquets starting at ₹200.',
    areaName: 'Ghaziabad'
  });
});

// --- BATCH 4: OCCASION PAGES ---

app.get('/birthday-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Birthday Flowers in Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Surprise someone with birthday flowers in Ghaziabad. Fresh bouquets delivered in 1 hour. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/birthday-flowers-ghaziabad',
    slug: 'birthday-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Birthday Flowers Ghaziabad","item":"https://rosenpetals.com/birthday-flowers-ghaziabad"}]}',
    h1: 'Birthday Flowers in Ghaziabad',
    leadText: 'Surprise someone special with fresh birthday flowers delivered in Ghaziabad in under 1 hour. Handmade birthday bouquets starting from ₹200. Order on WhatsApp — fast, simple, and personal.',
    areaName: 'Ghaziabad'
  });
});

app.get('/anniversary-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Anniversary Flowers in Ghaziabad | Rose n Petals',
    description: 'Celebrate your anniversary with fresh flowers in Ghaziabad. Handmade bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/anniversary-flowers-ghaziabad',
    slug: 'anniversary-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Anniversary Flowers Ghaziabad","item":"https://rosenpetals.com/anniversary-flowers-ghaziabad"}]}',
    h1: 'Anniversary Flowers in Ghaziabad',
    leadText: 'Celebrate your anniversary with beautiful fresh flowers delivered anywhere in Ghaziabad in under 1 hour. Romantic bouquets starting from ₹200. WhatsApp us to order.',
    areaName: 'Ghaziabad'
  });
});

app.get('/get-well-soon-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Get Well Soon Flowers Ghaziabad | Rose n Petals',
    description: 'Send get well soon flowers in Ghaziabad. Cheerful fresh bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/get-well-soon-flowers-ghaziabad',
    slug: 'get-well-soon-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Get Well Soon Flowers Ghaziabad","item":"https://rosenpetals.com/get-well-soon-flowers-ghaziabad"}]}',
    h1: 'Get Well Soon Flowers in Ghaziabad',
    leadText: 'Wish a speedy recovery with get well soon flowers in Ghaziabad. Delivered fresh in under 1 hour, beautiful bouquets starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/congratulations-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Congratulations Flowers Ghaziabad | Rose n Petals',
    description: 'Celebrate achievements with congratulations flowers in Ghaziabad. Fresh bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/congratulations-flowers-ghaziabad',
    slug: 'congratulations-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Congratulations Flowers Ghaziabad","item":"https://rosenpetals.com/congratulations-flowers-ghaziabad"}]}',
    h1: 'Congratulations Flowers in Ghaziabad',
    leadText: 'Celebrate achievements with our congratulations flowers in Ghaziabad. Handmade fresh bouquets delivered in under 1 hour from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/sorry-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Sorry Flowers in Ghaziabad | Rose n Petals',
    description: 'Say sorry with fresh flowers in Ghaziabad. Heartfelt bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/sorry-flowers-ghaziabad',
    slug: 'sorry-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Sorry Flowers Ghaziabad","item":"https://rosenpetals.com/sorry-flowers-ghaziabad"}]}',
    h1: 'Sorry Flowers in Ghaziabad',
    leadText: 'Express your sincere apologies with sorry flowers in Ghaziabad. Delivered swiftly in under 1 hour. Thoughtful bouquets starting at ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/romantic-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Romantic Flowers in Ghaziabad | Rose n Petals',
    description: 'Surprise your partner with romantic flowers in Ghaziabad. Red roses and love bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/romantic-flowers-ghaziabad',
    slug: 'romantic-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Romantic Flowers Ghaziabad","item":"https://rosenpetals.com/romantic-flowers-ghaziabad"}]}',
    h1: 'Romantic Flowers in Ghaziabad',
    leadText: 'Express your love with romantic flowers in Ghaziabad. Beautiful, fresh red roses delivered in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/new-baby-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'New Baby Flowers in Ghaziabad | Rose n Petals',
    description: 'Welcome a new baby with fresh flowers in Ghaziabad. Soft pastel bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/new-baby-flowers-ghaziabad',
    slug: 'new-baby-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"New Baby Flowers Ghaziabad","item":"https://rosenpetals.com/new-baby-flowers-ghaziabad"}]}',
    h1: 'New Baby Flowers in Ghaziabad',
    leadText: 'Welcome the little one with new baby flowers in Ghaziabad. Fresh and lovely bouquets delivered in under 1 hour from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/housewarming-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Housewarming Flowers in Ghaziabad | Rose n Petals',
    description: 'Send housewarming flowers in Ghaziabad. Beautiful fresh bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804 to order.',
    canonical: 'https://rosenpetals.com/housewarming-flowers-ghaziabad',
    slug: 'housewarming-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Housewarming Flowers Ghaziabad","item":"https://rosenpetals.com/housewarming-flowers-ghaziabad"}]}',
    h1: 'Housewarming Flowers in Ghaziabad',
    leadText: 'Congratulate them on their new home with housewarming flowers in Ghaziabad. Delivered fresh in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/sympathy-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Sympathy Flowers in Ghaziabad | Rose n Petals',
    description: 'Send sympathy flowers in Ghaziabad with care and respect. Thoughtful bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/sympathy-flowers-ghaziabad',
    slug: 'sympathy-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Sympathy Flowers Ghaziabad","item":"https://rosenpetals.com/sympathy-flowers-ghaziabad"}]}',
    h1: 'Sympathy Flowers in Ghaziabad',
    leadText: 'Express your condolences with sympathy flowers in Ghaziabad. Respectful, fresh bouquets delivered in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

app.get('/diwali-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Diwali Flowers in Ghaziabad | Rose n Petals',
    description: 'Celebrate Diwali with fresh flowers in Ghaziabad. Festive bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/diwali-flowers-ghaziabad',
    slug: 'diwali-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Diwali Flowers Ghaziabad","item":"https://rosenpetals.com/diwali-flowers-ghaziabad"}]}',
    h1: 'Diwali Flowers in Ghaziabad',
    leadText: 'Light up their festive spirit with Diwali flowers in Ghaziabad. Vibrant, fresh bouquets delivered in under 1 hour, starting from ₹200.',
    areaName: 'Ghaziabad'
  });
});

// --- BLOG PAGES ---
app.get(
  '/blog/how-to-keep-bouquet-fresh-north-indian-summer',
  (req, res) => {
    res.sendFile(
      path.join(__dirname, 'blog-keep-fresh.html')
    );
  }
);

app.get('/site.webmanifest', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(path.join(__dirname, 'site.webmanifest'));
});

// ─── SSR Routes ──────────────────────────────────────────────────────────────

// Homepage
app.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    const bestSellers = products.filter(p => p.isbestseller).slice(0, 8);

    const homeBreadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rosenpetals.com" }
      ]
    });

    const categoryStrip = `
      <section class="category-strip">
        <h2>Shop by Occasion</h2>
        <div class="category-cards">
          <a href="/catalog?filter=Birthday" class="category-card"><span>Birthday</span></a>
          <a href="/catalog?filter=Anniversary" class="category-card"><span>Anniversary</span></a>
          <a href="/catalog?filter=Celebration" class="category-card"><span>Celebration</span></a>
          <a href="/catalog?filter=Romantic" class="category-card"><span>Romantic</span></a>
          <a href="/catalog?filter=Get%20Well%20Soon" class="category-card"><span>Get Well Soon</span></a>
          <a href="/catalog?filter=Sorry" class="category-card"><span>Sorry</span></a>
          <a href="/catalog?filter=Same%20Day" class="category-card"><span>Same Day</span></a>
          <a href="/catalog?filter=Sympathy" class="category-card"><span>Sympathy</span></a>
        </div>
      </section>`;

    const ssrContent = `
      <script type="application/ld+json">${homeBreadcrumb}</script>
      <section class="hero-section">
        <div class="hero-content container">
          <span class="hero-label">Ghaziabad's Best Florist</span>
          <h1 style="color:#1A1A1A">Fresh Flower Delivery in Ghaziabad</h1>
          <p style="color:#555555;font-size:16px">Handmade bouquets delivered to your door in under 1 hour.<br>Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali &amp; more.</p>
          <p style="font-size:14px;color:#CC0000;font-weight:500">Starting from &#8377;200 &middot; No app needed &middot; Easy WhatsApp order</p>
          <div class="hero-buttons">
            <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me."
              target="_blank" rel="noopener noreferrer" class="hero-btn-primary">Order on WhatsApp</a>
            <a href="/catalog" class="hero-btn-secondary">Browse Bouquets</a>
          </div>
        </div>
      </section>
      ${categoryStrip}
      <section class="section section-light">
        <div class="container">
          <h2 class="section-title">Best Sellers</h2>
          ${catalogGridHTML(bestSellers)}
        </div>
      </section>

      <section class="section section-light">
        <div class="container">
          <div class="about-card p-4" style="background:white;padding:32px;">
            <h2 class="section-title text-left mb-4" style="text-align:left;">About Rose n Petals</h2>
            <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-bottom:12px;">Ghaziabad's Neighbourhood Florist — Since 1999</h3>
            <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">Rose n Petals has been handcrafting flower bouquets in Ghaziabad since 1999. What started as a small flower shop in Kavi Nagar has grown into one of the most trusted names for flower delivery across Ghaziabad and the NCR. We are not a website that outsources your order to whoever is available. We are a family-run shop — and every bouquet that leaves our hands has been made by us, with flowers we picked that morning.</p>
            <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Fresh Flowers, Every Single Day</h3>
            <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">We source our flowers daily from wholesale flower markets. Roses, lilies, sunflowers, carnations, gerberas — whatever is freshest that morning is what goes into your bouquet. We never use flowers that are more than 24 hours old in our arrangements. This is why customers who order from us come back — because the flowers last, and they look exactly as good in person as they do in the photos.</p>
            <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Delivery Across All of Ghaziabad in Under 1 Hour</h3>
            <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">We deliver to every part of Ghaziabad — Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, Mohan Nagar, Vijay Nagar, and Crossing Republik. Our average delivery time is under 1 hour from the moment you place your order. For urgent orders — last-minute birthdays, forgotten anniversaries — WhatsApp us and we will do our best to get it to you as fast as possible. We have been doing this for 26 years. We know how to move quickly.</p>
            <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Custom Bouquets for Every Occasion</h3>
            <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">Birthdays, anniversaries, graduations, weddings, housewarmings, hospital visits, condolence flowers — we make arrangements for every occasion and every budget. Our bouquets start at &#8377;200 and go up to premium custom designs. If you have a specific flower, colour, or style in mind, just tell us. Custom orders are one of the things we do best — after 26 years, we have made every type of arrangement you can imagine.</p>
            <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Why Order From a Neighbourhood Florist?</h3>
            <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">Large national flower delivery platforms charge high delivery fees, use franchise florists with inconsistent quality, and have no accountability once your order is placed. When you order from Rose n Petals, you are talking directly to the people making your bouquet. If something is not right, you call us — not a customer service centre. We have a 26-year reputation in this city to uphold, and we take that seriously with every single order.</p>
            <div class="mt-4" style="border-top:1px solid #eee;padding-top:16px;">
              <p style="font-size:15px;color:#444;">KD Market, Block D, Sector 18, Kavi Nagar, Ghaziabad – 201002</p>
              <p style="font-size:15px;color:#444;">Phone: <a href="tel:+919810244455" style="color:#CC0000;">+91 9810244455</a></p>
              <p style="font-size:15px;color:#444;">WhatsApp: <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me." target="_blank" rel="noopener noreferrer" style="color:#CC0000;">+91 7289996804</a></p>
              <p style="font-size:15px;color:#444;">Hours: Every day, 8 AM – 10 PM</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <div class="faq-accordion" style="max-width:800px;margin:0 auto;">
            <details style="border-bottom:1px solid #efefef;padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Do you deliver on Sundays and public holidays?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. We are open every day of the year, 8 AM to 10 PM. Sundays, national holidays, festival days — the shop runs regardless. If you need flowers on Diwali morning or on New Year's Day, we are here.</p>
            </details>
            <details style="border-bottom:1px solid #efefef;padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Can I add a personal note with the bouquet?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. When you message us on WhatsApp, simply include the note text. We will handwrite it on a card and include it with the bouquet. There is no extra charge for the note.</p>
            </details>
            <details style="border-bottom:1px solid #efefef;padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">What if I need flowers in under 30 minutes?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">For areas close to our Kavi Nagar shop — including Kavi Nagar itself, parts of Vijay Nagar, and nearby Raj Nagar — delivery in under 30 minutes is often possible. WhatsApp us at +91 7289996804 immediately. We will tell you honestly whether we can make it.</p>
            </details>
            <details style="border-bottom:1px solid #efefef;padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Can I place a same-day order?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. We accept same-day orders until 9 PM for most areas, with delivery by 10 PM. For urgent situations, contact us on WhatsApp and we will confirm what is possible given your location and the current time.</p>
            </details>
            <details style="border-bottom:1px solid #efefef;padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">What payment methods do you accept?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">We accept UPI and bank transfer only. No cash on delivery, no credit card payment at the door. Payment is confirmed before the bouquet enters preparation, which is why delivery is faster.</p>
            </details>
            <details style="border-bottom:1px solid #efefef;padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">What bouquets do you have under &#8377;500?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Our range starts at &#8377;200 and includes rose bouquets, carnation arrangements, gerbera bunches, and mixed combinations. Under &#8377;500, you can get a clean, well-arranged bouquet suitable for birthdays, housewarmings, get well visits, or a simple gesture of affection. Send us a WhatsApp message with your budget and occasion.</p>
            </details>
            <details style="border-bottom:1px solid #efefef;padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">How quickly do you respond on WhatsApp?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">We respond within 5 to 15 minutes during shop hours. For urgent orders, write URGENT in your first message and we will prioritise your order immediately.</p>
            </details>
            <details style="padding:16px 0;">
              <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Can I customise a bouquet?</summary>
              <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. WhatsApp us with your idea — flowers, colours, budget, occasion — and we will create it for you starting from &#8377;200. After 26 years, we have made every type of arrangement you can imagine.</p>
            </details>
          </div>
        </div>
      </section>`;

    const html = buildSSRPage(
      ssrContent,
      products,
      'Flower Delivery in Ghaziabad | Fresh Bouquets — Rose n Petals',
      'Ghaziabad\'s trusted florist since 1999. Fresh handmade bouquets delivered in 1 hour to Kavi Nagar, Indirapuram, Vaishali and more. Starting Rs.200. WhatsApp +91 7289996804.',
      'https://rosenpetals.com'
    );
    res.send(html);
  } catch (err) {
    console.error('[SSR] Homepage error:', err);
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Catalog page
app.get('/catalog', async (req, res) => {
  try {
    const products = await getProducts();
    const filter = req.query.filter;
    let displayed = products;
    if (filter && filter.toLowerCase() !== 'all') {
      if (filter.toLowerCase().includes('under 499')) {
        displayed = products.filter(p => p.price < 499);
      } else {
        displayed = products.filter(p =>
          p.occasiontags.some(tag =>
            tag.toLowerCase() === filter.toLowerCase()
          )
        );
      }
    }

    const catalogBreadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rosenpetals.com" },
        { "@type": "ListItem", "position": 2, "name": "Bouquets", "item": "https://rosenpetals.com/catalog" }
      ]
    });

    const ssrContent = `
      <script type="application/ld+json">${catalogBreadcrumb}</script>
      <div class="page-header section-light">
        <div class="container">
          <h1 class="mb-2">Our Bouquets</h1>
          <p class="text-muted">Fresh, hand-arranged flowers for every moment.</p>
        </div>
      </div>
      <section class="section container">
        ${catalogGridHTML(displayed)}
      </section>`;

    const html = buildSSRPage(
      ssrContent,
      products,
      'All Bouquets | Flower Delivery Ghaziabad — Rose n Petals',
      'Browse all fresh flower bouquets. Same-day delivery in Ghaziabad. Handmade arrangements starting Rs.200. Order on WhatsApp.',
      'https://rosenpetals.com/catalog'
    );
    res.send(html);
  } catch (err) {
    console.error('[SSR] Catalog error:', err);
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Redirect legacy product slugs to name-based slugs
app.get('/bouquet/product-:num', async (req, res) => {
  try {
    const products = await getProducts();
    const num = req.params.num;
    const product = products.find(p =>
      p.id.toString() === num ||
      p.id.toString() === `product-${num}` ||
      p.id.toString().toLowerCase() === `product ${num}` ||
      p.id.toString().toLowerCase().replace(/\s+/g, '-') === `product-${num}`
    );
    if (product) {
      return res.redirect(301, `/bouquet/${product.slug}`);
    }
    return res.status(404).send(buildSSRPage(
      `<div class="container">
        <section style="text-align:center;padding:80px 20px">
          <h1>Bouquet Not Found</h1>
          <p>This bouquet may no longer be available.</p>
          <a href="/catalog" class="btn btn-primary">Browse All Bouquets</a>
        </section>
      </div>`,
      [],
      '404 Bouquet Not Found — Rose n Petals',
      'The bouquet you are looking for is no longer available.',
      null
    ));
  } catch (err) {
    return res.status(404).sendFile(path.join(__dirname, 'index.html'));
  }
});

// Individual bouquet detail pages
app.get('/bouquet/:slug', async (req, res) => {
  try {
    const products = await getProducts();
    const slug = req.params.slug;
    const product = products.find(p => p.slug === slug);

    if (!product) {
      return res.status(404).send(buildSSRPage(
        `<div class="container">
          <section style="text-align:center;padding:80px 20px">
            <h1>Bouquet Not Found</h1>
            <p>This bouquet may no longer be available.</p>
            <a href="/catalog" class="btn btn-primary">Browse All Bouquets</a>
          </section>
        </div>`,
        [],
        '404 Bouquet Not Found — Rose n Petals',
        'The bouquet you are looking for is no longer available.',
        null
      ));
    }

    const ssrContent = bouquetDetailHTML(product);
    const title = `${product.name} | Bouquet Delivery Ghaziabad — Rose n Petals`;
    const desc = product.shortdescription
      ? product.shortdescription.slice(0, 140)
      : `Order ${product.name} with 1-hour delivery in Ghaziabad. Starting Rs.${product.price}.`;

    const html = buildSSRPage(
      ssrContent,
      products,
      title,
      desc,
      `https://rosenpetals.com/bouquet/${product.slug}`
    );
    res.send(html);
  } catch (err) {
    console.error(`[SSR] /bouquet/${req.params.slug} error:`, err);
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Catch-all — all other routes (area pages, blog, policies, etc.)
app.get('*', async (req, res) => {
    try {
      const products = await getProducts();
      let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
      const hydrationScript = `<script>window.__SSR_PRODUCTS__=${JSON.stringify(products)};window.__SSR_HYDRATED__=false;</script>`;
      html = html.replace('</body>', `${hydrationScript}</body>`);
      res.status(404).send(html);
    } catch (err) {
      console.error('[SSR] Catch-all error:', err);
      res.status(404).sendFile(path.join(__dirname, 'index.html'));
    }
  });

// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Configured Google Sheet URL: ${process.env.SHEET_URL ? 'Detected' : 'Not Provided'}`);
});
