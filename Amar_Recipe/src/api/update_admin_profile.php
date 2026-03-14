<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Output buffering to catch any accidental output
ob_start();

require_once __DIR__ . '/config.php';

// Ensure JSON response
header('Content-Type: application/json; charset=utf-8');

try {
    // Clear any previous output
    ob_clean();
    
    $conn = getDbConnection();

    // Frontend sends "id"; accept both "id" and "admin_id"
    $admin_id = $_POST['admin_id'] ?? $_POST['id'] ?? '';

    if (empty($admin_id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing admin ID']);
        ob_end_flush();
        exit;
    }

    // Handle profile image upload
    $profile_image_url = null;
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['profile_image']['tmp_name'];
        $fileType = $_FILES['profile_image']['type'];

        if (!is_uploaded_file($fileTmpPath) || !filesize($fileTmpPath)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Image upload failed: invalid or empty file']);
            ob_end_flush();
            exit;
        }

        $imageData = file_get_contents($fileTmpPath);
        if ($imageData === false || strlen($imageData) === 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Image upload failed: invalid or empty file']);
            ob_end_flush();
            exit;
        }

        try {
            // Ensure admin_images table exists
            if (defined('DB_TYPE') && DB_TYPE === 'pgsql') {
                $conn->exec("
                    CREATE TABLE IF NOT EXISTS admin_images (
                        admin_id INT PRIMARY KEY REFERENCES admin_requests(id) ON DELETE CASCADE,
                        image_data BYTEA,
                        file_type VARCHAR(50),
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                ");
            }

            // Save image to DB
            $checkStmt = $conn->prepare("SELECT 1 FROM admin_images WHERE admin_id = :id");
            $checkStmt->execute([':id' => $admin_id]);

            if ($checkStmt->fetch()) {
                $imgSql = "UPDATE admin_images SET image_data = :data, file_type = :type WHERE admin_id = :id";
            } else {
                $imgSql = "INSERT INTO admin_images (admin_id, image_data, file_type) VALUES (:id, :data, :type)";
            }

            $imgStmt = $conn->prepare($imgSql);
            $imgStmt->bindParam(':id', $admin_id);
            $imgStmt->bindParam(':data', $imageData, PDO::PARAM_LOB);
            $imgStmt->bindParam(':type', $fileType);
            $imgStmt->execute();

            $apiUrl = defined('API_BASE_URL') ? API_BASE_URL : (getenv('RENDER') === 'true' ? 'https://' . getenv('RENDER_EXTERNAL_HOSTNAME') . '/src/api/' : 'http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/');
            $profile_image_url = $apiUrl . "get_admin_image.php?id=" . $admin_id . "&t=" . time();
        } catch (Exception $e) {
            error_log("Admin image update failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Image update failed: ' . $e->getMessage()]);
            ob_end_flush();
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
    if ($profile_image_url) {
        $fields[] = "profile_image = :profile_image";
        $params[':profile_image'] = $profile_image_url;
    }

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        ob_end_flush();
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
        ob_end_flush();
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
    ob_end_flush();
    
} catch (Throwable $e) {
    ob_clean();
    http_response_code(500);
    error_log("update_admin_profile.php error: " . $e->getMessage() . " | " . $e->getFile() . ":" . $e->getLine());
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'debug' => [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ]);
    ob_end_flush();
}

// Handle fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        http_response_code(500);
        error_log("Fatal PHP error in update_admin_profile.php: " . $error['message'] . " in " . $error['file'] . ":" . $error['line']);
        echo json_encode([
            'success' => false,
            'message' => 'Fatal server error: ' . $error['message'],
            'debug' => $error
        ]);
        ob_end_flush();
    }
});
