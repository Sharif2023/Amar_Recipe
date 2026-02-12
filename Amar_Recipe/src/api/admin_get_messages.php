<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$sender_id = $_GET['sender_id'] ?? '';
$receiver_id = $_GET['receiver_id'] ?? '';

if (empty($sender_id) || empty($receiver_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing sender_id or receiver_id']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM admin_chat_messages 
    WHERE (sender_id = :sid1 AND receiver_id = :rid1) 
       OR (sender_id = :rid2 AND receiver_id = :sid2) 
    ORDER BY created_at ASC");
$stmt->execute([
    ':sid1' => $sender_id,
    ':rid1' => $receiver_id,
    ':rid2' => $receiver_id,
    ':sid2' => $sender_id
]);
$messages = $stmt->fetchAll();

echo json_encode(['success' => true, 'messages' => $messages]);
