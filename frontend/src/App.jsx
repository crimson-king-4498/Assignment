import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
};

export default App;