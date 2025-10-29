import { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Erwin from './components/Erwin.jsx';
import './Order.css';

function Order(){
	const[loading, setLoading] = useState(true);
	return(
		<>
			<Header name='Computer shop' search={true}/>
			<main>
			{loading ? (<div className='spinner'></div>) : (<div></div>)}
			</main>
			<Footer />
		</>
	)
}

export default Order;