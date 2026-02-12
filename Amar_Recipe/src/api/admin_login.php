<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$conn = getDbConnection();
$stmt = $conn->prepare("SELECT * FROM admin_requests WHERE email = :email AND status = 'approved'");
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch();

if ($admin && password_verify($password, $admin['password'])) {
    echo json_encode(['success' => true, 'admin' => $admin]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
