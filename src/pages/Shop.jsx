import { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './Shop.css';

function Shop() {
	const [user, setUser] = useState(null);
	const [products, setProducts] = useState(null);
	const [name, setName] = useState(null);
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const cat = queryParams.get('c');
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
					setName(response.name);
				}
				else{
					console.log('ошибка')
				}
			}	
			else {
				console.log('Ошибка ', xhr.status)
			}
			setLoading(false);
		}
	}, [cat])
	return (
		<>
			<Header name='Computer shop' search={true}/>
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
							{products.map(item => (
								<Link to={'/product?art=' + item.id} key={item.id} className='element prod'><img className='prodimg' src={'./prodimg/' + item.photo_url + '.png'} /><p className='prodname'>{item.name}</p></Link>
							))}
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