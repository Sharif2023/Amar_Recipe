<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Allow CORS for testing

require_once 'config.php';

// Helper function to sanitize input
function sanitize($conn, $data)
{
    return $conn->real_escape_string(trim($data));
}

// Check required fields
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

    // Generate unique file name to avoid conflicts
    $newFileName = uniqid('img_', true) . '.' . $fileExt;
    $destPath = $uploadDir . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        // Assuming your backend URL is http://yourdomain.com/
        $image_url = "uploads/" . $newFileName;
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to move uploaded image"]);
        exit;
    }
}

// Prepare and sanitize all inputs
$title = sanitize($conn, $_POST['title']);
$category = sanitize($conn, $_POST['category']);
$description = sanitize($conn, $_POST['description']);
$location = sanitize($conn, $_POST['location']);
$organizerName = sanitize($conn, $_POST['organizerName']);
$organizerEmail = sanitize($conn, $_POST['organizerEmail']);
$organizerAddress = sanitize($conn, $_POST['organizerAddress']);
$source = isset($_POST['source']) ? sanitize($conn, $_POST['source']) : '';
$tags = isset($_POST['tags']) ? sanitize($conn, $_POST['tags']) : '';
$reference = isset($_POST['reference']) ? sanitize($conn, $_POST['reference']) : '';
$tutorialVideo = isset($_POST['tutorialVideo']) ? sanitize($conn, $_POST['tutorialVideo']) : '';
$comment = isset($_POST['comment']) ? sanitize($conn, $_POST['comment']) : '';

// Function to calculate similarity of description
function is_similar_description($conn, $new_description)
{
    $threshold = 90; // similarity percentage

    // Fetch all existing descriptions
    $query = "SELECT description FROM recipes"; // Replace 'recipes' with your table name
    $result = mysqli_query($conn, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        similar_text(strip_tags($new_description), strip_tags($row['description']), $percent);
        if ($percent >= $threshold) {
            return true;
        }
    }
    return false;
}

// Before inserting, check for similar description
if (is_similar_description($conn, $_POST['description'])) {
    echo json_encode(["success" => false, "message" => "Similar recipe already exists."]);
    exit;
}

// Insert into DB
$sql = "INSERT INTO recipes (
    title, category, description, image_url, location, organizerName, organizerEmail,
    organizerAddress, source, tags, reference, tutorialVideo, comment
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param(
    'sssssssssssss',
    $title,
    $category,
    $description,
    $image_url,
    $location,
    $organizerName,
    $organizerEmail,
    $organizerAddress,
    $source,
    $tags,
    $reference,
    $tutorialVideo,
    $comment
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => "Insert failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
