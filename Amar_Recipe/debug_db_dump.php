<?php
require_once 'src/api/config.php';
$conn = getDbConnection();
$stmt = $conn->query("SELECT id, title, image_url FROM recipes ORDER BY id DESC LIMIT 5");
$recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($recipes);
echo "</pre>";
