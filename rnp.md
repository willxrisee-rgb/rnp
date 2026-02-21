{
  "project": {
    "title": "Rose n Petals – Bouquet Ordering Site",
    "description": "A fast, mobile‑first bouquet ecommerce website for Rose n Petals (Kavi Nagar & Raj Nagar) that uses Google Sheets as a product backend and WhatsApp click‑to‑chat for order confirmation.",
    "stack": {
      "frontend": "HTML, CSS, JavaScript (no frameworks unless really needed)",
      "routing": "client-side routing with clean URLs",
      "backend": "none; all data fetched client-side from Google Sheets"
    },
    "branding": {
      "shopName": "Rose n Petals",
      "tagline": "Fresh bouquets in Kavi Nagar & Raj Nagar, local delivery available",
      "primaryColor": "#FF4B7D",
      "accentColors": ["#FFE5EE", "#F7F7FB"],
      "fontStyle": "clean, modern sans-serif, similar to the Stitch design screenshots",
      "logoText": "Rose n Petals"
    }
  },

  "dataSources": [
    {
      "id": "bouquets_sheet",
      "type": "google_sheet_published_html",
      "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHd0751qQ03HhhAmQhVE32BlLZXOO1g40tqB3XPv_9WZCUwW4iQwZ6mNWUnf0Pvf0aD1HkRBAuOQQu/pubhtml",
      "description": "Published Google Sheet containing bouquet inventory.",
      "mapping": {
        "id": "id",
        "name": "name",
        "price": "price",
        "imageUrl": "image_url",
        "status": "status",                  // 'in-stock' or 'out-of-stock'
        "occasionTags": "occasion_tags",      // comma-separated tags: Birthday, Anniversary, etc.
        "shortDescription": "short_description",
        "isBestSeller": "is_best_seller"      // 'yes' / 'no' or TRUE / FALSE
      },
      "transform": "Parse the first table of the HTML, convert each row into a bouquet object using the mapping above. Coerce price to number, trim strings. Only expose bouquets where status === 'in-stock'."
    }
  ],

  "routes": [
    {
      "path": "/",
      "name": "Home",
      "component": "HomePage"
    },
    {
      "path": "/catalog",
      "name": "Catalog",
      "component": "CatalogPage"
    },
    {
      "path": "/bouquet/:id",
      "name": "BouquetDetail",
      "component": "BouquetDetailPage"
    }
  ],

  "layout": {
    "global": {
      "header": {
        "sticky": true,
        "left": "Rose n Petals logo + shop name",
        "center": null,
        "right": "menu icon on mobile, simple nav links on desktop",
        "navLinks": [
          { "label": "Home", "href": "/" },
          { "label": "Bouquets", "href": "/catalog" },
          { "label": "Occasions", "href": "/catalog#occasions" },
          { "label": "How it works", "href": "/#how-it-works" },
          { "label": "Contact", "href": "/#contact" }
        ]
      },
      "footer": {
        "sections": [
          {
            "type": "contact",
            "content": {
              "whatsapp": "+91 7289996804",
              "phone": "+91 9810244455",
              "address": "KD 14 Market, Block D, Sector 18, Kavi Nagar, Ghaziabad, Uttar Pradesh 201002",
              "hours": "Every day, 9 AM – 9 PM"
            }
          },
          {
            "type": "meta",
            "content": "© Rose n Petals"
          }
        ]
      },
      "styleReference": "Match overall layout, spacing, and color vibe to the attached Stitch screenshots: tall hero image with overlay text, pill filters for occasions, rounded product cards, soft shadows, and a big pink primary button."
    }
  },

  "pages": {
    "HomePage": {
      "sections": [
        {
          "id": "hero",
          "type": "hero",
          "props": {
            "backgroundImage": "large bouquet hero image (from assets, similar to Stitch design)",
            "title": "Fresh bouquets in Kavi Nagar & Raj Nagar",
            "subtitle": "Hand‑picked premium flowers for your special moments. Local delivery available.",
            "primaryButton": {
              "label": "View Bouquets",
              "href": "/catalog"
            },
            "badges": [
              "2‑hour delivery available (where possible)",
              "Loved by locals in Ghaziabad"
            ]
          }
        },
        {
          "id": "shop-by-occasion",
          "type": "filterChips",
          "props": {
            "title": "Shop by occasion",
            "chips": [
              "All",
              "Birthday",
              "Anniversary",
              "Love & Romance",
              "Get Well Soon",
              "Under ₹499"
            ],
            "behavior": "Filters the best‑seller and catalog carousels on this page client‑side, using occasionTags and price from bouquets_sheet."
          }
        },
        {
          "id": "best-sellers",
          "type": "bouquetCarousel",
          "data": {
            "source": "bouquets_sheet",
            "filter": "isBestSeller === 'yes' || isBestSeller === true",
            "limit": 8,
            "cardFields": ["imageUrl", "name", "price", "shortDescription"]
          },
          "cardActions": {
            "primary": {
              "label": "Order now",
              "href": "/bouquet/:id"
            }
          }
        },
        {
          "id": "how-it-works",
          "type": "steps",
          "props": {
            "title": "How it works",
            "steps": [
              { "title": "Choose a bouquet", "description": "Browse our curated collections for every occasion." },
              { "title": "Fill your details", "description": "Enter delivery address, date, time, and message card text." },
              { "title": "Confirm on WhatsApp", "description": "We confirm availability and payment via UPI or bank transfer, then deliver." }
            ]
          }
        },
        {
          "id": "about",
          "type": "textWithIcon",
          "props": {
            "title": "About our shop",
            "body": "Rose n Petals is a local family‑run florist in Kavi Nagar & Raj Nagar, dedicated to making your special moments bloom with carefully selected fresh flowers.",
            "highlightStats": [
              "Years of local experience",
              "Hundreds of happy customers"
            ]
          }
        },
        {
          "id": "contact",
          "type": "contactStrip",
          "props": {
            "title": "Contact Rose n Petals",
            "whatsapp": "+91 7289996804",
            "phone": "+91 9810244455",
            "buttons": [
              {
                "label": "Chat on WhatsApp",
                "href": "https://api.whatsapp.com/send?phone=917289996804",
                "variant": "primary"
              },
              {
                "label": "Call now",
                "href": "tel:+917289996804",
                "variant": "outline"
              }
            ]
          }
        }
      ]
    },

    "CatalogPage": {
      "sections": [
        {
          "id": "occasion-filters",
          "type": "filterChips",
          "props": {
            "chips": [
              "All",
              "Birthday",
              "Anniversary",
              "Love & Romance",
              "Get Well Soon",
              "Under ₹499"
            ],
            "behavior": "Filters the bouquet grid using occasionTags and price."
          }
        },
        {
          "id": "bouquet-grid",
          "type": "bouquetGrid",
          "data": {
            "source": "bouquets_sheet",
            "filter": "status === 'in-stock'",
            "cardFields": ["imageUrl", "name", "price", "shortDescription", "occasionTags", "isBestSeller"]
          },
          "cardUI": {
            "badges": {
              "bestSeller": "Show 'BEST SELLER' pill if isBestSeller is true/yes",
              "occasion": "Show one key occasion tag (e.g., first item from occasionTags)"
            },
            "primaryAction": {
              "label": "Order now",
              "href": "/bouquet/:id"
            }
          }
        }
      ]
    },

    "BouquetDetailPage": {
      "sections": [
        {
          "id": "main-info",
          "type": "bouquetDetail",
          "data": {
            "source": "bouquets_sheet",
            "lookupBy": "id",       // take id from route param :id
            "fields": ["imageUrl", "name", "price", "shortDescription", "occasionTags"]
          },
          "props": {
            "layout": "large image on top (mobile) or left (desktop), details on right",
            "showOccasionChips": true,
            "showRatingsPlaceholder": false
          }
        },
        {
          "id": "local-promise",
          "type": "infoList",
          "props": {
            "title": "Local promise",
            "items": [
              "Local delivery available in Kavi Nagar & Raj Nagar",
              "Custom message card available",
              "Fresh flowers arranged to order"
            ]
          }
        },
        {
          "id": "order-cta",
          "type": "stickyCTA",
          "props": {
            "buttonLabel": "Order this bouquet",
            "onClick": "Scroll to or open the embedded OrderForm section for this bouquet."
          }
        },
        {
          "id": "order-form",
          "type": "OrderForm", 
          "props": {
            "attachToBouquet": true,
            "position": "inline-below-detail"
          }
        },
        {
          "id": "related",
          "type": "bouquetCarousel",
          "data": {
            "source": "bouquets_sheet",
            "filter": "status === 'in-stock' && id !== currentBouquet.id",
            "limit": 4
          }
        }
      ]
    }
  },

  "components": {
    "OrderForm": {
      "type": "form",
      "fields": [
        { "name": "fullName", "label": "Full Name", "type": "text", "required": true },
        { "name": "mobileNumber", "label": "Mobile Number", "type": "tel", "required": true, "placeholder": "+91 XXXXX XXXXX" },
        { "name": "address", "label": "Full Address", "type": "textarea", "required": true },
        {
          "name": "area",
          "label": "Area",
          "type": "select",
          "required": true,
          "options": ["Kavi Nagar", "Raj Nagar", "Other"]
        },
        { "name": "deliveryDate", "label": "Delivery Date", "type": "date", "required": true },
        {
          "name": "deliverySlot",
          "label": "Delivery Time Slot",
          "type": "select",
          "required": true,
          "options": ["10 AM – 1 PM", "1 PM – 4 PM", "4 PM – 8 PM"]
        },
        {
          "name": "cardMessage",
          "label": "Message on Card (optional)",
          "type": "textarea",
          "required": false
        },
        {
          "name": "paymentMethod",
          "label": "Preferred Payment",
          "type": "radio-group",
          "required": true,
          "options": ["UPI", "Bank transfer"]
        }
      ],
      "submitButton": {
        "label": "Confirm on WhatsApp",
        "variant": "primary"
      },
      "belowText": "Next step opens WhatsApp with your order details.",
      "onSubmitLogic": "buildWhatsAppMessageAndRedirect"
    }
  },

  "logic": {
    "buildWhatsAppMessageAndRedirect": {
      "description": "When the order form is submitted, read all form values + current bouquet data, build a formatted text message, encode it, and open WhatsApp click‑to‑chat.",
      "steps": [
        "Read current bouquet object from bouquets_sheet using route param :id (fields: id, name, price).",
        "Read form values: fullName, mobileNumber, address, area, deliveryDate, deliverySlot, cardMessage, paymentMethod.",
        "Construct a multi‑line message string like:\n\nHi, I want to order a bouquet from Rose n Petals.\nName: <fullName>\nPhone: <mobileNumber>\nBouquet: <bouquetName> (<bouquetId>)\nPrice: ₹<price>\nAddress: <address>\nArea: <area>\nDelivery time: <deliveryDate> – <deliverySlot>\nMessage on card: \"ardMessage or 'None'>\"\nPayment method: <paymentMethod>\n\n        ",
        "URL‑encode this message using encodeURIComponent.",
        "Use standard WhatsApp click‑to‑chat URL: https://api.whatsapp.com/send?phone=917289996804&text=<encodedMessage> and redirect the browser there (window.location.href).",
        "Do not submit data to any server; everything happens client‑side."
      ]
    }
  },

  "performanceAndUX": {
    "requirements": [
      "Fully responsive: mobile‑first layout similar to the Stitch screenshots, then scale up to tablet and desktop.",
      "Fast initial load: bundle simple, avoid large JS frameworks, compress images where possible.",
      "Use smooth scrolling and sticky bottom CTA on mobile for the 'Order this bouquet' button.",
      "Respect accessibility basics: sufficient color contrast, readable font sizes, focus states on buttons and inputs."
    ]
  }
}
