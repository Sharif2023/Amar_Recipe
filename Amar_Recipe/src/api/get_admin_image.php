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

    if ($image && !empty($image['image_data'])) {
        $contentType = !empty($image['file_type']) ? $image['file_type'] : 'image/jpeg';
        $data = is_resource($image['image_data']) ? stream_get_contents($image['image_data']) : $image['image_data'];

        if ($data === false || strlen($data) === 0) {
            http_response_code(404);
            exit;
        }

        $etag = '"' . md5($data) . '"';
        header('Cache-Control: public, max-age=604800, immutable');
        header('ETag: ' . $etag);
        header('Content-Type: ' . $contentType);
        header('Content-Length: ' . strlen($data));

        if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
            http_response_code(304);
            exit;
        }

        echo $data;
        exit;
    } else {
        header("HTTP/1.1 404 Not Found");
        exit;
    }
} catch (Exception $e) {
    error_log("get_admin_image.php error: " . $e->getMessage());
    header("HTTP/1.1 500 Internal Server Error");
}
