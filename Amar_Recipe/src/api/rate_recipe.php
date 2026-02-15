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

    if ($existing) {
        // Prevent update - One time rating only
        echo json_encode(['success' => false, 'message' => 'আপনি ইতিমধ্যে এই রেসিপিটিকে রেটিং দিয়েছেন।']);
        exit;
    } else {
        // Insert new rating
        try {
            // Attempt insert with both user_email (new) and email (legacy/constraint)
            // We populate 'email' with the same value as 'user_email' to satisfy NOT NULL 'email' constraint
            $insertStmt = $conn->prepare("INSERT INTO ratings (recipe_id, user_email, email, rating) VALUES (:recipe_id, :user_email, :email, :rating)");
            $insertStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email, ':email' => $user_email, ':rating' => $rating]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23502') {
                // SQLSTATE 23502: Not null violation (ID missing sequence OR email missing)
                $msg = $e->getMessage();
                
                // Case 1: ID is null
                if (strpos($msg, 'id') !== false) {
                     // Auto-fix strategy: Manually generate ID
                    try {
                        $conn->exec("CREATE SEQUENCE IF NOT EXISTS ratings_id_seq");
                        
                        try {
                            $conn->exec("ALTER TABLE ratings ALTER COLUMN id SET DEFAULT nextval('ratings_id_seq')");
                        } catch (Exception $ignore) {}

                        $maxId = $conn->query("SELECT MAX(id) FROM ratings")->fetchColumn();
                        if ($maxId) {
                            $conn->exec("SELECT setval('ratings_id_seq', $maxId)");
                        }
                        
                        $nextId = $conn->query("SELECT nextval('ratings_id_seq')")->fetchColumn();

                        // Retry insert with EXPLICIT ID AND EMAIL
                        $retryStmt = $conn->prepare("INSERT INTO ratings (id, recipe_id, user_email, email, rating) VALUES (:id, :recipe_id, :user_email, :email, :rating)");
                        $retryStmt->execute([':id' => $nextId, ':recipe_id' => $recipe_id, ':user_email' => $user_email, ':email' => $user_email, ':rating' => $rating]);

                    } catch (Exception $ex) {
                        throw $e;
                    }
                }
                // Case 2: Email is null (Handled by main insert update, but kept if we fall through?)
                // If the main insert failed on EMAIL, it wouldn't match 'id' check above, so rethrow.
                // But now main insert HAS email, so this shouldn't happen for email.
                 else {
                    throw $e;
                }
            } else {
                throw $e;
            }
        }
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
