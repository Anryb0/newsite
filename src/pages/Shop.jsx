import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './Shop.css';

function Shop() {
	const [user, setUser] = useState(null);
	const [products, setProducts] = useState(null);
	const [name, setName] = useState(null);
	const [loading, setLoading] = useState(true);
	const [props, setProps] = useState(null);
	const [incart,setIncart] = useState([]);
	const[show,setShow] = useState(false);
	const[closing,setClosing] = useState(false);
	const[error,setError] = useState('');
	const location = useLocation();
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);
	const cat = queryParams.get('c');
	
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
	
	const handleBuyClick = (event, productId) => {
		event.preventDefault();
		event.stopPropagation(); 
		
		let formData = new FormData();
		formData.append('art', productId);
		
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://94.183.234.114/server/addtocart.php');
		xhr.send(formData);
		xhr.onload = function() {
			if(xhr.status == 200) {
				let response = JSON.parse(xhr.responseText);
				if(response.success) {
					openmodal(
					<div>
					<p>{response.cartLink ? 'Товар уже был добавлен в корзину' : 'Товар добавлен в корзину!'}</p>
					<button className='buy' onClick={() => { closemodal(); navigate('/cart'); }}>
						Перейти в корзину
					</button>
					<button className='buy' onClick={closemodal}>Продолжить покупки</button>
					
				</div>
				);
				setIncart([...incart, {id: productId}]);
				} else {
					openmodal('Ошибка: ' + response.message);
				}
			} else {
				openmodal('Ошибка соединения: ' + xhr.status);
			}
		};
	};

	useEffect(() => {
		let formData = new FormData();
		formData.append('cat',cat);
		let xhr = new XMLHttpRequest();
		xhr.open('POST','http://94.183.234.114/server/getproducts.php');
		xhr.send(formData);
		xhr.onload = function() {
			if(xhr.status == 200) {
				let response = JSON.parse(xhr.responseText);
				if(response.success){
					if(!Array.isArray(response.data)){
						setProducts([response.data]);
					} else{
					setProducts(response.data);
					}
					if(!Array.isArray(response.allprops)){
						setProps([response.allprops]);
					} else {
						setProps(response.allprops);
					}
					if(response.cart){
						if(!Array.isArray(response.cart)){
						setIncart([response.cart]);
						} else{
						setIncart(response.cart);
						}
					}
					setName(response.name);
				}
				else{
					openmodal('Ошибка: ' + response.message);
				}
			}	
			else {
				openmodal('Ошибка соединения: ' + xhr.status);
			}
			setLoading(false);
		}
	}, [cat])

	return (
		<>
			<Header name='Computer shop' search={true}/>
			{show && (
				<Erwin text={error} closemodal={closemodal} closing={closing}/>
			)}
			<main>
			{
				loading ? (
					<div className='spinner'>
					</div>
				) : products.length == 0 ? (
					<p><b>Тут пока нет товаров =(</b></p>
				) : (
					<>
						<p id='toptext'><span id='cn'>{name} </span><span id='q'>{products.length}</span></p>
						<div id='elements'>
							{products.map(item => {
								let pstr = '';
								props.forEach((i) => {
									if(i.id == item.id){pstr = i.str}
								})
								let c = false;
								incart.forEach((i) => {
									if(i.product_id == item.id){c = true}
								})
								return (
									<Link to={'/product?art=' + item.id} key={item.id} className='element prod'>
										<p className='prodname'>{item.name}</p>
										<img className='prodimg' src={'./prodimg/' + item.photo_url + '.png'} alt={item.name} />
										<p className='prodprops'>{pstr}</p>
										<p className='prodprice'>
											<span id='pp'>{item.price} RUB </span>
											{c ? (<Link to='../cart' className='buy'>В корзине</Link>) : (
												<button 
													className='buy y' 
													id={'y' + item.id}
													onClick={(e) => handleBuyClick(e, item.id)}
												>
													Купить
												</button>
											)}
										</p>
									</Link>
								);
							})}
						</div>
					</>
				)
			}
			</main>
			<Footer />
		</>
	)
}
export default Shop;