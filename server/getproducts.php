<?php
	if(!isset($_POST['cat'])){
		echo json_encode(['success' => false]);
	}
	include 'connect.php';
	$cat = $_POST['cat'];
	$stmt = $conn->prepare("SELECT * from shop_goods where subcat = ?");
	$stmt->bind_param("i", $cat);
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'id' => $row['id'],
			'name' => $row['name'],
			'price' => $row['price'],
			'descr' => $row['descr'],
			'photo_url' => $row['photo_url']
		];
	}
	$stmt->close();
	$stmt = $conn->prepare("SELECT name from shop_subcat where id = ?");
	$stmt->bind_param("i", $cat);
	$stmt->execute();
	$result = $stmt->get_result();
	$row = $result->fetch_assoc();
	$name = $row['name'];
	$stmt->close();
	echo json_encode(['success' => true,'data'=>$data, 'name'=>$name]);
?>