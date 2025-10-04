import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../services/user';

const Signup = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [emailID, setEmailID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await signup({ name, address, emailID, password });
            setSuccess(`User ${user.name} created successfully!`);
            setError(null);
            setName('');
            setAddress('');
            setEmailID('');
            setPassword('');
        } catch (error) {
            setError(error.message);
            setSuccess(null);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={name} onChange={({ target }) => setName(target.value)} />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" value={address} onChange={({ target }) => setAddress(target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={emailID} onChange={({ target }) => setEmailID(target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button type="submit">Signup</button>
            </form>
            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>
        </div>
    );
};

export default Signup;