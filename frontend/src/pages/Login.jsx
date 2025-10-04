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

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f4f7f6',
            fontFamily: 'Arial, sans-serif',
        },
        card: {
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
        },
        heading: {
            color: '#333',
            marginBottom: '30px',
            fontSize: '24px',
            fontWeight: 600,
        },
        formGroup: {
            marginBottom: '20px',
            textAlign: 'left',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            color: '#555',
        },
        input: {
            width: '100%',
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            fontSize: '16px',
        },
        button: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px',
            marginTop: '10px',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        error: {
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
        },
        linkText: {
            marginTop: '25px',
            color: '#666',
        },
        link: {
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 500,
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Welcome Back! 👋</h2>
                
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            value={emailID}
                            onChange={(e) => setEmailID(e.target.value)}
                            placeholder="you@example.com"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Log In
                    </button>
                </form>

                <p style={styles.linkText}>
                    Don't have an account? <Link to="/signup" style={styles.link}>Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;