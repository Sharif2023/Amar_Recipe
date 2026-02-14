<?php
require_once __DIR__ . '/config.php';

// Support JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Fallback to $_POST for binary/form data
if (!$data) {
    $data = $_POST;
}


// DEBUG LOGGING
file_put_contents('update_debug.log', "Time: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
file_put_contents('update_debug.log', "FILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);
// END DEBUG

$id = $data['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing recipe ID']);
    exit;
}

try {
    $conn = getDbConnection();

    // Handle image upload
    $image_url = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileType = $_FILES['image']['type'];
        
        // Read file content
        $imageData = file_get_contents($fileTmpPath);
        
        if ($imageData) {
            try {
                // Check if image exists
                $checkStmt = $conn->prepare("SELECT 1 FROM recipe_images WHERE recipe_id = :id");
                $checkStmt->execute([':id' => $id]);
                
                if ($checkStmt->fetch()) {
                    // Update existing
                    $imgSql = "UPDATE recipe_images SET image_data = :data, file_type = :type WHERE recipe_id = :id";
                } else {
                    // Insert new
                    $imgSql = "INSERT INTO recipe_images (recipe_id, image_data, file_type) VALUES (:id, :data, :type)";
                }
                
                $imgStmt = $conn->prepare($imgSql);
                $imgStmt->bindParam(':id', $id);
                $imgStmt->bindParam(':data', $imageData, PDO::PARAM_LOB);
                $imgStmt->bindParam(':type', $fileType);
                $imgStmt->execute();

                // Set the new image URL with cache-busting timestamp
                $image_url = API_BASE_URL . "get_image.php?id=" . $id . "&t=" . time();
                
            } catch (Exception $e) {
                error_log("Image update failed: " . $e->getMessage());
            }
        }
    } elseif (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        error_log("Image upload failed with error code: " . $_FILES['image']['error']);
    }

    // Build update query dynamically
    // Using standardized lowercase keys from config.php (PDO::CASE_LOWER)
    $fields = [];
    $params = [':id' => $id];

    // Map possible camelCase from frontend to lowercase for safety
    $mapping = [
        'title' => 'title',
        'category' => 'category',
        'description' => 'description',
        'location' => 'location',
        'organizername' => 'organizername',
        'organizeremail' => 'organizeremail',
        'organizeraddress' => 'organizeraddress',
        'tags' => 'tags',
        'reference' => 'reference',
        'tutorialvideo' => 'tutorialvideo',
        'comment' => 'comment',
        'source' => 'source'
    ];

    foreach ($mapping as $apiKey => $dbKey) {
        if (isset($data[$apiKey])) {
            $fields[] = "$dbKey = :$apiKey";
            $params[":$apiKey"] = trim($data[$apiKey]);
        } 
        // Also check camelCase variants just in case
        else {
            $camelKey = str_replace(' ', '', ucwords(str_replace('_', ' ', $apiKey)));
            // Manual overrides for non-standard ucwords
            if ($apiKey === 'organizername') $camelKey = 'organizerName';
            if ($apiKey === 'organizeremail') $camelKey = 'organizerEmail';
            if ($apiKey === 'organizeraddress') $camelKey = 'organizerAddress';
            if ($apiKey === 'tutorialvideo') $camelKey = 'tutorialVideo';

            if (isset($data[$camelKey])) {
                $fields[] = "$dbKey = :$apiKey";
                $params[":$apiKey"] = trim($data[$camelKey]);
            }
        }
    }

    if ($image_url) {
        $fields[] = "image_url = :image_url";
        $params[':image_url'] = $image_url;
    }

    if (empty($fields)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit;
    }

    $sql = "UPDATE recipes SET " . implode(', ', $fields) . " WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    $response = ['success' => true, 'message' => 'Recipe updated successfully'];
    if ($image_url) {
        $response['image_url'] = $image_url;
    }
    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
