<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Both current and new password are required.']);
    exit;
}

if (strlen($newPassword) < 8) {
    echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters.']);
    exit;
}

try {
    $conn = getDbConnection();
    $user = requireVerifiedUser($conn);

    // Fetch current hashed password from DB
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $user['id']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || !password_verify($currentPassword, $row['password'])) {
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect.']);
        exit;
    }

    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $update = $conn->prepare("UPDATE users SET password = :password, updated_at = NOW() WHERE id = :id");
    $update->execute([':password' => $newHash, ':id' => $user['id']]);

    // Invalidate all other sessions (security best practice)
    $tokenRaw = getRequestAuthToken();
    $currentHash = $tokenRaw ? hash('sha256', $tokenRaw) : null;
    if ($currentHash) {
        $conn->prepare("DELETE FROM user_sessions WHERE user_id = :uid AND token_hash != :current_hash")
             ->execute([':uid' => $user['id'], ':current_hash' => $currentHash]);
    }

    echo json_encode(['success' => true, 'message' => 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে: ' . $e->getMessage()]);
}
