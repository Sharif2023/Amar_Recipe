<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mail_util.php';

$data = json_decode(file_get_contents('php://input'), true) ?: [];

$name = trim($data['name'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
$phone = trim($data['phone'] ?? '');
$address = trim($data['address'] ?? '');

if ($name === '' || $email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Name, email and password are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters.']);
    exit;
}

try {
    $conn = getDbConnection();
    ensureUserSchema($conn);

    $stmt = $conn->prepare("SELECT id, is_verified FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $existing = $stmt->fetch();

    if ($existing && !empty($existing['is_verified']) && $existing['is_verified'] !== 'f') {
        echo json_encode(['success' => false, 'message' => 'This email is already registered. Please login.']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(16));

    $conn->beginTransaction();

    if ($existing) {
        $update = $conn->prepare("
            UPDATE users
            SET name = :name, password = :password, phone = :phone, address = :address,
                is_verified = FALSE, verification_token = :token, updated_at = NOW()
            WHERE id = :id
        ");
        $update->execute([
            ':name' => $name,
            ':password' => $hash,
            ':phone' => $phone ?: null,
            ':address' => $address ?: null,
            ':token' => $token,
            ':id' => $existing['id'],
        ]);
    } else {
        $insert = $conn->prepare("
            INSERT INTO users (name, email, password, phone, address, is_verified, verification_token)
            VALUES (:name, :email, :password, :phone, :address, FALSE, :token)
        ");
        $insert->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $hash,
            ':phone' => $phone ?: null,
            ':address' => $address ?: null,
            ':token' => $token,
        ]);
    }

    $mailResult = sendUserSignupVerification($email, $name, $token);
    if ($mailResult !== true) {
        $conn->rollBack();
        echo json_encode([
            'success' => false,
            'message' => 'Account was not created because the verification email failed to send.',
            'debug_info' => $mailResult,
        ]);
        exit;
    }

    $conn->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Account created. Please check your email to verify, then login.',
        'verification_required' => true,
    ]);
} catch (Throwable $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Signup failed: ' . $e->getMessage()]);
}
