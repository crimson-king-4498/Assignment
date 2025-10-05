const backendBaseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const baseUrl = `${backendBaseUrl}/api/cart`;

export const getCartItems = async (userId) => {
    const response = await fetch(`${baseUrl}/${userId}`);
    const data = await response.json();
    if (!response.ok) {
        throw { status: response.status, data };
    }
    return data;
};

export const addCartItem = async (userId, item) => {
    const response = await fetch(`${baseUrl}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};

export const updateCartItem = async (userId, cartItemId, updates) => {
    const response = await fetch(`${baseUrl}/${userId}/${cartItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};

export const deleteCartItem = async (userId, cartItemId) => {
    const response = await fetch(`${baseUrl}/${userId}/${cartItemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
