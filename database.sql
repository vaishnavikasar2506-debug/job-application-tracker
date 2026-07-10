-- =====================================================
-- DATABASE SETUP for Job Application Tracker
-- Run this once in phpMyAdmin (SQL tab) or MySQL CLI
-- =====================================================

CREATE DATABASE IF NOT EXISTS job_tracker;
USE job_tracker;

CREATE TABLE IF NOT EXISTS applications (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    company_name  VARCHAR(100) NOT NULL,
    job_role      VARCHAR(100) NOT NULL,
    status        ENUM('Applied', 'Interview', 'Offer', 'Rejected') DEFAULT 'Applied',
    deadline      DATE NULL,
    notes         TEXT NULL,
    is_favorite   TINYINT(1) DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A couple of sample rows so you have data to look at immediately
INSERT INTO applications (company_name, job_role, status, deadline, notes, is_favorite)
VALUES
('Google', 'SDE Intern', 'Applied', '2026-08-01', 'Referral from senior', 1),
('Microsoft', 'Frontend Intern', 'Interview', '2026-07-20', 'Round 1 cleared', 0);
