<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
$stmt = $conn->query("SELECT * FROM admin_requests ORDER BY date DESC");
$requests = $stmt->fetchAll();

echo json_encode(['success' => true, 'requests' => $requests]);
