<?php
	include 'connect.php';
	if(!isset($_SESSON['id'])){
		$conn->close();
		exit;
	}
	$stmt = $conn->prepare('select c.product_id, c.q, g.name,  from shop_cart c left join shop_goods g');
	
	
?>