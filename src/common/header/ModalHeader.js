import React from "react";

export default function ModalHeader ({ title }) {
    return (
        <div align="left" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            background: 'purple',
            height: 70,
            fontSize: '25px',
            width: 'auto',
            color: 'white',
        }}>
            {title || 'Authentication'}
        </div>
    );
}
