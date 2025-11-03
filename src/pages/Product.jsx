import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './Product.css';

function Product(){
		const[loading,setLoading] = useState(true);
		const[product,setProduct] = useState(null);
		const[show,setShow] = useState(false);
		const[no,setNo] = useState(false);
		const[props,setProps] = useState(null);
		const[way,setWay] = useState([]);
		const[closing,setClosing] = useState(false);
		const[revstatus,setRevstatus] = useState(null);
		const[revmessage,setRevmessage] = useState(null);
		const[error,setError] = useState('');
		const[err,setErr] = useState(false);
		const[avail,setAvail] = useState([]);
		const[refresh,setRefresh] = useState(0);
		const[selectedoption,setselectedoption] = useState('выберите магазин');
		const navigate = useNavigate();
		const[incart,setIncart] = useState(null);
		const location = useLocation();
		const queryParams = new URLSearchParams(location.search);
		const art = queryParams.get('art');
		
		function closemodal(){
			setClosing(true);
			setTimeout(() => {
				setShow(false);
				setClosing(false);
			}, 300);
		}
		function openmodal(t,err){
			setError(t);
			setErr(err);
			setShow(true);
		}
		function checkr(art){
			let formData = new FormData();
			formData.append('id', art);
			formData.append('mode', 0);
			let xhr = new XMLHttpRequest();
			xhr.open('POST','http://94.183.234.114/server/managereviews.php');
			xhr.send(formData);
			xhr.onload = function(){
				let response = JSON.parse(xhr.responseText);
				if(xhr.status == 200){
					if(response.success){
						setRevstatus(response.status);
						setRevmessage(response.message);
					}
					else{openmodal(response2.message, true)}
				}
				else{
					openmodal('Ошибка соединения '+ xhr.status, true);
				}	
			}
		}
		function addreview(){
			openmodal(
				<p>типа форма</p>
			
			
			)
		}
	
		useEffect(() => {
			if(toString(art).length < 1){
				setNo(true);
				setLoading(false);
			}
			else {
				let formData = new FormData();
				formData.append('art',art);
				let xhr = new XMLHttpRequest();
				xhr.open('POST','http://94.183.234.114/server/getproduct.php');
				xhr.send(formData);
				xhr.onload = function(){
					if(xhr.status == 200){
						let response = JSON.parse(xhr.responseText);
						if(response.success){
							if(response.info.length == 0){
								setNo(true)
							}
							else{
								let arr = [response.name, response.id];
								setProduct(response.info);
								setProps(response.data);
								setWay(arr);
								setIncart(response.incart);
								let xhr2 = new XMLHttpRequest();
								xhr2.open('POST','http://94.183.234.114/server/checkavail.php');
								xhr2.send(formData);
								xhr2.onload = function(){
									if(xhr2.status == 200){
										let response2 = JSON.parse(xhr2.responseText);
										if(response2.success){
											setAvail(response2.data);
											checkr(art);
										}
										else{openmodal(response2.message, true)}
									}
									else{
										openmodal('Ошибка '+ xhr.status, true);
									}
								}
							}
						}
						else{
							setNo(true);
						}
					}
					else{
						openmodal('Ошибка '+ xhr.status, true)
					}
					setLoading(false);
				}
			}
		},[art, refresh])
		
		function addtocart(){
			let xhr = new XMLHttpRequest();
			let formData = new FormData();
			formData.append('art',art);
			xhr.open('POST','http://94.183.234.114/server/addtocart.php');
			xhr.send(formData);
			xhr.onload = function(){
				if(xhr.status == 200){ 
					let response = JSON.parse(xhr.responseText);
					if(response.success){
						openmodal(
					<div>
					<p>{response.cartLink ? 'Товар уже был добавлен в корзину' : 'Товар добавлен в корзину!'}</p>
					<button className='buy' onClick={() => { closemodal(); navigate('/cart'); }}>
						Перейти в корзину
					</button>
					<button className='buy' onClick={closemodal}>Продолжить покупки</button>
					
				</div>, false
				);setRefresh(prev => prev + 1);
					}
					else{
						openmodal(response.message, true);
					}
				}
				else{
					openmodal('Ошибка '+ xhr.status, true);
				}
			}
		}
		return (
			<>
				<Header name='Computer shop' search={true} />
					<main>
					{show && (<Erwin text={error} closing={closing} closemodal={closemodal} error={err}/>)}
					{
						loading ? (
							<div className='spinner'></div>
						) : !no ? (
							<>
								<p id='way'><Link to='../'>Каталог</Link> → <Link to={'../shop?c='+way[1]}>{way[0]}</Link> → <span className='fakelink'>{product.name}</span></p>
								
								<div id='prodgrid'>
									<div id='firstline'>
										<div id='prodcart'>
											<p id='prodname'>{product.name}</p>
											<img id='prodimg' src={'prodimg/' + product.photo_url + '.png'} />
										</div>
										<div id='prodprice'>
											<p id='price'>{product.price} RUB</p>
											{incart == 0 ? (
												<button onClick={addtocart} id='buybut'>Купить</button>
											) : (
												<button onClick={() => navigate('../cart')} id='buybut'>
													В корзине
												</button>
											)}
											<div id='avail'>
												<div id='options'>
												<p className='big'>Наличие в магазинах:</p>
												{
													avail.map((item)=> {
														return(
															<div className={selectedoption == item.location ? 'option selected' : 'option'} onClick={() => {setselectedoption(item.location)}}><span className='o1'>{item.location.split(',')[0].trim()} - {item.name}</span><span className='o2'>{item.quantity} шт.</span></div>
														)
													})
												}
												</div>
											</div>
											<div  id='addr'><p>Адрес: {selectedoption}</p></div>
										</div>
									</div>
									<div id='secondline'>
										<h3>Описание</h3>
											<div id='descr'>
												{product.descr}
											</div>
									</div>
								<div id='thirdline'>
									<h3>Характеристики</h3>
										<ul>
										{	props.length == 0 ? (<p>Пока данных нет</p>) : (<div></div>)}
										{
											props.map((item)=> {
												return(
													<li>{item.name}: {item.val} {item.metrics}</li>
												)
											})
										}
										</ul>
								</div>
								<div id='fourthline'>
									<h3>Отзывы</h3>{
										revstatus == 0 ? (<p>Войдите в аккаунт чтобы оставить отзыв</p>) : revstatus == 1 ? (<button onClick={() => {addreview()}}><b>Добавить отзыв</b></button>) : (<p>Мой отзыв:</p>)
									}
								</div>
								</div>
							</>
						) : (
							<p>Такого товара нет=(</p>
						)
					}
					</main>
				<Footer />
			</>
		)
}
export default Product;
