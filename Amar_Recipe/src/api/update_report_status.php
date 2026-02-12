<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$status = $data['status'] ?? '';

if (empty($id) || empty($status)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("UPDATE reports SET status = :status WHERE id = :id");
$stmt->execute([':status' => $status, ':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Report status updated']);
