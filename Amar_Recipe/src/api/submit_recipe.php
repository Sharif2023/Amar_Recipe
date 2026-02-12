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

// Handle image upload
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
        echo json_encode(['success' => false, 'message' => "Invalid image format"]);
        exit;
    }
    $newFileName = uniqid('img_', true) . '.' . $fileExt;
    $destPath = $uploadDir . $newFileName;
    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $image_url = "uploads/" . $newFileName;
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to move uploaded image"]);
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

$stmt = $conn->prepare("INSERT INTO recipes 
    (title, category, description, image_url, location, organizerName, organizerEmail, organizerAddress, tags, reference, tutorialVideo, comment, source)
    VALUES (:title, :category, :description, :image_url, :location, :organizerName, :organizerEmail, :organizerAddress, :tags, :reference, :tutorialVideo, :comment, :source)");

$stmt->execute([
    ':title' => $title,
    ':category' => $category,
    ':description' => $description,
    ':image_url' => $image_url,
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

echo json_encode(['success' => true, 'message' => 'Recipe submitted successfully']);
