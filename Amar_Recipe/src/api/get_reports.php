<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$result = $conn->query("SELECT * FROM reports ORDER BY created_at DESC");

// Check if query was successful
if (!$result) {
    echo json_encode([
        "success" => false, 
        "message" => "Query failed: " . $conn->error
    ]);
    $conn->close();
    exit;
}

$reports = [];
while ($row = $result->fetch_assoc()) {
    $reports[] = $row;
}

echo json_encode(["success" => true, "reports" => $reports]);
$conn->close();
?>
