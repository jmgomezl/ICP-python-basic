import React from 'react';

export function Button({ children, onClick, variant = "default", ...props }) {
    const style = variant === "outline" ? { border: "1px solid #ccc", background: "#fff" } : { background: "#007bff", color: "#fff" };
    return (
        <button style={style} onClick={onClick} {...props}>
            {children}
        </button>
    );
}
