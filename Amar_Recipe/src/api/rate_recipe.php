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
    // Initial check outside transaction
    $stmt = $conn->prepare("SELECT id, is_verified FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
    $stmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
    $existing = $stmt->fetch();

    if ($existing && $existing['is_verified']) {
        echo json_encode(['success' => false, 'message' => 'আপনি ইতিমধ্যে এই রেসিপিটিকে রেটিং দিয়েছেন।']);
        exit;
    } 

    $conn->beginTransaction();
    require_once __DIR__ . '/mail_util.php';

    // Generate token
    $token = bin2hex(random_bytes(16));
    
    if ($existing && !$existing['is_verified']) {
        // Update unverified rating
        $updateStmt = $conn->prepare("UPDATE ratings SET rating = :rating, verification_token = :token, created_at = NOW() WHERE id = :id");
        $updateStmt->execute([':rating' => $rating, ':token' => $token, ':id' => $existing['id']]);
    } else {
        // Insert new unverified rating
        $insertStmt = $conn->prepare("INSERT INTO ratings (recipe_id, user_email, email, rating, is_verified, verification_token) VALUES (:recipe_id, :user_email, :email, :rating, FALSE, :token)");
        $insertStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email, ':email' => $user_email, ':rating' => $rating, ':token' => $token]);
    }

    // Get recipe title for email
    $titleStmt = $conn->prepare("SELECT title FROM recipes WHERE id = :id");
    $titleStmt->execute([':id' => $recipe_id]);
    $recipeTitle = $titleStmt->fetchColumn();

    // Send verification email
    $mailResult = sendRatingVerification($user_email, $recipeTitle, $token);
    if ($mailResult === true) {
        $conn->commit();
        echo json_encode([
            'success' => true, 
            'message' => 'আপনার রেটিংটি যাচাই করতে আপনার ইমেইল চেক করুন। আমরা ভেরিফিকেশন লিঙ্ক পাঠিয়েছি।',
            'verification_required' => true
        ]);
    } else if ($mailResult === "DISABLED") {
        // Auto-verify if email service is not configured
        $stmt = $conn->prepare("UPDATE ratings SET is_verified = TRUE WHERE verification_token = :token");
        $stmt->execute([':token' => $token]);
        $conn->commit();
        echo json_encode([
            'success' => true, 
            'message' => 'আপনার রেটিংটি সফলভাবে জমা হয়েছে। (ইমেইল যাচাইকরণ বর্তমানে নিষ্ক্রিয়)',
            'verification_required' => false
        ]);
    } else {
        $conn->rollback();
        echo json_encode([
            'success' => false, 
            'message' => 'The rating was NOT saved because the verification email failed to send. Error: ' . (is_string($mailResult) ? $mailResult : 'SMTP Connection Issues'),
            'debug_info' => $mailResult
        ]);
    }
} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    error_log("Rating Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'সার্ভার ত্রুটি: ' . $e->getMessage()]);
}
