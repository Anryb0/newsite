import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Shop from './pages/Shop.jsx';
import Profile from './pages/Profile.jsx';
import Product from './pages/Product.jsx';
import Search from './pages/Search.jsx';
import Cart from './pages/Cart.jsx';
import Order from './pages/Order.jsx';

function App() {	
  return (
    <Router>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/register" element={<Register />} />
			<Route path="/shop" element={<Shop />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/search" element={<Search />} />
			<Route path="/product" element={<Product />} />
			<Route path="/cart" element={<Cart />} />
			<Route path="/order" element={<Order />} />
		</Routes>
	</Router>
  );
}

export default App;