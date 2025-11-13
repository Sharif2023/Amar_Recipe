<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once 'config.php';

$sql = "SELECT * FROM recipes ORDER BY created_at DESC";
$result = $conn->query($sql);

$recipes = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }
}

echo json_encode(['success' => true, 'recipes' => $recipes]);
$conn->close();

