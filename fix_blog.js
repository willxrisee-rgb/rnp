const fs = require('fs');

let content = fs.readFileSync('blog-keep-fresh.html', 'utf8');

// Fix logos
content = content.replace(/src="Logo\.jpg"/g, 'src="/Logo.jpg"');

// Fix nav links
content = content.replace(/href="#\/"/g, 'href="/"');
content = content.replace(/href="#\/catalog"/g, 'href="/#/catalog"');
content = content.replace(/href="#\/catalog\?filter=occasions"/g, 'href="/#/catalog?filter=occasions"');
content = content.replace(/href="#\/\?scrollTo=how-it-works"/g, 'href="/#/?scrollTo=how-it-works"');
content = content.replace(/href="#\/\?scrollTo=contact"/g, 'href="/#/?scrollTo=contact"');

fs.writeFileSync('blog-keep-fresh.html', content);
console.log("Updated blog-keep-fresh.html links");
