<?php


require_once 'config.php';

$sql = "SELECT * FROM submission_requests ORDER BY submission_date DESC";

$result = $conn->query($sql);

$requests = [];
while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode(['success' => true, 'data' => $requests]);

$conn->close();

