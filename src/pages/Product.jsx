import { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './Product.css';

function Product(){
		const[loading,setLoading] = useState(true);
		const[product,setProduct] = useState(null);
		const[no,setNo] = useState(false);
		const[props,setProps] = useState(null);
		const[way,setWay] = useState([]);
		const location = useLocation();
		const queryParams = new URLSearchParams(location.search);
		const art = queryParams.get('art')
		useEffect(() => {
			if(toString(art).length < 1){
				setNo(true);
				setLoading(false);
			}
			else {
				let formData = new FormData();
				formData.append('art',art)
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
							}
						}
						else{
							setNo(true);
						}
					}
					else{
						console.log('Ошибка ', xhr.status)
					}
					setLoading(false);
				}
			}
		},[art])
		return (
			<>
				<Header name='Computer shop' search={true} />
					<main>
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
											<button id='buybut'>Купить</button>
											<p>Товар доступен в магазине по адресу блаблабла</p>
											<button>Проверить наличие в других магазинах</button>
										</div>
									</div>
									<div id='secondline'>
										<h3>Характеристики</h3>
										<ul>
										{
											props.map((item)=> {
												return(
													<li>{item.name}: {item.val} {item.metrics}</li>
												)
											})
										}
										</ul>
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
