<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
$stmt = $conn->query("SELECT COUNT(*) as count FROM submission_requests WHERE status = 'Pending'");
$row = $stmt->fetch();

echo json_encode(['success' => true, 'count' => (int)$row['count']]);
