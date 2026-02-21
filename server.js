require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
// Render automatically provides the PORT environment variable
const PORT = process.env.PORT || 8080;
// Must bind to 0.0.0.0 for Render deployments instead of localhost
const HOST = '0.0.0.0';

// Serve all static assets from the current directory (index.html, css, js, etc.)
app.use(express.static(path.join(__dirname)));

// API endpoint to securely pass environment variables to the frontend dynamically
app.get('/api/config', (req, res) => {
    res.json({
        sheetUrl: process.env.SHEET_URL || ''
    });
});

// SPA Fallback: Any other route returns index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    console.log(`Configured Google Sheet URL: ${process.env.SHEET_URL ? 'Detected' : 'Not Provided'}`);
});
