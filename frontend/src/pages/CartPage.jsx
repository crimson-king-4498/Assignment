import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, updateCartItem, deleteCartItem } from '../services/cart';
import { checkout } from '../services/checkout';

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid #dee2e6',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    navButton: {
        padding: '8px 15px',
        marginLeft: '10px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'background-color 0.3s',
    },
    logoutButton: {
        padding: '8px 15px',
        marginLeft: '10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'background-color 0.3s',
    },
    main: {
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '1.5rem',
        color: '#343a40',
        borderBottom: '2px solid #007bff',
        paddingBottom: '5px',
    },
    error: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb',
    },
    success: {
        color: '#155724',
        backgroundColor: '#d4edda',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #c3e6cb',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
    },
    itemDetails: {
        flexGrow: 1,
        minWidth: '250px',
    },
    itemControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        minWidth: '200px',
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        width: '50px',
        textAlign: 'center',
    },
    select: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        marginLeft: '5px',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        minWidth: '80px',
    },
    summaryCard: {
        backgroundColor: '#e9ecef',
        padding: '1.5rem',
        borderRadius: '8px',
        marginTop: '2rem',
        textAlign: 'right',
    },
    checkoutButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '6px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '15px',
        transition: 'background-color 0.3s',
    },
};

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

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
        if (field === 'quantity' && value < 1) return;

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
            setSuccess('Item removed from cart.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCheckout = async () => {
        if (loading) return;
        if (cartItems.length === 0) {
            setError('Cannot checkout an empty cart.');
            return;
        }
        setLoading(true);

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('You must be logged in to checkout.');
                return;
            }
            const response = await checkout(userId);
            setSuccess(response.message || 'Checkout successful!');
            setCartItems([]);
            setError(null);
        } catch (error) {
            if (error.data?.invalidItems) {
                const invalids = error.data.invalidItems
                    .map(item => item.productName)
                    .join(', ');
                setError(`${error.data.message} Removed: ${invalids}`);
            } else {
                setError(error.message || 'Checkout failed.');
            }
            setSuccess(null);
        } finally {
            setLoading(false);
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
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ color: '#007bff' }}>EComm</h1>
                <div>
                    <Link to="/home">
                        <button style={styles.navButton}>
                            Home
                        </button>
                    </Link>
                    <Link to="/orders">
                        <button style={styles.navButton}>
                            Orders
                        </button>
                    </Link>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </header>
            <main style={styles.main}>
                <h2 style={styles.heading}>Your Shopping Cart 🛒</h2>
                
                {error && <p style={styles.error}>Error: {error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                {loading && <p style={{color: '#007bff', fontWeight: 'bold'}}>Processing...</p>}
                
                {cartItems.length === 0 && !error && <p>Your cart is empty. <Link to="/home" style={{color: '#007bff'}}>Start shopping here.</Link></p>}

                <div>
                    {cartItems.map(item => (
                        <div key={item._id} style={styles.cartItem}>
                            
                            <div style={styles.itemDetails}>
                                <h3 style={{ margin: '0 0 5px 0', color: '#343a40' }}>{item.productName || 'Unknown Product'}</h3>
                                <p style={{ margin: '0 0 5px 0', color: '#6c757d' }}>Unit Price: ${item.price}</p>
                                <p style={{ margin: '0', fontWeight: 'bold', color: '#007bff' }}>Item Total: ${calculateItemTotal(item).toFixed(2)}</p>
                            </div>

                            <div style={styles.itemControls}>
                                <label style={{ color: '#555' }}>
                                    Qty:
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={e => handleUpdate(item._id, 'quantity', Number(e.target.value))}
                                        style={styles.input}
                                    />
                                </label>

                                <label style={{ color: '#555' }}>
                                    Size:
                                    <select
                                        value={item.size}
                                        onChange={e => handleUpdate(item._id, 'size', e.target.value)}
                                        style={styles.select}
                                    >
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                    </select>
                                </label>
                                
                                <label style={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                    Gift:
                                    <input
                                        type="checkbox"
                                        checked={item.gift}
                                        onChange={e => handleUpdate(item._id, 'gift', e.target.checked)}
                                        style={{ marginLeft: '5px', transform: 'scale(1.2)' }}
                                    />
                                </label>
                                
                                <button onClick={() => handleDelete(item._id)} style={styles.deleteButton}>
                                    Remove
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
                
                {cartItems.length > 0 && (
                    <div style={styles.summaryCard}>
                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: '#343a40' }}>
                            Subtotal: <span style={{ color: '#007bff' }}>${calculateCartTotal().toFixed(2)}</span>
                        </h3>
                        <button 
                            onClick={handleCheckout} 
                            style={styles.checkoutButton}
                            disabled={loading}
                        >
                            {loading ? 'Checking out...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPage;