<?php
	if(!isset($_POST['art'])){
		echo json_encode(['success'=>false,'message'=>'Не выбран товар']);
		exit;
	}
	include 'connect.php';
	$stmt = $conn->prepare('select * from shop_locations');
	$stmt->execute();
	

?>