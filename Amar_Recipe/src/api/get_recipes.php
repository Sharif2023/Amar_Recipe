<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$sql = "SELECT * FROM recipes ORDER BY created_at DESC";
$stmt = $conn->query($sql);

$recipes = $stmt->fetchAll();

echo json_encode(['success' => true, 'recipes' => $recipes]);
