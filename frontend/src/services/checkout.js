const baseUrl = 'http://localhost:3001/api/checkout';

export const checkout = async (userId) => {
    const response = await fetch(`${baseUrl}/${userId}`, {
        method: 'POST'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
