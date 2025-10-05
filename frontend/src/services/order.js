const backendBaseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const baseUrl = `${backendBaseUrl}/api/orders`;

export const getOrders = async (userId) => {
    const response = await fetch(`${baseUrl}/${userId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
