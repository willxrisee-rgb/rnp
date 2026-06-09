# Rose n Petals — PHASE 5: First Blog Post
# File: ~/Documents/rnp/PHASE5_BLOG.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first.
3. Do NOT implement until plan is confirmed.
4. Do NOT change homepage, sitemap, robots.txt,
   landing pages, or any existing feature.

---

## CONTEXT

The sitemap.xml references this URL:
/blog/how-to-keep-bouquet-fresh-north-indian-summer

This page does not exist yet. Google will crawl it
and get a 404 error. This chunk creates the blog
page at that URL with real content.

---

## CHANGE 1 — Create blog post HTML file

Create file: blog-keep-fresh.html in project root

Full page content:

<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,
    initial-scale=1.0">
  <title>How to Keep a Flower Bouquet Fresh in
    North India's Summer | Rose n Petals</title>
  <meta name="description" content="Your bouquet
    wilting too fast in Ghaziabad's summer heat?
    Here are 7 practical tips to keep your flowers
    fresh longer — from a local florist who knows
    the UP summer.">
  <link rel="canonical"
    href="https://rosenpetals.com/blog/how-to-keep-bouquet-fresh-north-indian-summer">
  <link rel="icon" type="image/png" sizes="32x32"
    href="/assets/favicon.png">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  [COPY EXACT NAVBAR FROM index.html]

  <article class="blog-post">
    <div class="blog-post-header">
      <p class="blog-category">Flower Care Tips</p>
      <h1>How to Keep a Flower Bouquet Fresh in
          North India's Summer</h1>
      <p class="blog-meta">By Rose n Petals,
        Kavi Nagar, Ghaziabad · June 2026</p>
    </div>

    <div class="blog-post-body">

      <p>Ghaziabad summers are brutal. When the
      temperature crosses 40°C and the air is dry,
      fresh flower bouquets can wilt within hours.
      If you have ever received a beautiful bouquet
      only to watch it droop by the next morning,
      these tips are for you.</p>

      <p>As a local florist in Kavi Nagar, we deliver
      bouquets every day across Ghaziabad. We know
      exactly what the UP summer does to flowers.
      Here is what works.</p>

      <h2>1. Cut the stems immediately</h2>
      <p>As soon as you receive your bouquet, cut
      1-2 cm from the bottom of each stem at a 45
      degree angle. Use clean scissors or a knife.
      This opens up the stem so the flower can drink
      water. Flat cuts seal over and block water
      absorption.</p>

      <h2>2. Use cold water, not room temperature</h2>
      <p>In summer, room temperature water in
      Ghaziabad is already warm. Use fresh cold
      water from the fridge or add a few ice cubes.
      Cold water slows bacterial growth and keeps
      flowers fresh 30 to 40 percent longer.</p>

      <h2>3. Change the water every day</h2>
      <p>Old water gets cloudy and full of bacteria.
      That bacteria travels up the stem and kills
      the flower. Every morning, pour out the old
      water, rinse the vase, and add fresh cold
      water. Takes two minutes and makes a huge
      difference.</p>

      <h2>4. Keep flowers away from direct sunlight
           and fans</h2>
      <p>Sunlight and air conditioning vents dry
      flowers out fast. Place your bouquet in a
      cool, shaded spot — away from windows,
      AC vents, and ceiling fans. A shaded corner
      of the room is perfect.</p>

      <h2>5. Remove dying flowers quickly</h2>
      <p>One wilting flower releases ethylene gas
      that speeds up wilting in the others. Remove
      any flowers that look tired or brown
      immediately. The rest of the bouquet will
      last longer.</p>

      <h2>6. Mist lightly in the morning</h2>
      <p>In dry summer heat, flowers lose moisture
      through their petals. A light mist of clean
      water on the petals in the morning helps them
      stay hydrated. Do not drench — just a light
      spray.</p>

      <h2>7. Add a pinch of sugar to the water</h2>
      <p>A half teaspoon of sugar in the vase water
      gives the flowers extra energy and can extend
      their freshness by one to two days. Some
      florists also add a drop of bleach to slow
      bacteria. Both are old tricks that actually
      work.</p>

      <h2>How long should a bouquet last in
           Ghaziabad?</h2>
      <p>With these tips, most fresh bouquets should
      last 4 to 7 days even in summer. Roses and
      carnations typically last longer. Gerberas
      and lilies are more sensitive to heat. If
      your bouquet arrived fresh from us and you
      followed these steps, you should get at
      least 4 days out of it.</p>

      <div class="blog-cta-box">
        <p><strong>Want fresh flowers delivered to
        your door in Ghaziabad?</strong><br>
        Rose n Petals delivers handmade bouquets
        in under 1 hour across Ghaziabad.
        Starting from ₹200.</p>
        <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20fresh%20bouquet.%20Please%20help%20me."
           class="lp-whatsapp-btn"
           rel="noopener noreferrer">
          Order on WhatsApp
        </a>
      </div>

    </div>
  </article>

  [COPY EXACT FOOTER FROM index.html]

</body>
</html>

---

## CHANGE 2 — Add blog route to server.js

Add this route to server.js BEFORE the catch-all:

app.get(
  '/blog/how-to-keep-bouquet-fresh-north-indian-summer',
  (req, res) => {
    res.sendFile(
      path.join(__dirname, 'blog-keep-fresh.html')
    );
  }
);

---

## CHANGE 3 — Add blog post CSS to styles.css

.blog-post {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
}

.blog-post-header {
  margin-bottom: 40px;
  border-bottom: 1px solid #EEEEEE;
  padding-bottom: 32px;
}

.blog-category {
  font-size: 12px;
  font-weight: 600;
  color: #CC0000;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 12px;
}

.blog-post-header h1 {
  font-size: 30px;
  font-weight: 700;
  color: #1A1A1A;
  line-height: 1.25;
  margin-bottom: 12px;
}

.blog-meta {
  font-size: 13px;
  color: #888888;
}

.blog-post-body h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  margin-top: 36px;
  margin-bottom: 10px;
}

.blog-post-body p {
  font-size: 15px;
  color: #444444;
  line-height: 1.8;
  margin-bottom: 16px;
}

.blog-cta-box {
  background: #FFF5F5;
  border: 1px solid #FDDEDE;
  border-radius: 12px;
  padding: 24px;
  margin-top: 48px;
  text-align: center;
}

.blog-cta-box p {
  font-size: 15px;
  margin-bottom: 16px;
}

@media (max-width: 767px) {
  .blog-post-header h1 {
    font-size: 22px;
  }
  .blog-post-body h2 {
    font-size: 18px;
  }
}

---

## VERIFICATION CHECKLIST

[ ] 1. URL rosenpetals.com/blog/how-to-keep-bouquet-fresh-north-indian-summer loads correctly
[ ] 2. Page shows correct title in browser tab
[ ] 3. H1 "How to Keep a Flower Bouquet Fresh in North India's Summer" is visible
[ ] 4. All 7 tips are visible
[ ] 5. WhatsApp CTA button works
[ ] 6. Navbar and footer display correctly
[ ] 7. Page looks readable on mobile
[ ] 8. No existing pages changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Verify all 8 items when done.