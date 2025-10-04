import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/product';
import { addCartItem } from '../services/cart';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [type, setType] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = async () => {
        try {
            const params = { page, limit: 8 }; // 👈 only 8 per page
            if (type) params.type = type;
            if (sortBy) params.sortBy = sortBy;
            if (search) params.search = search;

            const data = await getAllProducts(params);
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [type, sortBy, page]); // 👈 refetch on page change too

    const handleSearch = () => {
        setPage(1); // reset to first page when searching
        fetchProducts();
    };

    const handleAddToCart = async (product) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('You must be logged in to add items to the cart.');
                return;
            }

            const item = {
                product: product._id,
                productName: product.productName,
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
                <div>
                    <Link to="/cart">
                        <button>
                            <span role="img" aria-label="cart">🛒</span>
                        </button>
                    </Link>
                    <Link to="/orders">
                        <button>Orders</button>
                    </Link>
                </div>
            </header>
            <main style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="Jeans">Jeans</option>
                        <option value="Shirt">Shirt</option>
                        <option value="T-shirt">T-shirt</option>
                        <option value="Pants">Pants</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>

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

                {/* Pagination Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
