import { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './Product.css';

function Product(){
		const[loading,setloading] = useState(true);
		const[product,setProduct] = useState(null);
		const[no,setNo] = useState(false);
		const location = useLocation();
		const queryParams = new URLSearchParams(location.search);
		if(!queryParams.get('art')){
			setNo(true);
		}
		useEffect(() => {
			let formData = new FormData();
			formData.append()
			let xhr = new XMLHttpRequest();
			xhr.open('POST','http://94.183.234.114/server/getproduct.php');
			xhr.send();
			xhr.onload = function(){
				
			}
		},[art])
		return (
			<>
				<Header name='Computer shop' search={true} />
				<Footer />
			</>
		)
}
export default Product;
