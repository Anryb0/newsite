<?php 
	if(isset($_SESSION['id'])){
		echo json_encode(['success'=>false,'message'=>'Вы уже авторизованы']);
		exit;
	}
	if(!isset($_POST['rlogin']) or !isset($_POST['rpass']) or !isset($_POST['passcheck'])){
		echo json_encode(['success'=>false,'message'=>'Отсутствуют данные']);
		exit;
	}
	$login = $_POST['rlogin'];
	$pass = $_POST['rpass'];
	$passcheck = $_POST['passcheck'];
	if($pass!=$passcheck){
		echo json_encode(['success'=>false,'message'=>'Пароли не совпадают']);
		exit;
	}
	if(strlen($pass) < 8){
		echo json_encode(['success'=>false,'message'=>'Пароль слишком короткий. Он должен быть не менее 8 символов.']);
		exit;
	}
	if(strlen($login) < 3){
		echo json_encode(['success'=>false,'message'=>'Логин слишком короткий. Он должен быть не менее 3 символов.']);
		exit;
	}
	include 'connect.php';
	$stmt = $conn->prepare('select * from users where login = ?');
	$stmt ->bind_param('s',$login);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows > 0){
		echo json_encode(['success'=>false,'message'=>'Логин занят. Попробуйте другой.']);
		$stmt->close();
		$conn->close();
		exit;
	}
	$stmt->close();
	$hashedpass = password_hash($pass, PASSWORD_DEFAULT);
	$stmt = $conn->prepare('insert into users(login,password) values(?,?)');
	$stmt ->bind_param('ss',$login,$hashedpass);
	$stmt->execute();
	$stmt->close();
	$_SESSION['id'] = $conn->insert_id;
	$conn->close();
	echo json_encode(['success'=>true])
?>