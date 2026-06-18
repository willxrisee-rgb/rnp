// js/localAreaPagesData.js

window.SHARED_BENEFITS = window.SHARED_BENEFITS || [
    { icon: '🌹', title: 'Fresh & Handmade', text: 'Every bouquet made to order' },
    { icon: '⚡', title: 'Fast Local Delivery', text: 'Delivered in under 1 hour' },
    { icon: '💰', title: 'Starting ₹200', text: 'Premium flowers at local prices' },
    { icon: '📲', title: 'Easy WhatsApp Order', text: 'Slot confirmed in 10 minutes' }
];

window.SHARED_STEPS = window.SHARED_STEPS || [
    { number: '01', title: 'Browse Bouquets', text: 'Check out our fresh arrangements below.' },
    { number: '02', title: 'WhatsApp Us', text: 'Send us your address in {areaName}.' },
    { number: '03', title: 'Fast Delivery', text: 'We deliver fresh, on time, in under 1 hour.' }
];

window.SHARED_NEARBY_AREAS = window.SHARED_NEARBY_AREAS || [
    { label: 'Indirapuram', href: '#/flower-delivery-indirapuram' },
    { label: 'Vaishali', href: '#/flower-delivery-vaishali-ghaziabad' },
    { label: 'Vasundhara', href: '#/flower-delivery-vasundhara-ghaziabad' },
    { label: 'Raj Nagar', href: '#/flower-delivery-raj-nagar-ghaziabad' },
    { label: 'Kavi Nagar', href: '#/flower-delivery-kavi-nagar-ghaziabad' },
    { label: 'Mohan Nagar', href: '#/flower-delivery-mohan-nagar-ghaziabad' },
    { label: 'Vijay Nagar', href: '#/flower-delivery-vijay-nagar-ghaziabad' },
    { label: 'Crossing Republik', href: '#/flower-delivery-crossing-republik-ghaziabad' }
];

// Helper to filter out the current area from nearby areas
function getNearbyAreas(currentAreaName) {
    return window.SHARED_NEARBY_AREAS.filter(area => area.label !== currentAreaName).slice(0, 5);
}

