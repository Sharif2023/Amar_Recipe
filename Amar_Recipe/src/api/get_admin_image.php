<?php
require_once __DIR__ . '/config.php';

$id = $_GET['id'] ?? '';

if (empty($id)) {
    header("HTTP/1.1 404 Not Found");
    exit;
}

try {
    $conn = getDbConnection();
    
    $stmt = $conn->prepare("SELECT image_data, file_type FROM admin_images WHERE admin_id = :id");
    $stmt->execute([':id' => $id]);
    $image = $stmt->fetch();

    if ($image) {
        header("Content-Type: " . $image['file_type']);
        
        // Handle PostgreSQL BYTEA (can be a stream or hex string)
        if (is_resource($image['image_data'])) {
            fpassthru($image['image_data']);
        } else {
            echo $image['image_data'];
        }
    } else {
        // Return default placeholder or 404
        header("HTTP/1.1 404 Not Found");
    }
} catch (Exception $e) {
    error_log("get_admin_image.php error: " . $e->getMessage());
    header("HTTP/1.1 500 Internal Server Error");
}
