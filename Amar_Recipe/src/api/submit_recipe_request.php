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
        if (!is_writable($uploadDir)) {
            echo json_encode(['success' => false, 'message' => "Upload directory is not writable. Please check permissions."]);
            exit;
        }

        $newFileName = uniqid('img_', true) . '.' . $fileExt;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $image_url = "uploads/" . $newFileName;
        } else {
            $last_error = error_get_last();
            $error_info = $last_error ? " (Error: " . $last_error['message'] . ")" : "";
            echo json_encode(['success' => false, 'message' => "Failed to move uploaded image to destination." . $error_info]);
            exit;
        }
    } else if ($_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $php_errors = [
            UPLOAD_ERR_INI_SIZE   => "The uploaded file exceeds the upload_max_filesize directive in php.ini",
            UPLOAD_ERR_FORM_SIZE  => "The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form",
            UPLOAD_ERR_PARTIAL    => "The uploaded file was only partially uploaded",
            UPLOAD_ERR_NO_TMP_DIR => "Missing a temporary folder",
            UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk",
            UPLOAD_ERR_EXTENSION  => "A PHP extension stopped the file upload",
        ];
        $errorCode = $_FILES['image']['error'];
        $errMsg = isset($php_errors[$errorCode]) ? $php_errors[$errorCode] : "Unknown upload error (Code $errorCode)";
        echo json_encode(['success' => false, 'message' => "Image upload error: $errMsg"]);
        exit;
    }
} else {
    // REQUIRE image for new submissions to ensure persistence
    echo json_encode(['success' => false, 'message' => "আপনার রেসিপির জন্য একটি ছবি প্রয়োজন।"]);
    exit;
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
function is_similar_description($conn, $new_desc, $new_title)
{
    // Fast check: Exact title match in submission_requests or recipes
    $stmt = $conn->prepare("SELECT COUNT(*) FROM recipes WHERE title = ?");
    $stmt->execute([$new_title]);
    if ($stmt->fetchColumn() > 0) return true;

    $stmt = $conn->prepare("SELECT COUNT(*) FROM submission_requests WHERE title = ? AND status != 'Rejected' AND is_verified = TRUE");
    $stmt->execute([$new_title]);
    if ($stmt->fetchColumn() > 0) return true;

    // Slower check: Compare description with recent recipes only
    $threshold = 90; 
    // Limit to last 5 recipes for performance
    $stmt = $conn->query("SELECT description FROM recipes ORDER BY id DESC LIMIT 5");
    while ($row = $stmt->fetch()) {
        $db_desc = $row['description'] ?? '';
        if (empty($db_desc)) continue;
        
        // Only run similar_text if lengths are somewhat close to save CPU
        $newLen = strlen($new_desc);
        $dbLen = strlen($db_desc);
        if (abs($newLen - $dbLen) > ($newLen * 0.2)) continue;

        similar_text(strip_tags($new_desc), strip_tags($db_desc), $percent);
        if ($percent >= $threshold) return true;
    }
    return false;
}

// Check for similar descriptions BEFORE transaction to avoid poisoning
if (is_similar_description($conn, $description, $title)) {
    echo json_encode(["success" => false, "message" => "A similar recipe already exists."]);
    exit;
}

try {
    $conn->beginTransaction();
    
    require_once __DIR__ . '/mail_util.php';
    $token = bin2hex(random_bytes(16));

    $stmt = $conn->prepare("INSERT INTO submission_requests 
        (title, category, description, image, location, organizerName, organizerEmail, organizerAddress, status, tags, reference, tutorialVideo, comment, source, is_verified, verification_token)
        VALUES (:title, :category, :description, :image, :location, :organizerName, :organizerEmail, :organizerAddress, :status, :tags, :reference, :tutorialVideo, :comment, :source, FALSE, :token)");

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
        ':source' => $source,
        ':token' => $token
    ]);

    // Send verification email
    $mailResult = sendSubmissionVerification($organizerEmail, $title, $token);
    if ($mailResult === true) {
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Your recipe has been submitted! Please check your email to verify and send it to the admin block.']);
    } else {
        $conn->rollback();
        echo json_encode([
            'success' => false, 
            'message' => 'The recipe was NOT saved because the verification email failed to send. Error: ' . (is_string($mailResult) ? $mailResult : 'Unknown SMTP Error'),
            'debug_info' => $mailResult
        ]);
    }

} catch (Throwable $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollback();
    }
    error_log("Submission Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'সার্ভার ত্রুটি: ' . $e->getMessage()]);
    exit;
}
