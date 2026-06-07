# Rose n Petals — CHUNK 4: Policies Page
# File: ~/Documents/rnp/CHUNK4_POLICIES_PAGE.md

---

## CRITICAL RULES

1. Read this entire document before doing anything.
2. Write a PLAN first — list every file you will
   change and exactly what you will change.
3. Do NOT implement until plan is confirmed.
4. After implementing verify every checklist item.
5. This chunk creates ONE new page at /policies
   It does not touch any existing pages,
   routing logic, server.js, CSS, or JS files
   beyond what is listed here.

---

## PROJECT CONTEXT

Project: Rose n Petals — local flower shop, Ghaziabad
Live URL: https://rosenpetals.com
Stack: HTML, CSS, JS, Node.js, Express
Shop name: Rose n Petals
WhatsApp: +91 7289996804
Phone: +91 9810244455

---

## TASK — Create a Policies Page at /policies

Create a new server-rendered HTML page accessible
at the real URL: https://rosenpetals.com/policies

This is NOT a hash route. It must be a real
Express route that serves a real HTML page.

---

## SERVER ROUTE

Add this route to server.js BEFORE the catch-all
or SPA fallback route:

app.get('/policies', (req, res) => {
  res.sendFile(path.join(__dirname, 'policies.html'));
});

---

## CREATE FILE: policies.html

Create a new file called policies.html in the
root of the project.

The page must include:
- The same global header/navbar as the main site
- The same global footer as the main site
- A clean, readable policies content section
- Anchor links at the top for each policy
- All 11 policies listed below

Use the same CSS file (css/styles.css) so the
page matches the existing site design.

---

## PAGE HEAD SECTION

```html
<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,
  initial-scale=1.0">
  <title>Policies | Rose n Petals Ghaziabad</title>
  <meta name="description" content="Read the policies
  of Rose n Petals — delivery, refund, payment,
  privacy and more. Local flower shop in Ghaziabad.">
  /png"
  href="/assets/favicon.png">
  
  href="https://rosenpetals.com/policies">
  /styles.css">
</head>
```

---

## PAGE CONTENT

### Top Navigation Anchors

Add these jump links at the top of the content area:

Jump to:
• Privacy Policy           → #privacy
• Terms & Conditions       → #terms
• Refund Policy            → #refund
• Return & Replacement     → #return
• Cancellation Policy      → #cancellation
• Delivery Policy          → #delivery
• Payment Policy           → #payment
• Contact & Support        → #support
• Order Confirmation       → #order-confirmation
• Damaged Product          → #damaged
• Out-of-Stock Policy      → #out-of-stock

---

### POLICY 1 — Privacy Policy
Anchor id: privacy
Privacy Policy
Last updated: June 2026

At Rose n Petals, we respect your privacy. This
policy explains what information we collect and
how we use it.

Information We Collect
When you place an order with us via WhatsApp or
our website, we may collect your name, phone number,
delivery address, and any message or instructions
you provide. We do not collect payment details —
all payments are made directly via UPI or Bank
Transfer.

How We Use Your Information
We use your information only to:

Process and deliver your order

Contact you regarding your order status

Respond to your queries

We do not sell, share, or rent your personal
information to any third party for marketing
purposes.

Third-Party Delivery
We use third-party delivery partners to deliver
your order. Your delivery address and contact
number will be shared with the delivery partner
solely for the purpose of completing your delivery.

Data Retention
We retain order information only as long as
necessary for completing your order and for basic
record-keeping. We do not store payment information.

Contact
If you have any questions about this policy,
WhatsApp us at +91 7289996804 or call
+91 9810244455.

---

### POLICY 2 — Terms & Conditions
Anchor id: terms
Terms & Conditions
Last updated: June 2026

By placing an order with Rose n Petals — whether
through our website or via WhatsApp — you agree
to the following terms.

About Us
Rose n Petals is a local flower shop based at
Shop No. 14, KD Market, Block D, Sector 18,
Kavi Nagar, Ghaziabad, Uttar Pradesh – 201002.

Orders
All orders are subject to availability and
confirmation. An order is confirmed only after
we send you a confirmation message on WhatsApp.