window.LocalAreaPagesData = {
    "flower-delivery-indirapuram": {
        slug: "flower-delivery-indirapuram",
        pageTitle: "Flower Delivery in Indirapuram | Rose n Petals",
        metaDescription: "Fresh flower delivery in Indirapuram in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-indirapuram",
        areaName: "Indirapuram",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Indirapuram — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Indirapuram · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Indirapuram from our Ghaziabad shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Indirapuram" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Indirapuram"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all parts of Indirapuram?", a: "Yes, we deliver everywhere in Indirapuram, including Ahinsa Khand, Nyay Khand, Niti Khand, Shakti Khand, Vaibhav Khand, Abhay Khand and Gyan Khand." },
            { q: "How long does delivery take to Indirapuram?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Indirapuram?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Indirapuram." },
            { q: "What is the minimum order for Indirapuram delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    },
    "flower-delivery-vaishali-ghaziabad": {
        slug: "flower-delivery-vaishali-ghaziabad",
        pageTitle: "Flower Delivery in Vaishali, Ghaziabad | Rose n Petals",
        metaDescription: "Fresh flower delivery in Vaishali in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-vaishali-ghaziabad",
        areaName: "Vaishali",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Vaishali — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Vaishali · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Vaishali from our Ghaziabad shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Vaishali" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Vaishali"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all sectors of Vaishali?", a: "Yes, we deliver to all sectors in Vaishali, Ghaziabad, and nearby localities." },
            { q: "How long does delivery take to Vaishali?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Vaishali?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Vaishali." },
            { q: "What is the minimum order for Vaishali delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    },
    "flower-delivery-vasundhara-ghaziabad": {
        slug: "flower-delivery-vasundhara-ghaziabad",
        pageTitle: "Flower Delivery in Vasundhara, Ghaziabad | Rose n Petals",
        metaDescription: "Fresh flower delivery in Vasundhara in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-vasundhara-ghaziabad",
        areaName: "Vasundhara",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Vasundhara — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Vasundhara · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Vasundhara from our Ghaziabad shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Vasundhara" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Vasundhara"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all sectors of Vasundhara?", a: "Yes, we deliver to all sectors in Vasundhara, Ghaziabad, right to your doorstep." },
            { q: "How long does delivery take to Vasundhara?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Vasundhara?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Vasundhara." },
            { q: "What is the minimum order for Vasundhara delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    },
    "flower-delivery-raj-nagar-ghaziabad": {
        slug: "flower-delivery-raj-nagar-ghaziabad",
        pageTitle: "Flower Delivery in Raj Nagar, Ghaziabad | Rose n Petals",
        metaDescription: "Fresh flower delivery in Raj Nagar in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-raj-nagar-ghaziabad",
        areaName: "Raj Nagar",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Raj Nagar — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Raj Nagar · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Raj Nagar from our local Ghaziabad shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Raj Nagar" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Raj Nagar"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all parts of Raj Nagar?", a: "Yes, we deliver everywhere in Raj Nagar, Ghaziabad, and nearby areas." },
            { q: "How long does delivery take to Raj Nagar?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Raj Nagar?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Raj Nagar." },
            { q: "What is the minimum order for Raj Nagar delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    },
    "flower-delivery-kavi-nagar-ghaziabad": {
        slug: "flower-delivery-kavi-nagar-ghaziabad",
        pageTitle: "Flower Delivery in Kavi Nagar, Ghaziabad | Rose n Petals",
        metaDescription: "Fresh flower delivery in Kavi Nagar in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-kavi-nagar-ghaziabad",
        areaName: "Kavi Nagar",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Kavi Nagar — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Kavi Nagar · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Kavi Nagar from our local shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Kavi Nagar" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Kavi Nagar"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all parts of Kavi Nagar?", a: "Yes, we deliver everywhere in Kavi Nagar, Ghaziabad, right to your doorstep." },
            { q: "How long does delivery take to Kavi Nagar?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Kavi Nagar?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Kavi Nagar." },
            { q: "What is the minimum order for Kavi Nagar delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    },
    "flower-delivery-mohan-nagar-ghaziabad": {
        slug: "flower-delivery-mohan-nagar-ghaziabad",
        pageTitle: "Flower Delivery in Mohan Nagar, Ghaziabad | Rose n Petals",
        metaDescription: "Fresh flower delivery in Mohan Nagar in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-mohan-nagar-ghaziabad",
        areaName: "Mohan Nagar",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Mohan Nagar — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Mohan Nagar · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Mohan Nagar from our Ghaziabad shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Mohan Nagar" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Mohan Nagar"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all parts of Mohan Nagar?", a: "Yes, we deliver everywhere in Mohan Nagar, Ghaziabad, and the surrounding regions." },
            { q: "How long does delivery take to Mohan Nagar?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Mohan Nagar?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Mohan Nagar." },
            { q: "What is the minimum order for Mohan Nagar delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    },
    "flower-delivery-vijay-nagar-ghaziabad": {
        slug: "flower-delivery-vijay-nagar-ghaziabad",
        pageTitle: "Flower Delivery in Vijay Nagar, Ghaziabad | Rose n Petals",
        metaDescription: "Fresh flower delivery in Vijay Nagar in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-vijay-nagar-ghaziabad",
        areaName: "Vijay Nagar",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Vijay Nagar — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Vijay Nagar · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Vijay Nagar from our Ghaziabad shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Vijay Nagar" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Vijay Nagar"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all sectors of Vijay Nagar?", a: "Yes, we deliver to all sectors in Vijay Nagar, Ghaziabad, right to your doorstep." },
            { q: "How long does delivery take to Vijay Nagar?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Vijay Nagar?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Vijay Nagar." },
            { q: "What is the minimum order for Vijay Nagar delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    },
    "flower-delivery-crossing-republik-ghaziabad": {
        slug: "flower-delivery-crossing-republik-ghaziabad",
        pageTitle: "Flower Delivery in Crossing Republik, Ghaziabad | Rose n Petals",
        metaDescription: "Fresh flower delivery in Crossing Republik in under 1 hour. Order handmade bouquets starting from ₹200 on WhatsApp today.",
        canonicalUrl: "https://rosenpetals.com/#/flower-delivery-crossing-republik-ghaziabad",
        areaName: "Crossing Republik",
        cityName: "Ghaziabad",
        headline: "Flower Delivery in Crossing Republik — Fresh Bouquets from ₹200",
        subheadline: "Same-day delivery to Crossing Republik · Handmade bouquets · WhatsApp order",
        startingPrice: "₹200",
        deliveryTime: "under 1 hour",
        deliveryProof: [
            { icon: "📍", text: "We deliver directly to Crossing Republik from our Ghaziabad shop" },
            { icon: "⏱️", text: "Average delivery time: Under 1 hour to Crossing Republik" },
            { icon: "📞", text: "Local WhatsApp support — call or chat anytime" }
        ],
        benefits: window.SHARED_BENEFITS,
        nearbyAreas: getNearbyAreas("Crossing Republik"),
        steps: window.SHARED_STEPS,
        faqs: [
            { q: "Do you deliver to all societies in Crossing Republik?", a: "Yes, we deliver to all residential societies and commercial areas in Crossing Republik, Ghaziabad." },
            { q: "How long does delivery take to Crossing Republik?", a: "Delivery typically takes under 1 hour from order confirmation." },
            { q: "Is same-day delivery available in Crossing Republik?", a: "Yes! Order before 8 PM for guaranteed same-day delivery to any address in Crossing Republik." },
            { q: "What is the minimum order for Crossing Republik delivery?", a: "Our beautiful bouquets start from just ₹200, with no hidden express fees." }
        ]
    }
};
