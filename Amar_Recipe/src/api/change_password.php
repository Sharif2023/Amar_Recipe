<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (empty($email) || empty($currentPassword) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("SELECT * FROM admin_requests WHERE email = :email AND status = 'approved'");
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($currentPassword, $admin['password'])) {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
    exit;
}

$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
$updateStmt = $conn->prepare("UPDATE admin_requests SET password = :password WHERE email = :email");
$updateStmt->execute([':password' => $hashedPassword, ':email' => $email]);

echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
