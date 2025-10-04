import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, deleteProduct } from '../services/product';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({ productName: '', price: '', image: '', type: '' });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [page]); // refetch when page changes

    const fetchProducts = async () => {
        try {
            const { products, totalPages } = await getAllProducts({ page, limit: 8 });
            setProducts(products || []);
            setTotalPages(totalPages || 1);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCreateProduct = async (event) => {
        event.preventDefault();
        try {
            await createProduct(newProduct);
            setNewProduct({ productName: '', price: '', image: '', type: '' });
            setPage(1); // reset to first page after creating
            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProduct(productId);
            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Admin - Manage Products</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Create New Product</h3>
            <form onSubmit={handleCreateProduct} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={newProduct.productName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="type"
                    placeholder="Type"
                    value={newProduct.type}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Create Product</button>
            </form>

            <h3>All Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {products.map(product => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                        <img src={product.image} alt={product.productName} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <h3>{product.productName}</h3>
                        <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
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
        </div>
    );
};

export default AdminPage;