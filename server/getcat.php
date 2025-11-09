<?php
	include 'connect.php';
	$data = [];
	$stmt = $conn->prepare('select s.id, s.name, s.photo_url, s.cat, s.descr from shop_subcat');
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
	echo json_encode(['success'=>true, 'data'=>$data);
?>