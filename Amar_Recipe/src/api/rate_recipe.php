<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$recipe_id = $data['recipe_id'] ?? '';
$user_email = $data['user_email'] ?? '';
$rating = $data['rating'] ?? '';

if (empty($recipe_id) || empty($user_email) || empty($rating)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();

// Check if user already rated
$checkStmt = $conn->prepare("SELECT * FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
$checkStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
$existing = $checkStmt->fetch();

if ($existing) {
    // Update existing rating
    $updateStmt = $conn->prepare("UPDATE ratings SET rating = :rating WHERE recipe_id = :recipe_id AND user_email = :user_email");
    $updateStmt->execute([':rating' => $rating, ':recipe_id' => $recipe_id, ':user_email' => $user_email]);
} else {
    // Insert new rating
    $insertStmt = $conn->prepare("INSERT INTO ratings (recipe_id, user_email, rating) VALUES (:recipe_id, :user_email, :rating)");
    $insertStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email, ':rating' => $rating]);
}

// Calculate new average
$avgStmt = $conn->prepare("SELECT AVG(rating) as avg_rating FROM ratings WHERE recipe_id = :recipe_id");
$avgStmt->execute([':recipe_id' => $recipe_id]);
$avgRow = $avgStmt->fetch();
$avg_rating = round($avgRow['avg_rating'], 1);

// Update recipe average rating
$updateRecipeStmt = $conn->prepare("UPDATE recipes SET average_rating = :avg_rating WHERE id = :recipe_id");
$updateRecipeStmt->execute([':avg_rating' => $avg_rating, ':recipe_id' => $recipe_id]);

echo json_encode(['success' => true, 'average_rating' => $avg_rating]);
