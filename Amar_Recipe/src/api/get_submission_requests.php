<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$result = $conn->query("SELECT * FROM recipe_submission_requests WHERE status = 'pending' ORDER BY created_at DESC");
$requests = [];

while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode(["success" => true, "requests" => $requests]);
?>
