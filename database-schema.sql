-- ============================================
-- Student Management System - Database Schema
-- Database: student-management
-- Schema: public
-- ============================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS student_subjects CASCADE;
DROP TABLE IF EXISTS lecturer_subjects CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLE (Parent table for all users)
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'LECTURER', 'STUDENT')),
    mobile_no VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    user_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. ADMINS TABLE (Inherits from users)
-- ============================================
CREATE TABLE admins (
    id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255)
);

-- ============================================
-- 3. LECTURERS TABLE (Inherits from users)
-- ============================================
CREATE TABLE lecturers (
    id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    lecturer_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- ============================================
-- 4. SUBJECTS TABLE (Independent table)
-- ============================================
CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. LECTURER_SUBJECTS (Many-to-Many relationship)
--    One lecturer can teach up to 3 subjects
-- ============================================
CREATE TABLE lecturer_subjects (
    id BIGSERIAL PRIMARY KEY,
    lecturer_id BIGINT NOT NULL REFERENCES lecturers(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lecturer_id, subject_id)
);

-- ============================================
-- 6. STUDENTS TABLE (Inherits from users)
-- ============================================
CREATE TABLE students (
    id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE
);

-- ============================================
-- 7. STUDENT_SUBJECTS (Many-to-Many relationship)
--    One student can enroll in up to 5 subjects
-- ============================================
CREATE TABLE student_subjects (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id)
);

-- ============================================
-- CREATE INDEXES for better query performance
-- ============================================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_lecturer_subjects_lecturer ON lecturer_subjects(lecturer_id);
CREATE INDEX idx_lecturer_subjects_subject ON lecturer_subjects(subject_id);
CREATE INDEX idx_student_subjects_student ON student_subjects(student_id);
CREATE INDEX idx_student_subjects_subject ON student_subjects(subject_id);

-- ============================================
-- CONSTRAINTS to enforce business rules
-- ============================================

-- Constraint: Lecturer can teach maximum 3 subjects
CREATE OR REPLACE FUNCTION check_lecturer_subject_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM lecturer_subjects WHERE lecturer_id = NEW.lecturer_id) >= 3 THEN
        RAISE EXCEPTION 'Lecturer can only be assigned to a maximum of 3 subjects';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_lecturer_subject_limit
BEFORE INSERT ON lecturer_subjects
FOR EACH ROW
EXECUTE FUNCTION check_lecturer_subject_limit();

-- Constraint: Student can enroll in maximum 5 subjects
CREATE OR REPLACE FUNCTION check_student_subject_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM student_subjects WHERE student_id = NEW.student_id) >= 5 THEN
        RAISE EXCEPTION 'Student can only be enrolled in a maximum of 5 subjects';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_student_subject_limit
BEFORE INSERT ON student_subjects
FOR EACH ROW
EXECUTE FUNCTION check_student_subject_limit();

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert Admin user
-- Password: maysaraAdmin (hashed with BCrypt)
INSERT INTO users (name, username, password, role, is_active, user_type) VALUES
('System Admin', 'maysaracs1001@gmail.com', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'ADMIN', TRUE, 'ADMIN');

INSERT INTO admins (id, email, oauth_provider, oauth_id) VALUES
((SELECT id FROM users WHERE username = 'maysaracs1001@gmail.com'), 'maysaracs1001@gmail.com', 'SIMPLE_AUTH', 'maysaracs1001@gmail.com');

-- Insert 7 Lecturers
-- Password for all: password123 (hashed with BCrypt)
INSERT INTO users (name, username, password, role, mobile_no, is_active, user_type) VALUES
('Dr. Ahmed Hassan', 'ahmed.hassan', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'LECTURER', '1234567890', TRUE, 'LECTURER'),
('Dr. Fatima Ali', 'fatima.ali', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'LECTURER', '1234567891', TRUE, 'LECTURER'),
('Dr. Mohammed Khan', 'mohammed.khan', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'LECTURER', '1234567892', TRUE, 'LECTURER'),
('Dr. Sarah Ahmed', 'sarah.ahmed', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'LECTURER', '1234567893', TRUE, 'LECTURER'),
('Dr. Omar Abdullah', 'omar.abdullah', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'LECTURER', '1234567894', TRUE, 'LECTURER'),
('Dr. Layla Ibrahim', 'layla.ibrahim', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'LECTURER', '1234567895', TRUE, 'LECTURER'),
('Dr. Yusuf Mansoor', 'yusuf.mansoor', '$2a$10$rN8kYc8vGvJH5K5aE.xB2OwZlQYkR3XKj9vxYqKZ7YzVqQ8H7Ew3K', 'LECTURER', '1234567896', TRUE, 'LECTURER');

