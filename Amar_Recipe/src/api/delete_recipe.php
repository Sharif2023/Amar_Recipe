<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing recipe ID']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("DELETE FROM recipes WHERE id = :id");
$stmt->execute([':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Recipe deleted successfully']);
