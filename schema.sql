-- Enable UUID extension for unique reference IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- 1. SERVICES TABLE (Status indicator for Portal)
-- ========================================================
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Beroperasi', -- 'Beroperasi', 'Penyelenggaraan', 'Gangguan'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 2. NOTICES TABLE (Announcements for Portal)
-- ========================================================
CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY,
    unit VARCHAR(100) NOT NULL,                      -- e.g., 'KKP - Aras 8', 'ICT - Aras 22'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 3. SUBMISSIONS TABLE (Tickets, Hazards, Inquiries)
-- ========================================================
CREATE TABLE IF NOT EXISTS submissions (
    ref_id VARCHAR(50) PRIMARY KEY,                   -- e.g., '#PT-A22-1001'
    type VARCHAR(50) NOT NULL,                        -- 'Pertanyaan', 'ICT Ticket', 'Laporan Hazard'
    target_unit VARCHAR(150),                         -- Matches 'Tujuan Pertanyaan' (e.g., 'ICT - Aras 22')
    subject VARCHAR(255),                             -- Matches 'Perkara / Tajuk'
    reporter_name VARCHAR(150) NOT NULL,              -- Matches 'Nama Pemohon'
    reporter_email VARCHAR(150),                      -- Matches 'Emel Korporat'
    detail TEXT NOT NULL,                             -- Matches 'Mesej / Detail Pertanyaan'
    reply_text TEXT,                                  -- Admin reply message
    status VARCHAR(50) DEFAULT 'Baru',                -- 'Baru', 'Proses', 'Selesai'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safe Index Creation
CREATE INDEX IF NOT EXISTS idx_notices_active ON notices(is_active);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================
INSERT INTO services (id, name, status) VALUES
('wifi', 'Rangkaian Wi-Fi Menara (YSG-STAFF)', 'Beroperasi'),
('email', 'Pelayan E-Mel Korporat (Microsoft Exchange)', 'Beroperasi'),
('alarm', 'Sistem Penggera Kecemasan & Lif Menara', 'Beroperasi'),
('erp', 'Sistem ERP Intranet', 'Penyelenggaraan')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notices (unit, title, description) VALUES
('KKP - Aras 8', 'Latihan Evakuasi Kebakaran Menara Tun Mustapha', 'Akan dijalankan pada bulan hadapan. Sila semak Pegawai Insiden lantai anda.'),
('ICT - Aras 22', 'Peringatan: Amaran Phishing E-Mel Kewangan', 'Jangan klik pautan luar yang meminta nama pengguna & kata laluan.')
ON CONFLICT DO NOTHING;

INSERT INTO submissions (ref_id, type, target_unit, subject, reporter_name, reporter_email, detail, status) VALUES
('#PT-A22-1001', 'Pertanyaan', 'ICT (Aras 22) - Sistem / Perkakasan / Wi-Fi', 'Masalah Akses Portal Intranet', 'Mohd Faizal', 'faizal@sabah.gov.my', 'Saya tidak dapat membina akaun baru dalam portal.', 'Baru'),
('#TK-A22-9102', 'ICT Ticket', 'ICT - Aras 22', 'Masalah Wi-Fi', 'Ahmad Razali', 'ahmad@sabah.gov.my', 'Aras 12 - Laptop tidak dapat sambung Wi-Fi', 'Baru'),
('#HZ-A8-3011', 'Laporan Hazard', 'KKP - Aras 8', 'Tumpahan Cecair', 'Siti Sarah', 'siti@sabah.gov.my', 'Aras 8 - Tumpahan cecair berhampiran pantry', 'Baru')
ON CONFLICT (ref_id) DO NOTHING;