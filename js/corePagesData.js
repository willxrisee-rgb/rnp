// js/corePagesData.js
// ─────────────────────────────────────────────────────────────────────────────
// Content data for all 10 Core Service SEO pages (Template 1).
// Each export matches the prop interface of the CoreServicePage renderer.
// Shared data is defined once and reused across all pages.
// ─────────────────────────────────────────────────────────────────────────────

// ── SHARED DATA ──────────────────────────────────────────────────────────────

const SHARED_BENEFITS = [
    { icon: '🌹', title: 'Fresh & Handmade', text: 'Every bouquet made to order daily' },
    { icon: '⚡', title: 'Same-day Delivery', text: 'Order by 6 PM, delivered today' },
    { icon: '💰', title: 'Starting ₹200', text: 'Bouquets for every budget' },
    { icon: '📲', title: 'WhatsApp Order', text: 'Simple, personal, fast' },
];

const SHARED_AREAS = [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
];

const SHARED_STEPS = [
    { number: '01', title: 'Browse & Pick', text: 'Choose your bouquet from our catalog or Instagram' },
    { number: '02', title: 'WhatsApp Us', text: 'Send your choice + delivery address on WhatsApp' },
    { number: '03', title: 'We Deliver', text: 'Fresh bouquet delivered to your door, same day' },
];

const WA_NUMBER = '917289996804';

// ── PAGE DATA ────────────────────────────────────────────────────────────────

