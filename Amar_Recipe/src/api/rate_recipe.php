<?php
require_once __DIR__ . '/config.php';
error_log("Request received for rate_recipe.php");

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
    $conn->beginTransaction();
    // Initial check outside transaction (actually better inside now we started it)
    $stmt = $conn->prepare("SELECT id, is_verified FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
    $stmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
    $existing = $stmt->fetch();

    if ($existing && $existing['is_verified']) {
        echo json_encode(['success' => false, 'message' => 'আপনি ইতিমধ্যে এই রেসিপিটিকে রেটিং দিয়েছেন।']);
        exit;
    } 

    require_once __DIR__ . '/mail_util.php';

    // Check if we should bypass verification (Option B)
    $shouldVerify = ($user_email === ADMIN_EMAIL);
    $token = $shouldVerify ? bin2hex(random_bytes(16)) : null;
    
    // Perform the save operation (Insert or Update)
    if ($existing) {
        $updateStmt = $conn->prepare("UPDATE ratings SET rating = :rating, verification_token = :token, is_verified = :is_verified, created_at = NOW() WHERE id = :id");
        $updateStmt->execute([
            ':rating' => $rating, 
            ':token' => $token, 
            ':is_verified' => $shouldVerify ? 0 : 1, // Store as bool-compatible int
            ':id' => $existing['id']
        ]);
    } else {
        $insertStmt = $conn->prepare("INSERT INTO ratings (recipe_id, user_email, email, rating, is_verified, verification_token) VALUES (:recipe_id, :user_email, :email, :rating, :is_verified, :token)");
        $insertStmt->execute([
            ':recipe_id' => $recipe_id, 
            ':user_email' => $user_email, 
            ':email' => $user_email, 
            ':rating' => $rating, 
            ':is_verified' => $shouldVerify ? 0 : 1, 
            ':token' => $token
        ]);
    }

    // Get recipe title for email
    $titleStmt = $conn->prepare("SELECT title FROM recipes WHERE id = :id");
    $titleStmt->execute([':id' => $recipe_id]);
    $recipeTitle = $titleStmt->fetchColumn();

    if ($shouldVerify) {
        // Send verification email
        $mailResult = sendRatingVerification($user_email, $recipeTitle, $token);
        if ($mailResult === true) {
            $conn->commit();
            echo json_encode([
                'success' => true, 
                'message' => 'আপনার রেটিংটি যাচাই করতে আপনার ইমেইল চেক করুন। আমরা ভেরিফিকেশন লিঙ্ক পাঠিয়েছি।',
                'verification_required' => true
            ]);
        } else {
            $conn->rollback();
            echo json_encode([
                'success' => false, 
                'message' => 'The rating was NOT saved because the verification email failed to send. Error: ' . (is_string($mailResult) ? $mailResult : 'SMTP Connection Issues'),
                'debug_info' => $mailResult
            ]);
        }
    } else {
        // Bypass verification: Update recipe statistics immediately
        $statsStmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM ratings WHERE recipe_id = :recipe_id AND is_verified = TRUE");
        $statsStmt->execute([':recipe_id' => $recipe_id]);
        $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
        
        $avg_rating = round($stats['avg_rating'] ?? 0, 1);
        $rating_count = $stats['rating_count'] ?? 0;

        $updateRecipe = $conn->prepare("UPDATE recipes SET rating = :avg_rating, ratingCount = :rating_count WHERE id = :recipe_id");
        $updateRecipe->execute([':avg_rating' => $avg_rating, ':rating_count' => $rating_count, ':recipe_id' => $recipe_id]);

        $conn->commit();
        echo json_encode([
            'success' => true, 
            'message' => 'আপনার রেটিংটি সফলভাবে জমা হয়েছে। ধন্যবাদ!',
            'verification_required' => false
        ]);
    }
} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    error_log("Rating Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'সার্ভার ত্রুটি: ' . $e->getMessage()]);
}
