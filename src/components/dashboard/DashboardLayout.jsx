import React from 'react';

const DashboardLayout = ({ title, children, error }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-xl min-h-[calc(100vh-3rem)] p-6">
                    <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                        {title}
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-600 p-4 rounded-lg text-center mb-6">
                            {error}
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;