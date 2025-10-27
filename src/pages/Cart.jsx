import { useState, useEffect, useMemo } from "react";
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
	const[err,setErr] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();
	
	function closemodal(){
		setClosing(true);
		setTimeout(() => {
			setShow(false);
			setClosing(false);
		}, 300);
	}
	
	function openmodal(t, e){
		setError(t);
		setErr(e);
		setShow(true);
	}
	
	function calculatesum(data){
		let sum = 0;
		data.forEach((item) => {
			sum += (item.price * item.q);
		})
		return sum;
	}
	
	const totalSum = useMemo(() => {
		return calculatesum(products);
	}, [products]); 
	
	function managecart(plus, art){
		let xhr = new XMLHttpRequest();
		let formData = new FormData();
		if(plus){
			formData.append('mode', 0);
		} else {
			formData.append('mode', 1);
		}
		formData.append('art', art);
		
		xhr.open('POST','http://94.183.234.114/server/managecart.php');
		xhr.send(formData);
		
		xhr.onload = function(){
			if(xhr.status === 200){
				let response = JSON.parse(xhr.responseText);
				if(response.success){
					setRefresh(prev => prev + 1);
				} else {
					openmodal(response.message, true);
				}
			} else {
				openmodal('Ошибка ' + xhr.status, true);
			}
		}
		
		xhr.onerror = function() {
			openmodal('Ошибка сети', true);
		}
	}

	useEffect(() => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST','http://94.183.234.114/server/getuser.php');
		xhr.send();
		
		xhr.onload = function(){
			if(xhr.status === 200){
				let response = JSON.parse(xhr.responseText);
				if(!response.loggedin){
					navigate('/');
				} else {
					let xhr2 = new XMLHttpRequest();
					xhr2.open('POST','http://94.183.234.114/server/getcart.php');
					xhr2.send();
					
					xhr2.onload = function (){
						if(xhr2.status === 200){
							let response2 = JSON.parse(xhr2.responseText);
							
							if(response2.success){
								if(response2.data.length === 0){
									setNo(true);
									openmodal('Ваша корзина пока пуста =(', false);
								} else {
									setProducts(response2.data);
									setNo(false); 
								}
							} else {
								openmodal(response2.message, true);
							}
						} else {
							openmodal('Ошибка ' + xhr2.status, true);
						}
					}
					
					xhr2.onerror = function() {
						openmodal('Ошибка сети при загрузке корзины', true);
					}
				}
			} else {
				openmodal('Ошибка ' + xhr.status, true);
			}
			setLoading(false);
		}
		
		xhr.onerror = function() {
			openmodal('Ошибка сети при проверке пользователя', true);
			setLoading(false);
		}
	}, [navigate, refresh])

	return (
		<>
			<Header name='Computer shop' search={true} nocart={true}/>
			{show && (
				<Erwin text={error} closemodal={closemodal} closing={closing} error={err}/>
			)}
			<main>
				{loading ? (
					<div className='spinner'></div>
				) : no ? (
					<p id='c3'><Link to='../' id='toback' className='buy'>На главную</Link></p>
				) : products.length > 0 ? (
					<>
					<p id='toptext'>Корзина <span id='q'>{products.length}</span></p>
					<p id='cartheader'><span>Фото</span><span>Название</span><span></span><span>Кол-во</span><span>Стоимость</span></p>
					<hr />
					<div id='cartelements'>
						{products.map((item) => (
							<div className='cartelement' key={item.id}>
								<img src={'prodimg/' + item.photo_url + '.png'} alt={item.name} className='cartpic'/>
								<span className='cartname'>{item.name}</span>
								<span className='cartprice'>
									<span id='cartq'>{item.q}</span>
									<span id='pluscart' className='j' onClick={() => managecart(true, item.product_id)}>+</span>
									<span id='minuscart' className='j' onClick={() => managecart(false, item.product_id)}>-</span>
									<span id='v'>{item.price *item.q} RUB</span>
								</span>
							</div>
						))}
					</div>
					<p id='sum'><b>Итого: {totalSum} RUB</b><button id='end' className='buy'>Оформить заказ</button></p>
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