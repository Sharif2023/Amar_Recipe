<?php
require_once __DIR__ . '/config.php';

// Support JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Fallback to $_POST for binary/form data
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

    // Handle image upload: store binary in recipe_images (BYTEA); fail request if image save fails
    $image_url = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileType = $_FILES['image']['type'];

        if (!is_uploaded_file($fileTmpPath) || !filesize($fileTmpPath)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Image update failed: invalid or empty file']);
            exit;
        }

        $imageData = file_get_contents($fileTmpPath);
        if ($imageData === false || strlen($imageData) === 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Image update failed: invalid or empty file']);
            exit;
        }

        try {
            // Ensure recipe_images table exists (e.g. on first deploy). No FK to recipes so it works
            // even when recipes.id is not a formal primary key on production.
            if (defined('DB_TYPE') && DB_TYPE === 'pgsql') {
                $conn->exec("
                    CREATE TABLE IF NOT EXISTS recipe_images (
                        recipe_id INT PRIMARY KEY,
                        image_data BYTEA,
                        file_type VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ");
            }

            $checkStmt = $conn->prepare("SELECT 1 FROM recipe_images WHERE recipe_id = :id");
            $checkStmt->execute([':id' => $id]);

            if ($checkStmt->fetch()) {
                $imgSql = "UPDATE recipe_images SET image_data = :data, file_type = :type WHERE recipe_id = :id";
            } else {
                $imgSql = "INSERT INTO recipe_images (recipe_id, image_data, file_type) VALUES (:id, :data, :type)";
            }

            $imgStmt = $conn->prepare($imgSql);
            $imgStmt->bindParam(':id', $id);
            $imgStmt->bindParam(':data', $imageData, PDO::PARAM_LOB);
            $imgStmt->bindParam(':type', $fileType);
            $imgStmt->execute();

            $apiUrl = defined('API_BASE_URL') ? API_BASE_URL : (getenv('RENDER') === 'true' ? 'https://' . getenv('RENDER_EXTERNAL_HOSTNAME') . '/src/api/' : 'http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/');
            $image_url = $apiUrl . "get_image.php?id=" . $id . "&t=" . time();
        } catch (Exception $e) {
            error_log("Image update failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Image update failed: ' . $e->getMessage()]);
            exit;
        }
    } elseif (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $code = $_FILES['image']['error'];
        $msg = $code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE
            ? 'Image too large' : 'Image upload failed (error ' . $code . ')';
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $msg]);
        exit;
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

    // Send edit notification
    try {
        require_once __DIR__ . '/mail_util.php';
        // Get the current recipe details to find organizeremail and title
        $recipeStmt = $conn->prepare("SELECT title, organizeremail FROM recipes WHERE id = :id");
        $recipeStmt->execute([':id' => $id]);
        $recipeData = $recipeStmt->fetch();

        if ($recipeData && !empty($recipeData['organizeremail'])) {
            $changedFields = [];
            foreach ($mapping as $apiKey => $dbKey) {
                if (isset($data[$apiKey]) || isset($data[str_replace(' ', '', ucwords(str_replace('_', ' ', $apiKey)))])) {
                    $changedFields[] = $apiKey;
                }
            }
            if ($image_url) $changedFields[] = "image";
            
            $msg = "অ্যাডমিন আপনার রেসিপিতে কিছু পরিবর্তন করেছেন। পরিবর্তিত বিষয়গুলো হলো: " . implode(', ', $changedFields);
            sendRecipeEditNotification($recipeData['organizeremail'], $recipeData['title'], $msg);
        }
    } catch (Throwable $mailError) {
        error_log("Failed to send edit notification: " . $mailError->getMessage());
    }

    $response = ['success' => true, 'message' => 'Recipe updated successfully'];
    if ($image_url) {
        $response['image_url'] = $image_url;
    }
    echo json_encode($response);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
