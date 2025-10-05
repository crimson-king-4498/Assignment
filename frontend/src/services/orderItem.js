const backendBaseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const baseUrl = `${backendBaseUrl}/api/orderItems`;

export const getOrderItems = async (orderId) => {
    const response = await fetch(`${baseUrl}/${orderId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
