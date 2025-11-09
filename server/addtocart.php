<?php
	include 'connect.php';
	if(!isset($_SESSION['id'])){
		echo json_encode(['success'=>false,'message'=>'Необходимо войти в аккаунт']);
		$conn->close();
		exit;
	}
	if(!isset($_POST['art'])){
		echo json_encode(['success'=>false,'message'=>'Нет данных о товаре']);
		$conn->close();
		exit;
	}
	$stmt = $conn->prepare('select * from shop_goods where id = ?');
	$stmt->bind_param('i',$_POST['art']);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo json_encode(['success'=>false,'message'=>'Несуществующий товар']);
		$stmt->close();
		$conn->close();
		exit;
	}
	$stmt->close();
	$value = null;
	$stmt = $conn->prepare('select * from shop_cart where product_id = ? and user_id = ? and order_id is null');
	$stmt->bind_param('ii',$_POST['art'],$_SESSION['id']);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		$stmt->close();
		$value = 1;
		$stmt = $conn->prepare('INSERT INTO shop_cart (product_id, q, user_id,order_id) VALUES (?, ?, ?, NULL)');
		$stmt->bind_param('iii',$_POST['art'],$value,$_SESSION['id']);
		$stmt->execute();
		echo json_encode(['success'=>true,'message'=>'Товар добавлен в корзину']);
		$stmt->close();
		$conn->close();
	}
	else{
		echo json_encode(['success'=>true,'message'=>'Товар уже был добавлен в ', 'cartLink' => true]);
		$stmt->close();
		$conn->close();
	}
?>