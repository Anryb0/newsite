<?php
	include 'connect.php';
	$catid = $_POST['catid'];
	$data = [];
	$stmt = $conn->prepare('select * from shop_subcat where cat = ?');
	$stmt->bind_param('i',$catid);
	$stmt->execute();
	$result = $stmt->get_result();
	while($row = $result->fetch_assoc()){
		$data [] = [
			'id' => $row['id'],
			'name' => $row['name'],
			'photo_url' => $row['photo_url'],
			'descr' => $row['descr']
		];
	};
	$stmt->close();
	$stmt1 = $conn->prepare('select name from shop_categories where id = ?');
	$stmt1->bind_param('i',$catid);
	$stmt1->execute();
	$result1 = $stmt1->get_result();
	$row1 = $result1->fetch_assoc();
	$conn->close();
	echo json_encode(['success'=>true, 'data'=>$data, 'catname'=>$row1['name']]);
?>