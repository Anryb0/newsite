<?php 	
	include 'connect.php';
	if(isset($_SESSION['id'])){
		$stmt = $conn->prepare("SELECT login, photo_url from users where id = ?");
		$stmt->bind_param("i", $_SESSION['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
		echo json_encode(['loggedin' => true, 'user' => $row['login'], 'photo_url'=>$row['photo_url']]);
	}
	else{
		echo json_encode(['loggedin' => false]);
	}
?>