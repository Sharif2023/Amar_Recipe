<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$conn = getDbConnection();

$reportId = $data['id'];

$stmt = $conn->prepare("DELETE FROM reports WHERE id = ?");
$stmt->bind_param("i", $reportId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete report"]);
}
?>
