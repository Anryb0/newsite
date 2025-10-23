<?php 
	if(!isset($_POST['q'])){
		echo json_encode(['success' => false]);
	}
	include 'connect.php';
	$stmt = $conn->prepare('select * from shop_goods where name like ?');
	$stmt->bind_param('s',$_POST['q']);
	$stmt->execute();
	$result = $stmt->get_result();
	$data = [];
	$allprops = [];
	while($row = $result->fetch_assoc()){
		$data[] = [
			'id' => $row['id'],
			'name' => $row['name'],
			'price' =>$row['price'],
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
		$stmt0->close();
	}
	$conn->close();
	echo json_encode(['success' => true,'data'=>$data, 'allprops'=>$allprops]);
?>