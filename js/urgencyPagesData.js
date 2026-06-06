// js/urgencyPagesData.js
// ─────────────────────────────────────────────────────────────────────────────
// Content data for all 8 Urgency / Express SEO pages (Template 4).
// Each entry matches the prop interface expected by UrgencyServiceRoutes.render().
// ─────────────────────────────────────────────────────────────────────────────

// ── SHARED CONSTANTS ──────────────────────────────────────────────────────────

const URGENCY_AREAS = [
    'Kavi Nagar', 'Raj Nagar', 'Indirapuram', 'Vaishali',
    'Vasundhara', 'Mohan Nagar', 'Vijay Nagar', 'Crossing Republik',
];

const URGENCY_BENEFITS = [
    { icon: '🌹', title: 'Fresh, Not Pre-made',   text: 'Every bouquet arranged on the day of delivery' },
    { icon: '⚡', title: 'Priority Dispatch',      text: 'Urgent orders are our top priority' },
    { icon: '💰', title: 'No Express Surcharge',   text: 'Same price as standard — starting ₹200' },
    { icon: '📲', title: 'Confirm on WhatsApp',    text: 'Slot confirmed within 10 minutes of your message' },
];

const URGENCY_SPEED_PROOF = [
    { icon: '⚡', stat: 'Under 1 hr', label: 'Delivery from confirmation',  note: 'Across Ghaziabad' },
    { icon: '📦', stat: '8 PM',       label: 'Same-day order cut-off',      note: '7 days a week' },
    { icon: '🌙', stat: '10 PM',      label: 'Midnight delivery cut-off',   note: 'With advance booking' },
];

const WA_NUMBER = '917289996804';

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
        benefits:        URGENCY_BENEFITS,
        speedProof:      URGENCY_SPEED_PROOF,
        areas:           URGENCY_AREAS,
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I need same-day flower delivery in Ghaziabad today.',
        relatedUrgency: [
            { label: 'Under 1 Hour Delivery', href: '#/2-hour-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',      href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Midnight Delivery',     href: '#/midnight-flower-delivery-ghaziabad' },
        ],
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
        benefits:        URGENCY_BENEFITS,
        speedProof:      URGENCY_SPEED_PROOF,
        areas:           URGENCY_AREAS,
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I need express flower delivery in Ghaziabad — as fast as possible.',
        relatedUrgency: [
            { label: 'Same Day Delivery',       href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Under 1 Hour Delivery',   href: '#/2-hour-flower-delivery-ghaziabad' },
            { label: 'Midnight Delivery',     href: '#/midnight-flower-delivery-ghaziabad' },
        ],
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I need the fastest flower delivery in Ghaziabad — under 1 hour if possible.',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Midnight Delivery',   href: '#/midnight-flower-delivery-ghaziabad' },
        ],
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I want to book midnight flower delivery in Ghaziabad.',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Urgent Delivery',     href: '#/urgent-flower-delivery-ghaziabad' },
        ],
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
        benefits:        URGENCY_BENEFITS,
        speedProof:      URGENCY_SPEED_PROOF,
        areas:           URGENCY_AREAS,
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I need urgent flower delivery in Ghaziabad — please help ASAP.',
        relatedUrgency: [
            { label: 'Same Day Delivery',       href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Under 1 Hour Delivery',   href: '#/2-hour-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
        ],
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
        speedProof:      URGENCY_SPEED_PROOF,
        areas:           URGENCY_AREAS,
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I need last-minute flower delivery in Ghaziabad today — please help!',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Urgent Delivery',     href: '#/urgent-flower-delivery-ghaziabad' },
        ],
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
        benefits:        URGENCY_BENEFITS,
        speedProof:      URGENCY_SPEED_PROOF,
        areas:           URGENCY_AREAS,
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I need flower delivery in Ghaziabad today. Can you help?',
        relatedUrgency: [
            { label: 'Same Day Delivery',       href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',        href: '#/express-flower-delivery-ghaziabad' },
            { label: 'Under 1 Hour Delivery',   href: '#/2-hour-flower-delivery-ghaziabad' },
        ],
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
        whatsappNumber:   WA_NUMBER,
        whatsappMessage:  'Hi! I have an emergency — I need flower delivery in Ghaziabad as soon as possible!',
        relatedUrgency: [
            { label: 'Same Day Delivery',   href: '#/same-day-flower-delivery-ghaziabad' },
            { label: 'Urgent Delivery',     href: '#/urgent-flower-delivery-ghaziabad' },
            { label: 'Express Delivery',    href: '#/express-flower-delivery-ghaziabad' },
        ],
    },

}; // end window.UrgencyPagesData
