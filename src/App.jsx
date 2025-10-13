import { useState } from "react";
import Header from './components/Header.jsx'
import Catalog from './components/Catalog.jsx'
import Footer from './components/Footer.jsx'

function App() {	
  return (
    <div className="todoapp stack-large">
		<Header name='Computer shop'/>
		<main>
			<Catalog />
		</main>
		<Footer />
    </div>
  );
}

export default App;