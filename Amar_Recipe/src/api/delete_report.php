<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing report ID']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("DELETE FROM reports WHERE id = :id");
$stmt->execute([':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Report deleted successfully']);
