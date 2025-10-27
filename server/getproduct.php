<?php
	if(!isset($_POST['art'])){
		echo json_encode(['success'=>false]);
		exit;
	}
	$art = $_POST['art'];
	include 'connect.php';
	$stmt = $conn->prepare('select * from shop_goods where id = ?');
	$stmt->bind_param('i',$art);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo json_encode(['success'=>false,'message'=>'Такого товара нет =(']);
		$stmt->close();
		$conn->close();
		exit;
	}
	$info = $result->fetch_assoc();
	$stmt->close();
	$stmt = $conn->prepare("SELECT p.metrics, g.val, p.name from shop_goods_prop g left join shop_prop p on g.prop = p.id where g.good = ?");
	$stmt->bind_param('i',$art);
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'metrics' => $row['metrics'],
			'val' => $row['val'],
			'name' => $row['name']
		];
	}
	$stmt->close();
	$stmt = $conn->prepare("select s.name, s.id from shop_subcat s left join shop_goods g on s.id = g.subcat where g.id = ?");
	$stmt->bind_param('i',$art);
	$stmt->execute();
	$result = $stmt->get_result();
	$row = $result->fetch_assoc();
	$stmt->close();
	if(isset($_SESSION['id'])){
		$stmt = $conn->prepare('select q from shop_cart where product_id = ? and user_id = ? and order_id is null');
		$stmt->bind_param('ii',$art,$_SESSION['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		if($result->num_rows == 0){
			$incart = 0;
		}
		else{$incart = 1;}
	}
	else{
		$incart = 0;
	}
	echo json_encode(['success'=>true,'info'=>$info,'data'=>$data,'name'=>$row['name'],'id'=>$row['id'],'incart'=>$incart]);
	$conn->close();
?>