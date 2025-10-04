import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, deleteProduct } from '../services/product';
import { Link } from 'react-router-dom';

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
    heading: {
        fontSize: '2rem',
        marginBottom: '1.5rem',
        color: '#343a40',
        borderBottom: '2px solid #dc3545',
        paddingBottom: '5px',
    },
    error: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        border: '1px solid #f5c6cb',
    },
    formCard: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
        marginBottom: '30px',
    },
    formHeading: {
        fontSize: '1.5rem',
        color: '#343a40',
        marginBottom: '15px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        alignItems: 'center',
    },
    input: {
        padding: '10px 15px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box',
    },
    createButton: {
        padding: '10px 20px',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    productCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
        textAlign: 'center',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '6px',
        marginBottom: '10px',
    },
    cardTitle: {
        fontSize: '1.25rem',
        margin: '10px 0 5px 0',
        color: '#343a40',
    },
    deleteButton: {
        width: '100%',
        padding: '10px 0',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'background-color 0.3s',
        marginTop: '10px',
    },
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

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({ productName: '', price: '', image: '', type: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            const { products, totalPages } = await getAllProducts({ page, limit: 9 });
            setProducts(products || []);
            setTotalPages(totalPages || 1);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCreateProduct = async (event) => {
        event.preventDefault();

        if (!newProduct.productName || !newProduct.price || !newProduct.image || !newProduct.type) {
            setError("Please fill out all fields for the new product.");
            return;
        }

        try {
            const productToCreate = {
                ...newProduct,
                price: parseFloat(newProduct.price)
            };

            await createProduct(productToCreate);
            setNewProduct({ productName: '', price: '', image: '', type: '' });
            setPage(1);
            fetchProducts();
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to create product.');
        }
    };

    const handleDeleteProduct = async (productId) => {
        console.log(`Attempting to delete product ${productId}.`);
        
        try {
            await deleteProduct(productId);
            fetchProducts(); 
        } catch (err) {
            setError(err.message || 'Failed to delete product.');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct({ ...newProduct, [name]: value });
    };
    
    const getFallbackImageUrl = (productName) => {
        const color = 'dc3545';
        const textColor = 'ffffff';
        const text = encodeURIComponent(productName.substring(0, 10));
        return `https://placehold.co/280x200/${color}/${textColor}?text=No+Image`;
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ color: '#dc3545' }}>Admin Panel</h1>
                <div>
                    <Link to="/home">
                        <button style={styles.navButton}>
                            <span role="img" aria-label="home">🏠 Storefront</span>
                        </button>
                    </Link>
                </div>
            </header>
            <main style={styles.main}>
                <h2 style={styles.heading}>Manage Products</h2>
                
                {error && <p style={styles.error}>Error: {error}</p>}

                <div style={styles.formCard}>
                    <h3 style={styles.formHeading}>Create New Product</h3>
                    <form onSubmit={handleCreateProduct}>
                        <div style={styles.formGrid}>
                            <input
                                type="text"
                                name="productName"
                                placeholder="Product Name"
                                value={newProduct.productName}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Price ($)"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            <input
                                type="text"
                                name="image"
                                placeholder="Image URL (http://...)"
                                value={newProduct.image}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            <input
                                type="text"
                                name="type"
                                placeholder="Type (e.g., Shirt, Jeans)"
                                value={newProduct.type}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            <button type="submit" style={styles.createButton}>
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>


                <h3 style={styles.formHeading}>All Products ({products.length})</h3>
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
                            <p style={{ margin: '5px 0 10px 0', color: '#dc3545', fontWeight: 'bold' }}>${product.price ? product.price.toFixed(2) : '0.00'}</p>
                            <p style={{ margin: '5px 0 10px 0', color: '#6c757d', fontSize: '0.9rem' }}>Type: {product.type}</p>
                            
                            <button 
                                onClick={() => handleDeleteProduct(product._id)} 
                                style={styles.deleteButton}
                            >
                                Delete
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

export default AdminPage;
