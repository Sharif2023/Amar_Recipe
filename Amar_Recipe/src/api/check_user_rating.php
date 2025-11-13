<?php
require_once 'cors.php';

// Handle OPTIONS request for preflight check
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Stop further processing for OPTIONS request
}

// Database connection
require_once 'config.php';

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
