require('dotenv').config();
const express = require('express');
const path = require('path');

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
app.use(express.static(path.join(__dirname)));

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
const fs = require('fs');
function serveLandingPage(res, data) {
  const templatePath = path.join(__dirname, 'landing-page.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html.replace(/\{\{PAGE_TITLE\}\}/g, data.title);
  html = html.replace(/\{\{META_DESCRIPTION\}\}/g, data.description);
  html = html.replace(/\{\{CANONICAL_URL\}\}/g, data.canonical);
  html = html.replace(/\{\{BREADCRUMB_SCHEMA\}\}/g, data.breadcrumb);
  html = html.replace(/\{\{PAGE_SLUG\}\}/g, data.slug);
  res.send(html);
}

// --- BATCH 1: GENERAL PAGES ---

app.get('/flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Ghaziabad | Same Day – Rose n Petals',
    description: 'Order fresh flower bouquets in Ghaziabad with 1-hour delivery. Starting ₹200. Serving all of Ghaziabad. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-ghaziabad',
    slug: 'flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery in Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"}]}'
  });
});

app.get('/online-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Online Flower Delivery Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Order flowers online in Ghaziabad. Fresh handmade bouquets delivered in 1 hour. Starting ₹200. WhatsApp +91 7289996804. No app needed.',
    canonical: 'https://rosenpetals.com/online-flower-delivery-ghaziabad',
    slug: 'online-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Online Flower Delivery Ghaziabad","item":"https://rosenpetals.com/online-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/bouquet-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Bouquet Delivery in Ghaziabad | Fresh – Rose n Petals',
    description: 'Fresh handmade bouquets delivered across Ghaziabad in 1 hour. Starting ₹200. Order on WhatsApp — fast, easy, personal.',
    canonical: 'https://rosenpetals.com/bouquet-delivery-ghaziabad',
    slug: 'bouquet-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Bouquet Delivery Ghaziabad","item":"https://rosenpetals.com/bouquet-delivery-ghaziabad"}]}'
  });
});

app.get('/send-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Send Flowers in Ghaziabad | 1-Hour Delivery – Rose n Petals',
    description: 'Send fresh flowers anywhere in Ghaziabad in 1 hour. Handmade bouquets from ₹200. WhatsApp us to order — +91 7289996804.',
    canonical: 'https://rosenpetals.com/send-flowers-ghaziabad',
    slug: 'send-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Send Flowers Ghaziabad","item":"https://rosenpetals.com/send-flowers-ghaziabad"}]}'
  });
});

app.get('/order-flowers-online-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Order Flowers Online Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers online in Ghaziabad. Delivered in 1 hour. Bouquets from ₹200. Simple WhatsApp ordering — no app or account needed.',
    canonical: 'https://rosenpetals.com/order-flowers-online-ghaziabad',
    slug: 'order-flowers-online-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Order Flowers Online Ghaziabad","item":"https://rosenpetals.com/order-flowers-online-ghaziabad"}]}'
  });
});

app.get('/florist-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Florist in Ghaziabad | Fresh Bouquets – Rose n Petals',
    description: 'Looking for a florist in Ghaziabad? Rose n Petals offers fresh handmade bouquets with 1-hour delivery. Starting ₹200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/florist-ghaziabad',
    slug: 'florist-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Florist in Ghaziabad","item":"https://rosenpetals.com/florist-ghaziabad"}]}'
  });
});

app.get('/flower-shop-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Shop in Ghaziabad | Rose n Petals',
    description: 'Rose n Petals is Ghaziabads local flower shop. Fresh handmade bouquets from ₹200. 1-hour delivery across all of Ghaziabad. Order on WhatsApp.',
    canonical: 'https://rosenpetals.com/flower-shop-ghaziabad',
    slug: 'flower-shop-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Shop Ghaziabad","item":"https://rosenpetals.com/flower-shop-ghaziabad"}]}'
  });
});

app.get('/fresh-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Fresh Flowers Ghaziabad | Daily Delivery – Rose n Petals',
    description: 'Get fresh flowers delivered daily across Ghaziabad. Handmade bouquets starting Rs.200. 1-hour delivery. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/fresh-flowers-ghaziabad',
    slug: 'fresh-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Fresh Flowers Ghaziabad","item":"https://rosenpetals.com/fresh-flowers-ghaziabad"}]}'
  });
});

