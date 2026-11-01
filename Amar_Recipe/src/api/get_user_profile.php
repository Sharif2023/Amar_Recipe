<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    $user = requireVerifiedUser($conn);
    $userId = (int) $user['id'];
    $email = $user['email'];

    $subStmt = $conn->prepare("
        SELECT id, title, category, status, image, submission_date, created_at, action_date, comment, is_verified
        FROM submission_requests
        WHERE user_id = :user_id OR LOWER(organizeremail) = LOWER(:email)
        ORDER BY COALESCE(submission_date, created_at) DESC
    ");
    try {
        $subStmt->execute([':user_id' => $userId, ':email' => $email]);
        $submissions = $subStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Throwable $e) {
        $subStmt = $conn->prepare("
            SELECT id, title, category, status, image, created_at, comment, is_verified
            FROM submission_requests
            WHERE user_id = :user_id OR LOWER(organizeremail) = LOWER(:email)
            ORDER BY created_at DESC
        ");
        $subStmt->execute([':user_id' => $userId, ':email' => $email]);
        $submissions = $subStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    $ratingStmt = $conn->prepare("
        SELECT r.id, r.recipe_id, r.rating, r.is_verified, r.created_at, r.image_url, rec.title AS recipe_title
        FROM ratings r
        LEFT JOIN recipes rec ON rec.id = r.recipe_id
        WHERE r.user_id = :user_id OR LOWER(r.user_email) = LOWER(:email) OR LOWER(r.email) = LOWER(:email2)
        ORDER BY r.created_at DESC
    ");
    try {
        $ratingStmt->execute([':user_id' => $userId, ':email' => $email, ':email2' => $email]);
        $ratings = $ratingStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Throwable $e) {
        $ratingStmt = $conn->prepare("
            SELECT r.id, r.recipe_id, r.rating, r.is_verified, r.created_at, rec.title AS recipe_title
            FROM ratings r
            LEFT JOIN recipes rec ON rec.id = r.recipe_id
            WHERE r.user_id = :user_id OR LOWER(r.user_email) = LOWER(:email)
            ORDER BY r.created_at DESC
        ");
        $ratingStmt->execute([':user_id' => $userId, ':email' => $email]);
        $ratings = $ratingStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    $approved = 0;
    $pending = 0;
    $rejected = 0;
    foreach ($submissions as $row) {
        $status = strtolower($row['status'] ?? '');
        if ($status === 'approved') {
            $approved++;
        } elseif ($status === 'rejected') {
            $rejected++;
        } else {
            $pending++;
        }
    }

    echo json_encode([
        'success' => true,
        'user' => publicUserPayload($user),
        'stats' => [
            'submissions' => count($submissions),
            'approved' => $approved,
            'pending' => $pending,
            'rejected' => $rejected,
            'ratings' => count($ratings),
        ],
        'submissions' => $submissions,
        'ratings' => $ratings,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
