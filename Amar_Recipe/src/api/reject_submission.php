<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$conn = getDbConnection();

$requestId = $data['id'];

$stmt = $conn->prepare("UPDATE recipe_submission_requests SET status = 'rejected', updated_at = NOW() WHERE id = ?");
$stmt->bind_param("i", $requestId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to reject submission"]);
}
?>
