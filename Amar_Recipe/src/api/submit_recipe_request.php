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
if (isset($_FILES['image'])) {
    if ($_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = basename($_FILES['image']['name']);
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExts = ['png', 'jpg', 'jpeg', 'gif'];
        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['success' => false, 'message' => "Invalid image format. Allowed: PNG, JPG, JPEG, GIF"]);
            exit;
        }
        $newFileName = uniqid('img_', true) . '.' . $fileExt;
        $destPath = $uploadDir . $newFileName;
        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $image_url = "uploads/" . $newFileName;
        } else {
            echo json_encode(['success' => false, 'message' => "Failed to move uploaded image to destination."]);
            exit;
        }
    } else if ($_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        // Report specific PHP upload errors
        $php_errors = [
            UPLOAD_ERR_INI_SIZE   => "The uploaded file exceeds the upload_max_filesize directive in php.ini",
            UPLOAD_ERR_FORM_SIZE  => "The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form",
            UPLOAD_ERR_PARTIAL    => "The uploaded file was only partially uploaded",
            UPLOAD_ERR_NO_TMP_DIR => "Missing a temporary folder",
            UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk",
            UPLOAD_ERR_EXTENSION  => "A PHP extension stopped the file upload",
        ];
        $errMsg = isset($php_errors[$_FILES['image']['error']]) ? $php_errors[$_FILES['image']['error']] : "Unknown upload error";
        echo json_encode(['success' => false, 'message' => "Image upload error: $errMsg"]);
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
$status = 'Pending';
$source = isset($_POST['source']) ? trim($_POST['source']) : '';
$tags = isset($_POST['tags']) ? trim($_POST['tags']) : '';
$reference = isset($_POST['reference']) ? trim($_POST['reference']) : '';
$tutorialVideo = isset($_POST['tutorialVideo']) ? trim($_POST['tutorialVideo']) : '';
$comment = isset($_POST['comment']) ? trim($_POST['comment']) : '';

// Check for similar descriptions
function is_similar_description($conn, $new_desc)
{
    $threshold = 90;
    try {
        $stmt = $conn->query("SELECT description FROM recipes");
        while ($row = $stmt->fetch()) {
            $db_desc = $row['description'] ?? ''; // Handle NULL
            similar_text(strip_tags($new_desc), strip_tags($db_desc), $percent);
            if ($percent >= $threshold) return true;
        }
    } catch (Exception $e) {
        // Ignore errors in similarity check to allow submission? 
        // Or log them. For now, just continue or return false.
        return false; 
    }
    return false;
}

try {
    if (is_similar_description($conn, $description)) {
        echo json_encode(["success" => false, "message" => "A similar recipe already exists."]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO submission_requests 
        (title, category, description, image, location, organizerName, organizerEmail, organizerAddress, status, tags, reference, tutorialVideo, comment, source)
        VALUES (:title, :category, :description, :image, :location, :organizerName, :organizerEmail, :organizerAddress, :status, :tags, :reference, :tutorialVideo, :comment, :source)");

    $stmt->execute([
        ':title' => $title,
        ':category' => $category,
        ':description' => $description,
        ':image' => $image_url,
        ':location' => $location,
        ':organizerName' => $organizerName,
        ':organizerEmail' => $organizerEmail,
        ':organizerAddress' => $organizerAddress,
        ':status' => $status,
        ':tags' => $tags,
        ':reference' => $reference,
        ':tutorialVideo' => $tutorialVideo,
        ':comment' => $comment,
        ':source' => $source
    ]);

    echo json_encode(['success' => true]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
    exit;
}
