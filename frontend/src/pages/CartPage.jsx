import React, { useState, useEffect } from 'react';
import { getCartItems } from '../services/cart';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('You must be logged in to view the cart.');
                    return;
                }
                const items = await getCartItems(userId);
                setCartItems(items);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchCartItems();
    }, []);

    return (
        <div>
            <h2>Cart</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {cartItems.length === 0 && !error && <p>Your cart is empty.</p>}
            <div>
                {cartItems.map(item => (
                    <div key={item._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                        <h3>{item.productName|| 'Unknown Product'}</h3>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                        <p>Gift: {item.gift ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartPage;
