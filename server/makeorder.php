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
	$stmt = $conn->prepare('select * from shop_locations where id = ?');
	$stmt->bind_param('i',$_POST['selectedlocation']);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo json_encode(['success'=>false,'message'=>'Такого магазина нет']);
		$stmt->close();
		$conn->close();
		exit;
	}
	$stmt = $conn->prepare('select s.product_id, s.q, g.price from shop_cart s left join shop_goods g on g.id = s.product_id where user_id = ? and order_id is null');
	$stmt->bind_param('i',$_SESSION['id']);
	$stmt->execute();
	$result = $stmt->get_result();
	$cart = [];
	while($row = $result->fetch_assoc()){
		$cart[] = [
			'product_id' => $row['product_id'],
			'q' => $row['q'],
			'price' => $row['price']
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
	if(!$marker){
		echo json_encode(['success'=>false,'message'=>'Не все товары в наличии =(']);
		$conn->close();
		exit;
	}
	$stmt = $conn->prepare('insert into shop_orders (user_id, shop_id) values(?,?)');
	$stmt->bind_param('ii', $_SESSION['id'],$_POST['selectedlocation']);
	$stmt->execute();
	$order = $conn->insert_id;
	$stmt->close();
	foreach($cart as $product){
		$stmt = $conn->prepare('update shop_cart set price = ?, order_id = ? where order_id is null and user_id = ? and product_id = ?');
		$stmt->bind_param('iiii', $product['price'], $order, $_SESSION['id'], $product['product_id']);
		$stmt->execute();
		$stmt->close();
		$stmt = $conn->prepare('update shop_avail set quantity = quantity - ? where location = ? and product = ?');
		$stmt->bind_param('iii', $product['q'], $_POST['selectedlocation'], $product['product_id']);
		$stmt->execute();
		$stmt->close();
	}
	$conn->close();
	echo json_encode(['success'=>true,'order'=>$order]);
?>