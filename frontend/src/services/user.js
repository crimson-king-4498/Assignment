const baseUrl = 'http://localhost:3001/api/users';

export const signup = async (credentials) => {
    const response = await fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};

export const login = async (credentials) => {
    const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return await response.json();
};
