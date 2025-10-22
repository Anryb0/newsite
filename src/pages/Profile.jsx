import { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './Profile.css';

function Profile(){
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const location = useLocation();
	useEffect(() => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST','http://94.183.234.114/server/getuser.php');
		xhr.send()
		xhr.onload = function() {
			let response = JSON.parse(xhr.responseText);
			if(!response.loggedin){
				location('/');
			}
			else{
				setUser(response.name);
			}
		}
		setLoading(false);
	},[])
	return (
		<>
			<Header name='Computer shop' nonbut={true} search={false}/>
				<main>
					{loading ? (
						<div class='spinner'></div>
					) : (
						<p>Добрый день, {user}</p>
					)}
				</main>
			<Footer />
		</>
	)
}
export default Profile;