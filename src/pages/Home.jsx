import { useState } from "react";
import Header from './components/Header.jsx'
import Catalog from './components/Catalog.jsx'
import Footer from './components/Footer.jsx'
import Description from './components/Description.jsx'

function Home() {	
  return (
    <div className="todoapp stack-large">
		<Header name='Computer shop'/>
		<main>
			<h1>Каталог</h1>
			<Catalog />
			<Description />
		</main>
		<Footer />
    </div>
  );
}

export default Home;