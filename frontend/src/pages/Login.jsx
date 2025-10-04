
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/user';

const Login = () => {
    const [emailID, setEmailID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!emailID || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await login({ emailID, password });

            if (response && response.message) {
                localStorage.setItem('userId', response.userId);
                navigate('/home');
            } else {
                setError('Invalid email or password');
            }

        } catch (err) {
        setError(err.message || 'Invalid email or password');
        }

    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={emailID}
                        onChange={(e) => setEmailID(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit">Login</button>
            </form>

            <p>
                Don't have an account? <Link to="/signup">Signup</Link>
            </p>
        </div>
    );
};

export default Login;
