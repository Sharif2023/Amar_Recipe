<?php
require_once __DIR__ . '/config.php';

// Support both GET (legacy) and POST (current frontend)
$data = json_decode(file_get_contents('php://input'), true);

$recipe_id = $data['recipeId'] ?? $data['recipe_id'] ?? $_GET['recipe_id'] ?? '';
$user_email = $data['email'] ?? $data['user_email'] ?? $_GET['user_email'] ?? '';

if (empty($recipe_id) || empty($user_email)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();

try {
    $stmt = $conn->prepare("SELECT rating FROM ratings WHERE recipe_id = :recipe_id AND user_email = :user_email");
    $stmt->execute([':recipe_id' => $recipe_id, ':user_email' => $user_email]);
    $rating = $stmt->fetch();

    if ($rating) {
        echo json_encode([
            'success' => true, 
            'exists' => true, 
            'hasRated' => true, 
            'rating' => $rating['rating']
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'exists' => false, 
            'hasRated' => false
        ]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
