# Rose n Petals — CHUNK 6: Cart + Coupon System
# File: ~/Documents/rnp/CHUNK6_CART_COUPON.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will
   change and exactly what you will change.
3. Do NOT implement until plan is confirmed.
4. After implementing verify every checklist item.
5. Do NOT change any SEO tags, policies page,
   landing pages, robots.txt, or sitemap.xml.
6. Do NOT change any existing WhatsApp order
   flow that currently works.
7. The existing single-item WhatsApp order button
   on each bouquet card must continue to work
   exactly as before alongside the new cart system.

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Ghaziabad
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JS, Node.js, Express
Orders: WhatsApp only — +91 7289996804
Payment: UPI and Bank Transfer only. No COD.
No payment gateway. No database.
Coupon data stored in coupons.json file.

---

## FEATURE 1 — ADD TO CART

### What it does:
Customer can add multiple bouquets to a cart,
then place one combined WhatsApp order with
all items listed in a single message.

### Cart icon in navbar:
Add a cart icon to the RIGHT side of the navbar.
Use a shopping bag SVG icon.
Show a red badge with item count when cart
has 1 or more items.
Badge style: 
- position absolute top-right of icon
- background #CC0000
- color white
- border-radius 50%
- width 18px height 18px
- font-size 11px
- font-weight 700
Hide badge when cart is empty.

### Add to Cart button on bouquet cards:
On every bouquet card in the catalog, ADD a new
button alongside the existing "Order now" button.

New button text: Add to Cart
New button style:
- background: white
- color: #CC0000
- border: 2px solid #CC0000
- border-radius: 8px
- padding: 8px 12px
- font-size: 13px
- font-weight: 600
- cursor: pointer
- hover: background #CC0000, color white

The existing "Order now" WhatsApp button must
remain exactly as it is. Do not change it.

### Cart Drawer/Sidebar:
When customer clicks the cart icon in navbar,
a drawer slides in from the RIGHT side.

Drawer specifications:
- Width: 360px on desktop, 100% on mobile
- Background: white
- Box shadow: -4px 0 20px rgba(0,0,0,0.15)
- z-index: 1000
- Overlay: semi-transparent dark overlay
  behind drawer, clicking it closes the drawer

Drawer header:
- Text: "Your Cart"
- Font-size: 18px, font-weight: 700
- X close button on right side

Drawer content when cart is EMPTY:
Show this message centered in drawer:
"Your cart is empty.
Browse our bouquets and add something beautiful."
Add a "Browse Bouquets" button linking to /catalog

Drawer content when cart has items:
For each item show:
- Bouquet image thumbnail (60x60px, border-radius 8px,
  object-fit cover)
