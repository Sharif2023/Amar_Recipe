<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing submission ID']);
    exit;
}

try {
    $conn = getDbConnection();

    // Fetch the submission request
    $stmt = $conn->prepare("SELECT * FROM submission_requests WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $submission = $stmt->fetch();

    if (!$submission) {
        echo json_encode(['success' => false, 'message' => 'Submission not found']);
        exit;
    }

    // Check if new columns exist (to avoid Postgres transaction abort)
    $hasNewCols = false;
    try {
        $checkStmt = $conn->query("SELECT action_date, admin_name FROM submission_requests LIMIT 0");
        $hasNewCols = true;
    } catch (Throwable $e) {
        $hasNewCols = false;
    }

    // Start transaction
    $conn->beginTransaction();

    // Update submission status to Approved
    $admin_name = $data['admin_name'] ?? 'Admin';
    if ($hasNewCols) {
        $updateStmt = $conn->prepare("UPDATE submission_requests SET status = 'Approved', action_date = NOW(), admin_name = :admin_name WHERE id = :id");
        $updateStmt->execute([':id' => $id, ':admin_name' => $admin_name]);
    } else {
        $updateStmt = $conn->prepare("UPDATE submission_requests SET status = 'Approved' WHERE id = :id");
        $updateStmt->execute([':id' => $id]);
    }


    // Insert into recipes table
    // Note: Column names in PostgreSQL are returned in lowercase unless quoted.
    // submission_requests columns: title, category, description, image, location, organizername, organizeremail, organizeraddress, tags, reference, tutorialvideo, comment, source
    // recipes columns: title, category, description, image_url, location, organizername, organizeremail, organizeraddress, tags, reference, tutorialvideo, comment, source, created_at
    
    $insertStmt = $conn->prepare("INSERT INTO recipes 
        (title, category, description, image_url, location, organizername, organizeremail, organizeraddress, tags, reference, tutorialvideo, comment, source, created_at)
        VALUES (:title, :category, :description, :image_url, :location, :organizername, :organizeremail, :organizeraddress, :tags, :reference, :tutorialvideo, :comment, :source, NOW())");
    
    $insertStmt->execute([
        ':title' => $submission['title'] ?? '',
        ':category' => $submission['category'] ?? 'Miscellaneous',
        ':description' => $submission['description'] ?? '',
        ':image_url' => $submission['image'] ?? '',
        ':location' => $submission['location'] ?? 'Unknown',
        ':organizername' => $submission['organizername'] ?? 'User',
        ':organizeremail' => $submission['organizeremail'] ?? '',
        ':organizeraddress' => $submission['organizeraddress'] ?? '',
        ':tags' => $submission['tags'] ?? '',
        ':reference' => $submission['reference'] ?? '',
        ':tutorialvideo' => $submission['tutorialvideo'] ?? '',
        ':comment' => $submission['comment'] ?? '',
        ':source' => $submission['source'] ?? ''
    ]);

    $recipeId = $conn->lastInsertId();

    // Handle Image Persistence (Move from submission_images to recipe_images table)
    $fetchImgStmt = $conn->prepare("SELECT image_data, file_type FROM submission_images WHERE submission_id = :id");
    $fetchImgStmt->execute([':id' => $id]);
    $subImage = $fetchImgStmt->fetch();

    if ($subImage && $subImage['image_data']) {
        $imageData = $subImage['image_data'];
        $fileType = $subImage['file_type'] ?: 'image/jpeg';
        
        // Insert into recipe_images
        $imgSql = "INSERT INTO recipe_images (recipe_id, image_data, file_type) VALUES (:id, :data, :type)";
        $imgStmt = $conn->prepare($imgSql);
        $imgStmt->bindParam(':id', $recipeId);
        $imgStmt->bindParam(':data', $imageData, PDO::PARAM_LOB);
        $imgStmt->bindParam(':type', $fileType);
        $imgStmt->execute();

        // Update recipe url to point to persistent DB image
        $apiUrl = API_BASE_URL; // Using constant from config.php
        $newUrl = $apiUrl . "get_image.php?id=" . $recipeId . "&t=" . time();
        $updateUrlStmt = $conn->prepare("UPDATE recipes SET image_url = :url WHERE id = :id");
        $updateUrlStmt->execute([':url' => $newUrl, ':id' => $recipeId]);

        // Clean up temporary submission image
        $cleanupStmt = $conn->prepare("DELETE FROM submission_images WHERE submission_id = :id");
        $cleanupStmt->execute([':id' => $id]);
    }

    $conn->commit();
    
    // Send approval notification
    require_once __DIR__ . '/mail_util.php';
    sendRecipeApprovalNotification($submission['organizeremail'], $submission['title']);

    echo json_encode(['success' => true, 'message' => 'Submission approved and recipe added']);

} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Approval failed: ' . $e->getMessage()]);
}

