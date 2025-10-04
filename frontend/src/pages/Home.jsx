import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../services/product';
import { addCartItem } from '../services/cart';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                setProducts(products);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('You must be logged in to add items to the cart.');
                return;
            }

            const item = {
                product: product._id,
                price: product.price,
                quantity: 1,
                size: 'M', // Hardcoded for now
                gift: false // Hardcoded for now
            };

            await addCartItem(userId, item);
            setSuccess(`${product.productName} added to cart!`);
            setError(null);
        } catch (error) {
            setError(error.message);
            setSuccess(null);
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
                <h1>EComm</h1>
                <button>
                    <span role="img" aria-label="cart">🛒</span>
                </button>
            </header>
            <main style={{ padding: '1rem' }}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {products.map(product => (
                        <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                            <img src={product.image} alt={product.productName} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            <h3>{product.productName}</h3>
                            <p>${product.price}</p>
                            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;