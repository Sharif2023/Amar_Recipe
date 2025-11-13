<?php
// Start output buffering
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'cors.php';
require_once 'config.php';

// Test DB connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => $conn->connect_error]);
    ob_end_flush();
    exit;
}

// Fetch recipes
$sql = "SELECT * FROM recipes ORDER BY created_at DESC";
$result = $conn->query($sql);

$recipes = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
    $conn->close();
    ob_end_flush();
    exit;
}

// Send JSON response
echo json_encode([
    'success' => true,
    'count' => count($recipes),
    'recipes' => $recipes
]);

$conn->close();

// Flush buffer and end
ob_end_flush();
?>
