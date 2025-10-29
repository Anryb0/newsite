<?php
	if(!isset($_POST['selectedlocation'])){
		echo json_encode(['success'=>false,'message'=>'Нет данных']);
		exit;
	}
	include 'connect.php';
	if(!isset($_SESSION['id'])){
		echo json_encode(['success'=>false,'message'=>'Вы не авторизованы']);
		$conn->close();
		exit;
	}
	
	$stmt = $conn->prepare('select * from shop_cart where user_id = ? and order_id is null');
	$stmt->bind_param('i',$_SESSION['id']);
	$stmt->execute();
	$result = $stmt->get_result();
	$cart = [];
	while($row = $result->fetch_assoc()){
		$cart[] = [
			'product_id' => $row['product_id'],
			'q' => $row['q']
		];
	}
	$stmt->close();
	
	$stmt = $conn->prepare('select * from shop_avail where location = ?');
	$stmt->bind_param('i',$_POST['selectedlocation']);
	$stmt->execute();
	$result = $stmt->get_result();
	$avail = [];
	while($row= $result->fetch_assoc()){
		$avail[] = [
			'product' => $row['product'],
			'quantity' => $row['quantity']
		];
	}
	$stmt->close();
	$marker = true;
	foreach($cart as $prod){
		$marker2 = false;
		foreach($avail as $prod2){
			if($prod['product_id'] == $prod2['product'] && $prod2['quantity'] >= $prod['q']){
				$marker2 = true;
			}
		}
		if(!$marker2){
			$marker = false;
		}
	}
	echo json_encode(['success'=>true,'marker'=>$marker]);
?>