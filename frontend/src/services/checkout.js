const baseUrl = 'http://localhost:3001/api/checkout';

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