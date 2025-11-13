<?php
// Database Configuration File
// This file manages database connections for both development and production environments

// Determine environment (development or production)
$environment = getenv('ENVIRONMENT') ?: 'development';

if ($environment === 'production') {
    // InfinityFree Production Database Credentials
    $db_host = 'sql102.infinityfree.com';
    $db_username = 'if0_39569251';
    $db_password = 'Sharifcse2025';
    $db_name = 'if0_39569251_amar_recipe';
} else {
    // Local Development Database Credentials
    $db_host = 'localhost';
    $db_username = 'root';
    $db_password = '';
    $db_name = 'amar_recipe';
}

// Create connection
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

// Set charset to utf8mb4 for proper Bengali character support
$conn->set_charset("utf8mb4");

?>
