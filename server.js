require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
// Render automatically provides the PORT environment variable
const PORT = process.env.PORT || 8080;
// Must bind to 0.0.0.0 for Render deployments instead of localhost
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to parse cookies manually
const parseCookies = (req) => {
    const list = {};
    const rc = req.headers.cookie;
    rc && rc.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
};

// Protect admin views from being served statically
app.use('/admin_views', (req, res) => res.status(403).send('Forbidden'));

// Serve all static assets from the current directory (index.html, css, js, etc.)
app.use(express.static(path.join(__dirname)));

// Admin Auth Middleware
const requireAdmin = (req, res, next) => {
    const cookies = parseCookies(req);
    if (cookies.admin_session === 'authenticated') {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Admin Routes
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_views', 'login.html'));
});

app.post('/admin/login', (req, res) => {
    const password = req.body.password;
    const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
        res.cookie('admin_session', 'authenticated', { httpOnly: true });
        res.redirect('/admin');
    } else {
        res.redirect('/admin/login?error=1');
    }
});

app.get('/admin/logout', (req, res) => {
    res.clearCookie('admin_session');
    res.redirect('/admin/login');
});

app.get('/admin', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_views', 'dashboard.html'));
});

app.post('/api/admin/update', requireAdmin, (req, res) => {
    console.log("Received admin update payload:", JSON.stringify(req.body, null, 2));
    res.status(200).json({ success: true });
});

// API endpoint to securely pass environment variables to the frontend dynamically
app.get('/api/config', (req, res) => {
    res.json({
        sheetUrl: process.env.SHEET_URL || ''
    });
});

// Policies page route
app.get('/policies', (req, res) => {
  res.sendFile(path.join(__dirname, 'policies.html'));
});

// SPA Fallback: Any other route returns index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    console.log(`Configured Google Sheet URL: ${process.env.SHEET_URL ? 'Detected' : 'Not Provided'}`);
});
