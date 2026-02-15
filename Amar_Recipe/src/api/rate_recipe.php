<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Support both naming conventions for compatibility
$recipe_id = $data['recipe_id'] ?? $data['recipeId'] ?? '';
$user_email = $data['user_email'] ?? $data['email'] ?? '';
$rating = $data['rating'] ?? '';

if (empty($recipe_id) || empty($user_email) || empty($rating)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();

try {
    // Check if user already rated
    $checkStmt = $conn->prepare("SELECT id FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
    $checkStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        // Prevent update - One time rating only
        echo json_encode(['success' => false, 'message' => 'আপনি ইতিমধ্যে এই রেসিপিটিকে রেটিং দিয়েছেন।']);
        exit;
    } else {
        // Insert new rating
        $insertStmt = $conn->prepare("INSERT INTO ratings (recipe_id, user_email, rating) VALUES (:recipe_id, :user_email, :rating)");
        $insertStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email, ':rating' => $rating]);
    }

    // Calculate new average and count
    $statsStmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM ratings WHERE recipe_id = :recipe_id");
    $statsStmt->execute([':recipe_id' => $recipe_id]);
    $stats = $statsStmt->fetch();
    
    $avg_rating = round($stats['avg_rating'], 1);
    $rating_count = $stats['rating_count'];

    // Update recipe record with persistent stats
    $updateRecipeStmt = $conn->prepare("UPDATE recipes SET average_rating = :avg_rating, ratingcount = :rating_count WHERE id = :recipe_id");
    $updateRecipeStmt->execute([
        ':avg_rating' => $avg_rating, 
        ':rating_count' => $rating_count, 
        ':recipe_id' => $recipe_id
    ]);

    echo json_encode([
        'success' => true, 
        'average_rating' => $avg_rating, 
        'rating_count' => $rating_count
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
