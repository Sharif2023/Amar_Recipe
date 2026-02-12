<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    $stmt = $conn->query("SELECT COUNT(*) as count FROM submission_requests WHERE status = 'Pending'");
    $row = $stmt->fetch();

    echo json_encode(['success' => true, 'count' => (int)$row['count']]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
