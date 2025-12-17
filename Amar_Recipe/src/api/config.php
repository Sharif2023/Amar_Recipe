<?php
/**
 * Database Configuration for Byethost Hosting
 * 
 * This file contains database connection settings.
 * For local development, modify these values accordingly.
 */

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 for production

// Database Configuration
define('DB_HOST', 'sql212.byethost7.com');
define('DB_USER', 'b7_40426674');
define('DB_PASS', 'Sharif2025');
define('DB_NAME', 'b7_40426674_amar_recipe');
define('DB_PORT', 3306);

// Base URL for the API (used for image paths, etc.)
define('BASE_URL', 'https://amar-recipe.byethost7.com/');
define('API_BASE_URL', BASE_URL . 'src/api/');

// CORS Configuration
function setCorsHeaders() {
    // Allow requests from any origin (you can restrict this to your Vercel domain for security)
    header('Access-Control-Allow-Origin: *');
    
    // Allow specific HTTP methods
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    
    // Allow specific headers
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    
    // Allow credentials
    header('Access-Control-Allow-Credentials: true');
    
    // Cache preflight requests for 1 hour
    header('Access-Control-Max-Age: 3600');
    
    // Set content type
    header('Content-Type: application/json');
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Database Connection Function
function getDbConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Database connection failed: ' . $conn->connect_error
        ]);
        exit();
    }
    
    // Set charset to utf8mb4 for better emoji and character support
    $conn->set_charset('utf8mb4');
    
    return $conn;
}

// Initialize CORS headers for all API requests
setCorsHeaders();
?>
