import { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './Order.css';

function Order(){
	const[loading, setLoading] = useState(true);
	const[show,setShow] = useState(false);
	const[closing,setClosing] = useState(false);
	const[error,setError] = useState('');
	const[err,setErr] = useState(false);
	const[data,setData] = useState(null);
	const[order,setOrder] = useState(null);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const order = queryParams.get('id');
	
	function closemodal(){
		setClosing(true);
		setTimeout(() => {
			setShow(false);
			setClosing(false);
		}, 300);
	}
	function openmodal(t, err){
		setErr(err);
		setError(t);
		setShow(true);
	}
	
	useEffect(() => {
		let formData = new FormData();
		formData.append('id',order);
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://94.183.234.114/server/getorder.php');
		xhr.send(formData);
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText));
				if(response.success){
					setData(response.data);
					setOrder(response.order);
				}
				else{
					openmodal(response.message, true);
				}
			}
			else{
				openmodal('Ошибка соединения: ' + xhr.status, true);
			}
			setLoading(false);
		}
	}, [order]);
	return(
		<>
			<Header name='Computer shop' search={true}/>
			{show && (
				<Erwin text={error} closemodal={closemodal} closing={closing}/>
			)}
			<main>
			{loading ? (<div className='spinner'></div>) : (
				<>
					<p id='toptext'>Заказ №{order.id}</p>
					<p className='orderprop'>Заказ оформлен: {order.time.split(':').slice(0, 2).join(':')}</p>
					<p className='orderprop'>Статус заказа: {order.status}</p>
					<p className='orderprop'></p>
				</>
			)}
			</main>
			<Footer />
		</>
	)
}

export default Order;