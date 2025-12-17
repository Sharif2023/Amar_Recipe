<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();


$data = json_decode(file_get_contents("php://input"), true);
$recipeId = $data['recipeId'];
$email = $data['email'];

// Check if email has already rated the recipe
$sql = "SELECT id FROM ratings WHERE recipe_id = ? AND email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $recipeId, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Rating already exists
    echo json_encode(['success' => true, 'exists' => true]);
} else {
    // Rating does not exist
    echo json_encode(['success' => true, 'exists' => false]);
}
?>
