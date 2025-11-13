<?php
require_once 'cors.php';

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['recipeId']) || (!isset($data['reasons']) && !isset($data['otherReason']))) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$recipeId = intval($data['recipeId']);
$reasons = isset($data['reasons']) ? json_encode($data['reasons']) : json_encode([]);
$otherReason = isset($data['otherReason']) ? trim($data['otherReason']) : '';
$reporterEmail = isset($data['reporterEmail']) ? trim($data['reporterEmail']) : '';

$stmt = $conn->prepare("INSERT INTO reports (recipe_id, reasons, other_reason, reporter_email) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $recipeId, $reasons, $otherReason, $reporterEmail);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Insert failed']);
}
$stmt->close();
$mysqli->close();
