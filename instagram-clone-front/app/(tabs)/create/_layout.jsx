import React from 'react';

export default function CreateLayout({ children }) {
    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <header style={{ borderBottom: '1px solid #dbdbdb', paddingBottom: 16, marginBottom: 24 }}>
                <h2>Create Post</h2>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}