INSERT INTO lecturers (id, lecturer_id, department, email) VALUES
((SELECT id FROM users WHERE username = 'ahmed.hassan'), 'LEC001', 'Computer Science', 'ahmed.hassan@university.edu'),
((SELECT id FROM users WHERE username = 'fatima.ali'), 'LEC002', 'Mathematics', 'fatima.ali@university.edu'),
((SELECT id FROM users WHERE username = 'mohammed.khan'), 'LEC003', 'Physics', 'mohammed.khan@university.edu'),
((SELECT id FROM users WHERE username = 'sarah.ahmed'), 'LEC004', 'Chemistry', 'sarah.ahmed@university.edu'),
((SELECT id FROM users WHERE username = 'omar.abdullah'), 'LEC005', 'Engineering', 'omar.abdullah@university.edu'),
((SELECT id FROM users WHERE username = 'layla.ibrahim'), 'LEC006', 'Business Administration', 'layla.ibrahim@university.edu'),
((SELECT id FROM users WHERE username = 'yusuf.mansoor'), 'LEC007', 'Literature', 'yusuf.mansoor@university.edu');

-- Insert Sample Subjects
INSERT INTO subjects (subject_name, subject_code) VALUES
('Data Structures', 'CS101'),
('Algorithms', 'CS102'),
('Database Systems', 'CS201'),
('Web Development', 'CS202'),
('Calculus I', 'MATH101'),
('Linear Algebra', 'MATH102'),
('Physics I', 'PHY101'),
('Organic Chemistry', 'CHEM101'),
('Engineering Drawing', 'ENG101'),
('Business Management', 'BUS101');

-- Assign 2 subjects to Dr. Ahmed Hassan (Computer Science)
INSERT INTO lecturer_subjects (lecturer_id, subject_id) VALUES
((SELECT id FROM lecturers WHERE lecturer_id = 'LEC001'), (SELECT id FROM subjects WHERE subject_code = 'CS101')),
((SELECT id FROM lecturers WHERE lecturer_id = 'LEC001'), (SELECT id FROM subjects WHERE subject_code = 'CS102'));

-- Assign 1 subject to Dr. Fatima Ali (Mathematics)
INSERT INTO lecturer_subjects (lecturer_id, subject_id) VALUES
((SELECT id FROM lecturers WHERE lecturer_id = 'LEC002'), (SELECT id FROM subjects WHERE subject_code = 'MATH101'));

-- ============================================
-- USEFUL QUERIES FOR TESTING
-- ============================================

-- View all lecturers with their subjects
SELECT 
    u.name AS lecturer_name,
    l.lecturer_id,
    l.department,
    s.subject_name,
    s.subject_code
FROM users u
JOIN lecturers l ON u.id = l.id
LEFT JOIN lecturer_subjects ls ON l.id = ls.lecturer_id
LEFT JOIN subjects s ON ls.subject_id = s.id
WHERE u.role = 'LECTURER'
ORDER BY u.name, s.subject_name;

-- View all students with their subjects
SELECT 
    u.name AS student_name,
    st.student_id,
    st.faculty,
    s.subject_name,
    s.subject_code
FROM users u
JOIN students st ON u.id = st.id
LEFT JOIN student_subjects ss ON st.id = ss.student_id
LEFT JOIN subjects s ON ss.subject_id = s.id
WHERE u.role = 'STUDENT'
ORDER BY u.name, s.subject_name;

-- Count subjects assigned to each lecturer
SELECT 
    u.name AS lecturer_name,
    l.lecturer_id,
    COUNT(ls.subject_id) AS subject_count
FROM users u
JOIN lecturers l ON u.id = l.id
LEFT JOIN lecturer_subjects ls ON l.id = ls.lecturer_id
WHERE u.role = 'LECTURER'
GROUP BY u.name, l.lecturer_id
ORDER BY subject_count DESC;

-- Find students enrolled in a specific subject
SELECT 
    s.subject_name,
    s.subject_code,
    u.name AS student_name,
    st.student_id
FROM subjects s
LEFT JOIN student_subjects ss ON s.id = ss.subject_id
LEFT JOIN students st ON ss.student_id = st.id
LEFT JOIN users u ON st.id = u.id
WHERE s.subject_code = 'CS101'
ORDER BY u.name;

COMMIT;