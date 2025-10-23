import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './components/Cart.css';

function Cart(){
	const[products.setProducts] = useState(null);
	const[user,getUser] = useState(null);
	const[loading,setLoading] = useState(true);
	const[show,setShow] = useState(false);
	const[closing,setClosing] = useState(false);
	const[error,setError] = useState('');
	const location = useLocation();
	const navigate = useNavigate();
	
	function closemodal(){
		setClosing(true);
		setTimeout(() => {
			setShow(false);
			setClosing(false);
		}, 300);
	}
	function openmodal(t){
		setError(t);
		setShow(true);
	}
	useEffect(() => {
		let xhr = new XMLHttpRequest;
		xhr.open('POST','http://94.183.234.114/server/getuser.php');
		xhr.send();
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText);
				if(!response.loggedin){
					navigate('/');
				}
				else{
					let xhr2 = new XMLHttpRequest;
					xhr2.open('POST','http://94.183.234.114/server/getcart.php');
					xhr2.send();
					xhr2.onload = function (){
						if(xhr2.status == 200){
							let response2 = JSON.parse(xhr2.responseText);
							if(response2.success){
								setProducts(response2.data)
							}
							else{
								openmodal(response2.message)
							}
						}
						else{
							openmodal('Ошибка ' + xhr2.status);
						}
					}
				}
			}
			else{
				openmodal('Ошибка ' + xhr.status);
			}
		}
	}, [user])
	return (
		<>
			<Header name='Computer shop' search={true}/>
			{
				show && (
					<Erwin text={error} closemodal={closemodal} closing={closing}/>
				)
			}
				<main>
				{
					
				}
				</main>
			<Footer />
		</>
	)
}

export default cart;