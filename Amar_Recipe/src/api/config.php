<?php
// Database Configuration for InfinityFree Hosting

error_reporting(E_ALL);
ini_set('display_errors', 1);

$db_host = 'sql102.infinityfree.com';
$db_username = 'if0_39569251';
$db_password = 'Sharifcse2025';
$db_name = 'if0_39569251_amar_recipe';

$conn = new mysqli($db_host, $db_username, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");
?>
