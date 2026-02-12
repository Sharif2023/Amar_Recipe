<?php
require_once __DIR__ . '/config.php';

$recipe_id = $_GET['recipe_id'] ?? '';
$user_email = $_GET['user_email'] ?? '';

if (empty($recipe_id) || empty($user_email)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("SELECT * FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
$stmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
$rating = $stmt->fetch();

if ($rating) {
    echo json_encode(['success' => true, 'hasRated' => true, 'rating' => $rating['rating']]);
} else {
    echo json_encode(['success' => true, 'hasRated' => false]);
}
