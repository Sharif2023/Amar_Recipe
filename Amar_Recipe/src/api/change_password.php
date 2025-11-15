<?php



if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

require_once 'config.php';

$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];
$email = $data['email'];

// Fetch the current password from the DB for the given user
$stmt = $conn->prepare("SELECT password FROM admin_requests WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($storedPassword);
$stmt->fetch();
$stmt->close();

// Check if the current password is correct
if (!password_verify($currentPassword, $storedPassword)) {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
    $conn->close();
    exit;
}

// Hash the new password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update the password in the database
$stmt = $conn->prepare("UPDATE admin_requests SET password = ? WHERE email = ?");
$stmt->bind_param("ss", $hashedPassword, $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update password']);
}

$stmt->close();
$conn->close();
?>
