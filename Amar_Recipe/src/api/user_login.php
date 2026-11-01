<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if ($email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

try {
    $conn = getDbConnection();
    ensureUserSchema($conn);

    $stmt = $conn->prepare("SELECT id, name, email, password, phone, address, is_verified, created_at FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }

    $verified = !empty($user['is_verified']) && $user['is_verified'] !== 'f';
    if (!$verified) {
        echo json_encode([
            'success' => false,
            'message' => 'Please verify your email before logging in.',
            'verification_required' => true,
        ]);
        exit;
    }

    $token = createUserSession($conn, (int) $user['id']);
    unset($user['password']);

    echo json_encode([
        'success' => true,
        'message' => 'Login successful.',
        'token' => $token,
        'user' => publicUserPayload($user),
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Login failed: ' . $e->getMessage()]);
}
