const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://rosenpetals.com';
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHd0751qQ03HhhAmQhVE32BlLZXOO1g40tqB3XPv_9WZCUwW4iQwZ6mNWUnf0Pvf0aD1HkRBAuOQQu/pub?output=csv';
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { loc: '',                                        priority: '1.0', changefreq: 'weekly' },
  { loc: 'catalog',                                 priority: '0.9', changefreq: 'weekly' },
  { loc: 'policies',                                priority: '0.5', changefreq: 'monthly' },
  { loc: 'flower-delivery-ghaziabad',               priority: '0.9', changefreq: 'monthly' },
  { loc: 'online-flower-delivery-ghaziabad',        priority: '0.8', changefreq: 'monthly' },
  { loc: 'bouquet-delivery-ghaziabad',              priority: '0.8', changefreq: 'monthly' },
  { loc: 'send-flowers-ghaziabad',                  priority: '0.8', changefreq: 'monthly' },
  { loc: 'order-flowers-online-ghaziabad',          priority: '0.8', changefreq: 'monthly' },
  { loc: 'florist-ghaziabad',                       priority: '0.8', changefreq: 'monthly' },
  { loc: 'flower-shop-ghaziabad',                   priority: '0.8', changefreq: 'monthly' },
  { loc: 'fresh-flowers-ghaziabad',                 priority: '0.7', changefreq: 'monthly' },
  { loc: 'rose-bouquet-delivery-ghaziabad',         priority: '0.7', changefreq: 'monthly' },
  { loc: 'mixed-flower-bouquet-ghaziabad',          priority: '0.7', changefreq: 'monthly' },
  { loc: 'flower-delivery-indirapuram',             priority: '0.9', changefreq: 'monthly' },
  { loc: 'flower-delivery-vaishali-ghaziabad',      priority: '0.9', changefreq: 'monthly' },
  { loc: 'flower-delivery-vasundhara-ghaziabad',    priority: '0.8', changefreq: 'monthly' },
  { loc: 'flower-delivery-raj-nagar-ghaziabad',     priority: '0.9', changefreq: 'monthly' },
  { loc: 'flower-delivery-kavi-nagar-ghaziabad',    priority: '0.9', changefreq: 'monthly' },
  { loc: 'flower-delivery-mohan-nagar-ghaziabad',   priority: '0.8', changefreq: 'monthly' },
  { loc: 'flower-delivery-vijay-nagar-ghaziabad',   priority: '0.8', changefreq: 'monthly' },
  { loc: 'flower-delivery-crossing-republik-ghaziabad', priority: '0.8', changefreq: 'monthly' },
  { loc: 'same-day-flower-delivery-ghaziabad',      priority: '0.9', changefreq: 'monthly' },
  { loc: 'express-flower-delivery-ghaziabad',       priority: '0.8', changefreq: 'monthly' },
  { loc: '2-hour-flower-delivery-ghaziabad',        priority: '0.8', changefreq: 'monthly' },
  { loc: 'midnight-flower-delivery-ghaziabad',      priority: '0.8', changefreq: 'monthly' },
  { loc: 'urgent-flower-delivery-ghaziabad',        priority: '0.8', changefreq: 'monthly' },
  { loc: 'last-minute-flower-delivery-ghaziabad',   priority: '0.8', changefreq: 'monthly' },
  { loc: 'flower-delivery-today-ghaziabad',         priority: '0.8', changefreq: 'monthly' },
  { loc: 'emergency-flower-delivery-ghaziabad',     priority: '0.8', changefreq: 'monthly' },
  { loc: 'birthday-flowers-ghaziabad',              priority: '0.9', changefreq: 'monthly' },
  { loc: 'anniversary-flowers-ghaziabad',           priority: '0.9', changefreq: 'monthly' },
  { loc: 'get-well-soon-flowers-ghaziabad',         priority: '0.8', changefreq: 'monthly' },
  { loc: 'congratulations-flowers-ghaziabad',       priority: '0.8', changefreq: 'monthly' },
  { loc: 'sorry-flowers-ghaziabad',                 priority: '0.8', changefreq: 'monthly' },
  { loc: 'romantic-flowers-ghaziabad',              priority: '0.8', changefreq: 'monthly' },
  { loc: 'new-baby-flowers-ghaziabad',              priority: '0.8', changefreq: 'monthly' },
  { loc: 'housewarming-flowers-ghaziabad',          priority: '0.8', changefreq: 'monthly' },
  { loc: 'sympathy-flowers-ghaziabad',              priority: '0.8', changefreq: 'monthly' },
  { loc: 'diwali-flowers-ghaziabad',                priority: '0.8', changefreq: 'monthly' },
  { loc: 'blog/how-to-keep-bouquet-fresh-north-indian-summer', priority: '0.8', changefreq: 'monthly' },
];

function csvToArray(str) {
  const arr = [];
  let quote = false;
  for (let row = 0, col = 0, c = 0; c < str.length; c++) {
    const cc = str[c], nc = str[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';
    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; c++; continue; }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { col++; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { row++; col = 0; c++; continue; }
    if (cc === '\n' && !quote) { row++; col = 0; continue; }
    if (cc === '\r' && !quote) { row++; col = 0; continue; }
    arr[row][col] += cc;
  }
  return arr;
}

async function fetchProductSlugs() {
  console.log('[sitemap] Fetching product slugs from Google Sheets...');
  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    if (text.trim().startsWith('<')) throw new Error('Received HTML instead of CSV');
    const rows = csvToArray(text);
    if (rows.length < 2) return [];
    const headers = rows[0].map(h => h.toLowerCase().trim());
    const slugs = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < headers.length) continue;
      const rowData = {};
      headers.forEach((h, idx) => { if (h) rowData[h] = row[idx] ? row[idx].trim() : ''; });
      const idVal = rowData['product no.'] || rowData['id'];
      if (!idVal) continue;
      const statusVal = (rowData['status'] || '').toLowerCase();
      if (!statusVal.includes('in') || !statusVal.includes('stock')) continue;
      const nameVal = rowData['product name'] || rowData['name'] || idVal;
      const slug = nameVal.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      slugs.push(slug);
    }
    console.log('[sitemap] Found ' + slugs.length + ' in-stock products.');
    return slugs;
  } catch (err) {
    console.error('[sitemap] Failed to fetch slugs:', err.message);
    return [];
  }
}

function urlEntry({ loc, priority, changefreq }) {
  const fullUrl = loc ? BASE_URL + '/' + loc : BASE_URL;
  return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  const productSlugs = await fetchProductSlugs();
  const staticEntries = STATIC_ROUTES.map(urlEntry);
  const productEntries = productSlugs.map(slug =>
    urlEntry({ loc: 'bouquet/' + slug, priority: '0.8', changefreq: 'weekly' })
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...productEntries].join('\n')}
</urlset>`;
  const outPath = path.join(__dirname, '..', 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('[sitemap] Written to ' + outPath);
  console.log('[sitemap] ' + staticEntries.length + ' static + ' + productEntries.length + ' product URLs');
}

generate().catch(err => {
  console.error('[sitemap] Generation failed:', err);
  process.exit(1);
});
