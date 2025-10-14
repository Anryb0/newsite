import { useEffect, useState } from 'react';
import './Subcat.css'

function Subcat(props){
	const [loading,setLoading] = useState(true);
	const [subcat,setSubcat] = useState([]);
	const [catname,setCatname] = useState('');
	useEffect(() => {
		let xhr = new XMLHttpRequest();
		let formData = new FormData();
		formData.append("catid",props.catid);
		xhr.open('POST','http://94.183.234.114/server/getcat.php');
		xhr.send(formData);
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText);
				console.log(response)
				if(response.success){
					if(!Array.isArray(response.data)){
						setSubcat([response.data])
					}
					else { setSubcat(response.data)};
					setCatname(response.catname);
					setLoading(false);
				}
				else{
					console.log('ошибка');
					setLoading(false);
				}
			}
			else{
				console.log('ошибка');
				setLoading(false);
			}
		}
	},[props.catid])
	return(
		<div id='modalplace'>
			{
				loading ? (
					<div id='modal'>
						<div id='modal-el'>
							<h2>Загрузка...<span id='closebutton' onClick={() => {props.closemodal()}}>×</span></h2>
						</div>
					</div>
				) : subcat && subcat.length > 0 ? (
					<div id='modal'>
						<div id='modal-el'>
							<h2>{catname}<span id='closebutton' onClick={() => {props.closemodal()}}>×</span></h2>
							<div id='subcatlist'>
								{subcat.map(item => (
									<a id={'l' + item.id}><p className='subcatname'><img src={'subcatpic/' + item.photo_url+'.png'} className='subcatpic'/><span className='scn'>{item.name}</span></p></a>
								))}
							</div>
						</div>
					</div>
				) : (
					<div id='modal'>
						<div id='modal-el'>
							<h2>Нет данных<span id='closebutton' onClick={() => {props.closemodal()}}>×</span></h2>
						</div>
					</div>
				)
			}
		</div>
	);
}

export default Subcat;