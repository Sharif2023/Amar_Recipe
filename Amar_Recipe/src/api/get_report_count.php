<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$result = $conn->query("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
$row = $result->fetch_assoc();

echo json_encode(["success" => true, "count" => $row['count']]);
?>
