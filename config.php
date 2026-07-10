<?php
// =====================================================
// config.php
// One shared file that all PHP scripts include to get
// a working connection to the MySQL database.
// =====================================================

$host   = "localhost";
$dbname = "job_tracker";
$username = "root";   // default XAMPP username
$password = "";       // default XAMPP password (blank)

try {
    // PDO = PHP Data Objects. It's a safe, standard way for
    // PHP to talk to different databases (MySQL, SQLite, etc.)
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);

    // This makes PDO throw real errors instead of failing silently
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // If connection fails, stop everything and send an error as JSON
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB connection failed: " . $e->getMessage()]);
    exit();
}

// Allow our frontend JavaScript (running from the same origin) to call this API
header("Content-Type: application/json");
?>
