<?php
require_once __DIR__ . '/config.php';

// Get the input data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Create a new MySQLi connection
$mysqli = getDbConnection();


// Check if the required fields are present
if (isset($data['sender_id'], $data['receiver_id'], $data['message'])) {
    $sender_id = $data['sender_id'];
    $receiver_id = $data['receiver_id'];
    $message = $data['message'];

    // Insert message into the database
    $query = "INSERT INTO admin_chat_messages (sender_id, receiver_id, message) 
              VALUES ('$sender_id', '$receiver_id', '$message')";

    if ($mysqli->query($query)) {  // Corrected to use $mysqli instead of $conn
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save message']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
}

?>
