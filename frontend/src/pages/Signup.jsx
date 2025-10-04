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
        if (!name || !address || !emailID || !password) {
            setError('Please fill out all fields.');
            setSuccess(null);
            return;
        }
        
        try {
            const user = await signup({ name, address, emailID, password });
            setSuccess(`Success! User ${user.name} created. Please log in.`);
            setError(null);
            setName('');
            setAddress('');
            setEmailID('');
            setPassword('');
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
            setSuccess(null);
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
            maxWidth: '450px',
            textAlign: 'center',
        },
        heading: {
            color: '#333',
            marginBottom: '30px',
            fontSize: '24px',
            fontWeight: 600,
        },
        formGroup: {
            marginBottom: '15px',
            textAlign: 'left',
        },
        label: {
            display: 'block',
            marginBottom: '6px',
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
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px',
            marginTop: '20px',
            transition: 'background-color 0.3s ease',
        },
        error: {
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
        },
        success: {
            color: '#155724',
            backgroundColor: '#d4edda',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
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
                <h2 style={styles.heading}>Create Your Account 📝</h2>
                
                {success && <p style={styles.success}>{success}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={({ target }) => setName(target.value)} 
                            placeholder="Your name"
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            value={emailID} 
                            onChange={({ target }) => setEmailID(target.value)} 
                            placeholder="you@example.com"
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Address</label>
                        <input 
                            type="text" 
                            value={address} 
                            onChange={({ target }) => setAddress(target.value)} 
                            placeholder="Street, City, Zip"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={({ target }) => setPassword(target.value)} 
                            placeholder="Create a strong password"
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Sign Up
                    </button>
                </form>

                <p style={styles.linkText}>
                    Already have an account? <Link to="/" style={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;