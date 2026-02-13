<?php
require_once 'config.php';
header('Content-Type: application/json');

try {
    $conn = getDbConnection();
    $stmt = $conn->query("SELECT id, title, image_url FROM recipes ORDER BY id DESC LIMIT 5");
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'recipes' => $recipes]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
