import { useEffect, useState } from 'react';
import './Header.css';

function Header()
{
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let user;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "http://94.183.234.114/server/getuser.php");
		xhr.send();
		xhr.onload = function() {
			if (xhr.status == 200) {
				let responce = JSON.parse(xhr.responseText);
				if (responce.loggedin){
					setUser(responce);
				}
				else {
					setUser(null);
				}
				setLoading(false);
			}
			else {
				console.log('ошибка');
				setLoading(false);
			}
		}
	},[]);
	return (
		<div id='header'>
			<div id='lm'>
				<div>
					<div className="logo"><img src="/shop.png" id='logo' /></div>
					<div id='pagename'><b>Computer shop</b></div>
				</div>
				{loading ? (
					<span id='lau'>Загрузка...</span>
				) : user ? (
					<a id='lau' href="/profile">{user.username}</a>
				) : (
					<a id='lau' href="/register">Регистрация / Вход</a>
				)}
			</div>
		</div>
	)
}
export default Header;