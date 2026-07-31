const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves static files dari folder public

// --- CLEANUP FUNCTION (Dijalankan secara async latar belakang) ---
function cleanDuplicateNotices() {
    db.query(`
        DELETE FROM notices a
        USING notices b
        WHERE a.id < b.id 
          AND a.title = b.title;
    `)
    .then(() => console.log('🧹 Duplicate notices cleaned up.'))
    .catch((err) => console.log('⚠️ Cleanup skipped (Table might not exist yet):', err.message));
}

// --- 1. GET ALL PORTAL DATA ---
app.get('/api/portal-data', async (req, res) => {
    try {
        const services = await db.query('SELECT * FROM services ORDER BY id');
        const notices = await db.query(`
            SELECT DISTINCT ON (title) * 
            FROM notices 
            WHERE is_active = TRUE 
            ORDER BY title, created_at DESC
        `);
        const submissions = await db.query('SELECT * FROM submissions ORDER BY created_at DESC');

        res.json({
            services: services.rows,
            notices: notices.rows,
            submissions: submissions.rows
        });
    } catch (err) {
        console.error('Portal Data Error:', err.message);
        res.status(500).json({ error: 'Database server error' });
    }
});

// --- 2. GET NOTICES ONLY ---
app.get('/api/notices', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT DISTINCT ON (title) * 
            FROM notices 
            WHERE is_active = TRUE 
            ORDER BY title, created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch Notices Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
});

// --- 3. CREATE NOTICE ---
app.post('/api/notices', async (req, res) => {
    const { unit, title, description } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO notices (unit, title, description) VALUES ($1, $2, $3) RETURNING *',
            [unit || 'Umum', title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. DELETE NOTICE ---
app.delete('/api/notices/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM notices WHERE id = $1', [req.params.id]);
        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5. CREATE SUBMISSION ---
app.post('/api/submissions', async (req, res) => {
    const { type, name, email, target_unit, subject, detail } = req.body;
    const prefix = type === 'ICT Ticket' ? '#TK-A22-' : type === 'Laporan Hazard' ? '#HZ-A8-' : '#INQ-';
    const ref_id = prefix + Math.floor(1000 + Math.random() * 9000);

    try {
        const result = await db.query(
            `INSERT INTO submissions (ref_id, type, reporter_name, reporter_email, target_unit, subject, detail) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [ref_id, type || 'Pertanyaan', name, email || '', target_unit || '', subject || '', detail]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 6. DELETE / RESOLVE SUBMISSION ---
app.delete('/api/submissions/:ref_id', async (req, res) => {
    try {
        await db.query('DELETE FROM submissions WHERE ref_id = $1', [req.params.ref_id]);
        res.json({ message: 'Submission resolved/deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 7. UPDATE SERVICES STATUS ---
app.post('/api/services', async (req, res) => {
    const { services } = req.body;
    try {
        if (Array.isArray(services)) {
            for (const service of services) {
                if (service.id) {
                    await db.query('UPDATE services SET status = $1 WHERE id = $2', [service.status, service.id]);
                } else if (service.name) {
                    await db.query('UPDATE services SET status = $1 WHERE name = $2', [service.status, service.name]);
                }
            }
        }
        res.json({ message: 'Statuses updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- START SERVER ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Run cleanup in background silently
    setTimeout(cleanDuplicateNotices, 3000);
});
