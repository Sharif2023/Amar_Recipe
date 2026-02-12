-- Amar Recipe Database Schema for PostgreSQL
-- Compatible with Render PostgreSQL Free Tier
-- Converted from MySQL schema

-- =============================================
-- Drop existing tables if they exist (careful!)
-- =============================================
DROP TABLE IF EXISTS admin_chat_messages CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS submission_requests CASCADE;
DROP TABLE IF EXISTS recipe_submission_requests CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS admin_requests CASCADE;

-- =============================================
-- Table: recipes
-- Stores all approved recipes
-- =============================================
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    location VARCHAR(255) NOT NULL,
    organizerName VARCHAR(255) NOT NULL,
    organizerEmail VARCHAR(255) NOT NULL,
    organizerAddress VARCHAR(255) NOT NULL,
    source VARCHAR(100),
    tags VARCHAR(255),
    reference VARCHAR(255),
    tutorialVideo VARCHAR(255),
    comment TEXT,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    ratingCount INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category ON recipes(category);
CREATE INDEX idx_created ON recipes(created_at);

-- =============================================
-- Table: recipe_submission_requests
-- Stores recipe submission requests pending admin approval
-- =============================================
CREATE TABLE recipe_submission_requests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    location VARCHAR(255),
    organizerName VARCHAR(255),
    organizerEmail VARCHAR(255),
    organizerAddress VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    tags TEXT,
    reference VARCHAR(255),
    tutorialVideo VARCHAR(255),
    comment TEXT,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_name VARCHAR(100) DEFAULT NULL,
    approved_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_status ON recipe_submission_requests(status);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipe_submission_requests_updated_at BEFORE UPDATE
    ON recipe_submission_requests FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table: admin_requests
-- Stores admin signup requests and approved admins
-- =============================================
CREATE TABLE admin_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    date TIMESTAMP,
    area VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    postcode VARCHAR(20),
    experience INTEGER,
    specialty VARCHAR(100),
    portfolio TEXT,
    certification TEXT,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    comment TEXT,
    admin_name VARCHAR(100) DEFAULT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON admin_requests(email);
CREATE INDEX idx_admin_status ON admin_requests(status);

-- =============================================
-- Table: reports
-- Stores user reports for recipes
-- =============================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    reasons TEXT NOT NULL,
    other_reason TEXT,
    reporter_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved'))
);

CREATE INDEX idx_recipe ON reports(recipe_id);
CREATE INDEX idx_report_status ON reports(status);

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE
    ON reports FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table: ratings
-- Stores user ratings for recipes
-- =============================================
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recipe_id, email),
    CONSTRAINT fk_ratings_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE INDEX idx_rating_recipe ON ratings(recipe_id);

-- =============================================
-- Table: admin_chat_messages
-- Stores chat messages between admins
-- =============================================
CREATE TABLE admin_chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES admin_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES admin_requests(id) ON DELETE CASCADE
);

CREATE INDEX idx_sender ON admin_chat_messages(sender_id);
CREATE INDEX idx_receiver ON admin_chat_messages(receiver_id);
CREATE INDEX idx_conversation ON admin_chat_messages(sender_id, receiver_id);

-- =============================================
-- Sample Data (Optional - Remove if not needed)
-- =============================================
-- Insert a root admin (Change email and password as needed)
-- Password: admin123 (hashed with PASSWORD_DEFAULT)
-- Sample Data REMOVED to avoid conflict with imported data
-- INSERT INTO admin_requests (name, phone, email, date, city, state, password, status) VALUES
-- ('Root Admin', '01700000000', 'admin@amarrecipe.com', CURRENT_TIMESTAMP, 'Dhaka', 'Bangladesh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'approved');

-- =============================================
-- Database Setup Complete
-- =============================================
