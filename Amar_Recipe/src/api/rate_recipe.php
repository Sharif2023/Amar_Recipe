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
    try {
        $checkStmt = $conn->prepare("SELECT id FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
        $checkStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
    } catch (PDOException $e) {
        // SQLSTATE 42703: Undefined column
        if ($e->getCode() === '42703') {
            // Auto-fix: Add the missing column
            $conn->exec("ALTER TABLE ratings ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)");
            
            // Retry the query
            $checkStmt = $conn->prepare("SELECT id FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
            $checkStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
        } else {
            throw $e;
        }
    }
    $existing = $checkStmt->fetch();

    require_once __DIR__ . '/mail_util.php';

    if ($existing) {
        // Prevent update - One time rating only
        echo json_encode(['success' => false, 'message' => 'আপনি ইতিমধ্যে এই রেসিপিটিকে রেটিং দিয়েছেন।']);
        exit;
    } else {
        // Generate token and insert unverified rating
        $token = bin2hex(random_bytes(16));
        $insertStmt = $conn->prepare("INSERT INTO ratings (recipe_id, user_email, email, rating, is_verified, verification_token) VALUES (:recipe_id, :user_email, :email, :rating, FALSE, :token)");
        $insertStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email, ':email' => $user_email, ':rating' => $rating, ':token' => $token]);

        // Get recipe title for email
        $titleStmt = $conn->prepare("SELECT title FROM recipes WHERE id = :id");
        $titleStmt->execute([':id' => $recipe_id]);
        $recipeTitle = $titleStmt->fetchColumn();

        // Send verification email
        if (sendRatingVerification($user_email, $recipeTitle, $token)) {
            echo json_encode([
                'success' => true, 
                'message' => 'আপনার রেটিংটি যাচাই করতে আপনার ইমেইল চেক করুন।',
                'verification_required' => true
            ]);
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'ইমেইল পাঠাতে ব্যর্থ হয়েছে, দয়া করে পরে আবার চেষ্টা করুন।'
            ]);
        }
    }
    exit;

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
