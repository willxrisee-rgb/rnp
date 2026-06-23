// js/urgencyPagesData.js
// ─────────────────────────────────────────────────────────────────────────────
// Content data for all 8 Urgency / Express SEO pages (Template 4).
// Each entry matches the prop interface expected by UrgencyServiceRoutes.render().
// ─────────────────────────────────────────────────────────────────────────────

// ── SHARED CONSTANTS ──────────────────────────────────────────────────────────

window.URGENCY_AREAS = window.URGENCY_AREAS || [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
];

window.URGENCY_BENEFITS = window.URGENCY_BENEFITS || [
    { icon: '🌹', title: 'Fresh, Not Pre-made',   text: 'Every bouquet arranged on the day of delivery' },
    { icon: '⚡', title: 'Priority Dispatch',      text: 'Urgent orders are our top priority' },
    { icon: '💰', title: 'No Express Surcharge',   text: 'Same price as standard — starting ₹200' },
    { icon: '📲', title: 'Confirm on WhatsApp',    text: 'Slot confirmed within 10 minutes of your message' },
];

window.URGENCY_SPEED_PROOF = window.URGENCY_SPEED_PROOF || [
    { icon: '⚡', stat: 'Under 1 hr', label: 'Delivery from confirmation',  note: 'Across Ghaziabad' },
    { icon: '📦', stat: '8 PM',       label: 'Same-day order cut-off',      note: '7 days a week' },
    { icon: '🌙', stat: '10 PM',      label: 'Midnight delivery cut-off',   note: 'With advance booking' },
];

window.WA_NUMBER = window.WA_NUMBER || '917289996804';

// ── PAGE DATA ────────────────────────────────────────────────────────────────

