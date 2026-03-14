<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
try {
    // Join with recipes to get all necessary details for the Admin Reports view
    $query = "SELECT 
                r.*, 
                rec.title, 
                rec.category,
                rec.image_url, 
                rec.description, 
                rec.comment, 
                rec.location, 
                rec.tags,
                rec.reference,
                rec.tutorialVideo as tutorialvideo,
                rec.organizerName as organizername, 
                rec.organizerEmail as organizeremail 
              FROM reports r 
              LEFT JOIN recipes rec ON r.recipe_id = rec.id 
              ORDER BY r.created_at DESC";
    $stmt = $conn->query($query);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}

$reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'reports' => $reports]);
