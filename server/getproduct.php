<?php
	if(!isset($_POST['art'])){
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
	}
	$info = $result->fetch_assoc();
	$stmt->close();
	$stmt = $conn->prepare("SELECT p.metrics, g.val from shop_goods_prop g left join shop_prop p on g.prop = p.id where g.good = ?");
	$stmt->bind_param('i',$art);
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'metrics' => $row['metrics'],
			'val' => $row['val']
		];
	}
	echo json_encode(['success'=>true,'info'=>$info,'data'=>$data]);
?>