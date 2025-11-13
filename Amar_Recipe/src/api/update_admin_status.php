<?php

date_default_timezone_set("Asia/Dhaka");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

require_once 'config.php';

if (!isset($data['id'], $data['status'], $data['admin_name'])) {
    echo json_encode(['success' => false, 'message' => 'Missing id, status or admin_name']);
    exit;
}

$id = intval($data['id']);
$status = $data['status'];
$admin_name = $data['admin_name'];  // Capture admin's name

$stmt = $conn->prepare("UPDATE admin_requests SET status = ?, admin_name = ?, date = NOW() WHERE id = ?");
$stmt->bind_param('ssi', $status, $admin_name, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Status updated"]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
