<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$admin_id = $_POST['admin_id'] ?? '';

if (empty($admin_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing admin ID']);
    exit;
}

// Handle profile image upload
$profile_image = null;
if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Delete old image if exists
    $oldStmt = $conn->prepare("SELECT profile_image FROM admin_requests WHERE id = :id");
    $oldStmt->execute([':id' => $admin_id]);
    $oldRow = $oldStmt->fetch();
    if ($oldRow && $oldRow['profile_image']) {
        $oldPath = __DIR__ . '/' . $oldRow['profile_image'];
        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }

    $fileTmpPath = $_FILES['profile_image']['tmp_name'];
    $fileName = basename($_FILES['profile_image']['name']);
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExts = ['png', 'jpg', 'jpeg', 'gif'];
    if (!in_array($fileExt, $allowedExts)) {
        echo json_encode(['success' => false, 'message' => 'Invalid image format']);
        exit;
    }
    $newFileName = uniqid('profile_', true) . '.' . $fileExt;
    $destPath = $uploadDir . $newFileName;
    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $profile_image = "uploads/" . $newFileName;
    }
}

// Build update query dynamically
$fields = [];
$params = [':id' => $admin_id];

if (isset($_POST['name'])) {
    $fields[] = "name = :name";
    $params[':name'] = trim($_POST['name']);
}
if (isset($_POST['phone'])) {
    $fields[] = "phone = :phone";
    $params[':phone'] = trim($_POST['phone']);
}
if (isset($_POST['email'])) {
    $fields[] = "email = :email";
    $params[':email'] = trim($_POST['email']);
}
if (isset($_POST['area'])) {
    $fields[] = "area = :area";
    $params[':area'] = trim($_POST['area']);
}
if (isset($_POST['city'])) {
    $fields[] = "city = :city";
    $params[':city'] = trim($_POST['city']);
}
if (isset($_POST['state'])) {
    $fields[] = "state = :state";
    $params[':state'] = trim($_POST['state']);
}
if (isset($_POST['postcode'])) {
    $fields[] = "postcode = :postcode";
    $params[':postcode'] = trim($_POST['postcode']);
}
if (isset($_POST['specialty'])) {
    $fields[] = "specialty = :specialty";
    $params[':specialty'] = trim($_POST['specialty']);
}
if ($profile_image) {
    $fields[] = "profile_image = :profile_image";
    $params[':profile_image'] = $profile_image;
}

if (empty($fields)) {
    echo json_encode(['success' => false, 'message' => 'No fields to update']);
    exit;
}

$sql = "UPDATE admin_requests SET " . implode(', ', $fields) . " WHERE id = :id";
$stmt = $conn->prepare($sql);
$stmt->execute($params);

// Fetch updated admin data
$fetchStmt = $conn->prepare("SELECT * FROM admin_requests WHERE id = :id");
$fetchStmt->execute([':id' => $admin_id]);
$admin = $fetchStmt->fetch();

echo json_encode(['success' => true, 'admin' => $admin, 'message' => 'Profile updated successfully']);
