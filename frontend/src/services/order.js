
const baseUrl = 'http://localhost:3001/api/orders';

export const getOrders = async (userId) => {
    const response = await fetch(`${baseUrl}/${userId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