- Bouquet name (font-size 14px, font-weight 600)
- Price (font-size 13px, color #CC0000)
- Quantity controls: [ - ] [ 1 ] [ + ]
  (each button 28x28px, border 1px solid #EEEEEE,
  border-radius 4px)
- Remove button: trash icon, color #999,
  hover color #CC0000

Below all items:
Divider line

Coupon code section:
Label: "Have a coupon?"
Input field: placeholder "Enter coupon code"
  (uppercase automatically)
Apply button: text "Apply", background #CC0000,
  color white, border-radius 6px, padding 8px 16px
Success message (green): "Coupon applied! You save ₹X."
Error message (red): specific error per case

Price summary:
Subtotal: ₹X (right aligned)
Discount: -₹X (green, only show if coupon applied)
Delivery: Communicated on WhatsApp
Total: ₹X (bold, font-size 16px)

Bottom buttons:
Button 1: "Continue Shopping"
- full width, background white, color #CC0000,
  border 2px solid #CC0000, border-radius 8px,
  padding 12px, font-size 14px
- closes drawer on click

Button 2: "Proceed to Order on WhatsApp"
- full width, background #CC0000, color white,
  border-radius 8px, padding 14px, font-size 14px,
  font-weight 700, margin-top 8px
- opens WhatsApp with pre-filled message
  (see WhatsApp message format below)

### Cart WhatsApp Message Format:
When customer clicks "Proceed to Order on WhatsApp"
open WhatsApp with this pre-filled message:

Hi! I want to place an order from Rose n Petals.

ORDER DETAILS:
[List each item as:]
[item number]. [Bouquet name] (x[quantity]) — ₹[price x quantity]

Subtotal: ₹[subtotal]
[If coupon applied:] Coupon: [CODE] (-₹[discount])
Total: ₹[total]

Please confirm my order and share delivery details.

WhatsApp link format:
https://api.whatsapp.com/send?phone=917289996804&text=[URL encoded message]

### Cart State Management:
Store cart data in localStorage under key 'rnp_cart'
Cart data structure:
[
  {
    id: "Product 1",
    name: "Classic 21 Red Roses Bouquet",
    price: 699,
    imageUrl: "cloudinary url",
    quantity: 1
  }
]

When same item is added again, increase quantity.
Maximum quantity per item: 10.
Cart persists across page refreshes via localStorage.

---

## FEATURE 2 — COUPON SYSTEM

### Coupon data file:
Create file: coupons.json in project root.

Initial content:
[
  {
    "id": 1,
    "code": "WELCOME100",
    "type": "fixed",
    "value": 100,
    "minOrder": 300,
    "maxDiscount": null,
    "status": "active"
  },
  {
    "id": 2,
    "code": "ROSE10",
    "type": "percentage",
    "value": 10,
    "minOrder": 500,
    "maxDiscount": 200,
    "status": "active"
  }
]

### Coupon validation API route:
Add to server.js BEFORE the catch-all route:

POST /api/coupons/validate
Body: { code: string, cartTotal: number }
Response: { valid: boolean, discountAmount: number,
            message: string, finalTotal: number }

Validation logic:
1. Find coupon by code (case-insensitive)
2. If not found: return valid false,
   message "Invalid coupon code. Please check
   and try again."
3. If found but status inactive: return valid false,
   message "This coupon is no longer active."
4. If cartTotal less than minOrder: return valid false,
   message "Minimum order of ₹[minOrder] required
   for this coupon."
5. Calculate discount:
   - fixed type: discountAmount = value
   - percentage type: discountAmount = 
     Math.min(cartTotal * value / 100, maxDiscount
     or Infinity)
   - discountAmount cannot exceed cartTotal
6. Return valid true, discountAmount, finalTotal,
   message "Coupon applied! You save ₹[discountAmount]."

### Admin panel coupon routes:
Add to server.js (protected by existing admin auth):

GET /api/admin/coupons
— returns all coupons from coupons.json

POST /api/admin/coupons
— creates new coupon, appends to coupons.json
— auto-assigns next id

PUT /api/admin/coupons/:id
— updates coupon by id in coupons.json

DELETE /api/admin/coupons/:id
— removes coupon by id from coupons.json

All admin coupon routes must check the same
admin session/cookie authentication that the
existing admin panel uses. Reject with 401
if not authenticated.

---

## FEATURE 3 — ADMIN COUPON PANEL UI

Add a new "Coupons" tab/section to the existing
admin dashboard page.

### Coupons section layout:

Section header:
"Coupons & Discounts"
+ Create New Coupon button (top right)
background #CC0000, color white, border-radius 8px,
padding 8px 16px

Coupon list table:
Columns:
Code | Type | Value | Min Order | Status | Actions

Each row:
- Code: bold, uppercase
- Type: "Fixed (₹)" or "Percentage (%)"
- Value: ₹X or X%
- Min Order: ₹X or "None"
- Status: green "Active" badge or grey "Inactive" badge
- Actions: Edit button + Delete button

Empty state:
"No coupons yet. Create your first coupon."

### Create/Edit Coupon Modal:

Trigger: clicking "+ Create New Coupon" or "Edit"

Modal fields:
1. Coupon Code (text input)
   - auto-converts to uppercase
   - no spaces allowed
   - placeholder: e.g. WELCOME100

2. Discount Type (dropdown)
   Options: Fixed Amount (₹) | Percentage (%)

3. Discount Value (number input)
   - If fixed: label "Discount Amount (₹)"
     placeholder: e.g. 100
   - If percentage: label "Discount Percentage (%)"
     placeholder: e.g. 10

4. Minimum Order Amount (number input, optional)
   label: "Minimum Order (₹)"
   placeholder: "Leave blank for no minimum"

5. Maximum Discount Cap (number input, optional)
   label: "Maximum Discount Cap (₹)"
   placeholder: "For % coupons only — leave blank for no cap"
   Only show this field when type is Percentage

6. Status (toggle switch)
   Active / Inactive
   Default: Active

Modal buttons:
Cancel (closes modal, no changes)
Save Coupon (saves via API, closes modal,
  refreshes coupon list)

### Inline validation in modal:
- Code field: required, min 3 chars, max 20 chars
- Value field: required, must be positive number
- Show red error text below field if invalid
- Save button disabled if any required field is empty

---

## FILE CHANGES SUMMARY

Files to CREATE:
- coupons.json (project root)

Files to MODIFY:
- server.js (add coupon API routes)
- js/store.js or js/app.js (add cart state logic)
- js/components.js (add cart icon, cart drawer,
  Add to Cart button on cards)
- css/styles.css (add cart and coupon styles)
- admin_views/ (whichever file renders the admin
  dashboard — add coupons section and modal)

---

## VERIFICATION CHECKLIST

After implementing confirm every item:

[ ] 1. Cart icon appears in navbar right side
[ ] 2. Cart icon shows red badge with count
       when items are added
[ ] 3. Add to Cart button exists on every
       bouquet card
[ ] 4. Existing Order now button still works
       exactly as before
[ ] 5. Clicking cart icon opens drawer from right
[ ] 6. Empty cart shows correct empty state message
[ ] 7. Adding items shows them in cart drawer
       with image, name, price, quantity controls
[ ] 8. Quantity + and - buttons work correctly
[ ] 9. Remove button removes item from cart
[ ] 10. Cart persists after page refresh
        (stored in localStorage)
[ ] 11. Coupon input field exists in cart drawer
[ ] 12. Valid coupon WELCOME100 applies Rs.100
        discount on orders over Rs.300
[ ] 13. Invalid coupon shows correct error message
[ ] 14. Proceed to Order on WhatsApp button
        opens WhatsApp with correct pre-filled
        message listing all cart items
[ ] 15. POST /api/coupons/validate works correctly
[ ] 16. coupons.json file exists with 2 sample coupons
[ ] 17. Admin panel shows Coupons section
[ ] 18. Can create a new coupon from admin panel
[ ] 19. Can edit existing coupon from admin panel
[ ] 20. Can delete coupon from admin panel
[ ] 21. Admin coupon routes reject unauthenticated
        requests with 401
[ ] 22. No existing pages, SEO tags, landing pages,
        policies, or other features were changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Then implement. Verify all 22 items when done.
Do not touch anything not listed here.
The existing single-item WhatsApp order flow
must continue working exactly as before.