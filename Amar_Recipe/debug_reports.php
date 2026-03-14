<?php
require_once __DIR__ . '/src/api/config.php';
$conn = getDbConnection();
$stmt = $conn->query("SELECT r.*, rec.title, rec.category, rec.image_url FROM reports r LEFT JOIN recipes rec ON r.recipe_id = rec.id LIMIT 1");
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo "KEYS: " . implode(', ', array_keys($row)) . "\n";
print_r($row);
