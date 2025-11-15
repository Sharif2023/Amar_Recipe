<?php


require_once 'config.php';

$result = $conn->query("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
$count = 0;
if ($result) {
    $row = $result->fetch_assoc();
    $count = intval($row['count']);
}

echo json_encode(['success' => true, 'count' => $count]);
$conn->close();

