<?php
// =====================================================
// api/get_applications.php
// Returns ALL applications as JSON.
// Search/filter/sort will be handled in JavaScript on the
// frontend after this data is fetched — simpler to reason about.
// =====================================================

require_once '../config.php';

try {
    $stmt = $pdo->query("SELECT * FROM applications ORDER BY created_at DESC");
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $applications]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
