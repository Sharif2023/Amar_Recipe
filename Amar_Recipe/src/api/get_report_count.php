<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM reports");
    $row = $stmt->fetch();
    echo json_encode(['success' => true, 'count' => (int)$row['count']]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
