<?php
// =====================================================
// api/delete_application.php
// Deletes an application by id.
// =====================================================

require_once '../config.php';

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Application id is required"]);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM applications WHERE id = :id");
    $stmt->execute([':id' => $input['id']]);

    echo json_encode(["success" => true, "message" => "Application deleted"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
