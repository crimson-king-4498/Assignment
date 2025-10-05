import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/product';
import { addCartItem } from '../services/cart';

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
        maxWidth: '1200px',
        margin: '0 auto',
    },
    error: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        border: '1px solid #f5c6cb',
    },
    success: {
        color: '#155724',
        backgroundColor: '#d4edda',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        border: '1px solid #c3e6cb',
    },
    filterBar: {
        display: 'flex',
        gap: '15px',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    input: {
        padding: '10px 15px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '1rem',
        flexGrow: 1,
        minWidth: '150px',
    },
    searchButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        fontWeight: 'bold',
    },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    productCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
        textAlign: 'center',
        overflow: 'hidden',
        transition: 'transform 0.2s',
    },
    productImage: {
        width: '100%',
        height: '220px',
        objectFit: 'cover',
        borderRadius: '6px',
        marginBottom: '10px',
    },
    cardTitle: {
        fontSize: '1.25rem',
        margin: '10px 0 5px 0',
        color: '#343a40',
    },
    cardPrice: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#28a745',
        margin: '5px 0 15px 0',
    },
    addToCartButton: {
        width: '100%',
        padding: '10px 0',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'background-color 0.3s',
    },
    // Pagination
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
        gap: '15px',
        alignItems: 'center',
    },
    pageButton: {
        padding: '8px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    pageButtonDisabled: {
        backgroundColor: '#adb5bd',
        cursor: 'not-allowed',
    },
    pageInfo: {
        fontSize: '1rem',
        color: '#6c757d',
    }
};

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
            const params = { page, limit: 9 }; 
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
    }, [type, sortBy, page]);

    const handleSearch = () => {
        setPage(1);
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
                size: 'M',
                gift: false 
            };

            await addCartItem(userId, item);
            setSuccess(`"${product.productName}" added to cart!`);
            setError(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.message);
            setSuccess(null);
        }
    };

    const getFallbackImageUrl = (productName) => {
        const color = '007bff';
        const textColor = 'ffffff';
        const text = encodeURIComponent(productName.substring(0, 10));
        return `https://placehold.co/280x220/${color}/${textColor}?text=${text}`;
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ color: '#007bff' }}>EComm</h1>
                <div>
                    <Link to="/cart">
                        <button style={styles.navButton}>
                            Cart
                        </button>
                    </Link>
                    <Link to="/orders">
                        <button style={styles.navButton}>Orders</button>
                    </Link>
                </div>
            </header>
            <main style={styles.main}>
                <div style={styles.filterBar}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleSearch} style={styles.searchButton}>Search</button>
                    
                    <select 
                        value={type} 
                        onChange={(e) => { setType(e.target.value); setPage(1); }} 
                        style={styles.input}
                    >
                        <option value="">All Types</option>
                        <option value="Jeans">Jeans</option>
                        <option value="Shirt">Shirt</option>
                        <option value="T-shirt">T-shirt</option>
                        <option value="Pant">Pants</option>
                    </select>
                    
                    <select 
                        value={sortBy} 
                        onChange={(e) => { setSortBy(e.target.value); setPage(1); }} 
                        style={styles.input}
                    >
                        <option value="">Sort By</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>

                {error && <p style={styles.error}>Error: {error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <div style={styles.productGrid}>
                    {products.map(product => (
                        <div key={product._id} style={styles.productCard}>
                            <img 
                                src={product.image} 
                                alt={product.productName} 
                                style={styles.productImage} 
                                onError={(e) => {
                                    if (!e.target.src.includes('placehold.co')) {
                                        e.target.src = getFallbackImageUrl(product.productName);
                                    }
                                }}
                            />
                            
                            <h3 style={styles.cardTitle}>{product.productName}</h3>
                            <p style={styles.cardPrice}>${product.price.toFixed(2)}</p>
                            
                            <button 
                                onClick={() => handleAddToCart(product)} 
                                style={styles.addToCartButton}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>

                <div style={styles.pagination}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{...styles.pageButton, ...(page === 1 ? styles.pageButtonDisabled : {})}}
                    >
                        &larr; Previous
                    </button>
                    <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{...styles.pageButton, ...(page === totalPages ? styles.pageButtonDisabled : {})}}
                    >
                        Next &rarr;
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
