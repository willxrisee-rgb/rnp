# Rose n Petals — CHUNK 2 FIX: Hero + Delivery Area Redesign
# File: ~/Documents/rnp/CHUNK2_HERO_FIX.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will change
   and exactly what you will change in each one.
3. Do NOT implement until plan is confirmed.
4. After implementing, verify every checklist item.
5. Do NOT change routing, server.js, product data,
   SEO head tags, FAQ section, About Us, footer,
   or anything not listed in this document.

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Kavi Nagar, Ghaziabad
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JS, Node.js, Express
Homepage content is rendered via js/pages.js and/or js/app.js
Bouquet images are hosted on Cloudinary

---

## CHANGE 1 — Remove Hero Image, Redesign Hero Section

### What to remove:
- Remove the existing hero banner/image entirely
- Remove any full-width background image from the hero
- Remove any image tag or background-image CSS 
  in the hero section

### New hero section design:

BACKGROUND:
- Use a subtle repeating pattern background
- Create using CSS only — no image file needed
- Use this CSS pattern (soft rose petal dots):

```css
.hero-section {
  background-color: #FFF5F5;
  background-image: radial-gradient(
    circle, #FDDEDE 1px, transparent 1px
  );
  background-size: 24px 24px;
  padding: 60px 20px 40px 20px;
  text-align: center;
}
```

HERO CONTENT (top to bottom):

1. Small label above H1:
```html
<span class="hero-label">
  🌹 Ghaziabad's Local Florist
</span>
```
Style: font-size 13px, color #CC0000, font-weight 600,
letter-spacing 0.05em, display block, margin-bottom 12px

2. H1 (keep existing H1 tag, update styling only): Fresh Flower Delivery in Ghaziabad 

Style: font-size 36px desktop / 26px mobile,
font-weight 700, color #1A1A1A, line-height 1.2,
margin-bottom 12px

3. Subheadline paragraph:Handmade bouquets delivered to your door in under 1 hour.
Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali & more. 
Style: font-size 16px desktop / 14px mobile,
color #555555, margin-bottom 8px

4. Price anchor line: 
Starting from ₹200 · No app needed · Easy WhatsApp order
Style: font-size 14px, color #CC0000, font-weight 500,
margin-bottom 28px

5. TWO BUTTONS — stacked vertically on mobile,
   side by side on desktop:

Button 1 (primary):
Text: Order on WhatsApp
Background: #CC0000, color white, border-radius 8px
Padding: 14px 28px, font-size 15px, font-weight 600
Width: 100% on mobile, auto on desktop

Button 2 (secondary):
Text: Browse Bouquets
Background: white, color #CC0000
Border: 2px solid #CC0000, border-radius 8px
Padding: 12px 28px, font-size 15px, font-weight 600
Width: 100% on mobile, auto on desktop

Gap between buttons on mobile: 12px (margin-top on btn 2)
Gap between buttons on desktop: 16px (flex gap)

MOBILE BUTTON FIX — add this CSS:
```css
@media (max-width: 767px) {
  .hero-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
  .hero-btn-primary,
  .hero-btn-secondary {
    width: 100%;
    text-align: center;
  }
}

@media (min-width: 768px) {
  .hero-buttons {
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: center;
  }
}
```

---

## CHANGE 2 — Add Category Strip Below Hero

Add a new section immediately below the hero section
and above the trust signals bar.

This is a horizontal scrollable row of category cards
on mobile, and a wrapped grid on desktop.

SECTION HEADING (small, above cards):
Shop by Occasion

CATEGORY CARDS — 8 cards total.
Each card has: bouquet photo + category name + link.

Use these existing Cloudinary bouquet images
for the category photos. Check the existing product
data in the JS files for the correct Cloudinary URLs.
Use the best matching bouquet image for each category:

Card 1:
- Photo: use the Classic 21 Red Roses bouquet image
- Text: Birthday
- Link: /birthday-flowers-ghaziabad

Card 2:
- Photo: use the Pink Lily and Chrysanthemum image
- Text: Anniversary
- Link: /anniversary-flowers-ghaziabad

Card 3:
- Photo: use the Royal Sunflower bouquet image
- Text: Celebration
- Link: /congratulations-flowers-ghaziabad

Card 4:
- Photo: use the Blush Carnation bouquet image
- Text: Romantic
- Link: /romantic-flowers-ghaziabad

Card 5:
- Photo: use the Soft Pastel Pink Rose image
- Text: Get Well Soon
- Link: /get-well-soon-flowers-ghaziabad

Card 6:
- Photo: use the Sweet Pink Rose Bouquet image
- Text: Sorry
- Link: /sorry-flowers-ghaziabad

Card 7:
- Photo: use the Sunflower Burst bouquet image
- Text: Same Day
- Link: /same-day-flower-delivery-ghaziabad

Card 8:
- Photo: use the Ocean Mist bouquet image
- Text: Sympathy
- Link: /sympathy-flowers-ghaziabad

