const fs = require('fs');
let js = fs.readFileSync('js/occasionPagesData.js', 'utf8');

js = js.replace(/https:\/\/drive\.google\.com\/uc\?export=view&id=([a-zA-Z0-9_-]+)/g, 'https://lh3.googleusercontent.com/d/$1');

js = js.replace(/https:\/\/drive\.usercontent\.google\.com\/download\?id=([a-zA-Z0-9_-]+)&export=view&authuser=0/g, 'https://lh3.googleusercontent.com/d/$1');

fs.writeFileSync('js/occasionPagesData.js', js);
console.log("Updated URLs successfully");
