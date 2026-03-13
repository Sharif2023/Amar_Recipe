<?php
/**
 * Database Configuration for Production and Local Development
 * CORS headers MUST be first - before any output
 */

// Define allowed origins
$envOrigin = rtrim(getenv('ALLOWED_ORIGIN') ?: '', '/');

// Get the request origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Handle CORS
if ($envOrigin === '*') {
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
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ==========================================
// DATABASE CONFIGURATION
// ==========================================
$databaseUrl = getenv('DATABASE_URL');
$dbTypeEnv = getenv('DB_TYPE');

if ($databaseUrl) {
    // Parse the DATABASE_URL into components
    $dbParts = parse_url($databaseUrl);
    define('DB_HOST', $dbParts['host'] ?? '');
    define('DB_PORT', $dbParts['port'] ?? 5432);
    define('DB_USER', $dbParts['user'] ?? '');
    define('DB_PASS', $dbParts['pass'] ?? '');
    define('DB_NAME', ltrim($dbParts['path'] ?? '/postgres', '/'));
    define('DB_TYPE', 'pgsql');
} else {
    define('DB_TYPE', $dbTypeEnv ?: 'mysql');
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_PORT', getenv('DB_PORT') ?: (DB_TYPE === 'pgsql' ? 5432 : 3306));
    define('DB_USER', getenv('DB_USER') ?: (DB_TYPE === 'pgsql' ? 'postgres' : 'root'));
    define('DB_PASS', getenv('DB_PASS') ?: '');
    define('DB_NAME', getenv('DB_NAME') ?: (DB_TYPE === 'pgsql' ? 'postgres' : 'amar_recipe'));
}

$isProduction = getenv('RENDER') === 'true' || $databaseUrl || DB_TYPE === 'pgsql';

// ==========================================
// BASE URLs
// ==========================================
if ($isProduction) {
    $renderUrl = getenv('RENDER_EXTERNAL_URL') ?: ('https://' . getenv('RENDER_EXTERNAL_HOSTNAME'));
    define('BASE_URL', $renderUrl ? rtrim($renderUrl, '/') . '/' : '/');
} else {
    define('BASE_URL', 'http://localhost/Amar_Recipies_Live/Amar_Recipe/');
}
define('API_BASE_URL', BASE_URL . 'src/api/');

/**
 * Database Connection Function
 */
function getDbConnection() {
    try {
        if (DB_TYPE === 'pgsql') {
            if (!extension_loaded('pdo_pgsql')) {
                throw new Exception("PHP extension 'pdo_pgsql' is not loaded on this server.");
            }
            $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";sslmode=require";
        } else {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        }
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 5
        ]);
        return $pdo;
    } catch (Exception $e) {
        error_log("Database connection failed: " . $e->getMessage());
        
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed. Check your environment variables.',
            'error' => $e->getMessage(),
            'debug_info' => [
                'db_type' => defined('DB_TYPE') ? DB_TYPE : 'not defined',
                'db_host' => defined('DB_HOST') ? DB_HOST : 'not defined',
                'db_port' => defined('DB_PORT') ? DB_PORT : 'not defined',
                'db_user' => defined('DB_USER') ? DB_USER : 'not defined',
                'db_name' => defined('DB_NAME') ? DB_NAME : 'not defined',
                'driver_loaded' => extension_loaded('pdo_pgsql') ? 'yes' : 'no'
            ]
        ]);
        exit();
    }
}
