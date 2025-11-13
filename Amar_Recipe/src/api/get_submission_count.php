<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

require_once 'config.php';

$sql = "SELECT COUNT(*) as count FROM submission_requests WHERE status = 'Pending'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
echo json_encode(["success" => true, "count" => (int)$row['count']]);
?>
