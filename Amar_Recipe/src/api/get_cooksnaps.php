<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

$recipe_id = $_GET['recipe_id'] ?? '';
if (empty($recipe_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing recipe ID']);
    exit;
}

try {
    $conn = getDbConnection();
    $stmt = $conn->prepare("SELECT user_email, rating, image_url, created_at FROM ratings WHERE recipe_id = :recipe_id AND is_verified = TRUE AND image_url IS NOT NULL ORDER BY created_at DESC");
    $stmt->execute([':recipe_id' => $recipe_id]);
    $cooksnaps = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $cooksnaps]);
} catch (Exception $e) {
    error_log("Error fetching cooksnaps: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
