<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit();
}

if (!isset($_POST['id'])) {
    echo json_encode(["success" => false, "message" => "Missing ID"]);
    exit();
}

require_once 'config.php';

$id = $_POST['id'];
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$city = $_POST['city'] ?? '';
$state = $_POST['state'] ?? '';
$experience = $_POST['experience'] ?? '';
$portfolio = $_POST['portfolio'] ?? '';
$certification = $_POST['certification'] ?? '';

// Update text fields first
$stmt = $conn->prepare("UPDATE admin_requests SET name = ?, email = ?, phone = ?, city = ?, state = ?, experience = ?, portfolio = ?, certification = ? WHERE id = ?");
$stmt->bind_param("ssssssssi", $name, $email, $phone, $city, $state, $experience, $portfolio, $certification, $id);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Error updating fields: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

$response = ["success" => true];

// If there's a profile image to upload
if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
    // Fetch old image path first
    $getImageQuery = $conn->prepare("SELECT profile_image FROM admin_requests WHERE id = ?");
    $getImageQuery->bind_param("i", $id);
    $getImageQuery->execute();
    $getImageQuery->bind_result($oldImagePath);
    $getImageQuery->fetch();
    $getImageQuery->close();

    // Upload new image
    $imageName = basename($_FILES['profileImage']['name']);
    $targetDir = "admin_dp_uploads/"; // Store image in relative path
    $newImagePath = $targetDir . uniqid() . "_" . $imageName;

    if (move_uploaded_file($_FILES['profileImage']['tmp_name'], $newImagePath)) {
        // Delete old image file (unless it's default placeholder or empty)
        if (!empty($oldImagePath) && file_exists($oldImagePath) && strpos($oldImagePath, 'default') === false) {
            unlink($oldImagePath);
        }

        // Save new path in database as a relative path
        $updateImgStmt = $conn->prepare("UPDATE admin_requests SET profile_image = ? WHERE id = ?");
        $updateImgStmt->bind_param("si", $newImagePath, $id);
        if ($updateImgStmt->execute()) {
            // Respond with the full URL (returning it for the frontend to handle)
            $response["profileImage"] = "http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/" . $newImagePath;
        } else {
            $response["success"] = false;
            $response["message"] = "Error saving image path: " . $updateImgStmt->error;
        }
        $updateImgStmt->close();
    } else {
        $response["success"] = false;
        $response["message"] = "Image upload failed.";
    }
}

$conn->close();
echo json_encode($response);
