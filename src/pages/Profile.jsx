import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './Profile.css';

function Profile(){
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [refresh, setRefresh] = useState(0);
	const navigate = useNavigate();
	function logout(){
		let xhr = new XMLHttpRequest();
		xhr.open('POST','http://94.183.234.114/server/logout.php');
		xhr.send();
		xhr.onload = function() {setRefresh(prev => prev + 1);}
	}
	useEffect(() => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST','http://94.183.234.114/server/getuser.php');
		xhr.send()
		xhr.onload = function() {
			let response = JSON.parse(xhr.responseText);
			if(!response.loggedin){
				navigate('/');
			}
			else{
				setUser(response.name);
			}
		}
		setLoading(false);
	},[refresh])
	return (
		<>
			<Header name='Computer shop' nonbut={true} search={false}/>
				<main>
					{loading ? (
						<div class='spinner'></div>
					) : (
					<>
						<p><h3>Добрый день, {user}</h3></p>
						<p>Изменить аватарку: <input type='file' /></p>
						<p><button className='logout' onClick={() => {logout()}}><b>Выйти из аккаунта</b></button></p>
						</>
					)}
				</main>
			<Footer />
		</>
	)
}
export default Profile;