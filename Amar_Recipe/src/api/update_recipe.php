<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$id = $_POST['id'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing recipe ID']);
    exit;
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
$fields = [];
$params = [':id' => $id];

if (isset($_POST['title'])) {
    $fields[] = "title = :title";
    $params[':title'] = trim($_POST['title']);
}
if (isset($_POST['category'])) {
    $fields[] = "category = :category";
    $params[':category'] = trim($_POST['category']);
}
if (isset($_POST['description'])) {
    $fields[] = "description = :description";
    $params[':description'] = trim($_POST['description']);
}
if (isset($_POST['location'])) {
    $fields[] = "location = :location";
    $params[':location'] = trim($_POST['location']);
}
if (isset($_POST['organizerName'])) {
    $fields[] = "\"organizerName\" = :organizerName";
    $params[':organizerName'] = trim($_POST['organizerName']);
}
if (isset($_POST['organizerEmail'])) {
    $fields[] = "\"organizerEmail\" = :organizerEmail";
    $params[':organizerEmail'] = trim($_POST['organizerEmail']);
}
if (isset($_POST['organizerAddress'])) {
    $fields[] = "\"organizerAddress\" = :organizerAddress";
    $params[':organizerAddress'] = trim($_POST['organizerAddress']);
}
if (isset($_POST['tags'])) {
    $fields[] = "tags = :tags";
    $params[':tags'] = trim($_POST['tags']);
}
if (isset($_POST['reference'])) {
    $fields[] = "reference = :reference";
    $params[':reference'] = trim($_POST['reference']);
}
if (isset($_POST['tutorialVideo'])) {
    $fields[] = "\"tutorialVideo\" = :tutorialVideo";
    $params[':tutorialVideo'] = trim($_POST['tutorialVideo']);
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
