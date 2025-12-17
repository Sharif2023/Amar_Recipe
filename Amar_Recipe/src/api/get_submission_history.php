<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$result = $conn->query("SELECT * FROM recipe_submission_requests WHERE status != 'pending' ORDER BY updated_at DESC");
$history = [];

while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

echo json_encode(["success" => true, "history" => $history]);
?>
