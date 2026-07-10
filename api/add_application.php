<?php
// =====================================================
// api/add_application.php
// Inserts a new application row. Expects JSON body from fetch().
// =====================================================

require_once '../config.php';

// Read the raw JSON sent by JavaScript's fetch() and decode it into a PHP array
$input = json_decode(file_get_contents("php://input"), true);

// Basic validation — never trust incoming data
if (empty($input['company_name']) || empty($input['job_role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Company name and job role are required"]);
    exit();
}

try {
    // Prepared statement with named placeholders — prevents SQL injection
    $sql = "INSERT INTO applications (company_name, job_role, status, deadline, notes, is_favorite)
            VALUES (:company_name, :job_role, :status, :deadline, :notes, :is_favorite)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':company_name' => $input['company_name'],
        ':job_role'     => $input['job_role'],
        ':status'       => $input['status'] ?? 'Applied',
        ':deadline'     => $input['deadline'] ?? null,
        ':notes'        => $input['notes'] ?? '',
        ':is_favorite'  => $input['is_favorite'] ?? 0
    ]);

    echo json_encode(["success" => true, "message" => "Application added", "id" => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
