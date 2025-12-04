import React from 'react';

const Container = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
};

export default Container;
