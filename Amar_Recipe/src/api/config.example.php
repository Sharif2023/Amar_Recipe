<?php
/**
 * Database Configuration Template
 * 
 * This file serves as a template for config.php
 * Copy this to config.php and update with your actual credentials
 * NEVER commit config.php with real credentials to version control!
 */

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 1 for local development, 0 for production

// ==========================================
// DATABASE CONFIGURATION
// ==========================================

// For LOCAL DEVELOPMENT (XAMPP/WAMP):
// define('DB_HOST', 'localhost');
// define('DB_USER', 'root');
// define('DB_PASS', '');
// define('DB_NAME', 'amar_recipe');
// define('DB_PORT', 3306);

// For PRODUCTION (Byethost):
define('DB_HOST', 'sql212.byethost7.com');
define('DB_USER', 'b7_40426674');
define('DB_PASS', 'YOUR_PASSWORD_HERE'); // CHANGE THIS!
define('DB_NAME', 'b7_40426674_amar_recipe');
define('DB_PORT', 3306);

// ==========================================
// BASE URLs
// ==========================================

// For LOCAL DEVELOPMENT:
// define('BASE_URL', 'http://localhost/Amar_Recipies_Live/Amar_Recipe/');
// define('API_BASE_URL', BASE_URL . 'src/api/');

// For PRODUCTION (Byethost):
define('BASE_URL', 'https://amar-recipe.byethost7.com/');
define('API_BASE_URL', BASE_URL . 'src/api/');

// ==========================================
// CORS CONFIGURATION
// ==========================================
function setCorsHeaders() {
    // Allow requests from any origin (you can restrict this to your Vercel domain for security)
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    
    // Allow specific HTTP methods
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    
    // Allow specific headers
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
    
    // Allow credentials
    header('Access-Control-Allow-Credentials: true');
    
    // Cache preflight requests for 1 hour
    header('Access-Control-Max-Age: 3600');
    
    // Set content type
    header('Content-Type: application/json; charset=utf-8');
    
    // Additional headers for compatibility
    header('Access-Control-Expose-Headers: Content-Length, X-JSON');
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// ==========================================
// DATABASE CONNECTION
// ==========================================
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
