<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    $token = getRequestAuthToken();

    if ($token) {
        $stmt = $conn->prepare("DELETE FROM user_sessions WHERE token_hash = :token_hash");
        $stmt->execute([':token_hash' => hash('sha256', $token)]);
    }

    echo json_encode(['success' => true, 'message' => 'Logged out.']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Logout failed: ' . $e->getMessage()]);
}
