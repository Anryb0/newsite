import { useState, useEffect, useCallback } from "react";
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
    const[header,setHeader] = useState(false);
    const[props,setProps] = useState(null);
    const[way,setWay] = useState([]);
    const[closing,setClosing] = useState(false);
    const[revstatus,setRevstatus] = useState(null);
    const[revmessage,setRevmessage] = useState(null);
	const[myrev,setMyrev] = useState(null);
	const[otherrevs, setOtherrevs] = useState(null);
	const[cr, setCr] = useState(null);
    const[selectedFile,setSelectedFile] = useState(null);
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
    
    const[pros, setPros] = useState('');
    const[cons, setCons] = useState('');
    const[comm, setComm] = useState(''); 
    const[rating, setRating] = useState(0);
    const[tempRating, setTempRating] = useState(0); 
    
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

const handleRatingSelect = useCallback((selectedRating) => {
  setRating(selectedRating);
}, []);

const handleStarHover = useCallback((hoverRating) => {
  setTempRating(hoverRating);
}, []);

const handleStarLeave = useCallback(() => {
  setTempRating(0);
}, []);
    
    function closemodal(){
        setClosing(true);
        setTimeout(() => {
            setShow(false);
            setClosing(false);
            setSelectedFile(null);
        }, 300);
    }

    function openmodal(t,err, hr){
        setError(t);
        setErr(err);
        if(hr){
            setHeader(hr)
        } else {setHeader(false)}
        setShow(true);
    }

	function loadotherrevs(){
		let formData = new FormData();
        formData.append('id', art);
        formData.append('mode', 1);
        let xhr = new XMLHttpRequest();
        xhr.open('POST','http://94.183.234.114/server/managereviews.php');
        xhr.send(formData);
		 xhr.onload = function(){
            let response = JSON.parse(xhr.responseText);
            if(xhr.status == 200){
                if(response.success){	
					if (Array.isArray(response.reviews)) {
    setOtherrevs(response.reviews);
} else {
    setOtherrevs([response.reviews]);
}if(response.avgr){
setCr(response.avgr.slice(0,3))
}
                }
                else{openmodal(response.message, true)}
            }
            else{
                openmodal('Ошибка соединения '+ xhr.status, true);
            }	
        }
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
					setMyrev(response.rev);
                }
                else{openmodal(response.message, true)}
            }
            else{
                openmodal('Ошибка соединения '+ xhr.status, true);
            }	
        }
    }
	

    
    function sendreview(){
		openmodal(
			<div>
				<p>Загрузка отзыва...</p>
				<div className='spinner'></div>
			</div>
		)
        let formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('pros', pros);
        formData.append('cons', cons);
        formData.append('comm', comm);
        formData.append('rating', rating);
        formData.append('id', art);
		formData.append('mode', 2);
        
        let xhr = new XMLHttpRequest();
        xhr.open('POST','http://94.183.234.114/server/managereviews.php');
        xhr.send(formData);
        xhr.onload = function(){
            if(xhr.status == 200){
                let response = JSON.parse(xhr.responseText);
                if(response.success){
					closemodal();
                    openmodal('Отзыв успешно добавлен!', false);
                    setPros('');
                    setCons('');
                    setComm('');
                    setRating(0);
                    setSelectedFile(null);
                    checkr(art);
                }
                else{
					closemodal();
                    openmodal(response.message, true);
                }
            }
            else{
                openmodal('Ошибка соединения '+ xhr.status, true);
            }
        }
    }
    
    useEffect(() => {
        if(art && art.length < 1){
            setNo(true);
            setLoading(false);
        }
        else if (art) {
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
										loadotherrevs();
										setLoading(false);
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

function deleterev() {
    if (!myrev) return;
    openmodal(
        <div>
            <p>Удаляю отзыв...</p>
            <div className='spinner'></div>
        </div>
    );

    let formData = new FormData();
    formData.append('id', myrev.id);
    formData.append('mode', 3); 

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://94.183.234.114/server/managereviews.php');
    xhr.send(formData);
    xhr.onload = function () {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            closemodal();
            if (response.success) {
                openmodal('Отзыв удалён', false);
                setMyrev(null);
                checkr(art);
                loadotherrevs();
            } else {
                openmodal(response.message, true);
            }
        } else {
            openmodal('Ошибка соединения ' + xhr.status, true);
        }
    };
}


    return (
        <>
            <Header name='Computer shop' search={true} />
                <main>
                {show && (<Erwin text={error} closing={closing} closemodal={closemodal} error={err} header={header}/>)}
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
                                        <p className='big'>Наличие в магазинах:</p>
                                            {/* <select id='shopfilt'>
                                                <option>Все</option>
                                                <option>В наличии</option>
                                            </select>
                                            <input type='text' placeholder='Поиск' /> */}
                                            <div id='options'>
                                            {
                                                avail.map((item, index)=> {
                                                    return(
                                                        <div key={index} className={selectedoption == item.location ? 'option selected' : 'option'} onClick={() => {setselectedoption(item.location)}}><span className='o1'>{item.location.split(',')[0].trim()} - {item.name}</span><span className='o2'>{item.quantity} шт.</span></div>
                                                    )
                                                })
                                            }
                                            </div>
                                        </div>
                                        <div  id='addr'><p>Адрес: {selectedoption}</p></div>
                                    </div>
                                </div>
                                <div id='secondline'>
                                    <div id='descr'>
                                        <h3>Описание</h3>
                                        <div>
                                            {product.descr}
                                        </div>
                                    </div>
                                    <div id='props'>
                                        <h3>Характеристики</h3>
                                        <ul>
                                        {   props && props.length == 0 ? (<p>Пока данных нет</p>) : (<div></div>)}
                                        {
                                            props && props.map((item, index)=> {
                                                return(
                                                    <li key={index}>{item.name}: {item.val} {item.metrics}</li>
                                                )
                                            })
                                        }
                                        </ul>
                                    </div>
                                </div>
								{
    revstatus == 0 ? null 
    : revstatus == 1 ? (
        <div id='thirdline' className='glassy'>
            <h3>Добавить отзыв</h3>
            <div>
                <span id='rating'>
                    <span className="rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= (tempRating > 0 ? tempRating : rating) ? 'select' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setTempRating(star)}
                                onMouseLeave={() => setTempRating(0)}
                            >
                                ★
                            </span>
                        ))}
                    </span>
                </span>
                <p>
                    Достоинства
                    <input
                        type='text'
                        placeholder='необязательно'
                        className='f'
                        value={pros}
                        onChange={(e) => setPros(e.target.value)}
                    />
                </p>

                <p>
                    Недостатки
                    <input
                        type='text'
                        placeholder='необязательно'
                        className='f'
                        value={cons}
                        onChange={(e) => setCons(e.target.value)}
                    />
                </p>

                <p>
                    Комментарий
                    <input
                        type='text'
                        placeholder='обязательно, минимум 4 символа'
                        className='f'
                        value={comm}
                        onChange={(e) => setComm(e.target.value)}
                    />
                </p>

                <p>
                    Прикрепить фото
                    <input
                        type='file'
                        placeholder='необязательно'
                        className='f'
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </p>

                <button onClick={sendreview} id='sendrev'>Отправить</button>
            </div>
        </div>	
    ) : (
        myrev ? ( 
            <div id='thirdline' className='glassy'>
                <h3>
                    Мой отзыв
                    <button id='delrev' className='redback' onClick={deleterev}>Удалить отзыв</button>
                </h3>
                <div className='order glassy'>
                    {myrev.userpic && <img src={'userpic/' + myrev.userpic} className='userpic' alt='аватар' />}
					<span className='userinfo grey'>
						<span className='username'>{myrev.login} </span>
						<span className='time'>{myrev.time?.split(":").slice(0, 2).join(":")}</span>
						<span className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= myrev.rating ? 'select' : ''}`}
                            >
                                ★
                            </span>
                        ))}
                    </span>
					</span>
                    {myrev.pros && <p className='revpros'>Достоинства: {myrev.pros}</p>}
                    {myrev.cons && <p className='revcons'>Недостатки: {myrev.cons}</p>}
                    <p className='revcomm'>Комментарий: {myrev.comm}</p>
                    {myrev.photo_url && <button onClick={() => {openmodal(<img src={'revpic/' + myrev.photo_url} className='revpic' alt='фото отзыва' />)}}>Показать фото</button>}
					<p>Статус: {myrev.status}</p>
                </div>
            </div>
        ) : (<div className='spinner'></div>)
    )
}

							<div id='fourthline'>
    <h3>
	  Отзывы <span className='q'>{otherrevs ? otherrevs.length : 0}</span>
	  {otherrevs && otherrevs.length > 0 && (
		<span id='completerating'>
		  <span className="star select">★</span> {cr}
		</span>
	  )}
	</h3>

    
    {otherrevs === null ? (
        <div className='spinner'></div>
    ) : otherrevs.length > 0 ? (
        otherrevs.map((item) => (
            <div key={item.id} className='order glassy'>
                {item.userpic && <img src={'userpic/' + item.userpic} className='userpic' alt='аватар' />}
                <span className='userinfo grey'>
                    <span className='username'>{item.login} </span>
                    <span className='time'>{item.time?.split(":").slice(0, 2).join(":")}</span>
                    <span className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= item.rating ? 'select' : ''}`}
                            >
                                ★
                            </span>
                        ))}
                    </span>
                </span>
                {item.pros && <p className='revpros'>Достоинства: {item.pros}</p>}
                {item.cons && <p className='revcons'>Недостатки: {item.cons}</p>}
                <p className='revcomm'>Комментарий: {item.comm}</p>
                {item.photo_url && (
                    <button
                        onClick={() => {
                            openmodal(
                                <img src={'revpic/' + item.photo_url} className='revpic' alt='фото отзыва' />
                            )
                        }}
                    >
                        Показать фото
                    </button>
                )}
            </div>
        ))
    ) : (
        <p>Пока нет отзывов</p>
    )}
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