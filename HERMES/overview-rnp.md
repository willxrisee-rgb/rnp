# Rose n Petals Project Overview

## What the Project Currently Is
Rose n Petals is a Node.js web service for a florist business, featuring an Express backend that serves static frontend files (HTML/CSS/JS) and provides server-side rendering (SSR) for product data fetched from a Google Sheets CSV export. It includes admin interfaces for managing coupons and WhatsApp-based order functionality.

## What Has Been Built So Far
- **Backend**: Express.js server (`server.js`) with:
  - Server-side product caching from Google Sheets CSV
  - SSR for product pages (index, catalog, bouquet details)
  - Admin authentication and dashboard
  - Coupon management API (CRUD operations)
  - WhatsApp order integration
  - Static file serving for frontend assets
- **Frontend**: HTML/CSS/JS files for:
  - Homepage (`index.html`)
  - Product catalog and bouquet detail pages
  - Blog pages
  - Landing page
  - Policies page
  - Admin views (login, dashboard)
  - Client-side JavaScript bundles (via esbuild)
- **Configuration**: 
  - Environment variables for Google Sheets URL and admin password
  - Package.json with Express and esbuild dependencies
  - Deployment guide for Render.com

## Technology Stack
- **Runtime**: Node.js (v18.x+ recommended)
- **Backend Framework**: Express.js
- **Templating**: Server-side HTML generation (no frontend framework like React/Vue)
- **Build Tool**: esbuild for JavaScript bundling/minification
- **Styling**: Custom CSS
- **Data Source**: Google Sheets (published as CSV) for product catalog
- **Deployment Target**: Render.com (Node.js Web Service)
- **Version Control**: Git (hosted somewhere, clean main branch)

## Current Architecture
```
Rose n Petals Web Service
├── server.js          # Main Express application
├── /assets            # Static assets (images, etc.)
├── /css               # Stylesheets
├── /js                # Client-side JavaScript (bundled via esbuild)
├── /admin_views       # Admin dashboard and login pages
├── /scripts           # Build scripts (generate-sitemap, prerender, bundle)
├── /src copy          # Source copy directory
├── index.html         # Homepage
├── blog-keep-fresh.html
├── landing-page.html
├── policies.html
├── coupons.json       # Coupon data storage
├── package.json       # Dependencies and scripts
├── .git               # Git repository
├── DEPLOY_RENDER.md   # Deployment instructions
└── Logo.jpg, rnp.md, etc.
```

**Data Flow**:
1. Server starts → loads product cache from Google Sheets CSV (with 15-min TTL)
2. Client requests HTML pages → Express renders server-side HTML with product data
3. Static assets served directly from filesystem
4. Admin routes require session cookie authentication
5. Coupon validation and management via `/api/coupons/*` and `/api/admin/coupons/*`
6. Frontend fetches backend config via `/api/config` to get Google Sheets URL securely

## Features That Already Work
- ✅ Server-side rendering of product catalog and detail pages
- ✅ Static file serving (HTML, CSS, JS, images)
- ✅ Admin authentication and dashboard access
- ✅ Coupon validation (frontend → `/api/coupons/validate`)
- ✅ Admin coupon management (CRUD operations)
- ✅ WhatsApp order integration (pre-filled message)
- ✅ SEO metadata (JSON-LD structured data, OpenGraph)
- ✅ Google Sheets CSV parsing with caching
- ✅ Build scripts for JavaScript bundling and sitemap generation
- ✅ Deployment-ready configuration for Render.com

## What Is Incomplete or Broken
Based on inspection:
- ❌ No visible database for persistent storage beyond JSON files (coupons.json)
- ❌ Product data only cached in memory (lost on server restart until refresh)
- ❌ No user accounts or customer management system
- ❌ No actual order processing/payment integration (only WhatsApp initiation)
- ❌ No inventory management tied to orders
- ❌ No frontend build process for modern frameworks (plain HTML/CSS/JS)
- ❌ No automated tests visible
- ❌ No CI/CD pipeline configured
- ❌ No error monitoring or logging infrastructure
- ❌ No rate limiting or security headers beyond basic auth
- ❌ The admin views appear to be basic HTML forms without framework

## Deployment Setup Currently Is
- **Target**: Render.com Node.js Web Service
- **Build Command**: `npm install` (installs Express and esbuild)
- **Start Command**: `npm start` (runs `node server.js`)
- **Node Version**: 18.x or higher
- **Environment Variables Required**:
  - `SHEET_URL`: Google Sheets CSV export URL for product data
  - `PORT`: Automatically set by Render (server binds to 0.0.0.0)
- **Deployment Process**:
  1. Push to Git repository connected to Render
  2. Render detects Node.js project, runs `npm install`
  3. Starts server with `npm start`
  4. Server binds to PORT environment variable on 0.0.0.0
  5. Frontend served statically from same Express instance

## Key Observations
1. The project is a functional MVP for a florist web presence with:
   - Product catalog display from Google Sheets
   - Basic e-commerce flow (view → WhatsApp order)
   - Admin coupon management
   - SSR for SEO and performance

2. It uses a traditional server-rendered approach rather than SPA, which is good for SEO and simplicity.

3. The code appears well-organized with clear separation of concerns in server.js.

4. Deployment to Render is straightforward per the provided guide.

5. Main limitations are around scalability (in-memory cache) and missing e-commerce features (payments, inventory, user accounts).

---
*Report generated by Hermes Agent on $(date)*