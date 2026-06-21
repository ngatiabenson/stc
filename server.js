const express = require('express');
const mysql = require('mysql2'); // Or 'mysql' depending on your package.json
const path = require('path');

const app = express();
const PORT = 3000;

// --- MIDDLEWARE CONFIGURATION (Must load before routes!) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from your root folder
app.use(express.static(path.join(__dirname)));


// --- DATABASE CONNECTION POOL CONFIGURATION ---
// ⚠️ Update these values to match your local MySQL environment settings
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',         // Your database username (usually root)
    password: '',         // Your database password
    database: 'spiritans_college',   // Your actual database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify connection loop status on boot
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ SQL Cluster Database Connection Failure:', err.message);
    } else {
        console.log('✅ SQL Relational Pool Connected Successfully.');
        connection.release();
    }
});


// --- ADMINISTRATIVE SECURITY & PROFILE ENDPOINTS ---

// API NODE: Verify Principal Administrative Credentials
app.post('/api/auth/admin-verify', (req, res) => {
    const { passphrase } = req.body;

    db.query('SELECT config_value FROM system_config WHERE config_key = "admin_passphrase" LIMIT 1', (err, results) => {
        if (err || !results || results.length === 0) {
            console.error('Database security read exception:', err?.message);
            return res.status(500).json({ success: false, message: 'Security layer database error. Make sure the table exists.' });
        }

        if (passphrase === results[0].config_value) {
            return res.json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid Administrative Credentials.' });
        }
    });
});

// API NODE: Update/Rotate Master Administrative Passphrase
app.post('/api/auth/admin-update-password', (req, res) => {
    const { currentPassphrase, newPassphrase } = req.body;

    // Verify current password first to authorize rotation
    db.query('SELECT config_value FROM system_config WHERE config_key = "admin_passphrase" LIMIT 1', (err, results) => {
        if (err || !results || results.length === 0 || currentPassphrase !== results[0].config_value) {
            return res.status(401).json({ success: false, message: 'Authorization failed. Current passphrase incorrect.' });
        }

        // Proceed with updates
        db.query('UPDATE system_config SET config_value = ? WHERE config_key = "admin_passphrase"', [newPassphrase], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ success: false, message: 'Failed to write new authorization state to database.' });
            }
            res.json({ success: true, message: 'Passphrase rotated successfully in SQL registry.' });
        });
    });
});


// --- ANNUAL MESSAGE BROADCAST ENDPOINTS ---

// API NODE: Fetch Current End of Year Message
app.get('/api/config/year-message', (req, res) => {
    db.query('SELECT config_value FROM system_config WHERE config_key = "principal_year_message" LIMIT 1', (err, results) => {
        if (err || !results || results.length === 0) {
            return res.json({ success: true, message: "Welcome to a new academic season." });
        }
        res.json({ success: true, message: results[0].config_value });
    });
});

// API NODE: Update End of Year Message
app.post('/api/config/update-year-message', (req, res) => {
    const { messageContent } = req.body;

    db.query('UPDATE system_config SET config_value = ? WHERE config_key = "principal_year_message"', [messageContent], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to update message in database pool.' });
        }
        res.json({ success: true, message: 'Principal end-year memo synchronized successfully.' });
    });
});


// --- TERMINAL STARTUP RUNNER LOOP ---
app.listen(PORT, () => {
    console.log(`🚀 STC Core Engine Running seamlessly on: http://localhost:${PORT}`);
});