const fs = require('fs');
const file = '/Users/hirensharma/Documents/rnp/js/occasionPagesData.js';
let content = fs.readFileSync(file, 'utf8');

const images = {
    red: "https://drive.google.com/uc?export=view&id=1cpJMck3YEYANy_4uBPE2Ej1t8K68b-4N",
    pink: "https://drive.google.com/uc?export=view&id=1JTTaBprDopk8V8ws6rpg2VvGRt-GS5wB",
    peachMix: "https://drive.google.com/uc?export=view&id=1edFTn-jyEQVOujkgEP7bzWB-ipbAB--R",
    pinkLily: "https://drive.google.com/uc?export=view&id=1V48ZJQ1Q0y39kubUK3Z3dzGXCx-5Lx0k",
    orchidMix: "https://drive.google.com/uc?export=view&id=1bu6hIhMX4d-IHIjnmFVG7OkNz6Dx74t1",
    sweetPink: "https://drive.google.com/uc?export=view&id=1Zq_aPUFhFTMSij7OmpAUboS89w2CGR27",
    bigRed: "https://drive.google.com/uc?export=view&id=1_pEGn0sH9qo6zuhQKRj4k62KbZeKXK2V"
};

const mapImage = (name, desc) => {
    const text = (name + " " + desc).toLowerCase();
    if (text.includes("orchid")) return images.orchidMix;
    if (text.includes("lily") || text.includes("lilies")) return images.pinkLily;
    if (text.includes("red") && text.includes("rose")) return images.red;
    if (text.includes("grand") || text.includes("luxury") || text.includes("100")) return images.bigRed;
    if (text.includes("yellow") || text.includes("sunflower") || text.includes("daisies")) return images.peachMix;
    if (text.includes("pastel") || text.includes("carnation")) return images.sweetPink;
    if (text.includes("pink")) return images.pink;
    if (text.includes("white")) return images.pinkLily; // fallback for white
    if (text.includes("mix") || text.includes("vibrant") || text.includes("colorful")) return images.orchidMix;
    return images.peachMix; // ultimate fallback
};

const mapHero = (occasionName) => {
    const name = occasionName.toLowerCase();
    if (name.includes("romance") || name.includes("anniversary")) return images.bigRed;
    if (name.includes("birthday") || name.includes("congratulation") || name.includes("diwali")) return images.orchidMix;
    if (name.includes("apology") || name.includes("sympathy") || name.includes("get well") || name.includes("new baby")) return images.sweetPink;
    if (name.includes("housewarming")) return images.peachMix;
    return images.pink;
};

// Use eval to parse the object out of the file
const window = {};
eval(content);

const occasionPagesData = window.OccasionPagesData;

for (const slug in occasionPagesData) {
    const page = occasionPagesData[slug];
    page.heroImage = mapHero(page.occasionName);
    if (!page.heroImageAlt) {
        page.heroImageAlt = page.pageTitle;
    }
    
    if (page.featuredProducts) {
        page.featuredProducts.forEach(p => {
            p.image = mapImage(p.name, p.desc || "");
        });
    }
}

const newContent = `// js/occasionPagesData.js
// ─────────────────────────────────────────────────────────────────────────────
// Content data for all 10 Occasion SEO pages (Template 2).
// ─────────────────────────────────────────────────────────────────────────────

const OCCASION_AREAS = [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
];

window.OccasionPagesData = ` + JSON.stringify(occasionPagesData, null, 4) + `;
`;

// Fix OCCASION_AREAS reference in the JSON string
const finalContent = newContent.replace(/"areas": \[[\s\S]*?\],/g, '"areas": OCCASION_AREAS,');

fs.writeFileSync(file, finalContent);
console.log("Updated data file successfully.");
