<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
$stmt = $conn->query("SELECT r.*, rec.title as recipe_title FROM reports r LEFT JOIN recipes rec ON r.recipe_id = rec.id ORDER BY r.created_at DESC");
$reports = $stmt->fetchAll();

echo json_encode(['success' => true, 'reports' => $reports]);
