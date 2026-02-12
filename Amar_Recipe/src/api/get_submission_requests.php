<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
$stmt = $conn->query("SELECT * FROM submission_requests WHERE status = 'Pending' ORDER BY created_at DESC");
$requests = $stmt->fetchAll();

echo json_encode(['success' => true, 'requests' => $requests]);
