<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$conn = getDbConnection();

$result = $conn->prepare("UPDATE admin_requests SET status = ? WHERE id = ?");
$result->bind_param("si", $data['status'], $data['id']);

if ($result->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}
?>
