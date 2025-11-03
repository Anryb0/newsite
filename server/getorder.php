<?php
	if(!isset($_POST['id'])){
		echo json_encode(['success'=>false,'message'=>'Нет данных']);
		exit;
	}
	include 'connect.php';
	if(!isset($_SESSION['id'])){
		echo json_encode(['success'=>false,'message'=>'Вы не авторизованы']);
		$conn->close();
		exit;
	}
	$stmt = $conn->prepare('select s.status, s.time, s.user_id, l.name, l.address from shop_orders s left join shop_locations l on l.id = s.shop_id where s.id = ?');
	$stmt->bind_param('i', $_POST['id']);
	$stmt->execute();
	$result=$stmt->get_result();
	if($result->num_rows == 0){
		echo json_encode(['success'=>false,'message'=>'Заказ не найден =(']);
		$stmt->close();
		$conn->close();
		exit;
	}
	$order = $result->fetch_assoc();
	$stmt->close();
	if($order['user_id'] != $_SESSION['id']){
		echo json_encode(['success'=>false,'message'=>'Этот заказ был оформлен с другого аккаунта =(']);
		$conn->close();
		exit;
	}
	$stmt = $conn->prepare('select c.product_id, c.q, c.price, g.name, g.photo_url from shop_cart c left join shop_goods g on c.product_id = g.id where c.order_id = ?');
	$stmt->bind_param('i',$_POST['id']);
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'product_id' => $row['product_id'],
			'q' => $row['q'],
			'price' => $row['price'],
			'name' => $row['name'],
			'photo_url' => $row['photo_url']
		];
	}
	$sum = 0;
	foreach($data as $product){
		$sum = $sum + ($product['price'] * $product['q']);
	}
	echo json_encode(['success'=>true,'data'=> $data, 'order'=>$order, 'sum'=>$sum]);
	$stmt->close();
	$conn->close();
	exit;


?>