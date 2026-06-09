const fs = require('fs');
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');

const newUrl = `  <url>
    <loc>https://rosenpetals.com/blog/how-to-keep-bouquet-fresh-north-indian-summer</loc>
    <lastmod>2026-06-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>`;

sitemap = sitemap.replace('</urlset>', newUrl);
fs.writeFileSync('sitemap.xml', sitemap);
console.log("Updated sitemap.xml");
