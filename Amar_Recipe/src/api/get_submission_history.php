<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    $stmt = $conn->query("SELECT * FROM submission_requests WHERE status != 'Pending' ORDER BY action_date DESC");
    $history = $stmt->fetchAll();

    echo json_encode(['success' => true, 'history' => $history]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}

