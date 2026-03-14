<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$baseUrl = defined('API_BASE_URL') ? API_BASE_URL : (getenv('RENDER') === 'true' ? 'https://' . getenv('RENDER_EXTERNAL_HOSTNAME') . '/src/api/' : 'http://localhost/Amar_Recipies_Live/Amar_Recipe/src/api/');
$recipes = [];
$hasImageTable = false;

// Try query with LEFT JOIN recipe_images (derive image_url when null); fall back if table missing
// Simplified query with EXISTS for better performance and to avoid duplicate rows
try {
    $sql = "SELECT r.*, 
            EXISTS (SELECT 1 FROM recipe_images ri WHERE ri.recipe_id = r.id) AS has_image
            FROM recipes r
            ORDER BY r.created_at DESC";
    $stmt = $conn->query($sql);
    $recipes = $stmt->fetchAll();
    $hasImageTable = true;
} catch (Exception $e) {
    // If the above fails (e.g. table doesn't exist yet), fall back to simple query
    $sql = "SELECT * FROM recipes ORDER BY created_at DESC";
    $stmt = $conn->query($sql);
    $recipes = $stmt->fetchAll();
}

foreach ($recipes as &$recipe) {
    $imageUrl = $recipe['image_url'] ?? '';
    $imageUrlStr = trim((string) $imageUrl);
    $id = (int) $recipe['id'];

    if ($hasImageTable && array_key_exists('has_image', $recipe)) {
        $hasImage = !empty($recipe['has_image']);
        $dbImageUrl = $baseUrl . 'get_image.php?id=' . $id;
        if ($hasImage) {
            $recipe['image_url'] = $dbImageUrl;
        }
        unset($recipe['has_image']);
    }
}
unset($recipe);

echo json_encode(['success' => true, 'recipes' => $recipes]);
