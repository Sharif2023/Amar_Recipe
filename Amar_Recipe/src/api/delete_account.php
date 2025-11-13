<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

require_once 'config.php';

$email = $data['email'];  // Logged-in admin's email

// Ensure the admin is allowed to delete their account (i.e., not the root admin)
$rootAdminEmail = "sharifislam0505@gmail.com";

if ($email === $rootAdminEmail) {
    echo json_encode(['success' => false, 'message' => 'Root admin cannot delete their account']);
    $conn->close();
    exit;
}

// Delete the admin's account from the database
$stmt = $conn->prepare("DELETE FROM admin_requests WHERE email = ?");
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Account deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete account']);
}

$stmt->close();
$conn->close();
?>
