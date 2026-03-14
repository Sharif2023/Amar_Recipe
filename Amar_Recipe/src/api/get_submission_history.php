<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    // Try with action_date
    try {
        $stmt = $conn->query("SELECT * FROM submission_requests WHERE status != 'Pending' ORDER BY action_date DESC");
    } catch (Throwable $e) {
        // Fallback to created_at
        $stmt = $conn->query("SELECT * FROM submission_requests WHERE status != 'Pending' ORDER BY created_at DESC");
    }
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'history' => $history]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}

