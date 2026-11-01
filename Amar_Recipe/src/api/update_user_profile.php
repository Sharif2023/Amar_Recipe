<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true) ?: [];

try {
    $conn = getDbConnection();
    $user = requireVerifiedUser($conn);

    $name = trim($data['name'] ?? $user['name']);
    $phone = trim($data['phone'] ?? ($user['phone'] ?? ''));
    $address = trim($data['address'] ?? ($user['address'] ?? ''));

    if ($name === '') {
        echo json_encode(['success' => false, 'message' => 'Name is required.']);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE users
        SET name = :name, phone = :phone, address = :address, updated_at = NOW()
        WHERE id = :id
    ");
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone ?: null,
        ':address' => $address ?: null,
        ':id' => $user['id'],
    ]);

    $fresh = $conn->prepare("SELECT id, name, email, phone, address, is_verified, created_at FROM users WHERE id = :id");
    $fresh->execute([':id' => $user['id']]);
    $updated = $fresh->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Profile updated.',
        'user' => publicUserPayload($updated),
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $e->getMessage()]);
}
