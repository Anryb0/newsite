import './Header.css';

function Header()
{
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "http://94.183.234.114/server/getuser.php");
	xhr.onload = function() {
        if (xhr.status == 200) {
			responce = JSON.parse(xhr.responseText);
			if (!responce.loggedin){
				
			}
			else {
				
			}
		}
		else {
			console.log('ошибка')
		}
	}
	return (
		<div id='lm'>
			<div>
				<div class="logo"><img src="../pic/shop.png" id='logo'></div>
				<div id='pagename'><b>Computer shop</b></div>
			</div>
			
		</div>
	)
}
export default Header;