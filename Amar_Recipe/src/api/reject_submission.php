<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$reason = $data['reason'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing submission ID']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("UPDATE submission_requests SET status = 'Rejected', comment = :reason WHERE id = :id");
$stmt->execute([':reason' => $reason, ':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Submission rejected']);
