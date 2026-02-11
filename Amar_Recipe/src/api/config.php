<?php
/**
 * Database Configuration for Production (Railway) and Local Development
 * CORS headers MUST be first - before any output
 */

// Define allowed origins
$envOrigin = rtrim(getenv('ALLOWED_ORIGIN') ?: '', '/');

// Get the request origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Handle CORS
if ($envOrigin === '*') {
    // Allow all origins
    header("Access-Control-Allow-Origin: *");
} else {
    $allowedOrigins = [
        $envOrigin ?: 'https://amar-recipe.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ];

    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
    }
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
// For Render (Production): Uses PostgreSQL via DATABASE_URL
// For Local Development: Falls back to localhost MySQL
$databaseUrl = getenv('DATABASE_URL');
$isRender = getenv('RENDER') === 'true' || $databaseUrl;

if ($databaseUrl) {
    // Parse the DATABASE_URL into components
    // Format: postgresql://user:password@host:port/dbname
    $dbParts = parse_url($databaseUrl);
    define('DB_HOST', $dbParts['host'] ?? 'localhost');
    define('DB_PORT', $dbParts['port'] ?? 5432);
    define('DB_USER', $dbParts['user'] ?? '');
    define('DB_PASS', $dbParts['pass'] ?? '');
    define('DB_NAME', ltrim($dbParts['path'] ?? '/amar_recipe', '/'));
} else {
    // Local development defaults
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_PORT', getenv('DB_PORT') ?: 3306);
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASS') ?: '');
    define('DB_NAME', getenv('DB_NAME') ?: 'amar_recipe');
}

define('DB_TYPE', $isRender ? 'pgsql' : 'mysql');

// ==========================================
// BASE URLs
// ==========================================
if ($isRender) {
    // Render uses RENDER_EXTERNAL_URL or we can construct it
    $renderUrl = getenv('RENDER_EXTERNAL_URL') ?: 'https://' . getenv('RENDER_EXTERNAL_HOSTNAME');
    define('BASE_URL', $renderUrl . '/');
} else {
    // Local development
    define('BASE_URL', 'http://localhost/Amar_Recipies_Live/Amar_Recipe/');
}
define('API_BASE_URL', BASE_URL . 'src/api/');

// Database Connection Function
function getDbConnection() {
    try {
        if (DB_TYPE === 'pgsql') {
            // PostgreSQL connection for Render
            $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
            return $pdo;
        } else {
            // MySQL connection for local development
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
            
            if ($conn->connect_error) {
                throw new Exception('Database connection failed: ' . $conn->connect_error);
            }
            
            $conn->set_charset('utf8mb4');
            return $conn;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed',
            'error' => $e->getMessage()
        ]);
        exit();
    }
}
?>

