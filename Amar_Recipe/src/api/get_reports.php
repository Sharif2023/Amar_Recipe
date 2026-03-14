<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
$baseUrl = defined('API_BASE_URL') ? API_BASE_URL : (getenv('RENDER') === 'true' ? 'https://' . getenv('RENDER_EXTERNAL_HOSTNAME') . '/src/api/' : 'http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/');

try {
    // Join with recipes to get all necessary details. 
    // We select rec.id specifically as recipe_id_verified to avoid confusion with report.id
    // and we check for existing binary images.
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
                rec.organizerEmail as organizeremail,
                EXISTS (SELECT 1 FROM recipe_images ri WHERE ri.recipe_id = rec.id) AS has_image
              FROM reports r 
              LEFT JOIN recipes rec ON r.recipe_id = rec.id 
              ORDER BY r.created_at DESC";
    $stmt = $conn->query($query);
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($reports as &$report) {
        $id = (int) ($report['recipe_id'] ?? 0);
        if ($id > 0 && !empty($report['has_image'])) {
            $report['image_url'] = $baseUrl . 'get_image.php?id=' . $id;
        }
        unset($report['has_image']);
    }
    unset($report);

    echo json_encode(['success' => true, 'reports' => $reports]);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}

