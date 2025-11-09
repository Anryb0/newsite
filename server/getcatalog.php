<?php
	include "connect.php";
	$stmt = $conn->prepare("select * from shop_categories");
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'id' => $row['id'],
			'name' => $row['name'],
			'photo_url' => $row['photo_url'],
			'descr' => $row['descr']
		]; 
	};
	$data1 = [];
	$stmt1 = $conn->prepare('select * from shop_subcat');
	$stmt1->execute();
	$result1 = $stmt1->get_result();
	while($row1 = $result1->fetch_assoc()){
		$data1 [] = [
			'id' => $row1['id'],
			'name' => $row1['name'],
			'photo_url' => $row1['photo_url'],
			'cat' => $row1['cat'],
			'descr' => $row1['descr']
		];
	};
	echo json_encode(['success'=>true,'data'=>$data,'data1'=>$data1]);
	$stmt->close();
	$stmt1->close();
    $conn->close();
?>