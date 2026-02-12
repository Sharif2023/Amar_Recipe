<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
try {
    $recipe_id = $data['recipeId'] ?? $data['recipe_id'] ?? '';
    // Combine reasons (array) and otherReason (string)
    $selectedReasons = $data['reasons'] ?? [];
    $otherReason = $data['otherReason'] ?? $data['other_reason'] ?? '';
    
    $fullReason = "";
    if (!empty($selectedReasons)) {
        $fullReason .= "Reasons: " . implode(', ', $selectedReasons);
    }
    if (!empty($otherReason)) {
        $fullReason .= ($fullReason ? " | " : "") . "Other: " . $otherReason;
    }
    
    $reporter_email = $data['reporterEmail'] ?? $data['reporter_email'] ?? '';

    if (empty($recipe_id) || empty($fullReason)) {
        echo json_encode(['success' => false, 'message' => 'Missing fields: ID or Reason']);
        exit;
    }

    $conn = getDbConnection();
    $stmt = $conn->prepare("INSERT INTO reports (recipe_id, reporter_email, reason) VALUES (:recipe_id, :reporter_email, :reason)");
    $stmt->execute([
        ':recipe_id' => $recipe_id,
        ':reporter_email' => $reporter_email,
        ':reason' => $fullReason
    ]);

    echo json_encode(['success' => true, 'message' => 'Report submitted']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
}

