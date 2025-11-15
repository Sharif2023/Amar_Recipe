<?php


// Handle OPTIONS request for preflight check
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Stop further processing for OPTIONS request
}

// Database connection
require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$recipeId = $data['recipeId'];
$email = $data['email'];
$rating = $data['rating'];

// Check if email is valid
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit;
}

// Check if the user has already rated the recipe
$sql = "SELECT id, rating FROM ratings WHERE recipe_id = ? AND email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $recipeId, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // User has already rated, update the existing rating
    $row = $result->fetch_assoc();
    $ratingId = $row['id'];

    // Update the existing rating
    $updateSql = "UPDATE ratings SET rating = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("ii", $rating, $ratingId);
    $updateStmt->execute();
} else {
    // Insert new rating
    $sql = "INSERT INTO ratings (recipe_id, email, rating) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isi", $recipeId, $email, $rating);
    $stmt->execute();
}

// Calculate new average rating
$sql = "SELECT AVG(rating) AS average_rating, COUNT(id) AS rating_count FROM ratings WHERE recipe_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $recipeId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$averageRating = round($row['average_rating'], 1);
$ratingCount = $row['rating_count'];

// Update recipe's average rating in the database
$updateSql = "UPDATE recipes SET rating = ?, ratingCount = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("dii", $averageRating, $ratingCount, $recipeId);
$updateStmt->execute();

echo json_encode(['success' => true, 'averageRating' => $averageRating, 'ratingCount' => $ratingCount]);
?>
