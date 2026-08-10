import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between`}>
            <span>{message}</span>
            <button onClick={() => { setVisible(false); if (onClose) onClose(); }} className="ml-4 text-white hover:text-gray-200">
                ✕
            </button>
        </div>
    );
}