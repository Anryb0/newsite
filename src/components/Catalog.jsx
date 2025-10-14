import { useEffect, useState } from 'react';
import './Catalog.css';
import Subcat from './Subcat.jsx';

function Catalog()
{
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [showmenu, setShowmenu] = useState(false);
	const [selected, setSelected] = useState(null);
	useEffect(() => {
		let xhr = new XMLHttpRequest;
		xhr.open('POST','http://94.183.234.114/server/getcatalog.php')
		xhr.send();
		xhr.onload = function()
		{
			if(xhr.status==200){
				let response = JSON.parse(xhr.responseText);
				if(response.success){
					setCategories(response.data);
				}
				else{
					console.log('ошибка');
				}
			}
			else{
				console.log('ошибка');
			}
			setLoading(false);
		}
		
	},[]);
	function openmodal(id){
		setSelected(id);
		setShowmenu(true);
	}
	function closemodal(){
		setShowmenu(false);
	}
	return (
		<>
			<div id='elements'>
			{ 	loading ? (
					<p>Загрузка...</p>
				) : (
					categories.map(item =>(
						<a className='element' onClick={() => openmodal(item.id)} key={item.id} id={'e' + item.id}><img src={'catpic/' + item.photo_url + '.png'} /><p className="catname"><b>{item.name}</b></p></a>
				)))	
			}
			</div>
			{showmenu && (<Subcat catid={selected} closemodal={closemodal}/>)}
		</>
	);
}

export default Catalog;


