<?php
require_once 'cors.php';

require_once 'config.php';

// Join reports with recipes to get full recipe data
$query = "
    SELECT 
        rr.id AS report_id,
        rr.reasons,
        rr.other_reason,
        rr.reporter_email,
        rr.reported_at,
        rr.status AS report_status,
        r.id AS recipe_id,
        r.title,
        r.category,
        r.description,
        r.image_url,
        r.location,
        r.organizerName,
        r.organizerEmail,
        r.organizerAddress,
        r.source,
        r.tags,
        r.reference,
        r.tutorialVideo,
        r.comment
    FROM reports rr
    JOIN recipes r ON rr.recipe_id = r.id
    ORDER BY rr.reported_at DESC
";

$result = $mysqli->query($query);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode(['success' => true, 'data' => $data]);

$mysqli->close();
?>
