<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    $user = getAuthenticatedUser($conn, true);
    echo json_encode([
        'success' => true,
        'user' => publicUserPayload($user),
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
