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
		$stmt = $conn->prepare('select r.id, r.pros, r.cons, r.comm, r.rating, r.photo_url, r.time, r.status, u.login, u.photo_url as userpic from shop_reviews r left join users u on r.user_id = u.id where user_id = ? and art = ?');
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
    session_start();

    if(isset($_SESSION['id'])){
        $stmt = $conn->prepare('SELECT r.id, r.pros, r.cons, r.comm, r.rating, r.photo_url, r.time, u.login, u.photo_url as userpic 
                                FROM shop_reviews r 
                                LEFT JOIN users u ON r.user_id = u.id 
                                WHERE r.user_id != ? AND r.art = ? AND r.status = ?');
        $stmt->bind_param('iis', $_SESSION['id'], $_POST['id'], $value);
    } else {
        $stmt = $conn->prepare('SELECT r.id, r.pros, r.cons, r.comm, r.rating, r.photo_url, r.time, u.login, u.photo_url as userpic 
                                FROM shop_reviews r 
                                LEFT JOIN users u ON r.user_id = u.id 
                                WHERE r.art = ? AND r.status = ?');
        $stmt->bind_param('is', $_POST['id'], $value);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $reviews = [];

    while($row = $result->fetch_assoc()){
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

    $stmt = $conn->prepare('SELECT AVG(rating) as rating FROM shop_reviews WHERE status = ? AND art = ?');
    $stmt->bind_param('si', $value, $_POST['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
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
			$maxFileSize = 2 * 1024 * 1024;
			if ($file['size'] > $maxFileSize) {
				echo json_encode(['success' => false, 'message' => "Размер файла не должен превышать 2 МБ"]);
				exit;
			}
			$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			$charactersLength = strlen($characters);
			$randomString = '';
			for ($i = 0; $i < 15; $i++) {
				$randomString .= $characters[random_int(0, $charactersLength - 1)];
			}
			$uploadDir = '../revpic/';
			$photo = $randomString . '.png';
			$path = $uploadDir . $photo;
			if ($file['type'] == 'image/jpeg') {
				$image = imagecreatefromjpeg($file['tmp_name']);
			} else {
				$image = imagecreatefrompng($file['tmp_name']);
			}
			$maxSize = 400;
			$width = imagesx($image);
			$height = imagesy($image);

			if ($width > $maxSize || $height > $maxSize) {
				$ratio = $width / $height;
				if ($ratio > 1) {
					$newWidth = $maxSize;
					$newHeight = $maxSize / $ratio;
				} else {
					$newWidth = $maxSize * $ratio;
					$newHeight = $maxSize;
				}
				$resizedImage = imagescale($image, (int)$newWidth, (int)$newHeight);
				imagedestroy($image);
				$image = $resizedImage;
			}
			imagepng($image, $path, 6);
		}
		$value = 'На модерации';
		$stmt = $conn ->prepare('insert into shop_reviews (pros, cons, comm, rating, art, user_id, photo_url, status) values (?,?,?,?,?,?,?,?)');
		$stmt->bind_param('sssiiiss',$pros,$cons,$comm,$_POST['rating'],$_POST['id'],$_SESSION['id'],$photo,$value);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		echo json_encode(['success'=>true]);
		exit;
	}
	if ($_POST['mode'] == 3) {
    if (!isset($_SESSION['id']) || !isset($_POST['id'])) {
        echo json_encode(['success' => false, 'message' => 'Нет доступа или данных']);
        $conn->close();
        exit;
    }

    $stmt = $conn->prepare('SELECT photo_url FROM shop_reviews WHERE id = ? AND user_id = ?');
    $stmt->bind_param('ii', $_POST['id'], $_SESSION['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'Отзыв не найден']);
        $conn->close();
        exit;
    }

    if (!empty($row['photo_url'])) {
        $file_path = '../revpic/' . $row['photo_url'];
        if (file_exists($file_path)) {
            unlink($file_path);
        }
    }

    $stmt = $conn->prepare('DELETE FROM shop_reviews WHERE id = ? AND user_id = ?');
    $stmt->bind_param('ii', $_POST['id'], $_SESSION['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Не удалось удалить отзыв']);
    }

    $stmt->close();
    $conn->close();
    exit;
}

?>