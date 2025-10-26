import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './Cart.css';

function Cart(){
	const[products,setProducts] = useState([]);
	const[user,getUser] = useState(null);
	const[loading,setLoading] = useState(true);
	const[show,setShow] = useState(false);
	const[closing,setClosing] = useState(false);
	const[no,setNo] = useState(false);
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
	
	function calculatesum(data){
		let sum = 0;
		data.forEach((item) => {
			sum += item.price;
		})
		return sum;
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
								if(response2.data.length === 0){
									setNo(true);
									openmodal('Ваша корзина пока пуста =(');
								}
								else{
									setProducts(response2.data);
									setNo(false); 
								}
							}
							else{
								openmodal(response2.message);
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
			setLoading(false);
		}
	}, [user, navigate])

	return (
		<>
			<Header name='Computer shop' search={true} nocart={true}/>
			{show && (
				<Erwin text={error} closemodal={closemodal} closing={closing}/>
			)}
			<main>
				{loading ? (
					<div className='spinner'></div>
				) : no ? (
					<p id='c3'><Link to='../' id='toback' className='buy'>На главную</Link></p>
				) : products.length > 0 ? (
					<>
					<p id='toptext'>Корзина <span id='q'>{products.length}</span></p>
					<div id='cartelements'>
						{products.map((item) => (
							<div className='cartelement' key={item.id}>
								<img src={'prodimg/' + item.photo_url + '.png'} alt={item.name} className='cartpic'/>
								<span className='cartname'>{item.name}</span>
								<span className='cartprice'>{item.price} RUB</span>
							</div>
						))}
					</div>
					<p>Итого: {calculatesum(products)} RUB</p>
					</>
				) : (
					<div>Нет товаров в корзине</div>
				)}
			</main>
			<Footer />
		</>
	)
}

export default Cart;