<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$comment = $data['comment'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing submission ID']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("UPDATE recipe_submission_requests SET status = 'rejected', comment = :comment, approved_at = NOW() WHERE id = :id");
$stmt->execute([':comment' => $comment, ':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Submission rejected']);
