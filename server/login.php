<?php 
	include 'connect.php';
	if(isset($_SESSION['id'])){
		echo json_encode(['success'=>false,'message'=>"Вы уже авторизованы"]);
		exit;
	}
	$login = $_POST['llogin'];
	$pass = $_POST['lpass'];
	$stmt = $conn->prepare('select * from users where login = ?');
	$stmt->bind_param('s',$login);
	$stmt->execute();
	$result=$stmt->get_result();
	if($result->num_rows == 0){
		echo json_encode(['success'=>false,'message'=>"Пользователь не найден"]);
		$stmt->close();
		$conn->close();
	}
	else{
		$row = $result->fetch_assoc();
		if(!password_verify($pass,$row['password'])){
			echo json_encode(['success'=>false,'message'=>"Пароль неверный"]);
			$stmt->close();
			$conn->close();
			exit;
		}
		else{
			echo json_encode(['success'=>true,'message'=>"Вы авторизованы"]);
			$_SESSION['id']=$row['id'];
			$stmt->close();
			$conn->close();
			exit;
		}
	}
?>