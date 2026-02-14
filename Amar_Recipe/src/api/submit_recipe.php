<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

// Validate required fields
$required_fields = ['title', 'category', 'description', 'location', 'organizerName', 'organizerEmail', 'organizerAddress'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
        exit;
    }
}

    // Handle Image Upload (Database Storage)
    $imageData = null;
    $fileType = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileType = $_FILES['image']['type'];
        
        // Read file content
        $imageData = file_get_contents($fileTmpPath);
        
        // Validate image type
        $allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        if (!in_array($fileType, $allowedTypes)) {
            echo json_encode(['success' => false, 'message' => "Invalid image format"]);
            exit;
        }
    }

$title = trim($_POST['title']);
$category = trim($_POST['category']);
$description = trim($_POST['description']);
$location = trim($_POST['location']);
$organizerName = trim($_POST['organizerName']);
$organizerEmail = trim($_POST['organizerEmail']);
$organizerAddress = trim($_POST['organizerAddress']);
$source = isset($_POST['source']) ? trim($_POST['source']) : '';
$tags = isset($_POST['tags']) ? trim($_POST['tags']) : '';
$reference = isset($_POST['reference']) ? trim($_POST['reference']) : '';
$tutorialVideo = isset($_POST['tutorialVideo']) ? trim($_POST['tutorialVideo']) : '';
$comment = isset($_POST['comment']) ? trim($_POST['comment']) : '';

// Check for similar descriptions
function is_similar_description($conn, $new_desc)
{
    $threshold = 90;
    $stmt = $conn->query("SELECT description FROM recipes");
    while ($row = $stmt->fetch()) {
        similar_text(strip_tags($new_desc), strip_tags($row['description']), $percent);
        if ($percent >= $threshold) return true;
    }
    return false;
}

if (is_similar_description($conn, $description)) {
    echo json_encode(["success" => false, "message" => "A similar recipe already exists."]);
    exit;
}

    // Use a placeholder URL first, will update after insertion
    $placeholderUrl = 'pending';
    
    $sql = "INSERT INTO recipes 
            (title, category, description, image_url, location, organizerName, organizerEmail, organizerAddress, tags, reference, tutorialVideo, comment, source)
            VALUES (:title, :category, :description, :image_url, :location, :organizerName, :organizerEmail, :organizerAddress, :tags, :reference, :tutorialVideo, :comment, :source)";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':title' => $title,
        ':category' => $category,
        ':description' => $description,
        ':image_url' => $placeholderUrl, // Use placeholder initially
        ':location' => $location,
        ':organizerName' => $organizerName,
        ':organizerEmail' => $organizerEmail,
        ':organizerAddress' => $organizerAddress,
        ':tags' => $tags,
        ':reference' => $reference,
        ':tutorialVideo' => $tutorialVideo,
        ':comment' => $comment,
        ':source' => $source
    ]);

    $recipeId = $conn->lastInsertId();

    // Save Image to DB and update URL
    if ($imageData) {
        try {
            // Insert binary data
            $imgSql = "INSERT INTO recipe_images (recipe_id, image_data, file_type) VALUES (:id, :data, :type)";
            $imgStmt = $conn->prepare($imgSql);
            $imgStmt->bindParam(':id', $recipeId);
            $imgStmt->bindParam(':data', $imageData, PDO::PARAM_LOB);
            $imgStmt->bindParam(':type', $fileType);
            $imgStmt->execute();

            // Update recipe with generic URL
            // Assuming API_BASE_URL is defined in config.php or elsewhere
            $finalImageUrl = (defined('API_BASE_URL') ? API_BASE_URL : '') . "get_image.php?id=" . $recipeId . "&t=" . time();
            $updateStmt = $conn->prepare("UPDATE recipes SET image_url = :url WHERE id = :id");
            $updateStmt->execute([':url' => $finalImageUrl, ':id' => $recipeId]);
        } catch (Exception $e) {
            // Log error but don't fail the whole request
            error_log("Image save failed: " . $e->getMessage());
            // Optionally, update image_url to an error state or empty
            $updateStmt = $conn->prepare("UPDATE recipes SET image_url = '' WHERE id = :id");
            $updateStmt->execute([':id' => $recipeId]);
        }
    } else {
         // Clear the placeholder if no image was uploaded
         $updateStmt = $conn->prepare("UPDATE recipes SET image_url = '' WHERE id = :id");
         $updateStmt->execute([':id' => $recipeId]);
    }

echo json_encode(['success' => true, 'message' => 'Recipe submitted successfully']);
