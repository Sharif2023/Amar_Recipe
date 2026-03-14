<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

try {
    $conn = getDbConnection();
    
    // First query: find by email (case-sensitive in PostgreSQL)
    $stmt = $conn->prepare("SELECT * FROM admin_requests WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch();
    
    // Debug: Check if email found
    if (!$admin) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials', 'debug' => 'Email not found']);
        exit();
    }
    
    // Check status
    if ($admin['status'] !== 'approved') {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials', 'debug' => 'Status is ' . $admin['status']]);
        exit();
    }
    
    // Verify password
    if (!password_verify($password, $admin['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials', 'debug' => 'Password mismatch']);
        exit();
    }
    
    echo json_encode(['success' => true, 'admin' => $admin]);
    
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