Pricing
All prices are in Indian Rupees (INR) and are
inclusive of applicable taxes. Prices are subject
to change without notice, but the price at the
time of your order confirmation will be honoured.

Payment
We accept UPI and Bank Transfer only. No Cash on
Delivery is available under any circumstances.
Payment must be completed before your order
is dispatched.

Delivery
Delivery is handled by third-party delivery
partners. While we make every effort to ensure
timely delivery, Rose n Petals is not responsible
for delays caused by circumstances beyond our
control, including traffic, weather, or third-party
delivery partner issues.

Product Appearance
All bouquets are handmade and may vary slightly
from the images shown on our website. Minor
differences in flower arrangement, wrapping colour,
or stem placement are normal and do not constitute
a defect.

Limitation of Liability
Rose n Petals liability is limited to the value
of the order placed. We are not liable for indirect
or consequential losses.

Governing Law
These terms are governed by the laws of India.
Any disputes will be subject to the jurisdiction
of courts in Ghaziabad, Uttar Pradesh.

Contact
WhatsApp: +91 7289996804
Phone: +91 9810244455

---

### POLICY 3 — Refund Policy
Anchor id: refund
Refund Policy
Last updated: June 2026

We want every customer to be happy with their
order. However, because our products are fresh,
perishable flowers, our refund policy is limited.

When a Refund is Applicable
A refund will be considered only if:

You received a completely wrong bouquet
(different product entirely from what you ordered)

When a Refund is NOT Applicable
We do not offer refunds for:

Minor visual differences between the website
photo and the delivered bouquet. All bouquets
are handmade and may vary slightly.

Damage caused during delivery by our third-party
delivery partner. Damage in transit is not the
responsibility of Rose n Petals.

Change of mind after order confirmation.

Delays caused by incorrect address or contact
information provided by the customer.

Bouquets that have been accepted at delivery.

How to Request a Refund
WhatsApp us at +91 7289996804 within 2 hours of
delivery with a clear photo of what you received.
We will review and respond within 24 hours.

Refund Processing
Approved refunds will be processed to your
original payment method within 5-7 business days.

---

### POLICY 4 — Return & Replacement Policy
Anchor id: return
Return & Replacement Policy
Last updated: June 2026

Due to the perishable nature of fresh flowers,
we do not accept returns.

Replacement
A replacement may be offered at our discretion if:

You received a completely wrong item

We do not offer replacements for:

Minor visual differences from website photos

Damage caused by the third-party delivery
partner during transit

Bouquets already accepted at delivery

Orders where incorrect address was provided

To request a replacement, WhatsApp us at
+91 7289996804 within 2 hours of delivery with
a photo of the item received.

---

### POLICY 5 — Cancellation Policy
Anchor id: cancellation
Cancellation Policy
Last updated: June 2026

Before Order Confirmation
You may cancel at any time before we send you
an order confirmation on WhatsApp. No charge
will apply.

After Order Confirmation
Once your order is confirmed, we begin preparing
your bouquet immediately. Cancellations after
confirmation are generally not possible.

If you need to cancel after confirmation, WhatsApp
us immediately at +91 7289996804. If your bouquet
has not yet been prepared or dispatched, we may
cancel at our discretion. If the bouquet has
already been prepared or is in transit,
cancellation will not be possible and no refund
will be issued.

Payment on Cancellation
If a cancellation is approved before preparation
begins, any payment made will be refunded within
5-7 business days.

---

### POLICY 6 — Delivery Policy
Anchor id: delivery
Delivery Policy
Last updated: June 2026

Delivery Areas
Rose n Petals delivers across all of Ghaziabad
and surrounding areas including Kavi Nagar,
Raj Nagar, Indirapuram, Vaishali, Vasundhara,
Mohan Nagar, Vijay Nagar, Crossing Republik,
and nearby localities.

Delivery Time
We aim to deliver in under 1 hour of order
confirmation. Same-day delivery is available
for orders placed before 9 PM. Delivery times
are estimates and may vary depending on distance,
traffic, and third-party delivery partner
availability.

