<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$reason = $data['reason'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing submission ID']);
    exit;
}

try {
    $conn = getDbConnection();
    $admin_name = $data['admin_name'] ?? 'Admin';
    $stmt = $conn->prepare("UPDATE submission_requests SET status = 'Rejected', comment = :reason, action_date = NOW(), admin_name = :admin_name WHERE id = :id");
    $stmt->execute([':reason' => $reason, ':id' => $id, ':admin_name' => $admin_name]);

    echo json_encode(['success' => true, 'message' => 'Submission rejected']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Rejection failed: ' . $e->getMessage()]);
}

