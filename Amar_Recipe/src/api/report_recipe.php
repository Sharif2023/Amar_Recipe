<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$recipe_id = $data['recipe_id'] ?? '';
$reporter_email = $data['reporter_email'] ?? '';
$reason = $data['reason'] ?? '';

if (empty($recipe_id) || empty($reporter_email) || empty($reason)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("INSERT INTO reports (recipe_id, reporter_email, reason) VALUES (:recipe_id, :reporter_email, :reason)");
$stmt->execute([
    ':recipe_id' => $recipe_id,
    ':reporter_email' => $reporter_email,
    ':reason' => $reason
]);

echo json_encode(['success' => true, 'message' => 'Report submitted']);
