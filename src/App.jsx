import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Shop from './pages/Shop.jsx';
import Profile from './pages/Profile.jsx';
import Product from './pages/Product.jsx';

function App() {	
  return (
    <Router>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/register" element={<Register />} />
			<Route path="/shop" element={<Shop />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/product" element={<Product />} />
		</Routes>
	</Router>
  );
}

export default App;