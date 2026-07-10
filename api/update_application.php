<?php
// =====================================================
// api/update_application.php
// Updates an existing application by id.
// =====================================================

require_once '../config.php';

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Application id is required"]);
    exit();
}

try {
    $sql = "UPDATE applications
            SET company_name = :company_name,
                job_role = :job_role,
                status = :status,
                deadline = :deadline,
                notes = :notes
            WHERE id = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':company_name' => $input['company_name'],
        ':job_role'     => $input['job_role'],
        ':status'       => $input['status'],
        ':deadline'     => $input['deadline'] ?? null,
        ':notes'        => $input['notes'] ?? '',
        ':id'           => $input['id']
    ]);

    echo json_encode(["success" => true, "message" => "Application updated"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
