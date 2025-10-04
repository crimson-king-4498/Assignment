
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/order';
import { getOrderItems } from '../services/orderItem';
import Modal from '../components/Modal';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('You must be logged in to view your orders.');
                    return;
                }
                const userOrders = await getOrders(userId);
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
                    <Link to="/cart">
                        <button>
                            <span role="img" aria-label="cart">🛒</span>
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
                <h2>My Orders</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {orders.length === 0 && !error && <p>You have no orders.</p>}
                <div>
                    {orders.map(order => (
                        <div key={order._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => handleOrderClick(order._id)}>
                            <h4>Order ID: {order._id}</h4>
                            <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p>Total: ${order.totalAmount}</p>
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        <h3>Order Items</h3>
                        {selectedOrderItems.length > 0 ? (
                            <ul>
                                {selectedOrderItems.map(item => (
                                    <li key={item._id}>
                                        {item.productName} - ${item.price} x {item.quantity} - Size: {item.size} {item.gift && '(gifted)'}
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
