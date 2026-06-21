-- ==========================================================================
-- SPIRITANS TECHNICAL COLLEGE - PRODUCTION SYSTEM SCHEMAS
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS stc_college_db;
USE stc_college_db;

-- 1. COURSE REGISTRATION APPLICATIONS REGISTRY
CREATE TABLE IF NOT EXISTS student_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. SECURE PORTAL USER PROFILES
CREATE TABLE IF NOT EXISTS portal_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('student', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Populate seed administrative profiles for verification checking
INSERT INTO portal_users (username, password_hash, user_role) 
VALUES 
('STC/DICT/2026/001', '$2b$10$SampleHashForStudentDemoPurposeOnly', 'student'),
('registrar@spiritanstechnical.ac.ke', '$2b$10$SampleHashForStaffDemoPurposeOnly', 'staff')
ON DUPLICATE KEY UPDATE username=username;