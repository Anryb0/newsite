<?php 	
	include 'connect.php';
	if(isset($_SESSION['id'])){
		$stmt = $conn->prepare("SELECT login from users where id = ?");
		$stmt->bind_param("i", $_SESSION['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
		echo json_encode(['loggedin' => true, 'name' => $row['login']]);
	}
	else{
		echo json_encode(['loggedin' => false]);
	}
?>