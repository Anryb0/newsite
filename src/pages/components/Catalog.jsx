import { useEffect, useState } from 'react';
import './Catalog.css';
import Subcat from './Subcat.jsx';

function Catalog()
{
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [showmenu, setShowmenu] = useState(false);
	const [selected, setSelected] = useState(null);
	const [selectedname, setSelectedname] = useState(null);
	const [selecteddescr, setSelecteddescr] = useState(null);
	const [closing, setClosing] = useState(false);
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
					setSubcategories(response.data1);
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
	function openmodal(id,name,descr){
		setSelected(id);
		setSelectedname(name);
		setSelecteddescr(descr);
		setShowmenu(true);
	}
	function closemodal(){
		setClosing(true);
		setTimeout(() => {
			setShowmenu(false);
			setClosing(false);
		}, 300);
	}
	return (
		<>
			<div id='elements'>
			{ 	loading ? (
					<div className='spinner'></div>
				) : (
					categories.map(item =>(
						<a className='element' onClick={() => openmodal(item.id, item.name, item.descr)} key={item.id} id={'e' + item.id}><img src={'catpic/' + item.photo_url + '.png'} /><p className="catname"><b>{item.name}</b></p></a>
				)))	
			}
			</div>
			{showmenu && (<Subcat catid={selected} catname={selectedname} subcategories={subcategories} closemodal={closemodal} closing={closing} descr={selecteddescr}/>)}
		</>
	);
}

export default Catalog;


