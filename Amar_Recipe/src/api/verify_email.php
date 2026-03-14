<?php
require_once __DIR__ . '/config.php';

$type = $_GET['type'] ?? '';
$token = $_GET['token'] ?? '';

if (empty($type) || empty($token)) {
    die("যাচাইকরন লিংকটি সঠিক নয়।");
}

$conn = getDbConnection();

try {
    if ($type === 'rating') {
        // Find the rating
        $stmt = $conn->prepare("SELECT r.id, r.recipe_id, rec.title FROM ratings r JOIN recipes rec ON r.recipe_id = rec.id WHERE r.verification_token = :token");
        $stmt->execute([':token' => $token]);
        $rating = $stmt->fetch();

        if ($rating) {
            // Verify and clear token
            $update = $conn->prepare("UPDATE ratings SET is_verified = TRUE, verification_token = NULL WHERE id = :id");
            $update->execute([':id' => $rating['id']]);

            // Now re-calculate average for the recipe
            $statsStmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM ratings WHERE recipe_id = :recipe_id AND is_verified = TRUE");
            $statsStmt->execute([':recipe_id' => $rating['recipe_id']]);
            $stats = $statsStmt->fetch();
            
            $avg_rating = round($stats['avg_rating'], 1);
            $rating_count = $stats['rating_count'];

            $updateRecipe = $conn->prepare("UPDATE recipes SET average_rating = :avg_rating, ratingcount = :rating_count WHERE id = :recipe_id");
            $updateRecipe->execute([':avg_rating' => $avg_rating, ':rating_count' => $rating_count, ':recipe_id' => $rating['recipe_id']]);

            echo "<h1>ধন্যবাদ!</h1><p>আপনার রেসিপি রেটিং সফলভাবে যাচাই করা হয়েছে এবং রেসিপিতে যুক্ত করা হয়েছে।</p>";
        } else {
            echo "<h1>দুঃখিত!</h1><p>যাচাইকরন টোকেনটি পাওয়া যায়নি বা ইতিমধ্য ব্যবহার করা হয়েছে।</p>";
        }
    } 
    elseif ($type === 'submission') {
        // Find the submission
        $stmt = $conn->prepare("SELECT id, title FROM submission_requests WHERE verification_token = :token");
        $stmt->execute([':token' => $token]);
        $submission = $stmt->fetch();

        if ($submission) {
            // Verify and clear token
            $update = $conn->prepare("UPDATE submission_requests SET is_verified = TRUE, verification_token = NULL WHERE id = :id");
            $update->execute([':id' => $submission['id']]);

            echo "<h1>ধন্যবাদ!</h1><p>আপনার রেসিপি জমা দেওয়ার আবেদনটি সফলভাবে যাচাই করা হয়েছে। আমাদের অ্যাডমিন শীঘ্রই এটি রিভিউ করবেন।</p>";
        } else {
            echo "<h1>দুঃখিত!</h1><p>যাচাইকরন টোকেনটি পাওয়া যায়নি বা ইতিমধ্য ব্যবহার করা হয়েছে।</p>";
        }
    }
} catch (Exception $e) {
    die("একটি সমস্যা হয়েছে: " . $e->getMessage());
}
?>
<div style="margin-top: 50px;">
    <a href="https://amar-recipe.vercel.app" style="text-decoration: none; color: #e11d48; font-weight: bold;">ওয়েবসাইটে ফিরে যান</a>
</div>
