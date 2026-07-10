<?php
// =====================================================
// api/toggle_favorite.php
// Flips is_favorite between 0 and 1 for a given application.
// =====================================================

require_once '../config.php';

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Application id is required"]);
    exit();
}

try {
    // NOT is_favorite flips 1 -> 0 and 0 -> 1 directly inside SQL
    $stmt = $pdo->prepare("UPDATE applications SET is_favorite = NOT is_favorite WHERE id = :id");
    $stmt->execute([':id' => $input['id']]);

    echo json_encode(["success" => true, "message" => "Favorite toggled"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
