<?php
	if(!isset($_POST['mode'])){
		echo json_encode(['success'=>false,'message'=>'Нет данных']);
		exit;
	}
	include 'connect.php';
	$auth = false;
	if(isset($_SESSION['id'])){
		$auth = true;
	}
	if($_POST['mode'] == 0){
		if(!isset($_POST['id'])){
			echo json_encode(['success'=>false,'message'=>'Нет данных']);
			$conn->close();
			exit;
		}
		if(!$auth){
			echo json_encode(['success'=>true,'status'=>0]);
			$conn->close();
			exit;
		}
		$stmt = $conn->prepare('select * from shop_reviews where user_id = ? and art = ?');
		$stmt->bind_param('ii', $_SESSION['id'], $_POST['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		if($result->num_rows == 0){
			echo json_encode(['success'=>true,'status'=>1]);
			$stmt->close();
			$conn->close();
			exit;
		}
		$rev = $result->fetch_assoc();
		echo json_encode(['success'=>true,'status'=>2,'rev'=>$rev]);
		$stmt->close();
		$conn->close();
		exit;
	}
	if($_POST['mode'] == 1){
		if(!isset($_POST['id'])){
			echo json_encode(['success'=>false,'message'=>'Нет данных']);
			$conn->close();
			exit;
		}
		$value = 'Прошел модерацию';
		if(isset($_SESSION['id'])){
			$stmt = $conn->prepare('select r.id, r.pros, r.cons, r.comm, r.rating, r.photo_url, r.time, u.login, u.photo_url as userpic from shop_reviews r left join users u on r.user_id = u.id where r.user_id != ? and r.art = ? and r.status = ?');
			$stmt->bind_param('iis', $_SESSION['id'], $_POST['id'], $value);
		} else{
			$stmt = $conn->prepare('select r.id, r.pros, r.cons, r.comm, r.rating, r.photo_url, r.time, u.login, u.photo_url as userpic from shop_reviews r left join users u on r.user_id = u.id where r.art = ? and r.status = ?');
			$stmt->bind_param('is', $_POST['id'], $value);
		}
		$stmt->execute();
		$result = $stmt->get_result();
		$reviews = [];
		while($row = $result->fetch_assoc){
			$reviews[] = [
				'id' => $row['id'],
				'pros' => $row['pros'],
				'cons' => $row['cons'],
				'comm' => $row['comm'],
				'rating' => $row['rating'],
				'photo_url' => $row['photo_url'],
				'time' => $row['time'],
				'login' => $row['login'],
				'userpic' => $row['userpic']
			];
		}
		$stmt->close();
		$stmt = $conn->prepare('select avg(rating) as rating from shop_reviews where status = ?');
		$stmt->bind_param('s', $value);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc;
		$avgr = $row['rating'];
		$stmt->close();
		$conn->close();
		echo json_encode(['success'=>true,'reviews'=>$reviews,'avgr'=>$avgr]);
		exit;
	}
	if($_POST['mode'] == 2){
		if(!isset($_POST['id']) || !isset($_POST['comm']) || !isset($_POST['rating'])){
			echo json_encode(['success'=>false,'message'=>'Нет данных']);
			$conn->close();
			exit;
		}
		if(!isset($_SESSION['id'])){
			echo json_encode(['success'=>false,'message'=>'Вы не авторизованы']);
			$conn->close();
			exit;
		}
		if(strlen($_POST['comm']) < 4 || $_POST['rating'] < 1 || $_POST['rating'] > 5){
			echo json_encode(['success'=>false,'message'=>'Некорректные данные']);
			$conn->close();
			exit;
		}
		$comm = $_POST['comm'];
		$pros = $_POST['pros'];
		$cons = $_POST['cons'];
		$photo = null;
		if(isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK){
			$file = $_FILES['image'];
			$uploadDir = '../review_images/';
		}
		$stmt = $conn ->prepare('insert into shop_reviews (pros, cons, comm, rating, art, user_id, photo_url, status) values (?,?,?,?,?,?,?,?)')
		
	}
?>