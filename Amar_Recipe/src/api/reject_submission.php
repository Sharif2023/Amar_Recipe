<?php

date_default_timezone_set("Asia/Dhaka");

require_once 'cors.php';
header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$reason = isset($data['reason']) ? trim($data['reason']) : '';
$adminName = isset($data['admin_name']) ? trim($data['admin_name']) : '';

if ($id <= 0 || empty($reason) || empty($adminName)) {
    echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
    exit;
}

$stmt = $conn->prepare("UPDATE submission_requests SET status = 'Rejected', comment = ?, admin_name = ?, action_date = NOW() WHERE id = ?");
$stmt->bind_param('ssi', $reason, $adminName, $id);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}
$stmt->close();
$conn->close();

?>
