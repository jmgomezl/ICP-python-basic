import React from 'react';

export function Card({ children }) {
    return (
        <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "16px", marginBottom: "16px" }}>
            {children}
        </div>
    );
}

export function CardHeader({ children }) {
    return (
        <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "8px", marginBottom: "8px" }}>
            {children}
        </div>
    );
}

export function CardTitle({ children }) {
    return (
        <h3>{children}</h3>
    );
}

export function CardContent({ children }) {
    return (
        <div>{children}</div>
    );
}
