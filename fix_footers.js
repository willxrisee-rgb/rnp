const fs = require('fs');

const files = ['index.html', 'landing-page.html', 'blog-keep-fresh.html'];
const searchStr = '<li><a href="/fresh-flowers-ghaziabad">Fresh Flowers</a></li>';
const replaceStr = searchStr + '\n                  <li><a href="/blog/how-to-keep-bouquet-fresh-north-indian-summer">Flower Care Blog</a></li>';

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(file, content);
  console.log("Updated footer in " + file);
}
