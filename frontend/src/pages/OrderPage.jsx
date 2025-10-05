import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../services/order';
import { getOrderItems } from '../services/orderItem';

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
    main: {
        padding: '2rem',
        maxWidth: '800px',
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
    orderCard: {
        backgroundColor: '#ffffff',
        padding: '1.2rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        borderLeft: '5px solid #007bff',
        transition: 'background-color 0.2s',
    },
    orderCardHover: {
        backgroundColor: '#f1f1f1',
    },
    orderDetail: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    orderId: {
        fontSize: '1.1rem',
        margin: '0 0 5px 0',
        color: '#495057',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        maxHeight: '80vh',
        overflowY: 'auto',
    },
    modalCloseButton: {
        float: 'right',
        fontSize: '1.5rem',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#adb5bd',
    },
    itemList: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        padding: '10px 0',
        borderBottom: '1px dashed #eee',
        color: '#343a40',
        lineHeight: '1.4',
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
    }
};

const Modal = ({ children, onClose }) => {
    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <button onClick={onClose} style={styles.modalCloseButton}>&times;</button>
                {children}
            </div>
        </div>
    );
};

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredOrderId, setHoveredOrderId] = useState(null);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/'); 
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('You must be logged in to view your orders.');
                    return;
                }
                const userOrders = await getOrders(userId);
                userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(userOrders);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchOrders();
    }, []);

    const handleOrderClick = async (orderId) => {
        try {
            const items = await getOrderItems(orderId);
            setSelectedOrderItems(items);
            setIsModalOpen(true);
        } catch (error) {
            setError(error.message);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrderItems([]);
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });
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
                    <Link to="/cart">
                        <button style={styles.navButton}>
                            Cart
                        </button>
                    </Link>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </header>
            <main style={styles.main}>
                <h2 style={styles.heading}>Order History 📜</h2>
                
                {error && <p style={styles.error}>Error: {error}</p>}
                
                {orders.length === 0 && !error && <p>You have no past orders.</p>}
                
                <div>
                    {orders.map(order => (
                        <div 
                            key={order._id} 
                            style={{
                                ...styles.orderCard,
                                ...(hoveredOrderId === order._id ? styles.orderCardHover : {})
                            }} 
                            onClick={() => handleOrderClick(order._id)}
                            onMouseEnter={() => setHoveredOrderId(order._id)}
                            onMouseLeave={() => setHoveredOrderId(null)}
                        >
                            <div style={styles.orderDetail}>
                                <h4 style={styles.orderId}>Order Placed: {formatDate(order.orderDate)}</h4>
                                <p style={{ fontWeight: 'bold', color: '#007bff', fontSize: '1.2rem' }}>
                                    Total: ${order.totalAmount.toFixed(2)}
                                </p>
                            </div>
                            <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
                                Status: <span style={{color: '#28a745', fontWeight: 600}}>Shipped</span>
                            </p>
                        </div>
                    ))}
                </div>
                
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '15px' }}>Order Details</h3>
                        {selectedOrderItems.length > 0 ? (
                            <ul style={styles.itemList}>
                                {selectedOrderItems.map((item, index) => (
                                    <li key={item._id} style={{...styles.listItem, borderBottom: index === selectedOrderItems.length - 1 ? 'none' : styles.listItem.borderBottom }}>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{item.productName}</p>
                                        <p style={{ margin: '0 0 5px 0', color: '#6c757d' }}>Size: {item.size} | Qty: {item.quantity} {item.gift && '(+Gift Wrap)'}</p>
                                        <p style={{ margin: 0, color: '#007bff' }}>Total: ${(item.price * item.quantity + (item.gift ? 10 * item.quantity : 0)).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No items found for this order.</p>
                        )}
                    </Modal>
                )}
            </main>
        </div>
    );
};

export default OrderPage;
