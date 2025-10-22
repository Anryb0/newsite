<?php
	include 'connect.php';
	$stmt = $conn->prepare('select * from shop_locations');
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'id' => $row['id'],
			'name' => $row['name'],
			'address' => $row['address']
		]
	}
	echo json_encode(['success'=> true,'data'=>$data]);
	
?>