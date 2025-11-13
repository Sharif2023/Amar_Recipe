<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

require_once 'config.php';

function sanitize($conn, $data)
{
    return $conn->real_escape_string(trim($data));
}

$required_fields = ['title', 'category', 'description', 'location', 'organizerName', 'organizerEmail', 'organizerAddress'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
        exit;
    }
}

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

$title = sanitize($conn, $_POST['title']);
$category = sanitize($conn, $_POST['category']);
$description = sanitize($conn, $_POST['description']);
$location = sanitize($conn, $_POST['location']);
$organizerName = sanitize($conn, $_POST['organizerName']);
$organizerEmail = sanitize($conn, $_POST['organizerEmail']);
$organizerAddress = sanitize($conn, $_POST['organizerAddress']);
$status = 'Pending';
$source = isset($_POST['source']) ? sanitize($conn, $_POST['source']) : '';
$tags = isset($_POST['tags']) ? sanitize($conn, $_POST['tags']) : '';
$reference = isset($_POST['reference']) ? sanitize($conn, $_POST['reference']) : '';
$tutorialVideo = isset($_POST['tutorialVideo']) ? sanitize($conn, $_POST['tutorialVideo']) : '';
$comment = isset($_POST['comment']) ? sanitize($conn, $_POST['comment']) : '';

function is_similar_description($conn, $new_desc)
{
    $threshold = 90;
    $res = $conn->query("SELECT description FROM recipes");
    while ($row = $res->fetch_assoc()) {
        similar_text(strip_tags($new_desc), strip_tags($row['description']), $percent);
        if ($percent >= $threshold) return true;
    }
    return false;
}

if (is_similar_description($conn, $description)) {
    echo json_encode(["success" => false, "message" => "A similar recipe already exists."]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO submission_requests 
    (title, category, description, image, location, organizerName, organizerEmail, organizerAddress, status, tags, reference, tutorialVideo, comment, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param(
    'ssssssssssssss',
    $title,
    $category,
    $description,
    $image_url,
    $location,
    $organizerName,
    $organizerEmail,
    $organizerAddress,
    $status,
    $tags,
    $reference,
    $tutorialVideo,
    $comment,
    $source
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => "Insert failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
