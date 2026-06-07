# Rose n Petals — CHUNK 1: Quick UI Fixes
# File location: ~/Documents/rnp/CHUNK1_UI_FIXES.md
# Instructions for Antigravity: Read this file completely 
# before doing anything. Follow all rules exactly.

---

## CRITICAL RULES — FOLLOW BEFORE TOUCHING ANY CODE

1. Read this entire document before doing anything.
2. Write out a PLAN first — list every file you will 
   change and exactly what you will change in each one.
3. Do NOT start implementing until the plan is confirmed.
4. After implementing, go through the VERIFICATION 
   CHECKLIST at the bottom and confirm every item is done.
5. Do NOT change anything not listed in this document.
   Not colors. Not fonts. Not layout. Not routing. 
   Not server.js. Not product data. Nothing else.

---

## PROJECT CONTEXT

Project: Rose n Petals bouquet ordering website
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JavaScript, Node.js, Express
Hosting: Render (auto-deploys from GitHub)
GitHub: willxrisee-rgb/rnp
Local folder: ~/Documents/rnp

Do not change any routing, server logic, or product data.
Do not change any existing colors or fonts.
Do not change any page structure beyond what is listed.

---

## CHANGE 1 — Fix Viewport Meta Tag

File: index.html

Find this exact line:
<meta name="viewport" content="width=device-width, 
initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

Replace with exactly this:
<meta name="viewport" content="width=device-width, 
initial-scale=1.0">

Reason: user-scalable=no causes Google mobile ranking 
penalty and violates WCAG accessibility guidelines.

---

## CHANGE 2 — Fix Instagram Link

Files: Check index.html, any footer component, 
any navbar component, any JS file that contains 
an Instagram URL.

Find any Instagram URL containing tracking parameters.
It will look something like this:
https://www.instagram.com/rosenpetals?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw

Replace every single occurrence with this exact clean URL:
https://www.instagram.com/_rosenpetals_

IMPORTANT: The correct handle is _rosenpetals_ 
with underscores on both sides. Not rosenpetals.

Also add rel="noopener noreferrer" to every anchor 
tag that links to Instagram if not already present.

---

## CHANGE 3 — Add Favicon

The favicon is the small icon shown in the browser 
tab next to the page title, and in bookmarks.

Create a favicon using these specifications:
- Red circle background using color #CC0000
- Simple white rose outline in the centre
- Two sizes required: 32x32px and 180x180px
- File names: favicon.png and favicon-180.png
- Save both files in the root public or assets folder

Then add these two lines inside the <head> tag 
of index.html, after the existing meta tags:

<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png">
---

## CHANGE 4 — Add Logo to Navbar and Footer

The Rose n Petals logo file is already in the project 
folder. It is a red rectangle with a white rose 
illustration and the text Rose n Petals and tagline 
adding flowers in your life.

NAVBAR:
- Add the logo image to the LEFT side of the navbar
- Maximum height: 40px
- The logo must link to the homepage href="/"
- Show only the rose icon and Rose n Petals text
- Hide the tagline adding flowers in your life 
  in the navbar (use CSS if needed)
- If the navbar already shows Rose n Petals as 
  plain text, replace that text with the logo image
- Do not change navbar background color or any 
  other navbar element

FOOTER:
- Add the full logo including the tagline to the 
  LEFT column of the footer
- Maximum width: 160px
- Place the logo above the address and contact details
- Do not change footer background color or any 
  other footer element

---

## CHANGE 5 — Fix Mobile Catalog Grid

Problem: On mobile screens only one bouquet card 
is visible at a time, taking up more than half 
the screen. This looks unprofessional.

Required fix: On mobile show 2 columns side by side.

IMPORTANT: Before adding these CSS rules, check 
the actual class names used on the catalog grid 
container and bouquet cards in the existing HTML 
and JS files. Use the correct existing class names. 
Do not rename any existing classes.

Add these CSS rules to the main CSS file. 
Replace the class names in brackets with the 
actual class names found in the existing code:

@media (max-width: 767px) {
  [CATALOG GRID CLASS] {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px;
  }
  [BOUQUET CARD CLASS] img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 8px;
  }
  [CARD NAME CLASS] {
    font-size: 13px;
    font-weight: 600;
    margin-top: 6px;
  }
  [CARD PRICE CLASS] {
    font-size: 12px;
    color: #CC0000;
    margin-top: 2px;
  }
  [ORDER BUTTON CLASS] {
    font-size: 12px;
    padding: 6px 10px;
    margin-top: 6px;
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  [CATALOG GRID CLASS] {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  [CATALOG GRID CLASS] {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

---

## CHANGE 6 — Add html lang attribute

File: index.html

Find the opening html tag. It will be either:
<html>
or
<html lang="en">

Replace with:
<html lang="en-IN">

---

## VERIFICATION CHECKLIST

After implementing all 6 changes, go through this 
checklist and confirm every item before finishing:

[ ] 1. index.html viewport tag no longer contains 
       user-scalable=no or maximum-scale=1.0
[ ] 2. Every Instagram link in every file points to 
       https://www.instagram.com/_rosenpetals_ 
       with no tracking parameters
[ ] 3. favicon.png (32x32) exists in assets folder
[ ] 4. favicon-180.png (180x180) exists in assets folder
[ ] 5. Both favicon link tags are present in 
       index.html <head> section
[ ] 6. Logo appears in navbar left side max 40px height
[ ] 7. Logo appears in footer left column max 160px width
[ ] 8. Mobile CSS grid rules are added to CSS file
       using the correct existing class names
[ ] 9. html opening tag has lang="en-IN"
[ ] 10. No other files were changed beyond what 
        is listed in this document

---

## FINAL REMINDER

Make only the 6 changes listed above.
Show your implementation plan first.
Wait for confirmation before implementing.
Verify all 10 checklist items after implementing.
Do not touch anything else.