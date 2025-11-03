<?php
	if(!isset($_POST['mode'])){
		echo json_encode(['success'=>false,'message'=>'Нет данных']);
		exit;
	}
	include 'connect.php';
	if(!isset($_SESSION['id'])){
		echo json_encode(['success'=>false,'message'=>'Вы не авторизованы']);
		$conn->close();
		exit;
	}
	if($_POST['mode'] == 0){
		if(!isset($_POST['id'])){
			echo json_encode(['success'=>false,'message'=>'Нет данных']);
			$conn->close();
			exit;
		}
		$stmt = $conn->prepare('select * from shop_orders where id = ?');
		$stmt->bind_param('i', $_POST['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		if($result->num_rows == 0){
			echo json_encode(['success'=>false,'message'=>'Заказ не найден']);
			$stmt->close();
			$conn->close();
			exit;
		}
		$row = $result->fetch_assoc();
		$stmt->close();
		if($row['user_id'] != $_SESSION['id']){
			echo json_encode(['success'=>false,'message'=>'Заказ был оформлен с другого аккаунта']);
			$conn->close();
			exit;
		}
		if($row['status'] != 'Создан'){
			echo json_encode([
				'success' => false,
				'message' => 'Заказ со статусом ' . $row['status'] . ' нельзя отменить']);
			$conn->close();
			exit;
		}
		$order = $row;
		$products = [];
		$stmt = $conn->prepare('select product_id, q from shop_cart where order_id = ?');
		$stmt->bind_param('i', $_POST['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		while($row = $result->fetch_assoc()){
			$products[] = [
				'product_id' => $row['product_id'],
				'q' => $row['q']
			];
		}
		$stmt->close();
		foreach($products as $product){
			$stmt = $conn->prepare('update shop_avail set quantity = quantity + ? where location = ? and product = ?');
			$stmt->bind_param('iii',$product['q'],$order['shop_id'],$product['product_id']);
			$stmt->execute();
			$stmt->close();
		}
		$value = 'Отменен';
		$stmt = $conn->prepare('update shop_orders set status = ? where id = ?');
		$stmt->bind_param('si', $value, $_POST['id']);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		echo json_encode(['success'=>true]);
		exit;
	}
	
?>