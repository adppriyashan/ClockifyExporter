const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const API_KEY_FILE = path.join(__dirname, 'api_key.txt');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Get API Key
app.get('/api/key', (req, res) => {
    try {
        if (fs.existsSync(API_KEY_FILE)) {
            const apiKey = fs.readFileSync(API_KEY_FILE, 'utf-8').trim();
            res.json({ apiKey });
        } else {
            res.json({ apiKey: '' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to read API key' });
    }
});

// Save API Key
app.post('/api/key', (req, res) => {
    try {
        const { apiKey } = req.body;
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }
        fs.writeFileSync(API_KEY_FILE, apiKey.trim(), 'utf-8');
        res.json({ success: true, message: 'API key saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save API key' });
    }
});

// Delete API Key
app.delete('/api/key', (req, res) => {
    try {
        if (fs.existsSync(API_KEY_FILE)) {
            fs.unlinkSync(API_KEY_FILE);
        }
        res.json({ success: true, message: 'API key deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete API key' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Clockify Exporter server running at http://localhost:${PORT}`);
    console.log(`📁 API key will be saved to: ${API_KEY_FILE}`);
});
