const fs = require('fs');

const csv = fs.readFileSync('data.csv', 'utf8');
const lines = csv.split('\n').filter(Boolean).slice(1);
const productUrls = {};

lines.forEach(line => {
    const cols = line.match(/(?:\"([^\"]*)\"|([^,]+))/g);
    if (!cols || cols.length < 3) return;
    const name = cols[1].replace(/(^\"|\"$)/g, '').trim();
    let url = cols[2].replace(/(^\"|\"$)/g, '').trim();
    
    // Fix Drive URLs
    if(url.includes('drive.google.com')) {
        const idMatch = url.match(/id=([^&]+)/) || url.match(/\/d\/([^\/]+)/);
        if(idMatch) {
            url = `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
        }
    }
    productUrls[name] = url;
});

const heroMap = {
    "birthday-flowers-ghaziabad": ["Carnival MIx", "Birthday bouquet in Ghaziabad"],
    "anniversary-flowers-ghaziabad": ["Grand Red Rose Prestige Bouquet", "Romantic red rose bouquet in Ghaziabad"],
    "get-well-soon-flowers-ghaziabad": ["Sunflower Burst Bouquet", "Cheerful sunflower bouquet in Ghaziabad"],
    "congratulations-flowers-ghaziabad": ["Peacock Crown", "Premium celebration bouquet in Ghaziabad"],
    "sorry-flowers-ghaziabad": ["Vintage Tale", "Peaceful apology bouquet in Ghaziabad"],
    "romantic-flowers-ghaziabad": ["Classic 21 Red Roses Bouquet", "Romantic red roses in Ghaziabad"],
    "new-baby-flowers-ghaziabad": ["Soft Pastel Pink Rose Bunch", "Soft new baby bouquet in Ghaziabad"],
    "housewarming-flowers-ghaziabad": ["Tulip Charm", "Elegant housewarming bouquet in Ghaziabad"],
    "sympathy-flowers-ghaziabad": ["Ocean Mist", "Serene sympathy bouquet in Ghaziabad"],
    "diwali-flowers-ghaziabad": ["Royal Sunflower", "Vibrant festive bouquet in Ghaziabad"]
};

const productMap = {
    "Red Roses Delight": "Classic 21 Red Roses Bouquet",
    "Mixed Vibrant Blooms": "Carnival MIx",
    "Orchid Elegance": "Orchid Carnival Mix Bouquet",
    "100 Red Roses Premium Box": "Grand Red Rose Prestige Bouquet",
    "Pink Lily & Rose Combo": "Pink Lily & Chrysanthemum Bouquet",
    "Classic Love Bouquet": "Blush Carnation",
    "Sunshine Yellow Daisies": "Sunflower Burst Bouquet",
    "Vibrant Mix Bouquet": "Peach Blossom Mixed Bouquet",
    "Elegant White Lilies": "Vintage Tale",
    "Vibrant Celebration Mix": "Carnival MIx",
    "Premium Pink Orchids": "Orchid Carnival Mix Bouquet",
    "Bright Sunflower Assortment": "Royal Sunflower",
    "Peaceful White Lilies": "Ocean Mist",
    "Soft Pastel Mix": "Pink Garden",
    "Classic Yellow Roses": "Sunflower Burst Bouquet",
    "Deep Red Roses Bouquet": "Classic 21 Red Roses Bouquet",
    "Elegant Pink Carnations": "Blush Carnation",
    "Luxury Orchid Arrangement": "Orchid Carnival Mix Bouquet",
    "Soft Blue & White Mix": "Ocean Mist",
    "Delicate Pink Roses": "Sweet Pink Rose Bouquet",
    "Joyful Yellow & Green Mix": "Royal Sunflower",
    "Elegant Lily Centerpiece": "Pink Lily & Chrysanthemum Bouquet",
    "Bright Mixed Garden": "Carnival MIx",
    "Premium Orchid Pot": "Peacock Crown",
    "Serene White Lilies": "Vintage Tale",
    "Gentle White Roses": "Harmony Blush",
    "Peaceful White & Green Mix": "Ocean Mist",
    "Vibrant Yellow & Orange Mix": "Peach Blossom Mixed Bouquet",
    "Premium Festive Orchids": "Orchid Carnival Mix Bouquet",
    "Classic Red & Gold Arrangement": "Grand Red Rose Prestige Bouquet"
};

let js = fs.readFileSync('js/occasionPagesData.js', 'utf8');

// Replace hero images
for (const [key, val] of Object.entries(heroMap)) {
    const sheetName = val[0];
    const altText = val[1];
    const url = productUrls[sheetName];
    if (!url) {
        console.error("Missing URL for hero", sheetName);
        continue;
    }
    
    // Regex to match the key block and replace its heroImage and heroImageAlt
    const regex = new RegExp(`("${key}":\\s*\\{[\\s\\S]*?)"heroImage":\\s*"[^"]*",\\s*"heroImageAlt":\\s*"[^"]*"`);
    js = js.replace(regex, `$1"heroImage": "${url}",\n        "heroImageAlt": "${altText}"`);
}

// Replace product images
js = js.replace(/"name":\s*"([^"]+)",\s*"desc":\s*"([^"]+)",\s*"image":\s*"([^"]*)"/g, (match, name, desc, oldUrl) => {
    const sheetName = productMap[name];
    if (!sheetName) {
        console.error("No mapping for product", name);
        return match;
    }
    const url = productUrls[sheetName];
    if (!url) {
        console.error("Missing URL for product", sheetName);
        return match;
    }
    return `"name": "${name}",\n                "desc": "${desc}",\n                "image": "${url}"`;
});

fs.writeFileSync('js/occasionPagesData.js', js);
console.log("Successfully updated occasionPagesData.js");
