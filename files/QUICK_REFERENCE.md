# RNP SEO Templates — Quick Reference

## Files
| File | Use for |
|------|---------|
| `Template1_CoreService.jsx` | General / core keywords |
| `Template2_Occasion.jsx` | Birthday, anniversary, Valentine's, etc. |
| `Template3_LocalArea.jsx` | Indirapuram, Vaishali, Kavi Nagar, etc. |
| `Template4_Urgency.jsx` | Same-day, 2-hour, midnight, express |
| `rnp-templates.css` | Import once in your app |

---

## Keyword → Template mapping (all 50)

### Template 1 — CoreServicePage
```
flower delivery Ghaziabad              /flower-delivery-ghaziabad
online flower delivery Ghaziabad       /online-flower-delivery-ghaziabad
bouquet delivery Ghaziabad             /bouquet-delivery-ghaziabad
send flowers to Ghaziabad              /send-flowers-ghaziabad
order flowers online Ghaziabad         /order-flowers-online-ghaziabad
florist in Ghaziabad                   /florist-ghaziabad
flower shop in Ghaziabad               /flower-shop-ghaziabad
fresh flowers Ghaziabad                /fresh-flowers-ghaziabad
rose bouquet delivery Ghaziabad        /rose-bouquet-delivery-ghaziabad
red rose bouquet Ghaziabad             /red-rose-bouquet-ghaziabad
orchid bouquet Ghaziabad               /orchid-bouquet-ghaziabad
lily bouquet Ghaziabad                 /lily-bouquet-ghaziabad
gerbera bouquet Ghaziabad              /gerbera-bouquet-ghaziabad
carnation bouquet Ghaziabad            /carnation-bouquet-ghaziabad
romantic bouquet delivery Ghaziabad    /romantic-bouquet-delivery-ghaziabad
mixed flower bouquet Ghaziabad         /mixed-flower-bouquet-ghaziabad
premium flower bouquet Ghaziabad       /premium-flower-bouquet-ghaziabad
luxury flower delivery Ghaziabad       /luxury-flower-delivery-ghaziabad
flowers and gifts delivery Ghaziabad   /flowers-and-gifts-delivery-ghaziabad
best florist in Ghaziabad              /best-florist-ghaziabad
online florist Ghaziabad               /online-florist-ghaziabad
bouquet shop Ghaziabad                 /bouquet-shop-ghaziabad
```

### Template 2 — OccasionPage
```
birthday flower delivery Ghaziabad     /birthday-flower-delivery-ghaziabad
anniversary bouquet delivery Ghaziabad /anniversary-bouquet-delivery-ghaziabad
valentines bouquet Ghaziabad           /valentines-bouquet-ghaziabad
love flowers delivery Ghaziabad        /love-flowers-delivery-ghaziabad
congratulations flowers Ghaziabad      /congratulations-flowers-ghaziabad
thank you flowers Ghaziabad            /thank-you-flowers-ghaziabad
apology flowers Ghaziabad              /apology-flowers-ghaziabad
sympathy flowers Ghaziabad             /sympathy-flowers-ghaziabad
wedding bouquet Ghaziabad              /wedding-bouquet-ghaziabad
special occasion flowers Ghaziabad     /special-occasion-flowers-ghaziabad
```

### Template 3 — LocalAreaPage
```
flower delivery Indirapuram            /flower-delivery-indirapuram
flower delivery Vaishali Ghaziabad     /flower-delivery-vaishali-ghaziabad
flower delivery Vasundhara Ghaziabad   /flower-delivery-vasundhara-ghaziabad
flower delivery Raj Nagar Ghaziabad    /flower-delivery-raj-nagar-ghaziabad
flower delivery Kavi Nagar Ghaziabad   /flower-delivery-kavi-nagar-ghaziabad
flower delivery Ghaziabad city         /flower-delivery-ghaziabad-city
local florist Indirapuram              /local-florist-indirapuram
local florist Vaishali                 /local-florist-vaishali
nearby flower shop Ghaziabad           /nearby-flower-shop-ghaziabad
florist near me Ghaziabad              /florist-near-me-ghaziabad
```

