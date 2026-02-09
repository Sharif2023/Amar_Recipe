<?php
/**
 * CORS Test File
 * This file helps diagnose CORS issues
 * Upload to: /htdocs/src/api/cors-test.php
 * Access at: https://amar-recipe.byethost7.com/src/api/cors-test.php
 */

// Set CORS headers manually
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 3600');
header('Content-Type: application/json; charset=utf-8');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Return diagnostic information
$response = [
    'success' => true,
    'message' => 'CORS is working!',
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
        'http_origin' => $_SERVER['HTTP_ORIGIN'] ?? 'not set',
        'cors_headers_sent' => true
    ],
    'headers_sent' => headers_list()
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
