<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    // Only show verified submissions to admin
    try {
        $stmt = $conn->query("SELECT * FROM submission_requests WHERE status = 'Pending' AND is_verified = TRUE ORDER BY submission_date DESC");
    } catch (Throwable $e) {
        $stmt = $conn->query("SELECT * FROM submission_requests WHERE status = 'Pending' AND is_verified = TRUE ORDER BY created_at DESC");
    }
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'requests' => $requests]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
