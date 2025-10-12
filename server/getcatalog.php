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
	echo json_encode(['success'=>true,'data'=>$data]);
	$stmt->close();
    $conn->close();
?>