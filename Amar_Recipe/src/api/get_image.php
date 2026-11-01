<?php
require_once __DIR__ . '/config.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit('Missing ID');
}

$conn = getDbConnection();

try {
    $stmt = $conn->prepare("SELECT image_data, file_type FROM recipe_images WHERE recipe_id = :id");
    $stmt->execute([':id' => $id]);
    $image = $stmt->fetch();

    if ($image && $image['image_data']) {
        // If file_type is missing, default to jpeg
        $contentType = $image['file_type'] ?: 'image/jpeg';
        
        if (is_resource($image['image_data'])) {
            $data = stream_get_contents($image['image_data']);
        } else {
            $data = $image['image_data'];
        }

        if ($data === false || strlen($data) === 0) {
            http_response_code(404);
            echo 'Image not found';
            exit;
        }

        $etag = '"' . md5($data) . '"';
        header("Cache-Control: public, max-age=604800, immutable");
        header("ETag: $etag");
        header("Content-Type: $contentType");
        header("Content-Length: " . strlen($data));

        if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
            http_response_code(304);
            exit;
        }

        echo $data;
    } else {
        http_response_code(404);
        echo 'Image not found';
    }
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error retrieving image';
}
