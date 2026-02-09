<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$conn = getDbConnection();

$email = $data['email'];
$password = $data['password'];

// Verify credentials
$stmt = $conn->prepare("SELECT id FROM admin_requests WHERE email = ? AND status = 'approved'");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    exit();
}

// Delete the account
$deleteStmt = $conn->prepare("DELETE FROM admin_requests WHERE id = ?");
$deleteStmt->bind_param("i", $user['id']);

if ($deleteStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete account"]);
}
?>
