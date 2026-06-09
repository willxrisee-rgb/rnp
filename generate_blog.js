const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract navbar
const headerStart = indexHtml.indexOf('<header class="global-header" id="global-header">');
const headerEnd = indexHtml.indexOf('</header>') + '</header>'.length;
const header = indexHtml.substring(headerStart, headerEnd);

// Extract footer
const footerStart = indexHtml.indexOf('<footer class="global-footer" id="global-footer">');
const footerEnd = indexHtml.indexOf('</footer>') + '</footer>'.length;
const footer = indexHtml.substring(footerStart, footerEnd);

const blogContent = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How to Keep a Flower Bouquet Fresh in North India's Summer | Rose n Petals</title>
  <meta name="description" content="Your bouquet wilting too fast in Ghaziabad's summer heat? Here are 7 practical tips to keep your flowers fresh longer — from a local florist who knows the UP summer.">
  <link rel="canonical" href="https://rosenpetals.com/blog/how-to-keep-bouquet-fresh-north-indian-summer">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon.png">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  ${header}

  <article class="blog-post">
    <div class="blog-post-header">
      <p class="blog-category">Flower Care Tips</p>
      <h1>How to Keep a Flower Bouquet Fresh in North India's Summer</h1>
      <p class="blog-meta">By Rose n Petals, Kavi Nagar, Ghaziabad · June 2026</p>
    </div>

    <div class="blog-post-body">

      <p>Ghaziabad summers are brutal. When the temperature crosses 40°C and the air is dry, fresh flower bouquets can wilt within hours. If you have ever received a beautiful bouquet only to watch it droop by the next morning, these tips are for you.</p>

      <p>As a local florist in Kavi Nagar, we deliver bouquets every day across Ghaziabad. We know exactly what the UP summer does to flowers. Here is what works.</p>

      <h2>1. Cut the stems immediately</h2>
      <p>As soon as you receive your bouquet, cut 1-2 cm from the bottom of each stem at a 45 degree angle. Use clean scissors or a knife. This opens up the stem so the flower can drink water. Flat cuts seal over and block water absorption.</p>

      <h2>2. Use cold water, not room temperature</h2>
      <p>In summer, room temperature water in Ghaziabad is already warm. Use fresh cold water from the fridge or add a few ice cubes. Cold water slows bacterial growth and keeps flowers fresh 30 to 40 percent longer.</p>

      <h2>3. Change the water every day</h2>
      <p>Old water gets cloudy and full of bacteria. That bacteria travels up the stem and kills the flower. Every morning, pour out the old water, rinse the vase, and add fresh cold water. Takes two minutes and makes a huge difference.</p>

      <h2>4. Keep flowers away from direct sunlight and fans</h2>
      <p>Sunlight and air conditioning vents dry flowers out fast. Place your bouquet in a cool, shaded spot — away from windows, AC vents, and ceiling fans. A shaded corner of the room is perfect.</p>

      <h2>5. Remove dying flowers quickly</h2>
      <p>One wilting flower releases ethylene gas that speeds up wilting in the others. Remove any flowers that look tired or brown immediately. The rest of the bouquet will last longer.</p>

      <h2>6. Mist lightly in the morning</h2>
      <p>In dry summer heat, flowers lose moisture through their petals. A light mist of clean water on the petals in the morning helps them stay hydrated. Do not drench — just a light spray.</p>

      <h2>7. Add a pinch of sugar to the water</h2>
      <p>A half teaspoon of sugar in the vase water gives the flowers extra energy and can extend their freshness by one to two days. Some florists also add a drop of bleach to slow bacteria. Both are old tricks that actually work.</p>

      <h2>How long should a bouquet last in Ghaziabad?</h2>
      <p>With these tips, most fresh bouquets should last 4 to 7 days even in summer. Roses and carnations typically last longer. Gerberas and lilies are more sensitive to heat. If your bouquet arrived fresh from us and you followed these steps, you should get at least 4 days out of it.</p>

      <div class="blog-cta-box">
        <p><strong>Want fresh flowers delivered to your door in Ghaziabad?</strong><br>
        Rose n Petals delivers handmade bouquets in under 1 hour across Ghaziabad. Starting from ₹200.</p>
        <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20fresh%20bouquet.%20Please%20help%20me."
           class="lp-whatsapp-btn"
           rel="noopener noreferrer">
          Order on WhatsApp
        </a>
      </div>

    </div>
  </article>

  ${footer}

  <!-- Include store.js for the mobile menu / cart logic -->
  <script src="/js/store.js"></script>
</body>
</html>`;

fs.writeFileSync('blog-keep-fresh.html', blogContent);
console.log("Successfully created blog-keep-fresh.html");
