<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);

$sender_id = $data['sender_id'] ?? '';
$receiver_id = $data['receiver_id'] ?? '';
$message = $data['message'] ?? '';

if (empty($sender_id) || empty($receiver_id) || empty(trim($message))) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("INSERT INTO admin_chat_messages (sender_id, receiver_id, message) VALUES (:sender_id, :receiver_id, :message)");
$stmt->execute([
    ':sender_id' => $sender_id,
    ':receiver_id' => $receiver_id,
    ':message' => trim($message)
]);

echo json_encode(['success' => true, 'message' => 'Message sent']);
