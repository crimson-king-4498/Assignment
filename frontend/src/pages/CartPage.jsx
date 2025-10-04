import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems, updateCartItem, deleteCartItem } from '../services/cart';
import { checkout } from '../services/checkout';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

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
                if (error.data?.invalidItems) {
                    const invalids = error.data.invalidItems
                        .map(item => item.productName)
                        .join(', ');
                    setError(`${error.data.message} Removed: ${invalids}`);
                } else {
                    setError(error.message);
                }

            }
        };
        fetchCartItems();
    }, []);


    const handleUpdate = async (cartItemId, field, value) => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');
            await updateCartItem(userId, cartItemId, { [field]: value });

            setCartItems(prev =>
                prev.map(item =>
                    item._id === cartItemId ? { ...item, [field]: value } : item
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cartItemId) => {
        try {
            const userId = localStorage.getItem('userId');
            await deleteCartItem(userId, cartItemId);
            setCartItems(prev => prev.filter(item => item._id !== cartItemId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCheckout = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('You must be logged in to checkout.');
                return;
            }
            const response = await checkout(userId);
            setSuccess(response.message);
            setCartItems([]);
            setError(null);
        } catch (error) {
            if (error.data?.invalidItems) {
                const invalids = error.data.invalidItems
                    .map(item => item.productName)
                    .join(', ');
                setError(`${error.data.message} Removed: ${invalids}`);
            } else {
                setError(error.message);
            }
            setSuccess(null);
        }
    };

    const calculateItemTotal = (item) => {
        const giftPrice = item.gift ? 10 : 0;
        return (item.price + giftPrice) * item.quantity;
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
    };


    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
                <h1>EComm</h1>
                <div>
                    <Link to="/home">
                        <button>
                            <span role="img" aria-label="home">🏠</span>
                        </button>
                    </Link>
                    <Link to="/orders">
                        <button>
                            Orders
                        </button>
                    </Link>
                </div>
            </header>
            <main style={{ padding: '1rem' }}>
                <h2>Cart</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {cartItems.length === 0 && !error && <p>Your cart is empty.</p>}

                {cartItems.map(item => (
                    <div
                        key={item._id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: '8px'
                        }}
                    >
                        <h3>{item.productName || 'Unknown Product'}</h3>
                        <p>Price: ${item.price}</p>

                        <label>
                            Quantity:
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={e => handleUpdate(item._id, 'quantity', Number(e.target.value))}
                                style={{ width: '60px', marginLeft: '8px' }}
                            />
                        </label>

                        <div style={{ marginTop: '0.5rem' }}>
                            <label>
                                Size:
                                <select
                                    value={item.size}
                                    onChange={e => handleUpdate(item._id, 'size', e.target.value)}
                                    style={{ marginLeft: '8px' }}
                                >
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                </select>
                            </label>
                        </div>

                        <div style={{ marginTop: '0.5rem' }}>
                            <label>
                                Gift:
                                <input
                                    type="checkbox"
                                    checked={item.gift}
                                    onChange={e => handleUpdate(item._id, 'gift', e.target.checked)}
                                    style={{ marginLeft: '8px' }}
                                />
                            </label>
                        </div>
                        <p>Total: ${calculateItemTotal(item)}</p>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>

                    </div>
                ))}
                {cartItems.length > 0 && (
                    <div>
                        <h3>Total Cart Price: ${calculateCartTotal()}</h3>
                        <button onClick={handleCheckout} style={{ marginTop: '1rem' }}>
                            Checkout
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPage;