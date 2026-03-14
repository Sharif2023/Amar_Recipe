<?php
require_once __DIR__ . '/config.php';

$type = $_GET['type'] ?? '';
$token = $_GET['token'] ?? '';

$message = "";
$status = "error"; // success or error
$title = "যাচাইকরন সঠিক নয়";

if (empty($token)) {
    $message = "যাচাইকরন লিংকটি সঠিক নয়। অনুগ্রহ করে আপনার ইমেইল চেক করুন।";
} else {
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

                // Re-calculate average
                $statsStmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM ratings WHERE recipe_id = :recipe_id AND is_verified = TRUE");
                $statsStmt->execute([':recipe_id' => $rating['recipe_id']]);
                $stats = $statsStmt->fetch();
                
                $avg_rating = round($stats['avg_rating'] ?? 0, 1);
                $rating_count = $stats['rating_count'] ?? 0;

                $updateRecipe = $conn->prepare("UPDATE recipes SET average_rating = :avg_rating, ratingcount = :rating_count WHERE id = :recipe_id");
                $updateRecipe->execute([':avg_rating' => $avg_rating, ':rating_count' => $rating_count, ':recipe_id' => $rating['recipe_id']]);

                $status = "success";
                $title = "সফলভাবে যাচাই হয়েছে!";
                $message = "আপনার রেসিপি রেটিং সফলভাবে যাচাই করা হয়েছে এবং রেসিপিতে সরাসরি যুক্ত করা হয়েছে।";
            } else {
                $message = "যাচাইকরন টোকেনটি পাওয়া যায়নি বা ইতিমধ্য ব্যবহার করা হয়েছে।";
            }
        } 
        elseif ($type === 'submission') {
            $stmt = $conn->prepare("SELECT id, title FROM submission_requests WHERE verification_token = :token");
            $stmt->execute([':token' => $token]);
            $submission = $stmt->fetch();

            if ($submission) {
                $update = $conn->prepare("UPDATE submission_requests SET is_verified = TRUE, verification_token = NULL WHERE id = :id");
                $update->execute([':id' => $submission['id']]);

                $status = "success";
                $title = "সফলভাবে যাচাই হয়েছে!";
                $message = "আপনার রেসিপি জমা দেওয়ার আবেদনটি সফলভাবে যাচাই করা হয়েছে। আমাদের অ্যাডমিন শীঘ্রই এটি রিভিউ করবেন।";
            } else {
                $message = "যাচাইকরন টোকেনটি পাওয়া যায়নি বা ইতিমধ্য ব্যবহার করা হয়েছে।";
            }
        } else {
            $message = "অজানা ধরনের যাচাইকরন অনুরোধ।";
        }
    } catch (Exception $e) {
        $message = "একটি কারিগরি সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন। (" . $e->getMessage() . ")";
    }
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?> - Amar Recipe</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #e11d48;
            --primary-hover: #be123c;
            --success: #10b981;
            --error: #ef4444;
            --text-main: #1f2937;
            --text-muted: #6b7280;
            --bg: #f9fafb;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Outfit', 'Arial', sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 450px;
            width: 90%;
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            border: 1px solid rgba(0,0,0,0.05);
        }
        .icon-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        .icon-success {
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--success);
        }
        .icon-error {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--error);
        }
        h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 12px;
        }
        p {
            color: var(--text-muted);
            line-height: 1.6;
            font-size: 16px;
            margin: 0 0 32px;
        }
        .btn {
            display: inline-block;
            background-color: var(--primary);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
        }
        .btn:hover {
            background-color: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(225, 29, 72, 0.3);
        }
        .logo {
            font-size: 24px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 30px;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <span class="logo">Amar Recipe</span>
        
        <div class="icon-circle <?php echo ($status === 'success' ? 'icon-success' : 'icon-error'); ?>">
            <?php if ($status === 'success'): ?>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <?php else: ?>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <?php endif; ?>
        </div>

        <h1><?php echo $title; ?></h1>
        <p><?php echo $message; ?></p>
        
        <a href="https://amar-recipe.vercel.app" class="btn">ওয়েবসাইটে ফিরে যান</a>
    </div>
</body>
</html>