app.get('/rose-bouquet-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Rose Bouquet Delivery Ghaziabad | Rose n Petals',
    description: 'Order rose bouquets in Ghaziabad with 1-hour delivery. Red roses, pink roses, mixed rose bouquets from Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/rose-bouquet-delivery-ghaziabad',
    slug: 'rose-bouquet-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Rose Bouquet Delivery Ghaziabad","item":"https://rosenpetals.com/rose-bouquet-delivery-ghaziabad"}]}'
  });
});

app.get('/mixed-flower-bouquet-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Mixed Flower Bouquet Ghaziabad | Rose n Petals',
    description: 'Order mixed flower bouquets in Ghaziabad. Colourful handmade arrangements from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/mixed-flower-bouquet-ghaziabad',
    slug: 'mixed-flower-bouquet-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Mixed Flower Bouquet Ghaziabad","item":"https://rosenpetals.com/mixed-flower-bouquet-ghaziabad"}]}'
  });
});

// --- BATCH 2: LOCAL AREA PAGES ---

app.get('/flower-delivery-indirapuram', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Indirapuram | 1-Hour – Rose n Petals',
    description: 'Fresh bouquets delivered in Indirapuram, Ghaziabad in 1 hour. Near Shipra Mall and Gyan Khand. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-indirapuram',
    slug: 'flower-delivery-indirapuram',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Indirapuram","item":"https://rosenpetals.com/flower-delivery-indirapuram"}]}'
  });
});

app.get('/flower-delivery-vaishali-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vaishali Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Vaishali, Ghaziabad. Delivered in 1 hour. Bouquets from Rs.200. Near Vaishali Metro. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vaishali-ghaziabad',
    slug: 'flower-delivery-vaishali-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vaishali","item":"https://rosenpetals.com/flower-delivery-vaishali-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-vasundhara-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vasundhara Ghaziabad | Rose n Petals',
    description: 'Fresh bouquets delivered in Vasundhara, Ghaziabad in 1 hour. Starting Rs.200. Handmade with care. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad',
    slug: 'flower-delivery-vasundhara-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vasundhara","item":"https://rosenpetals.com/flower-delivery-vasundhara-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-raj-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Raj Nagar Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Raj Nagar, Ghaziabad. Delivered in 1 hour. Near RDC Zone. Bouquets from Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad',
    slug: 'flower-delivery-raj-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Raj Nagar","item":"https://rosenpetals.com/flower-delivery-raj-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-kavi-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Kavi Nagar Ghaziabad | Rose n Petals',
    description: 'Rose n Petals is based in Kavi Nagar, Ghaziabad. Fresh bouquets delivered in 1 hour. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad',
    slug: 'flower-delivery-kavi-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Kavi Nagar","item":"https://rosenpetals.com/flower-delivery-kavi-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-mohan-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Mohan Nagar Ghaziabad | Rose n Petals',
    description: 'Fresh flowers delivered in Mohan Nagar, Ghaziabad in 1 hour. Handmade bouquets from Rs.200. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad',
    slug: 'flower-delivery-mohan-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Mohan Nagar","item":"https://rosenpetals.com/flower-delivery-mohan-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-vijay-nagar-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery in Vijay Nagar Ghaziabad | Rose n Petals',
    description: 'Order fresh flowers in Vijay Nagar, Ghaziabad. Delivered in 1 hour. Bouquets from Rs.200. Handmade daily. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad',
    slug: 'flower-delivery-vijay-nagar-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Vijay Nagar","item":"https://rosenpetals.com/flower-delivery-vijay-nagar-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-crossing-republik-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery Crossing Republik Ghaziabad | Rose n Petals',
    description: 'Fresh bouquets delivered in Crossing Republik, Ghaziabad in 1 hour. Starting Rs.200. Order on WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad',
    slug: 'flower-delivery-crossing-republik-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Ghaziabad","item":"https://rosenpetals.com/flower-delivery-ghaziabad"},{"@type":"ListItem","position":3,"name":"Flower Delivery Crossing Republik","item":"https://rosenpetals.com/flower-delivery-crossing-republik-ghaziabad"}]}'
  });
});

