<?php
	include 'connect.php';
	if(!isset($_SESSION['id'])){
		$conn->close();
		echo json_encode(['success'=>false,'message'=>'Вы не авторизованы']);
		exit;
	}
	$stmt = $conn->prepare('select c.product_id, c.q, g.name, g.price, g.photo_url from shop_cart c left join shop_goods g ON c.product_id = g.id where c.order_id is null and c.user_id = ?');
	$stmt->bind_param('i',$_SESSION['id']);
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'product_id' => $row['product_id'],
			'q' => $row['q'],
			'name' => $row['name'],
			'price' => $row['price'],
			'photo_url' => $row['photo_url']
		];
	}
	echo json_encode(['success'=>true,'data'=>$data]);
?>