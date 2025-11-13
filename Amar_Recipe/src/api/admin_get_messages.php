<?php
// Handle preflight OPTIONS request for CORS
require_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {// Now handle the actual GET request
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config.php';

$sender_id = isset($_GET['sender_id']) ? intval($_GET['sender_id']) : 0;
$receiver_id = isset($_GET['receiver_id']) ? intval($_GET['receiver_id']) : 0;

if ($sender_id && $receiver_id) {
    // Fetch messages from the database
    $query = "SELECT * FROM admin_chat_messages WHERE (sender_id = $sender_id AND receiver_id = $receiver_id) 
OR (sender_id = $receiver_id AND receiver_id = $sender_id) ORDER BY created_at ASC";
    $result = $conn->query($query);

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        // Make sure the message field is not empty
        if (empty($row['message'])) {
            echo json_encode(['success' => false, 'message' => 'Message is empty for row: ' . json_encode($row)]);
            exit();
        }
        $messages[] = $row;
    }

    // Send response back to frontend
    echo json_encode(['success' => true, 'messages' => $messages]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
}
