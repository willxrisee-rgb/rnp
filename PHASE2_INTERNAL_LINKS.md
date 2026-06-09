# Rose n Petals — PHASE 2: Internal Linking
# File: ~/Documents/rnp/PHASE2_INTERNAL_LINKS.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will change.
3. Do NOT implement until plan is confirmed.
4. After implementing verify every checklist item.
5. Do NOT change routing, server.js, SEO head tags,
   sitemap.xml, robots.txt, or any existing sections.
6. Only ADD the two new sections described below.

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Ghaziabad
Live URL: https://rosenpetals.com

The 36 landing pages exist at real URLs but most are
not linked from anywhere on the site. Google needs
to find these pages by following links.
This chunk adds two footer sections that create
internal links to all 36 pages.

---

## CHANGE 1 — Add "Delivery Areas" footer section
  to index.html, policies.html, landing-page.html

Add this new HTML section INSIDE the footer, ABOVE
the copyright bar, in all three files.
Use exact same classes in all three files.

Section: Delivery Areas

HTML to add:
<div class="footer-links-section">
  <div class="footer-links-col">
    <h4>Flower Delivery by Area</h4>
    <ul>
      <li><a href="/flower-delivery-kavi-nagar-ghaziabad">Kavi Nagar</a></li>
      <li><a href="/flower-delivery-raj-nagar-ghaziabad">Raj Nagar</a></li>
      <li><a href="/flower-delivery-indirapuram">Indirapuram</a></li>
      <li><a href="/flower-delivery-vaishali-ghaziabad">Vaishali</a></li>
      <li><a href="/flower-delivery-vasundhara-ghaziabad">Vasundhara</a></li>
      <li><a href="/flower-delivery-mohan-nagar-ghaziabad">Mohan Nagar</a></li>
      <li><a href="/flower-delivery-vijay-nagar-ghaziabad">Vijay Nagar</a></li>
      <li><a href="/flower-delivery-crossing-republik-ghaziabad">Crossing Republik</a></li>
    </ul>
  </div>
  <div class="footer-links-col">
    <h4>Shop by Occasion</h4>
    <ul>
      <li><a href="/birthday-flowers-ghaziabad">Birthday Flowers</a></li>
      <li><a href="/anniversary-flowers-ghaziabad">Anniversary Flowers</a></li>
      <li><a href="/romantic-flowers-ghaziabad">Romantic Flowers</a></li>
      <li><a href="/get-well-soon-flowers-ghaziabad">Get Well Soon</a></li>
      <li><a href="/congratulations-flowers-ghaziabad">Congratulations</a></li>
      <li><a href="/sorry-flowers-ghaziabad">Sorry Flowers</a></li>
      <li><a href="/housewarming-flowers-ghaziabad">Housewarming</a></li>
      <li><a href="/sympathy-flowers-ghaziabad">Sympathy Flowers</a></li>
      <li><a href="/new-baby-flowers-ghaziabad">New Baby Flowers</a></li>
      <li><a href="/diwali-flowers-ghaziabad">Diwali Flowers</a></li>
    </ul>
  </div>
  <div class="footer-links-col">
    <h4>Same Day Delivery</h4>
    <ul>
      <li><a href="/same-day-flower-delivery-ghaziabad">Same Day Delivery</a></li>
      <li><a href="/express-flower-delivery-ghaziabad">Express Delivery</a></li>
      <li><a href="/urgent-flower-delivery-ghaziabad">Urgent Delivery</a></li>
      <li><a href="/last-minute-flower-delivery-ghaziabad">Last Minute</a></li>
      <li><a href="/flower-delivery-today-ghaziabad">Delivery Today</a></li>
      <li><a href="/emergency-flower-delivery-ghaziabad">Emergency Delivery</a></li>
      <li><a href="/midnight-flower-delivery-ghaziabad">Midnight Delivery</a></li>
      <li><a href="/2-hour-flower-delivery-ghaziabad">2 Hour Delivery</a></li>
    </ul>
  </div>
  <div class="footer-links-col">
    <h4>More</h4>
    <ul>
      <li><a href="/flower-delivery-ghaziabad">Flower Delivery Ghaziabad</a></li>
      <li><a href="/florist-ghaziabad">Florist Ghaziabad</a></li>
      <li><a href="/online-flower-delivery-ghaziabad">Online Flower Delivery</a></li>
      <li><a href="/bouquet-delivery-ghaziabad">Bouquet Delivery</a></li>
      <li><a href="/send-flowers-ghaziabad">Send Flowers</a></li>
      <li><a href="/rose-bouquet-delivery-ghaziabad">Rose Bouquets</a></li>
      <li><a href="/mixed-flower-bouquet-ghaziabad">Mixed Bouquets</a></li>
      <li><a href="/fresh-flowers-ghaziabad">Fresh Flowers</a></li>
    </ul>
  </div>
</div>

---

## CHANGE 2 — Add CSS for footer link columns

Add these styles to css/styles.css:

.footer-links-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 40px 20px;
  border-top: 1px solid rgba(255,255,255,0.15);
  max-width: 1100px;
  margin: 0 auto;
}

.footer-links-col h4 {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

.footer-links-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links-col ul li {
  margin-bottom: 6px;
}

.footer-links-col ul li a {
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links-col ul li a:hover {
  color: white;
}

@media (max-width: 767px) {
  .footer-links-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 32px 16px;
  }
}

@media (max-width: 480px) {
  .footer-links-section {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

NOTE: Check the footer background colour in the
existing CSS. The footer is probably a dark red
or dark background. These styles use white text
which is designed for a dark footer. If the footer
background is white or light grey, change the
h4 color to #CC0000 and the link color to #555555
and hover color to #CC0000.

---

## VERIFICATION CHECKLIST

After implementing confirm every item:

[ ] 1. Footer in index.html shows 4 columns of links
[ ] 2. Footer in policies.html shows same 4 columns
[ ] 3. Footer in landing-page.html shows same 4 columns
[ ] 4. All 36 landing page links are present across
       the 4 columns
[ ] 5. On mobile footer shows 2 columns not 4
[ ] 6. Links are not broken — each href points to
       the correct real URL path
[ ] 7. No existing footer content (address, phone,
       hours, copyright) was removed or moved
[ ] 8. No SEO tags, routing, server.js changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Then implement. Verify all 8 items when done.