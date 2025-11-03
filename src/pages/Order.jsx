import { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './Order.css';
import './Cart.css';


function Order(){
	const[loading, setLoading] = useState(true);
	const[show,setShow] = useState(false);
	const[closing,setClosing] = useState(false);
	const[error,setError] = useState('');
	const[err,setErr] = useState(false);
	const[data,setData] = useState(null);
	const[order,setOrder] = useState(null);
	const[no, setNo] = useState(null);
	const[sum,setSum] = useState(null);
	const[refresh,setRefresh] = useState(0);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const o = queryParams.get('id');
	
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
	function cancelorder(o){
		let formData = new FormData();
		formData.append('id',o);
		formData.append('mode',0);
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://94.183.234.114/server/manageorder.php');
		xhr.send(formData);
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText);
				if(response.success){
					openmodal('Заказ отменен');
					setRefresh(prev => prev + 1);
				}
				else{
					openmodal(response.message, true);
				}
			}
			else{
				openmodal('Ошибка соединения: ' + xhr.status, true);
			}
		}
	}
	useEffect(() => {
		let formData = new FormData();
		formData.append('id',o);
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://94.183.234.114/server/getorder.php');
		xhr.send(formData);
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText);
				if(response.success){
					setData(response.data);
					setOrder(response.order);
					setSum(response.sum);
				}
				else{
					setNo(true);
					openmodal(response.message, true);
				}
			}
			else{
				setNo(true);
				openmodal('Ошибка соединения: ' + xhr.status, true);
			}
			setLoading(false);
		}
	}, [o, refresh]);
	return (
  <>
    <Header name="Computer shop" search={true} />
    {show && (
      <Erwin text={error} closemodal={closemodal} closing={closing} />
    )}
    <main>
      {loading ? (
        <div className="spinner"></div>
      ) : !no ? (
        <>
          <p id="toptext">Заказ №{o}</p>
          <p className="orderprop">Заказ оформлен: {order.time.split(":").slice(0, 2).join(":")}</p>
          <p className="orderprop">Статус заказа: {order.status}</p> {order.status == 'Создан' ? (<button className='cancel' onClick={() => {cancelorder(o)}}>Отменить заказ</button>) : (<></>)}
          <p className="orderprop">
            <b>В каком магазине забрать: {order.name} - {order.address}</b>
          </p>
		  <h3>Содержимое: </h3>
			<p id='orderheader'><span></span><span>Фото</span><span>Название</span><span></span><span>Кол-во</span><span>Стоимость</span></p>
			<hr />
          <div id="cartelements">
            {data.map((item) => (
              <div className="cartelement" key={item.product_id}>
                <img
                  src={`prodimg/${item.photo_url}.png`}
                  alt={item.product_name}
                  className="cartpic"
                />
                <Link to={`../product?art=${item.product_id}`} className="cartname">
                  {item.name}
                </Link>
                <span className="orderprice">
                  <span id="cartq">{item.q}</span>
                  <span id="v">{item.price * item.q} RUB</span>
                </span>
              </div>
            ))}
          </div>
		  <hr />
		  <p id='sumo'>Сумма заказа: {sum} RUB</p>
        </>
      ) : (
        <p>Что-то пошло не так</p>
      )}
    </main>
    <Footer />
  </>
);

}

export default Order;