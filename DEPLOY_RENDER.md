# Deploying Rose n Petals to Render

In order to run safely without hardcoding the sensitive Google Sheet URL in the frontend browser cache, the application is configured as a **Node.js Web Service**.

## Render Settings

When creating a new "Web Service" on [render.com](https://render.com), point it to this repository and use the following build and start settings:

- **Build Command:** `npm install` (this will install the minimal Express backend. The front-end requires no build step).
- **Start Command:** `npm start`
- **Node Version:** Ensure Node `18.x` or higher is selected.

### Required Environment Variables

You must configure the following key-value pairs in the Render dashboard's Environment Variables section:

- `SHEET_URL`: The exact Google Sheets CSV export URL.
  - *Example:* `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`
  - The frontend will dynamically fetch this URL from the backend upon loading via an internal `/api/config` proxy path.
- `PORT`: Note that Render sets this automatically. The `server.js` file properly binds to `0.0.0.0`.

No other configuration is needed! The app is completely ready to run.
