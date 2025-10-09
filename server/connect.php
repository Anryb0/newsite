<?php
$servername = "localhost";
$username = "Anryb0";
$password = "513381612";
$dbname = "sky";
$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_set_charset($conn, "utf8mb4");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
	$lifetime = 2592000;
    session_set_cookie_params($lifetime);
    session_start();
}
?>
