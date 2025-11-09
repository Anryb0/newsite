<?php
include 'connect.php';

if (!isset($_SESSION['id'])) {
    echo json_encode(['success' => false, 'message' => 'Вы не авторизованы']);
    $conn->close();
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Ошибка загрузки: ' . $_FILES['image']['error']]);
    exit;
}

$file = $_FILES['image'];
$uploadDir = '../userpic/';
$allowed_mime_types = ['image/png', 'image/jpeg'];

if (!in_array($file['type'], $allowed_mime_types)) {
    echo json_encode(['success' => false, 'message' => "Разрешены только PNG и JPG файлы"]);
    exit;
}

$stmt = $conn->prepare('SELECT photo_url FROM users WHERE id = ?');
$stmt->bind_param('i', $_SESSION['id']);
$stmt->execute();
$stmt->bind_result($old_photo_url);
$stmt->fetch();
$stmt->close();


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

$filename = $randomString . '.png';
$uploadPath = $uploadDir . $filename;

if ($file['type'] == 'image/jpeg') {
    $image = imagecreatefromjpeg($file['tmp_name']);
} else {
    $image = imagecreatefrompng($file['tmp_name']);
}

$maxSize = 250;
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

if (imagepng($image, $uploadPath, 6)) {
    $stmt = $conn->prepare('update users set photo_url = ? where id = ?');
    $stmt->bind_param('si', $filename, $_SESSION['id']);
    $stmt->execute();
	$stmt->close();
	if (!empty($old_photo_url) && $old_photo_url !== 'default.png') {
            $old_file_path = $uploadDir . $old_photo_url;
            if (file_exists($old_file_path)) {
                unlink($old_file_path);
            }
        }
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка']);
}

imagedestroy($image);
$conn->close();
?>