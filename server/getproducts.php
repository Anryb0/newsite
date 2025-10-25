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
	$allprops = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'id' => $row['id'],
			'name' => $row['name'],
			'price' => $row['price'],
			'descr' => $row['descr'],
			'photo_url' => $row['photo_url']
		];
		$stmt0 = $conn->prepare("SELECT p.metrics, g.val from shop_goods_prop g left join shop_prop p on g.prop = p.id where g.good = ?");
		$stmt0->bind_param("i", $row['id']);
		$stmt0->execute();
		$result0 = $stmt0->get_result();
		$prop = "";
		while ($row0 = $result0->fetch_assoc()) {
			$prop .= ($row0['val']." ".$row0['metrics'].", ");
		}
		$propn = substr($prop, 0, -2);
		$allprops[] = ['id' => $row['id'], 'str'=>$propn];
	}
	$stmt->close();
	$stmt = $conn->prepare("SELECT name from shop_subcat where id = ?");
	$stmt->bind_param("i", $cat);
	$stmt->execute();
	$result = $stmt->get_result();
	$row = $result->fetch_assoc();
	$name = $row['name'];
	$stmt->close();
	if(!isset($_SESSION['id'])){
		$conn->close();
		echo json_encode(['success' => true,'data'=>$data, 'name'=>$name, 'allprops'=>$allprops]);
	} 
	else{
		$stmt = $conn->prepare('select c.product_id, c.q, g.name, g.price, g.photo_url from shop_cart c left join shop_goods g ON c.product_id = g.id where c.order_id is null and c.user_id = ?');
		$stmt->bind_param('i',$_SESSION['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		$cart = [];
		while($row = $result->fetch_assoc()){
			$cart[] = [
				'product_id' => $row['product_id'],
				'q' => $row['q'],
				'name' => $row['name'],
				'price' => $row['price'],
				'photo_url' => $row['photo_url']
			];
		}
		echo json_encode(['success' => true,'data'=>$data, 'name'=>$name, 'allprops'=>$allprops, 'cart'=>$cart]);
	}
?>