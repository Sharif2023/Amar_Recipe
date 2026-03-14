<?php
header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/config.php';
    
    echo json_encode([
        'success' => true,
        'message' => 'config.php loaded successfully',
        'db_type' => defined('DB_TYPE') ? DB_TYPE : 'undefined',
        'environment' => [
            'RENDER' => getenv('RENDER'),
            'DATABASE_URL' => strlen(getenv('DATABASE_URL')) > 0 ? 'SET' : 'NOT_SET'
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>
