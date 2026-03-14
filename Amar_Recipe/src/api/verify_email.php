<?php
require_once __DIR__ . '/config.php';

// Set response type to JSON
header('Content-Type: application/json; charset=utf-8');

$type = $_GET['type'] ?? '';
$token = $_GET['token'] ?? '';

if (empty($type) || empty($token)) {
    echo json_encode(['success' => false, 'message' => 'যাচাইকরন লিংকটি সঠিক নয়।']);
    exit;
}

try {
    $conn = getDbConnection();
    
    if ($type === 'rating') {
        // Find the rating
        $stmt = $conn->prepare("SELECT r.id, r.recipe_id FROM ratings r WHERE r.verification_token = :token");
        $stmt->execute([':token' => $token]);
        $rating = $stmt->fetch();

        if ($rating) {
            // Verify and clear token
            $update = $conn->prepare("UPDATE ratings SET is_verified = TRUE, verification_token = NULL WHERE id = :id");
            $update->execute([':id' => $rating['id']]);

            // Re-calculate average
            $statsStmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM ratings WHERE recipe_id = :recipe_id AND is_verified = TRUE");
            $statsStmt->execute([':recipe_id' => $rating['recipe_id']]);
            $stats = $statsStmt->fetch();
            
            $avg_rating = round($stats['avg_rating'] ?? 0, 1);
            $rating_count = $stats['rating_count'] ?? 0;

            $updateRecipe = $conn->prepare("UPDATE recipes SET rating = :avg_rating, ratingCount = :rating_count WHERE id = :recipe_id");
            $updateRecipe->execute([':avg_rating' => $avg_rating, ':rating_count' => $rating_count, ':recipe_id' => $rating['recipe_id']]);

            echo json_encode(['success' => true, 'message' => 'ধন্যবাদ! আপনার রেসিপি রেটিং সফলভাবে যাচাই করা হয়েছে।']);
        } else {
            echo json_encode(['success' => false, 'message' => 'যাচাইকরন টোকেনটি পাওয়া যায়নি বা ইতিমধ্য ব্যবহার করা হয়েছে।']);
        }
    } 
    elseif ($type === 'submission') {
        $stmt = $conn->prepare("SELECT id FROM submission_requests WHERE verification_token = :token");
        $stmt->execute([':token' => $token]);
        $submission = $stmt->fetch();

        if ($submission) {
            $update = $conn->prepare("UPDATE submission_requests SET is_verified = TRUE, verification_token = NULL WHERE id = :id");
            $update->execute([':id' => $submission['id']]);

            echo json_encode(['success' => true, 'message' => 'ধন্যবাদ! আপনার রেসিপি জমা দেওয়ার আবেদনটি সফলভাবে যাচাই করা হয়েছে।']);
        } else {
            echo json_encode(['success' => false, 'message' => 'যাচাইকরন টোকেনটি পাওয়া যায়নি বা ইতিমধ্য ব্যবহার করা হয়েছে।']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'অজানা ধরনের যাচাইকরন অনুরোধ।']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'সার্ভার ত্রুটি: ' . $e->getMessage()]);
}
