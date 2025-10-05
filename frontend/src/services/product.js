const backendBaseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const baseUrl = `${backendBaseUrl}/api/products`;

export const getAllProducts = async (params = {}) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const response = await fetch(url);
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
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
