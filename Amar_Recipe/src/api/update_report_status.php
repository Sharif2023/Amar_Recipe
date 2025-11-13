<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(['success' => false]);
    exit;
}

$id = intval($data['id']);
$status = $data['status'];

$validStatuses = ['pending', 'reviewed', 'resolved'];
if (!in_array($status, $validStatuses)) {
    echo json_encode(['success' => false]);
    exit;
}

$stmt = $conn->prepare("UPDATE reports SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
$stmt->close();
$mysqli->close();
