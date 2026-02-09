<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$conn = getDbConnection();

$requestId = $data['id'];

// Get the submission details
$stmt = $conn->prepare("SELECT * FROM recipe_submission_requests WHERE id = ?");
$stmt->bind_param("i", $requestId);
$stmt->execute();
$submission = $stmt->get_result()->fetch_assoc();

if (!$submission) {
    echo json_encode(["success" => false, "message" => "Submission not found"]);
    exit();
}

// Insert into recipes table
$insertStmt = $conn->prepare("INSERT INTO recipes (title, category, description, image_url, location, organizerName, organizerEmail, organizerAddress, source, tags, reference, tutorialVideo, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$insertStmt->bind_param("sssssssssssss", 
    $submission['title'],
    $submission['category'],
    $submission['description'],
    $submission['image'],
    $submission['location'],
    $submission['organizerName'],
    $submission['organizerEmail'],
    $submission['organizerAddress'],
    $submission['source'],
    $submission['tags'],
    $submission['reference'],
    $submission['tutorialVideo'],
    $submission['comment']
);

if ($insertStmt->execute()) {
    // Update submission status
    $updateStmt = $conn->prepare("UPDATE recipe_submission_requests SET status = 'approved', updated_at = NOW() WHERE id = ?");
    $updateStmt->bind_param("i", $requestId);
    $updateStmt->execute();
    
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to approve submission"]);
}
?>