// --- BATCH 3: URGENCY PAGES ---

app.get('/same-day-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Same Day Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Same-day flower delivery across Ghaziabad. Order before 9 PM. Fresh bouquets from Rs.200. WhatsApp us now — +91 7289996804.',
    canonical: 'https://rosenpetals.com/same-day-flower-delivery-ghaziabad',
    slug: 'same-day-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Same Day Flower Delivery Ghaziabad","item":"https://rosenpetals.com/same-day-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/express-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Express Flower Delivery Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Express flower delivery in Ghaziabad in just 1 hour. Fresh handmade bouquets from Rs.200. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/express-flower-delivery-ghaziabad',
    slug: 'express-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Express Flower Delivery Ghaziabad","item":"https://rosenpetals.com/express-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/2-hour-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: '2 Hour Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Need flowers fast? We deliver across Ghaziabad within 1-2 hours. Fresh bouquets from Rs.200. WhatsApp +91 7289996804 right now.',
    canonical: 'https://rosenpetals.com/2-hour-flower-delivery-ghaziabad',
    slug: '2-hour-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"2 Hour Flower Delivery Ghaziabad","item":"https://rosenpetals.com/2-hour-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/midnight-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Midnight Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Midnight flower delivery in Ghaziabad for surprise moments. Fresh bouquets from Rs.200. WhatsApp us to check availability — +91 7289996804.',
    canonical: 'https://rosenpetals.com/midnight-flower-delivery-ghaziabad',
    slug: 'midnight-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Midnight Flower Delivery Ghaziabad","item":"https://rosenpetals.com/midnight-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/urgent-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Urgent Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Urgent flower delivery in Ghaziabad. WhatsApp us now and we will deliver within 1 hour. Fresh bouquets from Rs.200. +91 7289996804.',
    canonical: 'https://rosenpetals.com/urgent-flower-delivery-ghaziabad',
    slug: 'urgent-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Urgent Flower Delivery Ghaziabad","item":"https://rosenpetals.com/urgent-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/last-minute-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Last Minute Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Forgot a special occasion? We do last-minute flower delivery in Ghaziabad in 1 hour. From Rs.200. WhatsApp +91 7289996804 now.',
    canonical: 'https://rosenpetals.com/last-minute-flower-delivery-ghaziabad',
    slug: 'last-minute-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Last Minute Flower Delivery Ghaziabad","item":"https://rosenpetals.com/last-minute-flower-delivery-ghaziabad"}]}'
  });
});

app.get('/flower-delivery-today-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Flower Delivery Today in Ghaziabad | Rose n Petals',
    description: 'Need flowers delivered today in Ghaziabad? We deliver in 1 hour. Fresh bouquets from Rs.200. WhatsApp +91 7289996804 right now.',
    canonical: 'https://rosenpetals.com/flower-delivery-today-ghaziabad',
    slug: 'flower-delivery-today-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Flower Delivery Today Ghaziabad","item":"https://rosenpetals.com/flower-delivery-today-ghaziabad"}]}'
  });
});

app.get('/emergency-flower-delivery-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Emergency Flower Delivery Ghaziabad | Rose n Petals',
    description: 'Emergency flower delivery in Ghaziabad. WhatsApp us instantly and we will deliver within 1 hour. Bouquets from Rs.200. +91 7289996804.',
    canonical: 'https://rosenpetals.com/emergency-flower-delivery-ghaziabad',
    slug: 'emergency-flower-delivery-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Emergency Flower Delivery Ghaziabad","item":"https://rosenpetals.com/emergency-flower-delivery-ghaziabad"}]}'
  });
});

// --- BATCH 4: OCCASION PAGES ---

app.get('/birthday-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Birthday Flowers in Ghaziabad | 1-Hour – Rose n Petals',
    description: 'Surprise someone with birthday flowers in Ghaziabad. Fresh bouquets delivered in 1 hour. Starting Rs.200. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/birthday-flowers-ghaziabad',
    slug: 'birthday-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Birthday Flowers Ghaziabad","item":"https://rosenpetals.com/birthday-flowers-ghaziabad"}]}'
  });
});