Third-Party Delivery
All deliveries are handled by independent
third-party delivery partners. Rose n Petals
arranges the delivery on your behalf but is not
responsible for delays, damages, or losses caused
by the delivery partner once the bouquet has been
handed over.

Delivery Charges
Any applicable delivery charges will be
communicated to you at the time of order
confirmation on WhatsApp before payment
is requested.

Recipient Availability
Please ensure someone is available to receive
the delivery. If the recipient is unavailable,
the delivery partner may attempt to leave the
item with a neighbour or contact you. Rose n
Petals is not responsible for bouquets left
unattended.

Incorrect Address
If a delivery fails due to an incorrect address
provided by the customer, a re-delivery charge
may apply. No refund will be issued for failed
deliveries caused by incorrect address information.

Delivery Hours
Deliveries are made between 8 AM and 10 PM daily.

---

### POLICY 7 — Payment Policy
Anchor id: payment
Payment Policy
Last updated: June 2026

Accepted Payment Methods
Rose n Petals accepts:

UPI (Google Pay, PhonePe, Paytm, or any UPI app)

Direct Bank Transfer (NEFT/IMPS)

Cash on Delivery is not available under any
circumstances. We do not accept credit cards,
debit cards, or any other payment method.

Payment Timing
Payment must be completed after order confirmation
and before your bouquet is dispatched. Our team
will share payment details with you on WhatsApp
after confirming your order.

Payment Confirmation
Once payment is received, we will send you a
confirmation message on WhatsApp and proceed
with preparing and dispatching your order.

Failed Payments
If payment is not received within a reasonable
time after order confirmation, we reserve the
right to cancel your order.

Pricing
All prices are in Indian Rupees (INR) inclusive
of applicable taxes. The final price including
any delivery charges will be communicated before
payment.

---

### POLICY 8 — Contact & Support Policy
Anchor id: support
Contact & Support Policy
Last updated: June 2026

How to Contact Us
WhatsApp: +91 7289996804
Phone: +91 9810244455
Hours: Every day, 8 AM to 10 PM

Response Times
WhatsApp messages: within 15-30 minutes during
shop hours. For urgent orders write URGENT at
the start of your message. Messages received
after 10 PM will be responded to the following
morning.

Order Issues
If you have any issue with your order, WhatsApp
us within 2 hours of delivery with a description
and photo of the issue.

Complaint Resolution
We aim to resolve all complaints within 24 hours.

Shop Address
Shop No. 14, KD Market, Block D, Sector 18,
Kavi Nagar, Ghaziabad, Uttar Pradesh – 201002

---

### POLICY 9 — Order Confirmation & Acceptance Policy
Anchor id: order-confirmation
Order Confirmation & Acceptance Policy
Last updated: June 2026

Order Placement
Orders can be placed via our website or directly
on WhatsApp at +91 7289996804.

Order Confirmation
An order is confirmed only when we send you an
explicit confirmation message on WhatsApp.
Submitting an order form on our website alone
does not constitute a confirmed order.

Right to Refuse
Rose n Petals reserves the right to refuse or
cancel any order at our discretion, including
where:

The requested bouquet is not available

Delivery to the requested address is not possible

Incomplete or incorrect order details are provided

Payment is not received within a reasonable time

In such cases, any payment already made will be
fully refunded.

Order Modifications
If you need to modify your order, WhatsApp us
immediately. Modifications can only be accommodated
before bouquet preparation has begun.

Order Accuracy
Please double-check your delivery address,
recipient name, and contact number before
confirming your order. Rose n Petals is not
responsible for failed deliveries resulting from
incorrect information provided by the customer.
---

### POLICY 10 — Damaged Product Policy
Anchor id: damaged
Damaged Product Policy
Last updated: June 2026

Our Responsibility
Rose n Petals takes great care in preparing every
bouquet before handing it to our delivery partner.

Third-Party Delivery Disclaimer
All deliveries are handled by independent
third-party delivery partners. Once a bouquet
has been handed over to the delivery partner
in good condition, Rose n Petals is not
responsible for any damage that occurs during
transit.

Damage during delivery — including crushed flowers,
broken stems, spilled water, or damaged packaging
— is the responsibility of the third-party delivery
partner and is outside our control.