window.CorePagesData = {

    // ─── 1. flower delivery Ghaziabad ────────────────────────────────────────
    'flower-delivery-ghaziabad': {
        pageTitle: 'Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword: 'flower delivery Ghaziabad',
        headline: 'Fresh Flower Delivery in Ghaziabad – Starting ₹200',
        subheadline: 'Handmade bouquets with same-day delivery across Ghaziabad. Order in 2 minutes on WhatsApp.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'Which areas in Ghaziabad do you deliver to?',
                a: 'We deliver to Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, Mohan Nagar, Vijay Nagar, Crossing Republik and nearby localities. Message us on WhatsApp if your area is not listed — we'll do our best to cover it.'
            },
            {
                q: 'Do you offer same-day flower delivery in Ghaziabad?',
                a: 'Yes. Place your order before 6 PM and we deliver the same day across most parts of Ghaziabad.'
            },
            {
                q: 'How do I place a flower delivery order?',
                a: 'Tap the "Order on WhatsApp" button on this page, share your bouquet choice and delivery address, and we will confirm your slot within minutes.'
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept UPI and bank transfer. Cash-on-delivery is not available at this time.'
            }
        ],
        ctaText: 'Order on WhatsApp',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want to order a bouquet for delivery in Ghaziabad.'
    },

    // ─── 2. online flower delivery Ghaziabad ─────────────────────────────────
    'online-flower-delivery-ghaziabad': {
        pageTitle: 'Online Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword: 'online flower delivery Ghaziabad',
        headline: 'Online Flower Delivery in Ghaziabad – Order from Home',
        subheadline: 'Skip the traffic. Browse bouquets online, order on WhatsApp, and we deliver fresh flowers to any address in Ghaziabad.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'How does online flower delivery work in Ghaziabad?',
                a: 'Browse our bouquets on this page or our Instagram, pick the one you like, and send us your order on WhatsApp. We arrange it fresh and deliver the same day.'
            },
            {
                q: 'Can I order flowers online for someone else in Ghaziabad?',
                a: 'Absolutely. Just share the recipient\'s address and preferred time slot on WhatsApp, and we will deliver directly to them.'
            },
            {
                q: 'Is there a minimum order value?',
                a: 'Our bouquets start at ₹200. There is no hidden delivery charge for areas we cover in Ghaziabad.'
            },
            {
                q: 'Do I need to download any app to order?',
                a: 'No app needed. You order directly through WhatsApp — it is the simplest way to get flowers delivered in Ghaziabad.'
            }
        ],
        ctaText: 'Order Online via WhatsApp',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want to order flowers online for delivery in Ghaziabad.'
    },

    // ─── 3. bouquet delivery Ghaziabad ───────────────────────────────────────
    'bouquet-delivery-ghaziabad': {
        pageTitle: 'Bouquet Delivery in Ghaziabad | Rose n Petals',
        mainKeyword: 'bouquet delivery Ghaziabad',
        headline: 'Beautiful Bouquet Delivery in Ghaziabad – From ₹200',
        subheadline: 'Hand-arranged bouquets for birthdays, anniversaries, or just because. Same-day delivery across Ghaziabad.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'What types of bouquets can I get delivered in Ghaziabad?',
                a: 'We offer rose bouquets, mixed flower arrangements, premium bouquets, and custom designs. Tell us your budget and occasion on WhatsApp and we will suggest the best option.'
            },
            {
                q: 'Can I add a message card with my bouquet?',
                a: 'Yes, every bouquet can include a free handwritten message card. Just share the text when you place your order on WhatsApp.'
            },
            {
                q: 'How fresh are the bouquets you deliver?',
                a: 'Every bouquet is made to order on the day of delivery from our Kavi Nagar and Raj Nagar units. We never deliver pre-made or stored arrangements.'
            },
            {
                q: 'Can I schedule a bouquet delivery for a specific time?',
                a: 'Yes, we offer time slots — morning (10 AM–1 PM), afternoon (1–4 PM), and evening (4–8 PM). Let us know your preference on WhatsApp.'
            }
        ],
        ctaText: 'Order a Bouquet on WhatsApp',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want to get a bouquet delivered in Ghaziabad.'
    },

    // ─── 4. send flowers to Ghaziabad ────────────────────────────────────────
    'send-flowers-ghaziabad': {
        pageTitle: 'Send Flowers to Ghaziabad | Rose n Petals',
        mainKeyword: 'send flowers to Ghaziabad',
        headline: 'Send Flowers to Ghaziabad – Delivered Fresh, Same Day',
        subheadline: 'Living outside Ghaziabad? Send a stunning bouquet to your loved ones — we handle the delivery while you handle the surprise.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'Can I send flowers to Ghaziabad from another city?',
                a: 'Yes. Many of our customers order from Delhi, Noida, or even other states. Just WhatsApp us the recipient\'s address in Ghaziabad and we will deliver.'
            },
            {
                q: 'Will the recipient know the sender\'s name?',
                a: 'Only if you want them to. You can include a custom message card with your name or keep it anonymous — just let us know.'
            },
            {
                q: 'What if the recipient is not home at the time of delivery?',
                a: 'We coordinate the delivery time with you on WhatsApp. If the recipient is unavailable, we will reschedule at no extra cost.'
            },
            {
                q: 'How do I pay if I am ordering from outside Ghaziabad?',
                a: 'We accept UPI and bank transfer — both work from anywhere in India. No cash-on-delivery at this time.'
            }
        ],
        ctaText: 'Send Flowers via WhatsApp',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want to send flowers to someone in Ghaziabad.'
    },

    // ─── 5. order flowers online Ghaziabad ───────────────────────────────────
    'order-flowers-online-ghaziabad': {
        pageTitle: 'Order Flowers Online in Ghaziabad | Rose n Petals',
        mainKeyword: 'order flowers online Ghaziabad',
        headline: 'Order Flowers Online in Ghaziabad – Quick & Easy',
        subheadline: 'No app downloads, no complicated checkout. Pick a bouquet, WhatsApp us, and your flowers are on the way.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'How quickly can I get flowers after ordering online?',
                a: 'If you order before 6 PM, we deliver the same day. Most deliveries reach within 2–4 hours of confirmation.'
            },
            {
                q: 'Do I need to create an account to order?',
                a: 'No accounts, no sign-ups. You order directly on WhatsApp. It is the fastest way to get flowers in Ghaziabad.'
            },
            {
                q: 'Can I customise the bouquet I order online?',
                a: 'Yes. Tell us your budget, preferred flowers, and colour scheme on WhatsApp and we will create a custom arrangement for you.'
            },
            {
                q: 'Is there an extra charge for online ordering?',
                a: 'No. The price you see is the price you pay. Delivery within our service areas in Ghaziabad is included.'
            }
        ],
        ctaText: 'Order Flowers on WhatsApp',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want to order flowers online in Ghaziabad.'
    },

    // ─── 6. florist in Ghaziabad ─────────────────────────────────────────────
    'florist-ghaziabad': {
        pageTitle: 'Trusted Florist in Ghaziabad | Rose n Petals',
        mainKeyword: 'florist in Ghaziabad',
        headline: 'Your Trusted Local Florist in Ghaziabad',
        subheadline: 'Rose n Petals is a family-run florist in Kavi Nagar, serving all of Ghaziabad with fresh, handmade bouquets starting at ₹200.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'Where is Rose n Petals located in Ghaziabad?',
                a: 'Our shop is at KD 14 Market, Block D, Sector 18, Kavi Nagar, Ghaziabad 201002. We also deliver across Ghaziabad.'
            },
            {
                q: 'What makes Rose n Petals different from other florists?',
                a: 'We are a local, family-run shop. Every bouquet is hand-arranged fresh on the day of delivery. We focus on quality and personal service, not mass production.'
            },
            {
                q: 'Can I visit your shop and pick up flowers directly?',
                a: 'Yes, walk-ins are welcome at our Kavi Nagar shop between 9 AM and 9 PM, every day.'
            },
            {
                q: 'Do you do bulk orders for events or weddings?',
                a: 'Yes, we handle bulk and event orders. WhatsApp us your requirements at least 2–3 days in advance so we can source the best flowers.'
            }
        ],
        ctaText: 'Chat with Your Florist',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I am looking for a florist in Ghaziabad. Can you help?'
    },

    // ─── 7. flower shop in Ghaziabad ─────────────────────────────────────────
    'flower-shop-ghaziabad': {
        pageTitle: 'Flower Shop in Ghaziabad | Rose n Petals',
        mainKeyword: 'flower shop in Ghaziabad',
        headline: 'Rose n Petals – Your Go-To Flower Shop in Ghaziabad',
        subheadline: 'Fresh flowers, beautiful arrangements, and same-day delivery from our Kavi Nagar shop to anywhere in Ghaziabad.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'What are your shop timings?',
                a: 'We are open every day from 9 AM to 9 PM at KD 14 Market, Block D, Sector 18, Kavi Nagar, Ghaziabad.'
            },
            {
                q: 'Do you only sell bouquets or loose flowers too?',
                a: 'We primarily specialise in bouquets and arrangements starting at ₹200. For loose flowers or bulk requirements, WhatsApp us and we will check availability.'
            },
            {
                q: 'Can I order from your shop for delivery to another area?',
                a: 'Yes. You can visit our shop or order via WhatsApp, and we deliver to Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara and other areas.'
            },
            {
                q: 'Do you offer gift wrapping?',
                a: 'Every bouquet comes beautifully wrapped at no extra charge. We also offer premium packaging for special occasions.'
            }
        ],
        ctaText: 'Order from Our Shop',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I found your flower shop online. I want to place an order.'
    },

    // ─── 8. fresh flowers Ghaziabad ──────────────────────────────────────────
    'fresh-flowers-ghaziabad': {
        pageTitle: 'Fresh Flowers in Ghaziabad | Rose n Petals',
        mainKeyword: 'fresh flowers Ghaziabad',
        headline: 'Guaranteed Fresh Flowers in Ghaziabad – Made to Order',
        subheadline: 'No pre-made bouquets sitting in storage. Every arrangement is crafted fresh on the day you order, using hand-picked flowers.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'How do you ensure the flowers are fresh?',
                a: 'We source flowers daily and make every bouquet to order. Nothing sits overnight. Your bouquet is arranged within hours of delivery.'
            },
            {
                q: 'What if the flowers I receive are not fresh?',
                a: 'This has not happened yet — but if it ever does, WhatsApp us a photo and we will replace the bouquet at no extra cost.'
            },
            {
                q: 'Which flowers are available year-round in Ghaziabad?',
                a: 'Roses, gerberas, carnations, and chrysanthemums are available throughout the year. Lilies and orchids are seasonal — check with us on WhatsApp for availability.'
            },
            {
                q: 'How long do your fresh flowers last?',
                a: 'With proper care (clean water, cool spot, trim stems every 2 days), most of our bouquets last 5–7 days easily.'
            }
        ],
        ctaText: 'Get Fresh Flowers Today',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want fresh flowers delivered in Ghaziabad.'
    },

    // ─── 9. rose bouquet delivery Ghaziabad ──────────────────────────────────
    'rose-bouquet-delivery-ghaziabad': {
        pageTitle: 'Rose Bouquet Delivery in Ghaziabad | Rose n Petals',
        mainKeyword: 'rose bouquet delivery Ghaziabad',
        headline: 'Rose Bouquet Delivery in Ghaziabad – Handmade with Love',
        subheadline: 'Red, pink, yellow, or white — choose your favourite roses and we will craft a stunning bouquet delivered to your door in Ghaziabad.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'What types of rose bouquets do you offer?',
                a: 'We offer red rose bouquets, pink rose arrangements, mixed-colour rose bunches, and premium long-stem rose bouquets. Starting at ₹200.'
            },
            {
                q: 'Can I choose the number of roses in my bouquet?',
                a: 'Yes. WhatsApp us with the number you want (6, 12, 24, 50, or 100 roses) and we will give you the exact price.'
            },
            {
                q: 'Are your roses locally sourced?',
                a: 'We source roses from trusted suppliers daily to ensure freshness. Depending on the season, they come from local growers or premium flower markets.'
            },
            {
                q: 'Can I combine roses with other flowers?',
                a: 'Absolutely. Mixed arrangements with roses, gerberas, carnations, or fillers are very popular. Tell us your preference on WhatsApp.'
            }
        ],
        ctaText: 'Order Rose Bouquet',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want a rose bouquet delivered in Ghaziabad.'
    },

    // ─── 10. mixed flower bouquet Ghaziabad ──────────────────────────────────
    'mixed-flower-bouquet-ghaziabad': {
        pageTitle: 'Mixed Flower Bouquet in Ghaziabad | Rose n Petals',
        mainKeyword: 'mixed flower bouquet Ghaziabad',
        headline: 'Mixed Flower Bouquets in Ghaziabad – Colourful & Fresh',
        subheadline: 'A vibrant mix of roses, gerberas, carnations, and seasonal fillers — hand-arranged and delivered same day across Ghaziabad.',
        benefits: SHARED_BENEFITS,
        areas: SHARED_AREAS,
        steps: SHARED_STEPS,
        faqs: [
            {
                q: 'What flowers are included in a mixed bouquet?',
                a: 'Our mixed bouquets typically include roses, gerberas, carnations, and seasonal fillers. The exact mix depends on the freshest flowers available that day.'
            },
            {
                q: 'Can I request specific flowers in my mixed bouquet?',
                a: 'Yes. WhatsApp us your preferred flowers and colours and we will customise the arrangement for you, subject to availability.'
            },
            {
                q: 'What is the price range for mixed flower bouquets?',
                a: 'Mixed bouquets start at ₹200 for a simple arrangement and go up to ₹2,000+ for premium large bouquets. Share your budget and we will suggest the best option.'
            },
            {
                q: 'Are mixed bouquets suitable for all occasions?',
                a: 'Absolutely. Mixed flower bouquets work beautifully for birthdays, anniversaries, get-well wishes, congratulations, or just to brighten someone\'s day.'
            }
        ],
        ctaText: 'Order Mixed Bouquet',
        whatsappNumber: WA_NUMBER,
        whatsappMessage: 'Hi! I want a mixed flower bouquet delivered in Ghaziabad.'
    }

};