app.get('/anniversary-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Anniversary Flowers in Ghaziabad | Rose n Petals',
    description: 'Celebrate your anniversary with fresh flowers in Ghaziabad. Handmade bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/anniversary-flowers-ghaziabad',
    slug: 'anniversary-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Anniversary Flowers Ghaziabad","item":"https://rosenpetals.com/anniversary-flowers-ghaziabad"}]}'
  });
});

app.get('/get-well-soon-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Get Well Soon Flowers Ghaziabad | Rose n Petals',
    description: 'Send get well soon flowers in Ghaziabad. Cheerful fresh bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/get-well-soon-flowers-ghaziabad',
    slug: 'get-well-soon-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Get Well Soon Flowers Ghaziabad","item":"https://rosenpetals.com/get-well-soon-flowers-ghaziabad"}]}'
  });
});

app.get('/congratulations-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Congratulations Flowers Ghaziabad | Rose n Petals',
    description: 'Celebrate achievements with congratulations flowers in Ghaziabad. Fresh bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/congratulations-flowers-ghaziabad',
    slug: 'congratulations-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Congratulations Flowers Ghaziabad","item":"https://rosenpetals.com/congratulations-flowers-ghaziabad"}]}'
  });
});

app.get('/sorry-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Sorry Flowers in Ghaziabad | Rose n Petals',
    description: 'Say sorry with fresh flowers in Ghaziabad. Heartfelt bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/sorry-flowers-ghaziabad',
    slug: 'sorry-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Sorry Flowers Ghaziabad","item":"https://rosenpetals.com/sorry-flowers-ghaziabad"}]}'
  });
});

app.get('/romantic-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Romantic Flowers in Ghaziabad | Rose n Petals',
    description: 'Surprise your partner with romantic flowers in Ghaziabad. Red roses and love bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/romantic-flowers-ghaziabad',
    slug: 'romantic-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Romantic Flowers Ghaziabad","item":"https://rosenpetals.com/romantic-flowers-ghaziabad"}]}'
  });
});

app.get('/new-baby-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'New Baby Flowers in Ghaziabad | Rose n Petals',
    description: 'Welcome a new baby with fresh flowers in Ghaziabad. Soft pastel bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/new-baby-flowers-ghaziabad',
    slug: 'new-baby-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"New Baby Flowers Ghaziabad","item":"https://rosenpetals.com/new-baby-flowers-ghaziabad"}]}'
  });
});

app.get('/housewarming-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Housewarming Flowers in Ghaziabad | Rose n Petals',
    description: 'Send housewarming flowers in Ghaziabad. Beautiful fresh bouquets from Rs.200. Delivered in 1 hour. WhatsApp +91 7289996804 to order.',
    canonical: 'https://rosenpetals.com/housewarming-flowers-ghaziabad',
    slug: 'housewarming-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Housewarming Flowers Ghaziabad","item":"https://rosenpetals.com/housewarming-flowers-ghaziabad"}]}'
  });
});

app.get('/sympathy-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Sympathy Flowers in Ghaziabad | Rose n Petals',
    description: 'Send sympathy flowers in Ghaziabad with care and respect. Thoughtful bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804.',
    canonical: 'https://rosenpetals.com/sympathy-flowers-ghaziabad',
    slug: 'sympathy-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Sympathy Flowers Ghaziabad","item":"https://rosenpetals.com/sympathy-flowers-ghaziabad"}]}'
  });
});

app.get('/diwali-flowers-ghaziabad', (req, res) => {
  serveLandingPage(res, {
    title: 'Diwali Flowers in Ghaziabad | Rose n Petals',
    description: 'Celebrate Diwali with fresh flowers in Ghaziabad. Festive bouquets from Rs.200. 1-hour delivery. WhatsApp +91 7289996804 to order now.',
    canonical: 'https://rosenpetals.com/diwali-flowers-ghaziabad',
    slug: 'diwali-flowers-ghaziabad',
    breadcrumb: '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://rosenpetals.com"},{"@type":"ListItem","position":2,"name":"Diwali Flowers Ghaziabad","item":"https://rosenpetals.com/diwali-flowers-ghaziabad"}]}'
  });
});

// SPA Fallback: Any other route returns index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Configured Google Sheet URL: ${process.env.SHEET_URL ? 'Detected' : 'Not Provided'}`);
});
