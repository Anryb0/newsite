<?php if(!isset($_POST['art'])){
    echo json_encode(['success'=>false,'message'=>'Не выбран товар']);
    exit;
}

include 'connect.php';

$stmt = $conn->prepare('SELECT * FROM shop_locations');
$stmt->execute();
$result = $stmt->get_result();
$shops = [];
while($row = $result->fetch_assoc()){
    $shops[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'address' => $row['address']
    ];
}
$stmt->close();

$stmt = $conn->prepare('SELECT * FROM shop_avail WHERE product = ?');
$stmt->bind_param('s', $_POST['art']);
$stmt->execute();
$result = $stmt->get_result();
$avail = [];
while($row = $result->fetch_assoc()){
    $avail[] = [
        'id' => $row['id'],
        'location' => $row['location'],
        'product' => $row['product'],
        'quantity' => $row['quantity']
    ];
}
$stmt->close();

$data = [];
foreach($shops as $shop){
    $quantity = 0;
    
    foreach($avail as $item){
        if($item['location'] == $shop['id']){
            $quantity = $item['quantity'];
            break;
        }
    }
    
    $data[] = [
        'location' => $shop['address'],
		'name' => $shop['name'],
        'quantity' => $quantity
    ];
}

echo json_encode(['success' => true, 'data' => $data]);