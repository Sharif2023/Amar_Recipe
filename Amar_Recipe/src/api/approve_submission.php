<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing submission ID']);
    exit;
}

$conn = getDbConnection();

// Fetch the submission request
$stmt = $conn->prepare("SELECT * FROM submission_requests WHERE id = :id");
$stmt->execute([':id' => $id]);
$submission = $stmt->fetch();

if (!$submission) {
    echo json_encode(['success' => false, 'message' => 'Submission not found']);
    exit;
}

// Update submission status to Approved
$updateStmt = $conn->prepare("UPDATE submission_requests SET status = 'Approved' WHERE id = :id");
$updateStmt->execute([':id' => $id]);

// Insert into recipes table
$insertStmt = $conn->prepare("INSERT INTO recipes 
    (title, category, description, image_url, location, organizername, organizeremail, organizeraddress, tags, reference, tutorialvideo, comment, source, created_at)
    VALUES (:title, :category, :description, :image_url, :location, :organizername, :organizeremail, :organizeraddress, :tags, :reference, :tutorialvideo, :comment, :source, NOW())");
$insertStmt->execute([
    ':title' => $submission['title'],
    ':category' => $submission['category'],
    ':description' => $submission['description'],
    ':image_url' => $submission['image'],
    ':location' => $submission['location'],
    ':organizername' => $submission['organizername'],
    ':organizeremail' => $submission['organizeremail'],
    ':organizeraddress' => $submission['organizeraddress'],
    ':tags' => $submission['tags'] ?? '',
    ':reference' => $submission['reference'] ?? '',
    ':tutorialvideo' => $submission['tutorialvideo'] ?? '',
    ':comment' => $submission['comment'] ?? '',
    ':source' => $submission['source'] ?? ''
]);

echo json_encode(['success' => true, 'message' => 'Submission approved and recipe added']);
