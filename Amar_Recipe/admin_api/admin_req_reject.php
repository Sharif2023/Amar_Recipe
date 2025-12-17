<?php
require_once __DIR__ . '/../src/api/config.php';

date_default_timezone_set("Asia/Dhaka");

$conn = getDbConnection();


$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$reason = isset($data['reason']) ? trim($data['reason']) : '';
$admin_name = isset($data['admin_name']) ? trim($data['admin_name']) : '';  // Capture admin's name

if ($id <= 0 || empty($reason) || empty($admin_name)) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid ID, reason or admin_name']);
    exit;
}

$stmt = $conn->prepare("UPDATE admin_requests SET status = 'rejected', comment = ?, admin_name = ?, date = NOW() WHERE id = ?");
$stmt->bind_param("ssi", $reason, $admin_name, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
exit;
