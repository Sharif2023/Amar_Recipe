<?php
/**
 * Test Database Connection (Supabase/Production)
 */
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    
    // Simple query to check if we can reach the DB
    $stmt = $conn->query("SELECT current_user, current_database(), version()");
    $info = $stmt->fetch();
    
    echo json_encode([
        'success' => true,
        'message' => 'Connected successfully to ' . DB_TYPE,
        'db_info' => [
            'type' => DB_TYPE,
            'host' => DB_HOST,
            'database' => $info['current_database'] ?? 'unknown',
            'postgres_version' => $info['version'] ?? 'unknown'
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed',
        'error' => $e->getMessage()
    ]);
}
