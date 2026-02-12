<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$status = $data['status'] ?? '';
$comment = $data['comment'] ?? '';

if (empty($id) || empty($status)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("UPDATE admin_requests SET status = :status, comment = :comment WHERE id = :id");
$stmt->execute([':status' => $status, ':comment' => $comment, ':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Admin status updated']);
