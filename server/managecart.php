<?php
	include 'connect.php';
	if(!isset($_SESSION['id'])){
		echo json_encode(['success'=>false,'message'=>'Вы не авторизованы']);
		$conn->close();
		exit;
	}
	if(!isset($_POST['art']) || !isset($_POST['mode'])){
		echo json_encode(['success'=>false,'message'=>'Нет данных']);
		$conn->close();
		exit;
	}
	$stmt = $conn->prepare('select q from shop_cart where product_id = ? and user_id = ? and order_id is null');
	$stmt->bind_param('ii',$_POST['art'],$_SESSION['id']);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo json_encode(['success'=>false,'message'=>'В корзине нет такого товара']);
		$conn->close();
		exit;
	}
	$row = $result->fetch_assoc();
	$stmt->close();
	if($row['q'] == 1 && $_POST['mode'] == 1){
		$stmt = $conn->prepare('delete from shop_cart where product_id = ? and user_id = ? and order_id is null');
		$stmt->bind_param('ii',$_POST['art'],$_SESSION['id']);
		$stmt->execute();
		echo json_encode(['success'=>true]);
	}
	else{
		if($_POST['mode'] == 0){
			$stmt = $conn->prepare('update shop_cart set q = q + 1 where product_id = ? and user_id = ? and order_id is null');
			$stmt->bind_param('ii',$_POST['art'],$_SESSION['id']);
			$stmt->execute();
			echo json_encode(['success'=>true]);
		}
		else{
			$stmt = $conn->prepare('update shop_cart set q = q - 1 where product_id = ? and user_id = ? and order_id is null');
			$stmt->bind_param('ii',$_POST['art'],$_SESSION['id']);
			$stmt->execute();
			echo json_encode(['success'=>true]);
		}
	}
	$stmt->close();
	$conn->close();
?>