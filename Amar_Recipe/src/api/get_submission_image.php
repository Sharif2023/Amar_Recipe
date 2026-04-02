<?php
require_once __DIR__ . '/config.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit('Missing ID');
}

$conn = getDbConnection();

try {
    $stmt = $conn->prepare("SELECT image_data, file_type FROM submission_images WHERE submission_id = :id");
    $stmt->execute([':id' => $id]);
    $image = $stmt->fetch();

    if ($image && $image['image_data']) {
        $contentType = $image['file_type'] ?: 'image/jpeg';
        
        if (is_resource($image['image_data'])) {
            $data = stream_get_contents($image['image_data']);
        } else {
            $data = $image['image_data'];
        }

        header("Content-Type: $contentType");
        header("Content-Length: " . strlen($data));
        
        echo $data; 
    } else {
        http_response_code(404);
        echo 'Submission image not found';
    }
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error retrieving submission image';
}
