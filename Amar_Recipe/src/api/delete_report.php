<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'cors.php';
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check for POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get raw JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'No ID provided']);
    exit;
}

$id = intval($data['id']);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit;
}

require_once 'config.php';

// Check existence
$stmt = $conn->prepare("SELECT id FROM reports WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No report found']);
    exit;
}
$stmt->close();

// Delete record
$stmt = $mysqli->prepare("DELETE FROM reports WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Report deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Deletion failed: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
