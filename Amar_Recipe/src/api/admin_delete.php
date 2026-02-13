<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['adminId'] ?? '';
$loggedInEmail = $data['loggedInEmail'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing ID']);
    exit;
}

// Security: Check if logged in user is root admin
$rootAdminEmail = "sharifislam0505@gmail.com";
if ($loggedInEmail !== $rootAdminEmail) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$conn = getDbConnection();
try {
    $stmt = $conn->prepare("DELETE FROM admin_requests WHERE id = :id");
    $stmt->execute([':id' => $id]);
    echo json_encode(['success' => true, 'message' => 'Admin deleted']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Delete failed: ' . $e->getMessage()]);
}
