<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Debug logging (optional, remove in prod)
// file_put_contents('reject_log.txt', print_r($data, true));

$id = $data['id'] ?? '';
$reason = $data['reason'] ?? '';
$admin_name = $data['admin_name'] ?? ''; // Log who rejected

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Missing ID']);
    exit;
}

$conn = getDbConnection();
try {
    // Option 1: Delete the request entirely
    // $stmt = $conn->prepare("DELETE FROM admin_requests WHERE id = :id");
    
    // Option 2: Mark as rejected (Better for history)
    $stmt = $conn->prepare("UPDATE admin_requests SET status = 'rejected', comment = :reason WHERE id = :id");
    
    $stmt->execute([':reason' => "Rejected by $admin_name: $reason", ':id' => $id]);
    
    echo json_encode(['success' => true, 'message' => 'Admin request rejected']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Reject failed: ' . $e->getMessage()]);
}
