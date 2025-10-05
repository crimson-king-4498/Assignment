const backendBaseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const baseUrl = `${backendBaseUrl}/api/checkout`;

export const checkout = async (userId) => {
    const response = await fetch(`${baseUrl}/${userId}`, {
        method: 'POST'
    });
    const data = await response.json();
    if (!response.ok) {
        throw { status: response.status, data };
    }
    return data;
};