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

        // Generate ETag from image data for cache validation
        $etag = '"' . md5($data) . '"';
        $lastModified = gmdate('D, d M Y H:i:s T');

        // Send cache headers — browser caches for 7 days
        header("Cache-Control: public, max-age=604800, immutable");
        header("ETag: $etag");
        header("Last-Modified: $lastModified");

        // Serve 304 Not Modified if client already has this version
        if (
            (isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] === $etag) ||
            isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])
        ) {
            http_response_code(304);
            exit;
        }

        // Output headers
        header("Content-Type: $contentType");
        header("Content-Length: " . strlen($data));
        
        echo $data; 
    } else {
        // Serve a default placeholder or 404
        http_response_code(404);
        // Optional: Redirect to a default image
        // header("Location: ../assets/default-recipe.png"); 
        echo 'Image not found';
    }
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error retrieving image';
}