### Template 4 — UrgencyPage
```
same day flower delivery Ghaziabad     /same-day-flower-delivery-ghaziabad
midnight flower delivery Ghaziabad     /midnight-flower-delivery-ghaziabad
2 hour flower delivery Ghaziabad       /2-hour-flower-delivery-ghaziabad
express flower delivery Ghaziabad      /express-flower-delivery-ghaziabad
same day bouquet delivery Ghaziabad    /same-day-bouquet-delivery-ghaziabad
free delivery flowers Ghaziabad        /free-delivery-flowers-ghaziabad
affordable flower delivery Ghaziabad   /affordable-flower-delivery-ghaziabad
cheap flower bouquet Ghaziabad         /cheap-flower-bouquet-ghaziabad
```

---

## Minimal router setup (React Router v6)

```jsx
import { Routes, Route } from 'react-router-dom';
import CoreServicePage from './templates/Template1_CoreService';
import OccasionPage    from './templates/Template2_Occasion';
import LocalAreaPage   from './templates/Template3_LocalArea';
import UrgencyPage     from './templates/Template4_Urgency';

// Shared data — define once, spread into each page
import { SHARED_STEPS, SHARED_BENEFITS, SHARED_AREAS } from './content/sharedData';

<Routes>
  {/* Template 1 — Core */}
  <Route path="/flower-delivery-ghaziabad" element={
    <CoreServicePage
      headline="Flower Delivery in Ghaziabad — Fresh Bouquets from ₹200"
      mainKeyword="Flower Delivery Ghaziabad"
      {...SHARED_STEPS} {...SHARED_BENEFITS} {...SHARED_AREAS}
    />
  } />

  {/* Template 2 — Occasion */}
  <Route path="/birthday-flower-delivery-ghaziabad" element={
    <OccasionPage
      occasionName="Birthday"
      occasionEmoji="🎂"
      headline="Surprise Them with a Birthday Bouquet in Ghaziabad"
      whatsappMessage="Hi! I want to order a birthday bouquet in Ghaziabad."
      {...SHARED_STEPS} {...SHARED_BENEFITS} {...SHARED_AREAS}
    />
  } />

  {/* Template 3 — Local */}
  <Route path="/flower-delivery-indirapuram" element={
    <LocalAreaPage
      areaName="Indirapuram"
      deliveryTime="2–4 hours"
      headline="Flower Delivery in Indirapuram — Fresh Bouquets from ₹200"
      whatsappMessage="Hi! I want flower delivery in Indirapuram."
      {...SHARED_STEPS} {...SHARED_BENEFITS}
    />
  } />

  {/* Template 4 — Urgency */}
  <Route path="/same-day-flower-delivery-ghaziabad" element={
    <UrgencyPage
      urgencyType="same-day"
      deliveryPromise="Order by 6 PM → Delivered Today"
      cutoffTime="Order before 6 PM for same-day delivery"
      headline="Same Day Flower Delivery in Ghaziabad"
      whatsappMessage="Hi! I need same-day flower delivery in Ghaziabad."
      {...SHARED_STEPS} {...SHARED_BENEFITS} {...SHARED_AREAS}
    />
  } />
</Routes>
```

---

## Tip: sharedData.js (create this file to avoid repetition)

```js
// src/content/sharedData.js

export const SHARED_BENEFITS = {
  benefits: [
    { icon: '🌹', title: 'Fresh & Handmade', text: 'Every bouquet made to order daily' },
    { icon: '⚡', title: 'Same-day Delivery', text: 'Order by 6 PM, delivered today' },
    { icon: '💰', title: 'Starting ₹200', text: 'Bouquets for every budget' },
    { icon: '📲', title: 'WhatsApp Order', text: 'Simple, personal, fast' },
  ],
};

export const SHARED_AREAS = {
  areas: [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
  ],
};

export const SHARED_STEPS = {
  steps: [
    { number: '01', title: 'Browse & Pick', text: 'Choose your bouquet from the options below' },
    { number: '02', title: 'WhatsApp Us', text: 'Send your choice + address on WhatsApp' },
    { number: '03', title: 'We Deliver', text: 'Fresh bouquet delivered to your door' },
  ],
};
```
