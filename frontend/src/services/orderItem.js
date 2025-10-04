const baseUrl = 'http://localhost:3001/api/orderItems';

export const getOrderItems = async (orderId) => {
    const response = await fetch(`${baseUrl}/${orderId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
