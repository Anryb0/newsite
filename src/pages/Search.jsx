import { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './components/Catalog.css';

function Search() {
	const location = new useLocation;
	const[loading, setLoading] = useState(true);
	const[no, setNo] = useState(false);
	const[results,setResults] = useState(null);
	const[show,setShow] = useState(null);
	const[error,setError] = useState(null);
	const[closing,setClosing] = useState(false);
	const[props, setProps] = useState(null);
	const queryParams = new URLSearchParams(location.search);
	const query = queryParams.get('q');
	useEffect(() => {
		if(query.length == 0){
			setNo(true);
			setLoading(false);
		}
		else{
			let formData = new FormData();
			formData.append('q',('%' + query + '%'));
			let xhr = new XMLHttpRequest;
			xhr.open('POST','http://94.183.234.114/server/searchengine.php');
			xhr.send(formData);
			xhr.onload = function() {
				if(xhr.status == 200){
					let response = JSON.parse(xhr.responseText);
					if(response.success){
						if(response.data.length == 0){
							openmodal('По вашему запросу ничего не найдено');
							setNo(true);
						}
						setResults(response.data);
						setProps(response.allprops);
					}
					else{
						openmodal(response.message);
						setNo(true);
					}
				}
				else{
					openmodal('Ошибка ' + xhr.status);
					setNo(true);
				}
				setLoading(false);
			}
		}
	},[query])
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
	return (
		<>
			<Header name='Computer shop' search={true} />
				<main>
					{show && (<Erwin text={error} closing={closing} closemodal={closemodal} />)}
					{loading ? (	
						<div className='spinner'></div>
						) : no ? (
							<p id='c3'><Link to='../' className='buy' id ='toback'>На главную</Link></p>
						) : (
							<>
								<p id='toptext'></p>
								<div id='elements'>
										{results.map(item => {
											let pstr = '';
											props.forEach((i) => {
												if(i.id == item.id){pstr = i.str}
											})
											return (
												<Link to={'/product?art=' + item.id} key={item.id} className='element prod'>
													<p className='prodname'>{item.name}</p>
													<img className='prodimg' src={'./prodimg/' + item.photo_url + '.png'} alt={item.name} />
													<p className='prodprops'>{pstr}</p>
													<p className='prodprice'>
														<span id='pp'>{item.price} RUB </span>
														<button className='buy'>Купить</button>
													</p>
												</Link>
											);
										})}
								</div>
							</>
						)}
				</main>
			<Footer />
		</>
	)
	
}

export default Search;
