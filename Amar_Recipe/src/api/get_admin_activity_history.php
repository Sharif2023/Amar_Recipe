<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$result = $conn->query("SELECT * FROM admin_chat_messages ORDER BY created_at DESC LIMIT 100");
$history = [];

while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

echo json_encode(["success" => true, "history" => $history]);
?>