CARD STYLING:
```css
.category-strip {
  padding: 32px 20px;
  background: #FFFFFF;
}

.category-strip h2 {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 960px;
  margin: 0 auto;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  gap: 10px;
}

.category-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: border-color 0.2s ease, 
              transform 0.2s ease;
}

.category-card:hover img {
  border-color: #CC0000;
  transform: translateY(-3px);
}

.category-card span {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
  text-align: center;
}

@media (max-width: 767px) {
  .category-cards {
    grid-template-columns: repeat(4, 120px);
    overflow-x: auto;
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    padding-bottom: 8px;
    scrollbar-width: none;
  }
  .category-cards::-webkit-scrollbar {
    display: none;
  }
  .category-card {
    min-width: 100px;
    flex-shrink: 0;
  }
  .category-card img {
    width: 90px;
    height: 90px;
  }
  .category-card span {
    font-size: 12px;
  }
}
```

---

## CHANGE 3 — Redesign Delivery Area Section

The current delivery area section looks boring.
Replace it completely with this new design.

SECTION STRUCTURE:

Outer section background:
- Gradient: linear-gradient(135deg, #CC0000 0%, #990000 100%)
- Padding: 60px 20px
- Text-align: center

Section content (top to bottom):

1. Small label: 📍 Where We Deliver 
Style: font-size 12px, color rgba(255,255,255,0.7),
text-transform uppercase, letter-spacing 0.1em,
margin-bottom 12px, display block

2. Section H2:We Deliver Across All of Ghaziabad 
Style: font-size 28px desktop / 22px mobile,
color white, font-weight 700, margin-bottom 8px

3. Subtitle: Fresh bouquets to your door in under 1 hour 
Style: font-size 15px, color rgba(255,255,255,0.85),
margin-bottom 32px

4. Area cards grid:
Display 8 area cards in a 4x2 grid on desktop,
2x4 grid on mobile.

Each card:
- Background: rgba(255,255,255,0.12)
- Border: 1px solid rgba(255,255,255,0.25)
- Border-radius: 12px
- Padding: 16px 12px
- Text: white, font-size 14px, font-weight 600
- Emoji icon above text
- Hover: background rgba(255,255,255,0.22),
  transform translateY(-2px)

Area cards content:

Card 1: 🏡 Kavi Nagar
Card 2: 🌿 Raj Nagar
Card 3: 🏙️ Indirapuram
Card 4: 🌸 Vaishali
Card 5: 🌳 Vasundhara
Card 6: 🏘️ Mohan Nagar
Card 7: 🌻 Vijay Nagar
Card 8: 🏗️ Crossing Republik

CSS for area cards:
```css
.delivery-area-section {
  background: linear-gradient(
    135deg, #CC0000 0%, #990000 100%
  );
  padding: 60px 20px;
  text-align: center;
}

.area-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 800px;
  margin: 0 auto 32px auto;
}

.area-card {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 12px;
  padding: 16px 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: default;
  transition: background 0.2s ease, transform 0.2s ease;
}

.area-card:hover {
  background: rgba(255,255,255,0.22);
  transform: translateY(-2px);
}

.area-card .area-emoji {
  font-size: 22px;
  display: block;
  margin-bottom: 6px;
}

@media (max-width: 767px) {
  .area-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
```

5. Below area cards — WhatsApp note: Not sure if we deliver to your area?
Just WhatsApp us — we will reach you! 
Style: color rgba(255,255,255,0.8), font-size 14px,
margin-bottom 20px

6. WhatsApp CTA button at bottom of section:
Text: Order on WhatsApp Now
Style: background white, color #CC0000,
border-radius 8px, padding 14px 32px,
font-size 15px, font-weight 700,
box-shadow: 0 4px 16px rgba(0,0,0,0.2)
Hover: transform translateY(-2px),
box-shadow: 0 6px 20px rgba(0,0,0,0.25)

Keep the existing WhatsApp href link logic.

---

## VERIFICATION CHECKLIST

After implementing all 3 changes confirm every item:

[ ] 1. Hero section has NO background image
[ ] 2. Hero background shows subtle dot pattern on 
       light pink (#FFF5F5) background
[ ] 3. Small label "Ghaziabad's Local Florist" 
       appears above H1
[ ] 4. H1 reads "Fresh Flower Delivery in Ghaziabad"
[ ] 5. Price anchor line visible below subheadline
[ ] 6. On mobile, buttons are stacked vertically
       with proper gap — not joined together
[ ] 7. On desktop, buttons are side by side with gap
[ ] 8. Category strip section exists below hero
       with 8 category cards
[ ] 9. Each category card has bouquet photo + text
[ ] 10. Category cards scroll horizontally on mobile
[ ] 11. Delivery area section has red gradient background
[ ] 12. 8 area cards visible in grid layout
[ ] 13. Each area card has emoji + area name in white
[ ] 14. WhatsApp CTA button exists at bottom 
        of delivery area section in white
[ ] 15. No routing, server logic, head tags,
        FAQ, About Us, or footer changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Then implement. Verify all 15 items when done.
Do not touch anything not listed here.