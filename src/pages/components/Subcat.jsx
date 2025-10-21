import { useEffect, useState } from 'react';
import './Subcat.css'
import { Link } from 'react-router-dom';

function Subcat(props){
	const [vsubcategories, setVsubcategories] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
			let validsubcat = [];
			let allsc = [];
			if (!Array.isArray(props.subcategories)){
				allsc = [props.subcategories];
			}
			else{
				allsc = props.subcategories;
			}
			allsc.forEach(function(item){
				if(item.cat == props.catid){
					validsubcat.push(item);
				} 
			})
			setVsubcategories(validsubcat);
			setLoading(false);
		},[props.catid])
	return(
		<div id='modalplace'>
			{
				loading ? (
					<div id='modal' className = {props.closing ? 'modal-out' : ""}>
						<div id='modal-el'>
							<h2>Загрузка...<span id='closebutton' onClick={() => {props.closemodal()}}>×</span></h2>
						</div>
					</div>
				) : vsubcategories && vsubcategories.length > 0 ? (
					<div id='modal' className = {props.closing ? 'modal-out' : ""}>
						<div id='modal-el'>
							<h2>{props.catname}<span id='closebutton' onClick={() => {props.closemodal()}}>×</span></h2>
							<p className='catdescr'>{props.descr}</p>
							<div id='subcatlist'>
								{vsubcategories.map(item => (
									<Link id={'l' + item.id} to={'/shop?c=' + item.id} key={item.id}><p className='subcatname'><img src={'subcatpic/' + item.photo_url+'.png'} className='subcatpic'/><span className='scn'>{item.name}</span></p></Link>
								))}
							</div>
						</div>
					</div>
				) : (
					<div id='modal' className = {props.closing ? 'modal-out' : ""}>
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