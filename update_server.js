const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

content = content.replace(
  "html = html.replace(/\\{\\{PAGE_SLUG\\}\\}/g, data.slug);",
  "html = html.replace(/\\{\\{PAGE_SLUG\\}\\}/g, data.slug);\n  html = html.replace(/\\{\\{H1\\}\\}/g, data.h1);\n  html = html.replace(/\\{\\{LEAD_TEXT\\}\\}/g, data.leadText);"
);

const routes = {
  '/flower-delivery-ghaziabad': {
    h1: "Flower Delivery in Ghaziabad",
    leadText: "Rose n Petals delivers fresh handmade bouquets across all of Ghaziabad in under 1 hour. Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara and more. Orders via WhatsApp — no app needed. Starting from ₹200."
  },
  '/same-day-flower-delivery-ghaziabad': {
    h1: "Same Day Flower Delivery in Ghaziabad",
    leadText: "Need flowers delivered today in Ghaziabad? We offer same-day delivery in under 1 hour for orders placed before 9 PM. WhatsApp us your order — bouquets start from ₹200."
  },
  '/birthday-flowers-ghaziabad': {
    h1: "Birthday Flowers in Ghaziabad",
    leadText: "Surprise someone special with fresh birthday flowers delivered in Ghaziabad in under 1 hour. Handmade birthday bouquets starting from ₹200. Order on WhatsApp — fast, simple, and personal."
  },
  '/anniversary-flowers-ghaziabad': {
    h1: "Anniversary Flowers in Ghaziabad",
    leadText: "Celebrate your anniversary with beautiful fresh flowers delivered anywhere in Ghaziabad in under 1 hour. Romantic bouquets starting from ₹200. WhatsApp us to order."
  },
  '/flower-delivery-indirapuram': {
    h1: "Flower Delivery in Indirapuram, Ghaziabad",
    leadText: "Rose n Petals delivers fresh bouquets to Indirapuram in under 1 hour. We cover all sectors and societies in Indirapuram. Handmade bouquets from ₹200. Order on WhatsApp."
  },
  '/flower-delivery-vaishali-ghaziabad': {
    h1: "Flower Delivery in Vaishali, Ghaziabad",
    leadText: "Get fresh flowers delivered to your door in Vaishali, Ghaziabad in under 1 hour. Rose n Petals serves all of Vaishali Sector 1, 2, 3, 4, 5 and 6. Bouquets from ₹200."
  },
  '/flower-delivery-raj-nagar-ghaziabad': {
    h1: "Flower Delivery in Raj Nagar, Ghaziabad",
    leadText: "Fresh bouquet delivery in Raj Nagar and Raj Nagar Extension, Ghaziabad. Delivered in under 1 hour by Rose n Petals. Handmade bouquets starting from ₹200."
  },
  '/flower-delivery-kavi-nagar-ghaziabad': {
    h1: "Flower Delivery in Kavi Nagar, Ghaziabad",
    leadText: "Rose n Petals is your local florist in Kavi Nagar, Ghaziabad. We are based in KD Market, Sector 18, Kavi Nagar and deliver fresh handmade bouquets starting from ₹200."
  },
  '/online-flower-delivery-ghaziabad': {
    h1: "Online Flower Delivery in Ghaziabad",
    leadText: "Experience fast and reliable online flower delivery in Ghaziabad. Fresh handmade bouquets delivered to your doorstep in under 1 hour, starting from just ₹200."
  },
  '/bouquet-delivery-ghaziabad': {
    h1: "Bouquet Delivery in Ghaziabad",
    leadText: "Get beautiful, fresh bouquet delivery in Ghaziabad. Our handmade floral arrangements are delivered in under 1 hour. Starting from ₹200."
  },
  '/send-flowers-ghaziabad': {
    h1: "Send Flowers in Ghaziabad",
    leadText: "Send flowers to your loved ones anywhere in Ghaziabad with ease. Delivered fresh in under 1 hour, starting from ₹200. Order via WhatsApp."
  },
  '/order-flowers-online-ghaziabad': {
    h1: "Order Flowers Online in Ghaziabad",
    leadText: "Order flowers online in Ghaziabad seamlessly through WhatsApp. Fresh handmade bouquets delivered in under 1 hour, starting from ₹200."
  },
  '/florist-ghaziabad': {
    h1: "Local Florist in Ghaziabad",
    leadText: "Rose n Petals is your trusted local florist in Ghaziabad. Enjoy fresh handmade bouquets delivered in under 1 hour, starting at ₹200."
  },
  '/flower-shop-ghaziabad': {
    h1: "Flower Shop in Ghaziabad",
    leadText: "Visit the premier flower shop in Ghaziabad or order via WhatsApp. We deliver fresh, stunning bouquets in under 1 hour from ₹200."
  },
  '/fresh-flowers-ghaziabad': {
    h1: "Fresh Flowers in Ghaziabad",
    leadText: "Discover the best fresh flowers in Ghaziabad. Delivered in under 1 hour across the city, our handmade bouquets start from ₹200."
  },
  '/rose-bouquet-delivery-ghaziabad': {
    h1: "Rose Bouquet Delivery in Ghaziabad",
    leadText: "Specialized rose bouquet delivery in Ghaziabad. Perfect for any occasion, delivered fresh in under 1 hour. Prices starting at ₹200."
  },
  '/mixed-flower-bouquet-ghaziabad': {
    h1: "Mixed Flower Bouquet in Ghaziabad",
    leadText: "Brighten someone's day with a vibrant mixed flower bouquet in Ghaziabad. Delivered quickly in under 1 hour, starting from ₹200."
  },
  '/flower-delivery-vasundhara-ghaziabad': {
    h1: "Flower Delivery in Vasundhara, Ghaziabad",
    leadText: "Rose n Petals delivers fresh bouquets to Vasundhara in under 1 hour. We serve all sectors in Vasundhara. Handmade bouquets start from ₹200."
  },
  '/flower-delivery-mohan-nagar-ghaziabad': {
    h1: "Flower Delivery in Mohan Nagar, Ghaziabad",
    leadText: "Send fresh flowers to Mohan Nagar, Ghaziabad with our quick 1-hour delivery service. Handmade beautiful bouquets starting from ₹200."
  },
  '/flower-delivery-vijay-nagar-ghaziabad': {
    h1: "Flower Delivery in Vijay Nagar, Ghaziabad",
    leadText: "Reliable flower delivery in Vijay Nagar, Ghaziabad. Get your fresh handmade bouquets delivered in under 1 hour, starting from just ₹200."
  },
  '/flower-delivery-crossing-republik-ghaziabad': {
    h1: "Flower Delivery in Crossing Republik, Ghaziabad",
    leadText: "Fast and fresh flower delivery in Crossing Republik, Ghaziabad. Delight your loved ones in under 1 hour with bouquets starting from ₹200."
  },
  '/express-flower-delivery-ghaziabad': {
    h1: "Express Flower Delivery in Ghaziabad",
    leadText: "In a rush? Choose our express flower delivery in Ghaziabad. Fresh bouquets delivered in under 1 hour, starting from ₹200."
  },
  '/2-hour-flower-delivery-ghaziabad': {
    h1: "2-Hour Flower Delivery in Ghaziabad",
    leadText: "Guaranteed 2-hour flower delivery in Ghaziabad, usually arriving in under 1 hour. Fresh handmade bouquets starting from ₹200."
  },
  '/midnight-flower-delivery-ghaziabad': {
    h1: "Midnight Flower Delivery in Ghaziabad",
    leadText: "Surprise them at the stroke of midnight with our midnight flower delivery in Ghaziabad. Fresh bouquets from ₹200. Order now on WhatsApp."
  },
  '/urgent-flower-delivery-ghaziabad': {
    h1: "Urgent Flower Delivery in Ghaziabad",
    leadText: "Require flowers right now? Use our urgent flower delivery in Ghaziabad. Delivered fresh in under 1 hour, starting from ₹200."
  },
  '/last-minute-flower-delivery-ghaziabad': {
    h1: "Last Minute Flower Delivery in Ghaziabad",
    leadText: "Forgot an important date? Try our last minute flower delivery in Ghaziabad. Fresh handmade bouquets delivered in under 1 hour, from ₹200."
  },
  '/flower-delivery-today-ghaziabad': {
    h1: "Flower Delivery Today in Ghaziabad",
    leadText: "Looking for flower delivery today in Ghaziabad? We deliver fresh, stunning bouquets in under 1 hour. Prices start from ₹200."
  },
  '/emergency-flower-delivery-ghaziabad': {
    h1: "Emergency Flower Delivery in Ghaziabad",
    leadText: "For urgent needs, count on our emergency flower delivery in Ghaziabad. Speedy delivery in under 1 hour for bouquets starting at ₹200."
  },
  '/get-well-soon-flowers-ghaziabad': {
    h1: "Get Well Soon Flowers in Ghaziabad",
    leadText: "Wish a speedy recovery with get well soon flowers in Ghaziabad. Delivered fresh in under 1 hour, beautiful bouquets starting from ₹200."
  },
  '/congratulations-flowers-ghaziabad': {
    h1: "Congratulations Flowers in Ghaziabad",
    leadText: "Celebrate achievements with our congratulations flowers in Ghaziabad. Handmade fresh bouquets delivered in under 1 hour from ₹200."
  },
  '/sorry-flowers-ghaziabad': {
    h1: "Sorry Flowers in Ghaziabad",
    leadText: "Express your sincere apologies with sorry flowers in Ghaziabad. Delivered swiftly in under 1 hour. Thoughtful bouquets starting at ₹200."
  },
  '/romantic-flowers-ghaziabad': {
    h1: "Romantic Flowers in Ghaziabad",
    leadText: "Express your love with romantic flowers in Ghaziabad. Beautiful, fresh red roses delivered in under 1 hour, starting from ₹200."
  },
  '/new-baby-flowers-ghaziabad': {
    h1: "New Baby Flowers in Ghaziabad",
    leadText: "Welcome the little one with new baby flowers in Ghaziabad. Fresh and lovely bouquets delivered in under 1 hour from ₹200."
  },
  '/housewarming-flowers-ghaziabad': {
    h1: "Housewarming Flowers in Ghaziabad",
    leadText: "Congratulate them on their new home with housewarming flowers in Ghaziabad. Delivered fresh in under 1 hour, starting from ₹200."
  },
  '/sympathy-flowers-ghaziabad': {
    h1: "Sympathy Flowers in Ghaziabad",
    leadText: "Express your condolences with sympathy flowers in Ghaziabad. Respectful, fresh bouquets delivered in under 1 hour, starting from ₹200."
  },
  '/diwali-flowers-ghaziabad': {
    h1: "Diwali Flowers in Ghaziabad",
    leadText: "Light up their festive spirit with Diwali flowers in Ghaziabad. Vibrant, fresh bouquets delivered in under 1 hour, starting from ₹200."
  }
};

for (const [route, info] of Object.entries(routes)) {
  const h1Safe = info.h1.replace(/'/g, "\\'");
  const leadTextSafe = info.leadText.replace(/'/g, "\\'");
  
  const regex = new RegExp(`(app\\.get\\('${route}',[\\s\\S]*?breadcrumb: '[^']*')\\n\\s*\\}\\);`);
  content = content.replace(regex, `$1,\n    h1: '${h1Safe}',\n    leadText: '${leadTextSafe}'\n  });`);
}

fs.writeFileSync('server.js', content);
