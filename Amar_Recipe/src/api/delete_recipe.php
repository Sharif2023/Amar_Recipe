<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing recipe ID']);
    exit;
}

try {
    $conn = getDbConnection();
    
    // Start transaction to ensure atomicity (ACID compliance)
    $conn->beginTransaction();

    // 1. Delete from recipe_images
    $imgStmt = $conn->prepare("DELETE FROM recipe_images WHERE recipe_id = :id");
    $imgStmt->execute([':id' => $id]);

    // 2. Delete from ratings
    $ratingStmt = $conn->prepare("DELETE FROM ratings WHERE recipe_id = :id");
    $ratingStmt->execute([':id' => $id]);

    // 3. Delete from recipes
    $stmt = $conn->prepare("DELETE FROM recipes WHERE id = :id");
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("Recipe not found or already deleted.");
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Recipe deleted successfully']);

} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete recipe: ' . $e->getMessage()]);
}
