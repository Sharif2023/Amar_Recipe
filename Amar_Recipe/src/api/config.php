<?php
/**
 * Database Configuration for Byethost Hosting
 * CRITICAL: CORS headers must be set BEFORE any output
 */

// CORS MUST BE FIRST - Before any other output
// Handle OPTIONS request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

// Set CORS headers for all requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Database Configuration
define('DB_HOST', 'sql212.byethost7.com');
define('DB_USER', 'b7_40426674');
define('DB_PASS', 'Sharif2025');
define('DB_NAME', 'b7_40426674_amar_recipe');
define('DB_PORT', 3306);

// Base URLs
define('BASE_URL', 'https://amar-recipe.byethost7.com/');
define('API_BASE_URL', BASE_URL . 'src/api/');

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
    
    $conn->set_charset('utf8mb4');
    return $conn;
}
?>
