<?php
require_once __DIR__ . '/config.php';
$conn = getDbConnection();
$stmt = $conn->query("SELECT id FROM recipes ORDER BY id DESC LIMIT 1");
$row = $stmt->fetch();
echo $row ? $row['id'] : "No recipes found";
