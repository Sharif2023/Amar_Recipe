<?php
require_once __DIR__ . '/config.php';

// Support JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Fallback to $_POST for binary/form data if needed (though we primarily use JSON now)
if (!$data) {
    $data = $_POST;
}

$id = $data['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing recipe ID']);
    exit;
}

try {
    $conn = getDbConnection();

    // Handle image upload (if any)
    $image_url = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = basename($_FILES['image']['name']);
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExts = ['png', 'jpg', 'jpeg', 'gif'];
        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['success' => false, 'message' => 'Invalid image format']);
            exit;
        }
        $newFileName = uniqid('img_', true) . '.' . $fileExt;
        $destPath = $uploadDir . $newFileName;
        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $image_url = "uploads/" . $newFileName;
        }
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
        'comment' => 'comment'
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

    echo json_encode(['success' => true, 'message' => 'Recipe updated successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
