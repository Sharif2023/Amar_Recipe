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
            $insertStmt = $conn->prepare("INSERT INTO ratings (recipe_id, user_email, rating) VALUES (:recipe_id, :user_email, :rating)");
            $insertStmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email, ':rating' => $rating]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23502' && strpos($e->getMessage(), 'id') !== false) {
                // SQLSTATE 23502: Not null violation (missing AUTO_INCREMENT)
                // Auto-fix strategy: Manually generate ID
                try {
                    $conn->exec("CREATE SEQUENCE IF NOT EXISTS ratings_id_seq");
                    
                    // Attempt to set default for future, but don't rely on it for this request
                    try {
                        $conn->exec("ALTER TABLE ratings ALTER COLUMN id SET DEFAULT nextval('ratings_id_seq')");
                    } catch (Exception $ignore) {}

                    // Sync sequence if needed (only if verify fails)
                    $maxId = $conn->query("SELECT MAX(id) FROM ratings")->fetchColumn();
                    if ($maxId) {
                        // Ensure sequence is at least past maxId
                        $conn->exec("SELECT setval('ratings_id_seq', $maxId)");
                    }
                    
                    // Generate explicit ID for this request
                    $nextId = $conn->query("SELECT nextval('ratings_id_seq')")->fetchColumn();

                    // Retry insert with EXPLICIT ID
                    $retryStmt = $conn->prepare("INSERT INTO ratings (id, recipe_id, user_email, rating) VALUES (:id, :recipe_id, :user_email, :rating)");
                    $retryStmt->execute([':id' => $nextId, ':recipe_id' => $recipe_id, ':user_email' => $user_email, ':rating' => $rating]);

                } catch (Exception $ex) {
                    throw $e; // Throw original error if fix fails
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
