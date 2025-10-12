import { useEffect, useState } from 'react';
import './Catalog.css';

function Catalog()
{
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
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
		
	},[]);
	return (
		<div id='elements'>
		{ 	loading ? (
				<p>Загрузка...</p>
			) : (
				categories.map(item =>(
					<div className='element' key={item.id}><img src={'catpic/' + item.photo_url + '.png'} />{item.name}</div>
			)))	
		}
		</div>
	);
}

export default Catalog;


