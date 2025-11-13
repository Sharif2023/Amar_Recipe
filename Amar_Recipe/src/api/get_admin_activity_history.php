<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

require_once 'config.php';

$sql = "SELECT id, name, email, status, comment AS rejection_reason, date AS action_date 
        FROM admin_requests 
        WHERE status != 'pending' 
        ORDER BY date DESC";


$result = $conn->query($sql);
$activity = [];

while ($row = $result->fetch_assoc()) {
    $activity[] = $row;
}

echo json_encode(['success' => true, 'data' => $activity]);
$conn->close();
?>
