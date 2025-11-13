<?php

date_default_timezone_set("Asia/Dhaka");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
ini_set("display_errors", 0);
error_reporting(0);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

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
