<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$reason = $data['reason'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing submission ID']);
    exit;
}

try {
    $conn = getDbConnection();

    // Check if audit columns exist
    $hasAuditCols = false;
    try {
        $conn->query("SELECT action_date, admin_name FROM submission_requests LIMIT 0");
        $hasAuditCols = true;
    } catch (Throwable $e) {
        $hasAuditCols = false;
    }

    $admin_name = $data['admin_name'] ?? 'Admin';
    // Fetch submission details for email before status change
    $fetchStmt = $conn->prepare("SELECT organizeremail, title FROM submission_requests WHERE id = :id");
    $fetchStmt->execute([':id' => $id]);
    $submission = $fetchStmt->fetch();

    if ($hasAuditCols) {
        $stmt = $conn->prepare("UPDATE submission_requests SET status = 'Rejected', comment = :reason, action_date = NOW(), admin_name = :admin_name WHERE id = :id");
        $stmt->execute([':reason' => $reason, ':id' => $id, ':admin_name' => $admin_name]);
    } else {
        // Fallback: columns might be missing
        $stmt = $conn->prepare("UPDATE submission_requests SET status = 'Rejected', comment = :reason WHERE id = :id");
        $stmt->execute([':reason' => $reason, ':id' => $id]);
    }

    // Send Rejection Email
    if ($submission && !empty($submission['organizeremail'])) {
        require_once __DIR__ . '/mail_util.php';
        sendRecipeDeclineNotification($submission['organizeremail'], $submission['title'], $reason);
    }


    echo json_encode(['success' => true, 'message' => 'Submission rejected']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Rejection failed: ' . $e->getMessage()]);
}

