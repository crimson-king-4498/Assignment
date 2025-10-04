
import React from 'react';

const Modal = ({ children, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                minWidth: '300px'
            }}>
                <button onClick={onClose} style={{ float: 'right' }}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