What to Do if Your Bouquet Arrives Damaged

Photograph the damage immediately upon receipt

WhatsApp the photos to +91 7289996804 within
2 hours of delivery

Describe what happened

While damage in transit is not our responsibility,
we will review each case individually and may, at
our sole discretion, offer a partial replacement
or goodwill gesture depending on the circumstances.

We strongly recommend being present at the time
of delivery to inspect the bouquet before the
delivery partner leaves.

### POLICY 11 — Out-of-Stock & Substitution Policy
Anchor id: out-of-stock

Out-of-Stock & Substitution Policy
Last updated: June 2026

Availability
All bouquets displayed on our website are subject
to availability. Flower availability depends on
market supply and seasonal factors which can
change daily.

Out-of-Stock Items
If a specific bouquet or flower type you have
ordered is unavailable at the time of your order,
we will inform you immediately on WhatsApp before
proceeding.

Substitutions
In some cases, specific flowers used in a bouquet
may not be available on the day of your order.
If this happens, we will:
1. Inform you on WhatsApp before making any changes
2. Suggest an alternative of equal or higher value
3. Proceed only with your explicit approval

We will never substitute flowers without informing
you first.

If No Suitable Substitution is Available
If we are unable to fulfil your order due to stock
unavailability and no acceptable substitution
exists, we will cancel your order and issue a full
refund within 5-7 business days.

---

## PAGE STYLING

Add these styles inside a <style> tag in
policies.html head, or add to css/styles.css:

.policies-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 60px 20px;
}

.policies-nav {
  background: #FFF5F5;
  border: 1px solid #FDDEDE;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 40px;
}

.policies-nav h2 {
  font-size: 14px;
  font-weight: 600;
  color: #CC0000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.policies-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.policies-nav ul li a {
  font-size: 13px;
  color: #CC0000;
  text-decoration: none;
  background: white;
  border: 1px solid #FDDEDE;
  border-radius: 20px;
  padding: 5px 12px;
  display: inline-block;
  transition: background 0.2s ease;
}

.policies-nav ul li a:hover {
  background: #CC0000;
  color: white;
}

.policy-section {
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid #EEEEEE;
}

.policy-section:last-child {
  border-bottom: none;
}

.policy-section h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.policy-section .last-updated {
  font-size: 12px;
  color: #999999;
  margin-bottom: 20px;
  display: block;
}

.policy-section p {
  font-size: 14px;
  color: #444444;
  line-height: 1.7;
  margin-bottom: 12px;
}

.policy-section h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-top: 20px;
  margin-bottom: 8px;
}

.policy-section ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

.policy-section ul li {
  font-size: 14px;
  color: #444444;
  line-height: 1.7;
  margin-bottom: 4px;
}

.policies-page-header {
  text-align: center;
  padding: 40px 20px 32px 20px;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 40px;
}

.policies-page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.policies-page-header p {
  font-size: 14px;
  color: #666666;
}

@media (max-width: 767px) {
  .policies-page {
    padding: 20px 16px 40px 16px;
  }
  .policy-section h2 {
    font-size: 18px;
  }
}

---

## VERIFICATION CHECKLIST

After implementing confirm every item:

[ ] 1. /policies route exists in server.js
[ ] 2. policies.html file exists in project root
[ ] 3. Page is accessible at localhost/policies
[ ] 4. Page shows the same navbar as main site
[ ] 5. Page shows the same footer as main site
[ ] 6. Jump links at top work and scroll to
       correct policy sections
[ ] 7. All 11 policy sections are present
[ ] 8. Each policy has correct anchor id
[ ] 9. Page title is "Policies | Rose n Petals
       Ghaziabad"
[ ] 10. Canonical tag points to
        https://rosenpetals.com/policies
[ ] 11. Page looks clean and readable on mobile
[ ] 12. Footer Policies link correctly goes to /policies
[ ] 13. No existing pages, routing, or JS changed

---

## FINAL REMINDER

Show plan first. Wait for confirmation.
Then implement. Verify all 13 items when done.
Do not touch anything not listed here.