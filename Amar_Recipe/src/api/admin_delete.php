<?php

// Allow all origins (for development purposes)


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

require_once 'config.php';

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection failed']);
    exit;
}

$adminId = isset($data['adminId']) ? intval($data['adminId']) : 0;
$loggedInEmail = isset($data['loggedInEmail']) ? $data['loggedInEmail'] : '';

$rootAdminEmail = "sharifislam0505@gmail.com";

// Check if logged-in admin is root admin
if ($loggedInEmail !== $rootAdminEmail) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized action']);
    exit;
}

// ✅ Prevent deleting the root admin
$checkStmt = $conn->prepare("SELECT email FROM admin_requests WHERE id = ?");
$checkStmt->bind_param("i", $adminId);
$checkStmt->execute();
$checkStmt->bind_result($adminEmail);
$checkStmt->fetch();
$checkStmt->close();

if ($adminEmail === $rootAdminEmail) {
    echo json_encode(['success' => false, 'message' => 'Root admin cannot be deleted']);
    $conn->close();
    exit;
}

// Proceed to delete if not root admin
$stmt = $conn->prepare("DELETE FROM admin_requests WHERE id = ?");
$stmt->bind_param("i", $adminId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete admin']);
}

$stmt->close();
$conn->close();
?>
