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
        
        // Output headers
        header("Content-Type: $contentType");
        header("Content-Length: " . strlen($stream = stream_get_contents($image['image_data'])));
        
        // Postgres BYTEA returns a stream resource or string depending on PDO config
        // In our config, it's likely a string or resource.
        echo $image['image_data']; 
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
