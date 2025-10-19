import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header(props)
{
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [nonbut, setnonbut] = useState(props.nonbut);
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
					<div id='pagename'><b>{props.name}</b></div>
				</div>
				{nonbut ? (
					<div id='l'>
					</div>
				) :
				loading ? (
					<div id='l'>
						<span id='lau'>Загрузка...</span>
					</div>
				) : user ? (
					<div id='l'>
						<Link id='lau' to="/profile">{user.username}</Link>
					</div>
				) :	(
					<div id='l'>
						<Link id='lau' to="/register">Регистрация / Вход</Link>
					</div>
				)}
			</div>
		</div>
	)
}
export default Header;