window.UrgencyPagesData = {

    // ─── 1. same day flower delivery Ghaziabad ───────────────────────────────
    'same-day-flower-delivery-ghaziabad': {
        pageTitle:       'Same Day Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword:     'same day flower delivery Ghaziabad',
        urgencyType:     'same-day',
        deliveryPromise: 'Order by 8 PM → Delivered Today',
        cutoffTime:      'Order before 8 PM for same-day delivery in Ghaziabad',
        guaranteeText:   'If we cannot make your slot, we will call you immediately. No hidden delays.',
        headline:        'Same Day Flower Delivery in Ghaziabad',
        subheadline:     'Order by 8 PM and your fresh bouquet arrives today. Hand-arranged, not pre-packaged. Starting ₹200.',
        benefits:        window.URGENCY_BENEFITS,
        speedProof:      window.URGENCY_SPEED_PROOF,
        areas:           window.URGENCY_AREAS,
        steps: [
            { number: '01', title: 'WhatsApp Your Order',    text: 'Send us your bouquet choice, delivery address, and preferred time slot on WhatsApp.',           time: 'Takes 2 minutes' },
            { number: '02', title: 'We Confirm Your Slot',   text: 'We confirm availability and freshness for your requested time and start preparing your bouquet.', time: 'Within 10 minutes' },
            { number: '03', title: 'Delivered to Your Door', text: 'Your fresh bouquet is delivered to your address in Ghaziabad within under an hour of confirmation.', time: 'Under 1 hour from confirmation' },
        ],
        faqs: [
            { q: 'What is the cut-off time for same-day flower delivery in Ghaziabad?',  a: 'Order before 8 PM and we deliver the same day to most areas of Ghaziabad.' },
            { q: 'Is there an extra charge for same-day delivery?',                       a: 'No. Our bouquets start at ₹200 with no express surcharge for same-day delivery within our service areas.' },
            { q: 'What if I order after 8 PM?',                                           a: 'We will attempt delivery the same evening if your area is close by. Otherwise, we will schedule a first-thing-next-morning delivery and confirm with you on WhatsApp.' },
            { q: 'Can I choose a specific delivery time for same-day orders?',            a: 'Yes. We offer morning (10 AM–1 PM), afternoon (1–4 PM), and evening (4–8 PM) slots. Mention your preferred window when you WhatsApp us.' },
            { q: 'Which areas in Ghaziabad get same-day delivery?',                       a: 'We cover Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, Mohan Nagar, Vijay Nagar, and Crossing Republik. WhatsApp us if you are unsure about your area.' },
        ],
        ctaText:          'Order Same-Day on WhatsApp',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I need same-day flower delivery in Ghaziabad today.',
        relatedUrgency: [
            { label: 'Under 1 Hour Delivery', href: '#/2-hour-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',      href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Midnight Delivery',     href: '#/midnight-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Same Day Flower Delivery in Ghaziabad — Why Rose n Petals</h2><p>The bouquet needs to arrive today. Whether you remembered this morning or the situation just came up an hour ago, same-day flower delivery is what we do — every single day, from 8 AM to 10 PM, from our Kavi Nagar shop. Most orders arrive within an hour of being confirmed. This is not a special service with a surcharge — it is how we have operated since 1999.</p><p>Same-day has never been the exception here. It is the default.</p><h3>How It Works for Same-Day Orders</h3><p>Order by 9 PM for same-day delivery across most of Ghaziabad. For areas farther from our Kavi Nagar shop — Crossing Republik and the outer Vasundhara sectors — we recommend ordering by 8:30 PM to ensure delivery within operating hours. WhatsApp +91 7289996804 with your delivery address, occasion, and budget. We confirm availability immediately. Once payment is received via UPI or bank transfer, preparation begins.</p><p>The one variable is proximity — Kavi Nagar and Vijay Nagar typically receive delivery in 20 to 30 minutes. Indirapuram, Vaishali, and Raj Nagar in 30 to 45 minutes. Crossing Republik in 45 to 60 minutes.</p><h3>Why Our Same-Day Delivery is Reliable</h3><p>Same-day delivery works because we make the bouquet and deliver it ourselves. There is no platform routing your order. There is no third-party florist who may or may not be available in your area. Our Kavi Nagar shop makes your bouquet and our own person brings it to your address. After 26 years of same-day deliveries across Ghaziabad, we know the routes, the timing, and what realistic cutoff windows look like for every area we cover.</p>`,
    },

    // ─── 2. express flower delivery Ghaziabad ────────────────────────────────
    'express-flower-delivery-ghaziabad': {
        pageTitle:       'Express Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword:     'express flower delivery Ghaziabad',
        urgencyType:     'express',
        deliveryPromise: 'Express Delivery — Flowers in Under 1 Hour',
        cutoffTime:      'Order before 8 PM for express same-day delivery',
        guaranteeText:   'We prioritise express orders. You get a WhatsApp confirmation within 10 minutes.',
        headline:        'Express Flower Delivery in Ghaziabad — Under 1 Hour',
        subheadline:     'No waiting. Order now, we prepare fresh, and your bouquet is at the door in under an hour of confirmation. Starting ₹200.',
        benefits:        window.URGENCY_BENEFITS,
        speedProof:      window.URGENCY_SPEED_PROOF,
        areas:           window.URGENCY_AREAS,
        steps: [
            { number: '01', title: 'WhatsApp Us Now',         text: 'Share your bouquet choice, address, and the time by which you need it delivered.',               time: 'Takes 2 minutes' },
            { number: '02', title: 'Slot Confirmed Fast',     text: 'We confirm your express slot within 10 minutes and start arranging your bouquet immediately.',   time: 'Within 10 minutes' },
            { number: '03', title: 'Express Delivery Done',   text: 'Your fresh bouquet is delivered to your Ghaziabad address in under 1 hour of confirmation.',     time: 'Under 1 hour from confirmation' },
        ],
        faqs: [
            { q: 'How fast is express flower delivery in Ghaziabad?',       a: 'Our express delivery typically reaches you in under 1 hour of confirming your order on WhatsApp.' },
            { q: 'Do you charge extra for express delivery?',                a: 'No extra charge. Express delivery within our Ghaziabad service areas is included in the bouquet price, starting at ₹200.' },
            { q: 'What is the latest I can order for express delivery today?', a: 'Order before 8 PM and we can deliver the same day. WhatsApp us your slot preference and we confirm within 10 minutes.' },
            { q: 'Can I get express delivery for a specific occasion?',      a: 'Yes — birthdays, anniversaries, apologies, anything. Just tell us the occasion and your time constraint on WhatsApp.' },
            { q: 'What if there is a delay in my express order?',            a: 'We will call you immediately if any delay looks likely. This is rare, but we believe in being upfront rather than surprising you.' },
        ],
        ctaText:          'Order Express Delivery on WhatsApp',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I need express flower delivery in Ghaziabad — as fast as possible.',
        relatedUrgency: [
            { label: 'Same Day Delivery',       href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Under 1 Hour Delivery',   href: '#/2-hour-flower-delivery-ghaziabad' },
            { label: 'Midnight Delivery',     href: '#/midnight-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Express Flower Delivery in Ghaziabad — Why Rose n Petals</h2><p>Under one hour. That is our average delivery time across Ghaziabad, and for most areas it is not an average — it is the norm. Express flower delivery is not a premium tier here. It is the standard way we have operated since 1999.</p><p>From the moment your order is confirmed and paid, the bouquet goes into preparation. From the moment it is complete, it leaves the door. We are a single-shop operation in Kavi Nagar — there is no logistics chain, no handoff, no delay between the florist and the delivery. Starting at ₹200.</p><h3>How It Works for Express Orders</h3><p>WhatsApp +91 7289996804 immediately. Tell us you need the flowers within the hour. Share your address in Ghaziabad. We confirm whether the timeline is achievable for your specific address — Kavi Nagar and nearby: 30 minutes or less. Indirapuram, Vaishali, Raj Nagar: 30 to 45 minutes. Outer areas: 45 to 60 minutes. Once we confirm, payment via UPI or bank transfer is all that stands between you and the bouquet being made. Preparation begins the moment payment clears.</p><h3>Why This is Possible</h3><p>Express delivery works here because we are not a platform. When you order express delivery from our shop, a person at our Kavi Nagar location reads your message, picks up the flowers, and makes your bouquet. The florist who has been doing this since 1999 knows how to work at pace without compromising the arrangement. Express delivery does not mean a rushed, sloppy bouquet — it means the same handmade quality delivered on a tighter timeline.</p>`,
    },

    // ─── 3. 2 hour flower delivery Ghaziabad ─────────────────────────────────
    '2-hour-flower-delivery-ghaziabad': {
        pageTitle:       'Under 1 Hour Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword:     '2 hour flower delivery Ghaziabad',
        urgencyType:     '2-hour',
        deliveryPromise: 'Flowers at Your Door in Under 1 Hour',
        cutoffTime:      'Available till 8 PM — order now to guarantee your under-1-hour slot',
        guaranteeText:   'We confirm your delivery slot on WhatsApp within 10 minutes. If we cannot meet it, we tell you immediately.',
        headline:        'Under 1 Hour Flower Delivery in Ghaziabad — Ultra Fast',
        subheadline:     'Need flowers fast? WhatsApp us now and we will arrange a fresh bouquet and deliver to your door in Ghaziabad in under 1 hour of confirmation. Starting ₹200.',
        benefits: [
            { icon: '⚡', title: 'Under 1 Hour Delivery', text: 'Fastest delivery option in Ghaziabad' },
            { icon: '🌹', title: 'Made Fresh On Demand',  text: 'Arranged right after you confirm your order' },
            { icon: '💰', title: 'No Rush Surcharge',     text: 'Same pricing from ₹200 — no extra fees' },
            { icon: '📲', title: 'WhatsApp Slot Booking', text: 'Slot confirmed within 10 minutes' },
        ],
        speedProof: [
            { icon: '⚡', stat: 'Under 1 hr', label: 'Delivery from confirmation',       note: 'Within Ghaziabad service areas' },
            { icon: '📦', stat: '8 PM',        label: 'Fast-slot booking cut-off',        note: '7 days a week' },
            { icon: '✅', stat: '10 min',       label: 'Slot confirmation time',           note: 'Via WhatsApp' },
        ],
        areas:   URGENCY_AREAS,
        steps: [
            { number: '01', title: 'WhatsApp Right Now',                   text: 'Tell us your bouquet preference, delivery address, and that you need fastest delivery.',              time: 'Takes 2 minutes' },
            { number: '02', title: 'We Confirm Your Fast Slot',            text: 'We check availability and confirm your under-1-hour delivery slot on WhatsApp within 10 minutes.', time: 'Within 10 minutes' },
            { number: '03', title: 'Fresh Bouquet Delivered',              text: 'Your bouquet is arranged fresh and delivered to your Ghaziabad address in under 1 hour.',           time: 'Under 1 hour from confirmation' },
        ],
        faqs: [
            { q: 'How fast is your fastest flower delivery in Ghaziabad?',  a: 'We deliver in under 1 hour of confirming your order. WhatsApp us now and we will check the slot for your area.' },
            { q: 'What time do I need to order by for under-1-hour delivery?', a: 'Book your fast slot before 8 PM. WhatsApp us your order and we confirm within 10 minutes.' },
            { q: 'Do you charge extra for this fast delivery?',                a: 'No — our pricing starts at ₹200 and does not include a rush fee for areas we regularly serve.' },
            { q: 'How do I confirm my fast delivery slot?',                    a: 'Just WhatsApp us with your order details. We reply with a slot confirmation within 10 minutes.' },
            { q: 'Can I get this fast delivery for a surprise birthday or anniversary?', a: 'Absolutely. Many of our customers use this for last-minute surprises. Just message us and we will make it happen.' },
        ],
        ctaText:          'Book Your Fast Slot on WhatsApp',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I need the fastest flower delivery in Ghaziabad — under 1 hour if possible.',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Midnight Delivery',   href: '#/midnight-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Under 1 Hour Flower Delivery in Ghaziabad — Why Rose n Petals</h2><p>Two hours is enough time to order, pay, have a bouquet made by hand in our Kavi Nagar shop, and deliver it to any address across Ghaziabad — including the farther areas like Crossing Republik and outer Vasundhara. If you have a two-hour window and you need flowers at a specific address in Ghaziabad, we are the shop to call.</p><p>No platform logistics, no subcontracting, no guesswork on timing. One Ghaziabad-based shop, one florist, one delivery, made to your order. Starting at ₹200.</p><h3>How It Works for Fast Orders</h3><p>A fast delivery order works with a simple calculation. WhatsApp +91 7289996804 with the delivery address, the occasion, and your budget. We confirm your delivery slot — "under 1 hour from now" means exactly that. We build your bouquet after confirmation and dispatch with enough time to reach even the farther delivery areas within the window. If you need flowers at 3 PM, order by 1 PM. If you need them by 7 PM, order by 5 PM. For Crossing Republik and outer Vasundhara, add 15 minutes to the window to be comfortable.</p><h3>Why the Fast Window Holds</h3><p>A shop that has operated in Ghaziabad since 1999 knows what the routes look like on every road at every hour of the day. We have made deliveries during Diwali traffic, monsoon delays, and peak evening congestion. We make the bouquet ourselves and deliver it ourselves, which means there are no gaps in the chain where your order can get lost between platforms, fulfilment centres, and assigned florists.</p>`,
    },

    // ─── 4. midnight flower delivery Ghaziabad ───────────────────────────────
    'midnight-flower-delivery-ghaziabad': {
        pageTitle:       'Midnight Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword:     'midnight flower delivery Ghaziabad',
        urgencyType:     'midnight',
        deliveryPromise: 'Midnight Delivery — Surprise Them at 12 AM',
        cutoffTime:      'Book your midnight slot before 10 PM — advance booking recommended',
        guaranteeText:   'Midnight slots are limited. Book early and we confirm your exact delivery window on WhatsApp.',
        headline:        'Midnight Flower Delivery in Ghaziabad — Surprise at 12 AM',
        subheadline:     'Make their birthday or anniversary unforgettable. Fresh bouquets delivered between 11 PM and 1 AM in Ghaziabad. Starting ₹200.',
        benefits: [
            { icon: '🌙', title: 'Midnight Slots Available', text: 'Delivery between 11 PM and 1 AM in Ghaziabad' },
            { icon: '🌹', title: 'Fresh, Not Pre-arranged',  text: 'Bouquet prepared fresh on the delivery day' },
            { icon: '💰', title: 'Starting ₹200',            text: 'Affordable surprise delivery — no midnight premium' },
            { icon: '📲', title: 'WhatsApp Slot Booking',    text: 'Confirm your midnight slot in advance via WhatsApp' },
        ],
        speedProof: [
            { icon: '🌙', stat: '11 PM–1 AM', label: 'Midnight delivery window',    note: 'Ghaziabad service areas' },
            { icon: '📦', stat: '10 PM',       label: 'Last booking time for midnight', note: 'Advance booking preferred' },
            { icon: '✅', stat: 'Limited',     label: 'Midnight slots per night',    note: 'Book early to secure yours' },
        ],
        areas:   URGENCY_AREAS,
        steps: [
            { number: '01', title: 'Book in Advance',             text: 'WhatsApp us by 10 PM with your bouquet choice, address, and the midnight delivery time you want.',        time: 'Book by 10 PM' },
            { number: '02', title: 'Slot Confirmed on WhatsApp',  text: 'We confirm your midnight slot and payment. Slots are limited, so booking early is highly recommended.',   time: 'Within 30 minutes of booking' },
            { number: '03', title: 'Delivered at Midnight',       text: 'Your fresh bouquet is delivered to the recipient between 11 PM and 1 AM — the perfect surprise.',        time: '11 PM – 1 AM' },
        ],
        faqs: [
            { q: 'Is midnight flower delivery available every night in Ghaziabad?',    a: 'We offer midnight delivery most nights, but slots are limited. We recommend booking at least a day in advance, or by 10 PM on the day you want delivery.' },
            { q: 'What time exactly does midnight delivery happen?',                     a: 'Deliveries are made between 11 PM and 1 AM depending on your area and slot availability. We will confirm the exact window on WhatsApp.' },
            { q: 'Do you charge extra for midnight delivery?',                           a: 'Our bouquets start at ₹200. There may be a small convenience charge for midnight slots in certain areas — we will tell you upfront when you book.' },
            { q: 'How do I book a midnight delivery slot?',                              a: 'WhatsApp us with the recipient\'s address, your bouquet choice, and the midnight date. We will confirm your slot and share payment details.' },
            { q: 'Can I get midnight delivery for birthdays and anniversaries?',         a: 'Yes — midnight delivery is most popular for birthdays and anniversaries. It makes for an unforgettable surprise. Book early to get your preferred slot.' },
        ],
        ctaText:          'Book Midnight Delivery on WhatsApp',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I want to book midnight flower delivery in Ghaziabad.',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Urgent Delivery',     href: '#/urgent-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Midnight Flower Delivery in Ghaziabad — Why Rose n Petals</h2><p>A birthday that begins exactly at midnight. A surprise that has to land at 12 AM, not 8 AM the next day. The idea of flowers arriving at the door just as the clock turns — or of knowing that the delivery is on its way at the exact right moment — requires a florist who operates during those hours.</p><p>We close at 10 PM and accept last orders by 9 PM. This means we can get flowers to your Ghaziabad address by 10 PM, covering the late-evening birthday surprise that begins in the hours just before midnight. For true midnight delivery between 11 PM and 1 AM, book your slot in advance and we will arrange it.</p><h3>How It Works for Late-Evening Orders</h3><p>For a late-evening birthday surprise, order by 9 PM and request delivery between 9 PM and 10 PM. For midnight slots, WhatsApp +91 7289996804 as early in the evening as possible with the address and your timing preference. For Kavi Nagar and nearby areas, a 9 PM order can be delivered by 9:30 PM. For areas like Indirapuram or Vaishali, an 8:30 PM to 9 PM order is needed for delivery by 10 PM.</p><h3>Why Late-Evening Delivery From Our Shop</h3><p>Most Ghaziabad florists close at 7 or 8 PM. We are open until 10 PM every day — which means we cover the evening gifting window that most shops miss entirely. After 26 years of daily deliveries across Ghaziabad, late-evening timing is something we control and commit to. No routing, no intermediaries. Our 26 years of Ghaziabad operations mean we have done this for hundreds of customers who wanted flowers to arrive at a specific hour.</p>`,
    },

    // ─── 5. urgent flower delivery Ghaziabad ─────────────────────────────────
    'urgent-flower-delivery-ghaziabad': {
        pageTitle:       'Urgent Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword:     'urgent flower delivery Ghaziabad',
        urgencyType:     'express',
        deliveryPromise: 'Urgent Order? We Prioritise You — Under 1 Hour Delivery',
        cutoffTime:      'WhatsApp us before 8 PM — urgent orders are handled on priority',
        guaranteeText:   'Urgent orders jump the queue. We confirm your slot within 10 minutes on WhatsApp.',
        headline:        'Urgent Flower Delivery in Ghaziabad — Handled on Priority',
        subheadline:     'No time to plan? No problem. WhatsApp us your urgent flower delivery request and we deliver in under 1 hour of confirmation. Starting ₹200.',
        benefits:        window.URGENCY_BENEFITS,
        speedProof:      window.URGENCY_SPEED_PROOF,
        areas:           window.URGENCY_AREAS,
        steps: [
            { number: '01', title: 'Message Us Right Now',        text: 'Send your bouquet choice, address, and how urgently you need it — we respond within minutes.',         time: 'Response in 5–10 minutes' },
            { number: '02', title: 'Priority Slot Confirmed',     text: 'We prioritise urgent orders and confirm your delivery slot on WhatsApp before we start preparing.',   time: 'Within 10 minutes' },
            { number: '03', title: 'Delivered in Under 1 Hour',  text: 'Your fresh bouquet is dispatched on priority and delivered to your Ghaziabad address.',               time: 'Under 1 hour from confirmation' },
        ],
        faqs: [
            { q: 'Can you really handle urgent flower orders in Ghaziabad?',          a: 'Yes. Urgent orders are our top priority. WhatsApp us now and we will tell you the fastest slot available for your area.' },
            { q: 'How quickly can you deliver if I order right now?',                  a: 'For most areas of Ghaziabad, we can deliver in under 1 hour of confirming your order, provided it is before 8 PM.' },
            { q: 'Do urgent orders cost more?',                                        a: 'No extra charge for urgency. Our bouquets start at ₹200 with no rush premium for areas within our normal coverage.' },
            { q: 'What is the latest I can place an urgent order for same-day delivery?', a: 'WhatsApp us before 8 PM and we will get your bouquet delivered the same day. We confirm availability within 10 minutes.' },
            { q: 'Can I send an urgent flower delivery to someone else in Ghaziabad?',  a: 'Yes. Many urgent orders are sent by people outside Ghaziabad to someone in the city. Just share the recipient\'s address and we handle the rest.' },
        ],
        ctaText:          'Place Urgent Order on WhatsApp Now',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I need urgent flower delivery in Ghaziabad — please help ASAP.',
        relatedUrgency: [
            { label: 'Same Day Delivery',       href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Under 1 Hour Delivery',   href: '#/2-hour-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Urgent Flower Delivery in Ghaziabad — Why Rose n Petals</h2><p>Not in a few hours. Not later today. Now. Maybe something happened. Maybe you forgot. Maybe the event is in 45 minutes and you need flowers at that door before it begins. We handle urgent orders. It is not a premium service with extra charges — it is what happens when you WhatsApp us your need and we move.</p><p>Since 1999, we have handled every kind of urgent order Ghaziabad has produced. We do not panic. We assess what is possible from our Kavi Nagar shop, give you an honest answer in minutes, and if it is doable, we do it. Starting at ₹200.</p><h3>How It Works for Urgent Orders</h3><p>WhatsApp +91 7289996804 immediately. Tell us your delivery address in Ghaziabad and how much time you have. We will tell you, within minutes, whether we can make it. For Kavi Nagar and nearby Vijay Nagar — 20 to 30 minutes is achievable. For Indirapuram, Vaishali, Raj Nagar — 35 to 45 minutes is the honest number. For Mohan Nagar and Vasundhara — 40 to 55 minutes. We will not promise what we cannot deliver. But when we say yes, we mean it.</p><h3>Why Urgent Orders Work Here</h3><p>Urgent orders work because we are a single-location shop with our own delivery. When the florist who has been at this since 1999 decides to move fast, the bouquet is made fast. There is no platform to route through, no driver to dispatch from a pool, no gap between order and action. We make it, we carry it, we bring it to the door. In 26 years of Ghaziabad flower delivery, urgent has never meant careless.</p>`,
    },

    // ─── 6. last minute flower delivery Ghaziabad ────────────────────────────
    'last-minute-flower-delivery-ghaziabad': {
        pageTitle:       'Last Minute Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword:     'last minute flower delivery Ghaziabad',
        urgencyType:     'express',
        deliveryPromise: 'Last Minute? We Have Got You — Under 1 Hour Delivery',
        cutoffTime:      'Order before 8 PM — we handle last-minute requests every day',
        guaranteeText:   'Last-minute orders handled without fuss. WhatsApp us now and we sort it out.',
        headline:        'Last Minute Flower Delivery in Ghaziabad — We Will Sort It',
        subheadline:     'Forgot a birthday or anniversary? It happens. WhatsApp us now and we will get fresh flowers to your loved one in Ghaziabad in under 1 hour of confirmation. Starting ₹200.',
        benefits: [
            { icon: '🌹', title: 'No Judgment, Just Flowers', text: 'We handle last-minute requests every single day' },
            { icon: '⚡', title: 'Under 1 Hour Delivery',      text: 'Fresh bouquet at the door in under an hour of confirmation' },
            { icon: '💰', title: 'Starting ₹200',              text: 'No premium for last-minute bookings' },
            { icon: '📲', title: 'WhatsApp Ordering',          text: 'Quickest way to place a last-minute order' },
        ],
        speedProof:      window.URGENCY_SPEED_PROOF,
        areas:           window.URGENCY_AREAS,
        steps: [
            { number: '01', title: 'WhatsApp Us Immediately', text: 'Tell us what you need, where it needs to go, and how urgently — we do not judge last-minute requests.',  time: 'Takes 2 minutes' },
            { number: '02', title: 'We Confirm Fast',         text: 'We check the fastest available slot for your area and confirm it on WhatsApp within 10 minutes.',        time: 'Within 10 minutes' },
            { number: '03', title: 'Delivered Under 1 Hour',  text: 'Your bouquet is arranged fresh and delivered to the address in Ghaziabad in under 1 hour of confirmation.', time: 'Under 1 hour from confirmation' },
        ],
        faqs: [
            { q: 'Can I really get last-minute flower delivery in Ghaziabad?',       a: 'Yes. Last-minute orders are something we handle every day. WhatsApp us — if we can make it, we will. If not, we will be upfront.' },
            { q: 'What is the latest I can place a last-minute order?',               a: 'Order before 8 PM for same-day last-minute delivery. For very late evening, WhatsApp us and we will check what is possible.' },
            { q: 'Will it cost more because it is last minute?',                      a: 'No. Our pricing starts at ₹200 with no last-minute premium. What you see is what you pay.' },
            { q: 'Can I write a message card for a last-minute order?',               a: 'Yes — every bouquet includes a free handwritten message card. Just share the text when you WhatsApp us.' },
            { q: 'What if the recipient is not home when the last-minute delivery arrives?', a: 'We coordinate delivery time with you on WhatsApp. If the recipient is unavailable, we will call you and reschedule at no extra cost.' },
        ],
        ctaText:          'Place Last-Minute Order on WhatsApp',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I need last-minute flower delivery in Ghaziabad today — please help!',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Urgent Delivery',     href: '#/urgent-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Last Minute Flower Delivery in Ghaziabad — We Have Seen It All</h2><p>A birthday that arrived before you were ready. An anniversary that snuck up. A hospital visit you decided to make this afternoon. Whatever brought you here with not much time to spare — we handle it. Last-minute flower orders are a significant part of what we do every day, and we have been doing them for 26 years without judgment.</p><p>Send the message now. Starting at ₹200.</p><h3>How It Works for Last-Minute Orders</h3><p>WhatsApp +91 7289996804 immediately. Tell us your delivery address in Ghaziabad, what you need, and how much time you have. We will be direct about what is achievable for your area and your timeline. For last-minute orders with very tight windows, we streamline the arrangement — not because quality suffers, but because the fastest route to a beautiful bouquet is sometimes a focused one. A well-arranged bunch of roses in a bow, clean and well-presented, rather than a complex mixed arrangement that takes 20 minutes longer.</p><h3>Why Last-Minute Works Here</h3><p>A last-minute order is not a lesser order. It requires faster execution, and that is a different skill from a planned one. Our florist has been working under time pressure in this Kavi Nagar shop since 1999 — festival mornings, wedding days, hospital emergencies, forgotten anniversaries. After 26 years of Ghaziabad's last-minute moments, we are very good at moving fast and delivering well. We are the Ghaziabad-based florist making your bouquet — not a platform subcontracting to whoever might be available near your delivery address.</p>`,
    },

    // ─── 7. flower delivery today Ghaziabad ──────────────────────────────────
    'flower-delivery-today-ghaziabad': {
        pageTitle:       'Flower Delivery Today in Ghaziabad | Rose n Petals',
        mainKeyword:     'flower delivery today Ghaziabad',
        urgencyType:     'same-day',
        deliveryPromise: 'Order Today, Delivered in Under 1 Hour — Starting ₹200',
        cutoffTime:      'Order before 8 PM for delivery today in Ghaziabad',
        guaranteeText:   'If you order today before 8 PM, your bouquet is delivered today in under 1 hour of confirmation. That is our commitment.',
        headline:        'Flower Delivery Today in Ghaziabad — Order Now',
        subheadline:     'Need flowers delivered in Ghaziabad today? Order before 8 PM and we deliver in under 1 hour of confirmation. Fresh, handmade, starting ₹200.',
        benefits:        window.URGENCY_BENEFITS,
        speedProof:      window.URGENCY_SPEED_PROOF,
        areas:           window.URGENCY_AREAS,
        steps: [
            { number: '01', title: 'WhatsApp Your Order Now',  text: 'Choose a bouquet from our catalog or describe what you want. Send it to us on WhatsApp with your delivery address.',  time: 'Takes 2 minutes' },
            { number: '02', title: 'We Confirm Today\'s Slot', text: 'We check same-day availability for your area and confirm your delivery slot within 10 minutes.',                       time: 'Within 10 minutes' },
            { number: '03', title: 'Flowers Delivered Today',  text: 'Your fresh bouquet reaches your address in Ghaziabad in under 1 hour of confirmation — as promised.',               time: 'Under 1 hour from confirmation' },
        ],
        faqs: [
            { q: 'Can I get flower delivery today in Ghaziabad?',                     a: 'Yes. Order before 8 PM and we deliver the same day to most areas of Ghaziabad in under 1 hour of confirmation. WhatsApp us to confirm your area.' },
            { q: 'What time should I order by for today\'s delivery?',                 a: 'Order before 8 PM for same-day delivery. WhatsApp us your slot preference and we confirm within 10 minutes.' },
            { q: 'Is there an extra charge for delivery today?',                       a: 'No extra charge. Our bouquets start at ₹200 with no same-day premium for areas within our service zone.' },
            { q: 'How do I know my order will arrive today?',                          a: 'Once we confirm your slot on WhatsApp, your delivery is locked in. We only confirm when we are certain we can deliver.' },
            { q: 'Can someone else receive the flower delivery today on my behalf?',   a: 'Yes. Just share the recipient\'s name and address on WhatsApp. They do not need to know it is coming from you unless you want them to.' },
        ],
        ctaText:          'Order for Today\'s Delivery on WhatsApp',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I need flower delivery in Ghaziabad today. Can you help?',
        relatedUrgency: [
            { label: 'Same Day Delivery',       href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',        href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Under 1 Hour Delivery',   href: '#/2-hour-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Flower Delivery Today in Ghaziabad — Why Rose n Petals</h2><p>You need flowers today. Not tomorrow, not as a scheduled delivery for next week — today, to this address in Ghaziabad. That is what we do. Every day from 8 AM to 10 PM, our Kavi Nagar shop is open, making bouquets, and delivering them across the city.</p><p>Today is not a special case. It is every day. Since 1999, same-day has been our operating mode. Starting at ₹200.</p><h3>How It Works for Today's Orders</h3><p>The process is identical whether you order at 9 AM or 8 PM. WhatsApp +91 7289996804 with the delivery address in Ghaziabad, the occasion or note if any, and your budget. We confirm availability and the expected delivery window for your area. Pay via UPI or bank transfer. We make the bouquet and dispatch it. The one variable is the time you order — earlier orders allow more flexibility in delivery window. Orders placed after 8 PM may need to be within closer range of our Kavi Nagar shop for guaranteed delivery by 10 PM. For outer areas like Crossing Republik, order by 8:30 PM.</p><h3>Why Delivery Today is Reliable</h3><p>The reason "delivery today" works from our shop is structural. We make the bouquet in our Kavi Nagar shop and our own person delivers it. No orders are routed to other florists. No third-party logistics are involved. The bouquet leaves our hands and goes directly to the address. After 26 years of daily deliveries across Ghaziabad, same-day reliability is not something we aspire to — it is the basic condition of operating the way we do.</p>`,
    },

    // ─── 8. emergency flower delivery Ghaziabad ──────────────────────────────
    'emergency-flower-delivery-ghaziabad': {
        pageTitle:       'Emergency Flower Delivery in Ghaziabad | Rose n Petals',
        mainKeyword:     'emergency flower delivery Ghaziabad',
        urgencyType:     'express',
        deliveryPromise: 'Emergency Flower Delivery — We Act Fast',
        cutoffTime:      'WhatsApp us now — emergency orders get immediate attention',
        guaranteeText:   'Emergency orders are escalated immediately. We reply within 5 minutes during business hours.',
        headline:        'Emergency Flower Delivery in Ghaziabad — Act Now',
        subheadline:     'Forgot a birthday, need to apologise, or got an urgent occasion? WhatsApp us now and we will handle your emergency flower delivery in Ghaziabad today. Starting ₹200.',
        benefits: [
            { icon: '🚨', title: 'Emergency Priority',         text: 'Your order is escalated the moment we receive it' },
            { icon: '🌹', title: 'Fresh in an Emergency',      text: 'Even emergency orders get fresh, hand-arranged flowers' },
            { icon: '💰', title: 'No Emergency Premium',       text: 'Same honest pricing from ₹200 — no panic pricing' },
            { icon: '📲', title: 'Reply in 5 Minutes',         text: 'WhatsApp us and we respond within 5 minutes in business hours' },
        ],
        speedProof: [
            { icon: '🚨', stat: '5 min',      label: 'Response time on WhatsApp',        note: 'During business hours (9 AM–9 PM)' },
            { icon: '⚡', stat: 'Under 1 hr', label: 'Emergency delivery from confirmation', note: 'Across Ghaziabad service areas' },
            { icon: '📦', stat: '8 PM',        label: 'Same-day emergency order cut-off',  note: '7 days a week' },
        ],
        areas:   URGENCY_AREAS,
        steps: [
            { number: '01', title: 'WhatsApp Us Right Now',          text: 'Tell us your emergency — what you need, where it needs to go, and how fast. We take it from there.',       time: 'Response in 5 minutes' },
            { number: '02', title: 'Emergency Slot Confirmed',       text: 'We check the fastest delivery possible for your location and confirm on WhatsApp without delay.',          time: 'Within 10 minutes' },
            { number: '03', title: 'Delivered in Under 1 Hour',     text: 'We prepare your bouquet fresh and dispatch immediately — reaching your Ghaziabad address in under 1 hour.', time: 'Under 1 hour from confirmation' },
        ],
        faqs: [
            { q: 'What counts as an emergency flower delivery?',                         a: 'Anything urgent — a forgotten birthday, a surprise gone wrong, a last-minute apology, or flowers needed right away. If it is urgent to you, it is urgent to us.' },
            { q: 'How quickly do you respond to emergency orders?',                      a: 'We reply on WhatsApp within 5 minutes during business hours (9 AM–9 PM). Outside hours, message us and we will respond first thing.' },
            { q: 'Do you charge extra for emergency flower delivery?',                   a: 'No. Our pricing starts at ₹200 with no emergency or panic premium. Honest pricing no matter how urgent.' },
            { q: 'How fast is your emergency delivery?',                                  a: 'We deliver in under 1 hour of confirming your order for most Ghaziabad areas. WhatsApp us now and we will confirm your slot immediately.' },
            { q: 'What if my emergency falls outside your business hours?',              a: 'For emergencies after 9 PM, please WhatsApp us anyway. For midnight slots (11 PM–1 AM), we may be able to help if you book in advance.' },
        ],
        ctaText:          'Send Emergency Order on WhatsApp Now',
        whatsappNumber:   window.WA_NUMBER,
        whatsappMessage:  'Hi! I have an emergency — I need flower delivery in Ghaziabad as soon as possible!',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Urgent Delivery',     href: '#/urgent-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
        ],
        whyContent: `<h2>Emergency Flower Delivery in Ghaziabad — Why Rose n Petals</h2><p>Order placed. Bouquet started. Out the door. That is the sequence for emergency flower delivery from our Kavi Nagar shop, and it happens as fast as those words suggest. An emergency flower order is not a different service — it is the same bouquet, made by the same florist who has been at this since 1999, with one change: everything else stops and yours goes first.</p><p>We are one shop, one florist, one delivery. When you say emergency, we treat it like one. Starting at ₹200.</p><h3>How It Works for Emergency Orders</h3><p>WhatsApp +91 7289996804 and use the word "emergency." Tell us your Ghaziabad delivery address and how many minutes you have. We respond within minutes with an honest yes or no based on your location and our current capacity. If yes — we take payment via UPI on the spot and the bouquet begins the second payment shows. For Kavi Nagar and Vijay Nagar — under 30 minutes is genuinely achievable. For Raj Nagar, Mohan Nagar, Indirapuram — 35 to 50 minutes is the honest number. For Vaishali and Vasundhara — 40 to 55 minutes. We will tell you what we can do and then we will do it.</p><h3>Why Emergency Delivery Works From Our Shop</h3><p>Emergency delivery credibility comes from structure, not from marketing language. We are a Ghaziabad-based flower shop with 26 years of daily operations from one location in Kavi Nagar. We do not subcontract. We do not route your order to another florist. When an emergency order comes in, the florist who makes it and the person who delivers it are both present at our shop. There is no handoff, no delay, no gap. A national platform cannot offer emergency delivery from Ghaziabad — they do not have a shop here. We do. And we have for 26 years.</p>`,
    },

}; // end window.UrgencyPagesData
