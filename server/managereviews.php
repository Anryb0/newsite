<?php
	if(!isset($_POST['mode'])){
		echo json_encode(['success'=>false,'message'=>'Нет данных']);
		exit;
	}
	include 'connect.php';
	$auth = false;
	if(isset($_SESSION['id'])){
		$auth = true;
	}
	if($_POST['mode'] == 0){
		if(!isset($_POST['id'])){
			echo json_encode(['success'=>false,'message'=>'Нет данных']);
			$conn->close();
			exit;
		}
		if(!$auth){
			echo json_encode(['success'=>true,'status'=>0]);
			$conn->close();
			exit;
		}
		$stmt = $conn->prepare('select * from shop_reviews where user_id = ? and art = ?');
		$stmt->bind_param('ii', $_SESSION['id'], $_POST['id']);
		$stmt->execute();
		if($result->num_rows == 0){
			echo json_encode(['success'=>true,'status'=>1]);
			$stmt->close();
			$conn->close();
			exit;
		}
		$result = $stmt->get_result();
		$rev = $result->fetch_assoc();
		echo json_encode(['success'=>true,'status'=>2,'rev'=>$rev]);
		$stmt->close();
		$conn->close();
		exit;
	}
?>