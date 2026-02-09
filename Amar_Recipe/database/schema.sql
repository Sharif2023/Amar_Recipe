-- Amar Recipe Database Schema for Byethost Hosting
-- Database: b7_40426674_amar_recipe
-- Note: Byethost doesn't allow CREATE DATABASE, use phpMyAdmin to create the database

-- =============================================
-- Drop existing tables if they exist (careful!)
-- =============================================
DROP TABLE IF EXISTS `admin_chat_messages`;
DROP TABLE IF EXISTS `ratings`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `submission_requests`;
DROP TABLE IF EXISTS `recipe_submission_requests`;
DROP TABLE IF EXISTS `recipes`;
DROP TABLE IF EXISTS `admin_requests`;

-- =============================================
-- Table: recipes
-- Stores all approved recipes
-- =============================================
CREATE TABLE `recipes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `image_url` VARCHAR(255) DEFAULT NULL,
    `location` VARCHAR(255) NOT NULL,
    `organizerName` VARCHAR(255) NOT NULL,
    `organizerEmail` VARCHAR(255) NOT NULL,
    `organizerAddress` VARCHAR(255) NOT NULL,
    `source` VARCHAR(100),
    `tags` VARCHAR(255),
    `reference` VARCHAR(255),
    `tutorialVideo` VARCHAR(255),
    `comment` TEXT,
    `rating` DECIMAL(3, 1) DEFAULT 0.0,
    `ratingCount` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_category` (`category`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: recipe_submission_requests
-- Stores recipe submission requests pending admin approval
-- =============================================
CREATE TABLE `recipe_submission_requests` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100),
    `description` TEXT,
    `image` VARCHAR(255),
    `location` VARCHAR(255),
    `organizerName` VARCHAR(255),
    `organizerEmail` VARCHAR(255),
    `organizerAddress` VARCHAR(255),
    `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    `tags` TEXT,
    `reference` VARCHAR(255),
    `tutorialVideo` VARCHAR(255),
    `comment` TEXT,
    `source` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `admin_name` VARCHAR(100) DEFAULT NULL,
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admin_requests
-- Stores admin signup requests and approved admins
-- =============================================
CREATE TABLE `admin_requests` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `date` DATETIME,
    `area` VARCHAR(100),
    `city` VARCHAR(100),
    `state` VARCHAR(100),
    `postcode` VARCHAR(20),
    `experience` INT,
    `specialty` VARCHAR(100),
    `portfolio` TEXT,
    `certification` TEXT,
    `password` VARCHAR(255) NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    `comment` TEXT,
    `admin_name` VARCHAR(100) DEFAULT NULL,
    `profile_image` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: reports
-- Stores user reports for recipes
-- =============================================
CREATE TABLE `reports` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `recipe_id` INT NOT NULL,
    `reasons` TEXT NOT NULL,
    `other_reason` TEXT,
    `reporter_email` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `status` ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
    INDEX `idx_recipe` (`recipe_id`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: ratings
-- Stores user ratings for recipes
-- =============================================
CREATE TABLE `ratings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `recipe_id` INT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_rating` (`recipe_id`, `email`),
    INDEX `idx_recipe` (`recipe_id`),
    CONSTRAINT `fk_ratings_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admin_chat_messages
-- Stores chat messages between admins
-- =============================================
CREATE TABLE `admin_chat_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender_id` INT NOT NULL,
    `receiver_id` INT NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_sender` (`sender_id`),
    INDEX `idx_receiver` (`receiver_id`),
    INDEX `idx_conversation` (`sender_id`, `receiver_id`),
    CONSTRAINT `fk_sender` FOREIGN KEY (`sender_id`) REFERENCES `admin_requests`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `admin_requests`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Sample Data (Optional - Remove if not needed)
-- =============================================
-- Insert a root admin (Change email and password as needed)
-- Password: admin123 (hashed with PASSWORD_DEFAULT)
INSERT INTO `admin_requests` (`name`, `phone`, `email`, `date`, `city`, `state`, `password`, `status`) VALUES
('Root Admin', '01700000000', 'admin@amarrecipe.com', NOW(), 'Dhaka', 'Bangladesh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'approved');

-- =============================================
-- Database Setup Complete
-- =============================================
