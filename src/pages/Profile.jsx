import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './Profile.css';

function Profile(){
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [userpic, setUserpic] = useState(null);
	const[show,setShow] = useState(false);
	const[refresh,setRefresh] = useState(0);
	const[closing,setClosing] = useState(false);
	const[error,setError] = useState('');
	const[err,setErr] = useState(false);
	const[orders,setOrders] = useState([]);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const[isUploading, setIsUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	
	const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
	
	function logout(){
		let xhr = new XMLHttpRequest();
		xhr.open('POST','http://94.183.234.114/server/logout.php');
		xhr.send();
		xhr.onload = function() {setRefresh(prev => prev + 1);}
	}
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
	function uploaduserpic(){
		openmodal(
			<div>
				<p>Загрузка фото...</p>
				<div className='spinner'></div>
			</div>
		)
		let formData = new FormData();
		formData.append('image', selectedFile);
		let xhr = new XMLHttpRequest();
		setIsUploading(true);
		xhr.open('POST','http://94.183.234.114/server/uploaduserpic.php');
		xhr.send(formData);
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText);
				console.log(response)
				if(response.success){
					openmodal('Картинка загружена');
					setIsUploading(false);
					setRefresh((prev)=> prev + 1);
				}
				else{openmodal(response.message, true);}
			}
			else{
				openmodal('Ошибка соединения ' + xhr.status, true);
			}
		}
	}
	useEffect(() => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST','http://94.183.234.114/server/getuser.php');
		xhr.send()
		xhr.onload = function() {
			let response = JSON.parse(xhr.responseText);
			if(!response.loggedin){
				navigate('/');
			}
			else{
				setUser(response.user);
				setUserpic(response.photo_url);
				let formData = new FormData();
				formData.append('mode',1);
				let xhr2 = new XMLHttpRequest();
				xhr2.open('POST','http://94.183.234.114/server/manageorder.php');
				xhr2.onload = function(){
					if(xhr2.status == 200){
						let response2 = JSON.parse(xhr2.responseText);
						if(response2.success){
							if(response2.orders.length == 1){setOrders([response2.orders])}
							else{setOrders(response2.orders)}
						} else {
							openmodal(response2.message, true);
						}
						setLoading(false);
					} else {
						openmodal('Ошибка соединения ' + xhr2.status, true);
					}
				}
				xhr2.send(formData);
			}
		}
	},[refresh])
	return (
        <>
            <Header name='Computer shop' nonbut={true} search={false}/>
            {show && (
                <Erwin text={error} closemodal={closemodal} closing={closing} />
            )}
            <main>
                {loading ? (
                    <div className='spinner'></div>
                ) : (
                    <>
                        <h3>Добрый день, {user}<button className='logout redback' onClick={() => {logout()}}><b>Выйти из аккаунта</b></button></h3>
                        <div id='profilegrid'>
                            <div id='userpicplace' className='glassy'>
                                <img src={'userpic/' + userpic} id='userpic' />
                                <p>Изменить аватарку: <input type='file' id='fileinput' onChange={handleFileSelect} accept="image/png,image/jpeg"/></p>
								<button id='chuserpic'  onClick={uploaduserpic}
                        disabled={isUploading}>Загрузить</button>
                            </div>
                            <div id='userordersplace' className='glassy'>
								<h3>Мои заказы</h3>
                                <div id='userorderheader'><span>№ заказа</span><span></span><span>Статус</span><span>Дата создания</span><span>Сумма</span></div>
								<hr />
                                <div id='userorderlist'>
                                    {orders.map((item) => (
                                        <Link 
                                            to={'../order?id=' + item.id} 
                                            className='userorder glassy' 
                                            key={item.id} 
                                        >
                                            <span className='ordernum'>{'Заказ №' + item.id}</span>
											<span></span>
                                            <span className='orderstatus'>{item.status}</span>
                                            <span className='orderdate'>{item.time.split(":").slice(0, 2).join(":")}</span>
                                            <span className='ordersum'>{item.total_sum} RUB</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
						{/*
						<div id='userr'>
							<div id='userreviews' className='glassy'>
								<h3>Мои отзывы</h3>
							</div>
						</div> */}
                    </>
                )}
            </main>
            <Footer />
        </>
    )
}
export default Profile;