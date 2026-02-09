<?php
/**
 * Database Configuration for Production (Railway) and Local Development
 * CORS headers MUST be first - before any output
 */

// Define allowed origins
$allowedOrigins = [
    getenv('ALLOWED_ORIGIN') ?: 'https://amar-recipe.vercel.app', // Railway env variable or default
    'http://localhost:5173', // Local Vite dev server
    'http://localhost:3000'  // Alternative local port
];

// Get the request origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Default to first allowed origin (production)
    header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
}

// Handle OPTIONS preflight request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

// Set CORS headers for all other requests
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Content-Type: application/json; charset=utf-8');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// ==========================================
// DATABASE CONFIGURATION
// ==========================================
// For Railway (Production): Uses environment variables
// For Local Development: Falls back to localhost
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'amar_recipe');
define('DB_PORT', getenv('DB_PORT') ?: 3306);

// ==========================================
// BASE URLs
// ==========================================
// For Railway: Uses RAILWAY_PUBLIC_DOMAIN environment variable
// For Local: Falls back to localhost
$isRailway = getenv('RAILWAY_PUBLIC_DOMAIN');
if ($isRailway) {
    define('BASE_URL', 'https://' . getenv('RAILWAY_PUBLIC_DOMAIN') . '/');
} else {
    define('BASE_URL', 'http://localhost/Amar_Recipies_Live/Amar_Recipe/');
}
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

