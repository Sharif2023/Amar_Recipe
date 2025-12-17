<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$conn = getDbConnection();

$email = $data['email'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// First verify current password
$stmt = $conn->prepare("SELECT password FROM admin_requests WHERE email = ? AND status = 'approved'");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($currentPassword, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
    exit();
}

// Update password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
$updateStmt = $conn->prepare("UPDATE admin_requests SET password = ? WHERE email = ? AND status = 'approved'");
$updateStmt->bind_param("ss", $hashedPassword, $email);

if ($updateStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Password updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update password"]);
}
?>
