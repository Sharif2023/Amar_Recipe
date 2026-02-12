<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    // Try with submission_date (correct schema)
    try {
        $stmt = $conn->query("SELECT * FROM submission_requests WHERE status = 'Pending' ORDER BY submission_date DESC");
    } catch (Throwable $e) {
        // Fallback to created_at (old/simplified schema)
        $stmt = $conn->query("SELECT * FROM submission_requests WHERE status = 'Pending' ORDER BY created_at DESC");
    }
    $requests = $stmt->fetchAll();

    echo json_encode(['success' => true, 'requests' => $requests]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
