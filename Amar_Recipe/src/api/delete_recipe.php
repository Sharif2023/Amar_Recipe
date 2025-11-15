<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || intval($data['id']) <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid or missing recipe ID']);
    exit;
}

$recipeId = intval($data['id']);

require_once 'config.php';

// First delete any related reports (optional, for consistency)
$conn->query("DELETE FROM reports WHERE recipe_id = $recipeId");

// Then delete the recipe
$stmt = $conn->prepare("DELETE FROM recipes WHERE id = ?");
$stmt->bind_param("i", $recipeId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Recipe deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Deletion failed: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
