<?php
require_once __DIR__ . '/config.php';

// Ensure JSON response
header('Content-Type: application/json; charset=utf-8');

try {
    $conn = getDbConnection();

    // Frontend sends "id"; accept both "id" and "admin_id"
    $admin_id = $_POST['admin_id'] ?? $_POST['id'] ?? '';

    if (empty($admin_id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing admin ID']);
        exit;
    }

    // Handle profile image upload
    $profile_image = null;
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
                exit;
            }
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
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid image format']);
            exit;
        }
        $newFileName = uniqid('profile_', true) . '.' . $fileExt;
        $destPath = $uploadDir . $newFileName;
        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $profile_image = "uploads/" . $newFileName;
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
            exit;
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
    if (isset($_POST['city'])) {
        $fields[] = "city = :city";
        $params[':city'] = trim($_POST['city']);
    }
    if (isset($_POST['state'])) {
        $fields[] = "state = :state";
        $params[':state'] = trim($_POST['state']);
    }
    if (isset($_POST['experience'])) {
        $fields[] = "experience = :experience";
        $params[':experience'] = intval($_POST['experience']);
    }
    if (isset($_POST['portfolio'])) {
        $fields[] = "portfolio = :portfolio";
        $params[':portfolio'] = trim($_POST['portfolio']);
    }
    if (isset($_POST['certification'])) {
        $fields[] = "certification = :certification";
        $params[':certification'] = trim($_POST['certification']);
    }
    if ($profile_image) {
        $fields[] = "profile_image = :profile_image";
        $params[':profile_image'] = $profile_image;
    }

    if (empty($fields)) {
        http_response_code(400);
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

    if (!$admin) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Admin not found after update']);
        exit;
    }

    $profileImage = $admin['profile_image'] ?? null;
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'admin' => $admin,
        'profileImage' => $profileImage,
        'message' => 'Profile updated successfully'
    ]);
    
} catch (Throwable $e) {
    http_response_code(500);
    error_log("update_admin_profile.php error: " . $e->getMessage() . " | " . $e->getFile() . ":" . $e->getLine());
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'debug' => [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}
