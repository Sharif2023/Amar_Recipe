<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

$conn = getDbConnection();
$stmt = $conn->prepare("SELECT * FROM admin_requests WHERE email = :email");
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

$deleteStmt = $conn->prepare("DELETE FROM admin_requests WHERE id = :id");
$deleteStmt->execute([':id' => $admin['id']]);

echo json_encode(['success' => true, 'message' => 'Account deleted successfully']);
