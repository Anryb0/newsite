import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header(props)
{
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [nonbut, setnonbut] = useState(props.nonbut);
	const [search, setsearch] = useState(props.search);
	
	useEffect(() => {
		let user;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "http://94.183.234.114/server/getuser.php");
		xhr.send();
		xhr.onload = function() {
			if (xhr.status == 200) {
				let response = JSON.parse(xhr.responseText);
				if (response.loggedin){
					setUser(response);
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
				<Link to='/'>
					<div className="logo"><img src="/shop.png" id='logo' /></div>
					<div id='pagename'><b>{props.name}</b></div>
				</Link>
				{
					search ? (
						<div id='search'>
							<form>
								<input type='text' placeholder='Поиск' id='s1'></input>
								<input type='submit' value='Искать' className='but' id='s2'></input>
							</form>
						</div>
					) : (
						<div></div>
					)
				}
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
						<Link id='lau' to="/profile">{user.name}</Link>
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