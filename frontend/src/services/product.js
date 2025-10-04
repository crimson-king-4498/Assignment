const baseUrl = 'http://localhost:3001/api/products';

export const getAllProducts = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${baseUrl}?${queryString}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};

export const createProduct = async (product) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};

export const deleteProduct = async (productId) => {
    const response = await fetch(`${baseUrl}/${productId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
