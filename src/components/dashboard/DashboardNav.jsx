import React from 'react';

const DashboardNav = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-6 py-3 rounded-lg transition-all duration-300 text-lg font-medium ${
                        activeTab === tab.id 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default DashboardNav;