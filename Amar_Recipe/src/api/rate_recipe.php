<?php
require_once __DIR__ . '/config.php';
file_put_contents(__DIR__ . '/request_debug.log', "[" . date('Y-m-d H:i:s') . "] Request received for rate_recipe.php\n", FILE_APPEND);

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
    $stmt = $conn->prepare("SELECT id, is_verified FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
    $stmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
    $existing = $stmt->fetch();

    require_once __DIR__ . '/mail_util.php';

    if ($existing && $existing['is_verified']) {
        // Prevent update - One time rating only
        echo json_encode(['success' => false, 'message' => 'আপনি ইতিমধ্যে এই রেসিপিটিকে রেটিং দিয়েছেন।']);
        exit;
    } 

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
    if (sendRatingVerification($user_email, $recipeTitle, $token)) {
        echo json_encode([
            'success' => true, 
            'message' => 'আপনার রেটিংটি যাচাই করতে আপনার ইমেইল চেক করুন। আমরা ভেরিফিকেশন লিঙ্ক পাঠিয়েছি।',
            'verification_required' => true
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'ইমেইল পাঠাতে ব্যর্থ হয়েছে, দয়া করে পরে আবার চেষ্টা করুন।'
        ]);
    }
} catch (Exception $e) {
    file_put_contents(__DIR__ . '/api_debug.log', "[" . date('Y-m-d H:i:s') . "] Rating Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'সার্ভার ত্রুটি: ' . $e->getMessage()]);
}
