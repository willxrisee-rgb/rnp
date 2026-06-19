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

function productCardHTML(p) {
  const href = `/bouquet/${p.slug}`;
  const price = p.price ? `<p class="product-price">&#8377;${escapeHtml(String(p.price))}</p>` : '';
  const img = p.imageurl
    ? `<img src="${escapeHtml(p.imageurl)}"
          alt="${escapeHtml(p.name)} — Flower Bouquet for Delivery in Ghaziabad"
          class="product-image"
          loading="lazy"
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
  return `<div class="product-grid">${products.map(productCardHTML).join('')}</div>`;
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
          "addressRegion": "UP"
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
  html = html.replace(/\{\{PAGE_TITLE\}\}/g, data.title);
  html = html.replace(/\{\{META_DESCRIPTION\}\}/g, data.description);
  html = html.replace(/\{\{CANONICAL_URL\}\}/g, data.canonical);
  html = html.replace(/\{\{BREADCRUMB_SCHEMA\}\}/g, data.breadcrumb);
  html = html.replace(/\{\{PAGE_SLUG\}\}/g, data.slug);
  html = html.replace(/\{\{H1\}\}/g, data.h1);
  html = html.replace(/\{\{LEAD_TEXT\}\}/g, data.leadText);
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
    leadText: 'Rose n Petals delivers fresh handmade bouquets across all of Ghaziabad in under 1 hour. Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara and more. Orders via WhatsApp — no app needed. Starting from ₹200.'
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
    leadText: 'Experience fast and reliable online flower delivery in Ghaziabad. Fresh handmade bouquets delivered to your doorstep in under 1 hour, starting from just ₹200.'
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
    leadText: 'Get beautiful, fresh bouquet delivery in Ghaziabad. Our handmade floral arrangements are delivered in under 1 hour. Starting from ₹200.'
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
    leadText: 'Send flowers to your loved ones anywhere in Ghaziabad with ease. Delivered fresh in under 1 hour, starting from ₹200. Order via WhatsApp.'
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
    leadText: 'Order flowers online in Ghaziabad seamlessly through WhatsApp. Fresh handmade bouquets delivered in under 1 hour, starting from ₹200.'
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
    leadText: 'Rose n Petals is your trusted local florist in Ghaziabad. Enjoy fresh handmade bouquets delivered in under 1 hour, starting at ₹200.'
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
    leadText: 'Visit the premier flower shop in Ghaziabad or order via WhatsApp. We deliver fresh, stunning bouquets in under 1 hour from ₹200.'
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
    leadText: 'Discover the best fresh flowers in Ghaziabad. Delivered in under 1 hour across the city, our handmade bouquets start from ₹200.'
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
    leadText: 'Specialized rose bouquet delivery in Ghaziabad. Perfect for any occasion, delivered fresh in under 1 hour. Prices starting at ₹200.'
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
    leadText: 'Brighten someone\'s day with a vibrant mixed flower bouquet in Ghaziabad. Delivered quickly in under 1 hour, starting from ₹200.'
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
    leadText: 'Rose n Petals delivers fresh bouquets to Indirapuram in under 1 hour. We cover all sectors and societies in Indirapuram. Handmade bouquets from ₹200. Order on WhatsApp.'
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
    leadText: 'Get fresh flowers delivered to your door in Vaishali, Ghaziabad in under 1 hour. Rose n Petals serves all of Vaishali Sector 1, 2, 3, 4, 5 and 6. Bouquets from ₹200.'
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
    leadText: 'Rose n Petals delivers fresh bouquets to Vasundhara in under 1 hour. We serve all sectors in Vasundhara. Handmade bouquets start from ₹200.'
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
    leadText: 'Fresh bouquet delivery in Raj Nagar and Raj Nagar Extension, Ghaziabad. Delivered in under 1 hour by Rose n Petals. Handmade bouquets starting from ₹200.'
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
    leadText: 'Rose n Petals is your local florist in Kavi Nagar, Ghaziabad. We are based in KD Market, Sector 18, Kavi Nagar and deliver fresh handmade bouquets starting from ₹200.'
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
    leadText: 'Send fresh flowers to Mohan Nagar, Ghaziabad with our quick 1-hour delivery service. Handmade beautiful bouquets starting from ₹200.'
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
    leadText: 'Reliable flower delivery in Vijay Nagar, Ghaziabad. Get your fresh handmade bouquets delivered in under 1 hour, starting from just ₹200.'
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
    leadText: 'Fast and fresh flower delivery in Crossing Republik, Ghaziabad. Delight your loved ones in under 1 hour with bouquets starting from ₹200.'
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
    leadText: 'Need flowers delivered today in Ghaziabad? We offer same-day delivery in under 1 hour for orders placed before 9 PM. WhatsApp us your order — bouquets start from ₹200.'
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
    leadText: 'In a rush? Choose our express flower delivery in Ghaziabad. Fresh bouquets delivered in under 1 hour, starting from ₹200.'
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
    leadText: 'Guaranteed 2-hour flower delivery in Ghaziabad, usually arriving in under 1 hour. Fresh handmade bouquets starting from ₹200.'
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
    leadText: 'Surprise them at the stroke of midnight with our midnight flower delivery in Ghaziabad. Fresh bouquets from ₹200. Order now on WhatsApp.'
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
    leadText: 'Require flowers right now? Use our urgent flower delivery in Ghaziabad. Delivered fresh in under 1 hour, starting from ₹200.'
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
    leadText: 'Forgot an important date? Try our last minute flower delivery in Ghaziabad. Fresh handmade bouquets delivered in under 1 hour, from ₹200.'
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
    leadText: 'Looking for flower delivery today in Ghaziabad? We deliver fresh, stunning bouquets in under 1 hour. Prices start from ₹200.'
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
    leadText: 'For urgent needs, count on our emergency flower delivery in Ghaziabad. Speedy delivery in under 1 hour for bouquets starting at ₹200.'
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
    leadText: 'Surprise someone special with fresh birthday flowers delivered in Ghaziabad in under 1 hour. Handmade birthday bouquets starting from ₹200. Order on WhatsApp — fast, simple, and personal.'
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
    leadText: 'Celebrate your anniversary with beautiful fresh flowers delivered anywhere in Ghaziabad in under 1 hour. Romantic bouquets starting from ₹200. WhatsApp us to order.'
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
    leadText: 'Wish a speedy recovery with get well soon flowers in Ghaziabad. Delivered fresh in under 1 hour, beautiful bouquets starting from ₹200.'
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
    leadText: 'Celebrate achievements with our congratulations flowers in Ghaziabad. Handmade fresh bouquets delivered in under 1 hour from ₹200.'
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
    leadText: 'Express your sincere apologies with sorry flowers in Ghaziabad. Delivered swiftly in under 1 hour. Thoughtful bouquets starting at ₹200.'
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
    leadText: 'Express your love with romantic flowers in Ghaziabad. Beautiful, fresh red roses delivered in under 1 hour, starting from ₹200.'
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
    leadText: 'Welcome the little one with new baby flowers in Ghaziabad. Fresh and lovely bouquets delivered in under 1 hour from ₹200.'
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
    leadText: 'Congratulate them on their new home with housewarming flowers in Ghaziabad. Delivered fresh in under 1 hour, starting from ₹200.'
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
    leadText: 'Express your condolences with sympathy flowers in Ghaziabad. Respectful, fresh bouquets delivered in under 1 hour, starting from ₹200.'
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
    leadText: 'Light up their festive spirit with Diwali flowers in Ghaziabad. Vibrant, fresh bouquets delivered in under 1 hour, starting from ₹200.'
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
      </section>`;

    const html = buildSSRPage(
      ssrContent,
      products,
      'Flower Delivery in Ghaziabad | Fresh Bouquets — Rose n Petals',
      'Order fresh flower bouquets in Ghaziabad with 1-hour delivery. Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali and more. Starting Rs.200. Order on WhatsApp +91 7289996804.',
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
      p.id.toString().toLowerCase() === `product-${num}`
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
