import React from 'react';
import ToolDirectory from './ToolDirectory.js';

const RightSidebar = ({ isSidebarOpen, toggleSidebar }) => {
    return (
        <div className="relative">
            <aside 
                id="default-sidebar" 
                className={`fixed top-0 right-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${isSidebarOpen ? '' : 'translate-x-full'}`}
                aria-label="Sidebar"
            >
                <button 
                    onClick={() => toggleSidebar(!isSidebarOpen)}
                    aria-controls="default-sidebar" 
                    type="button" 
                    className={`absolute top-0 ${isSidebarOpen ? '-left-7' : '-left-7'} mt-2 mr-2 inline-flex items-center p-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-transform duration-300 ease-in-out`}
                >
                    <span className="sr-only">{isSidebarOpen ? 'Close' : 'Open'} sidebar</span>
                    {isSidebarOpen ? '>' : '<'}
                </button>

                <div className="h-full px-3 py-4 overflow-y-auto scrollbar-thin bg-blue-50 dark:bg-gray-800">
                    <ToolDirectory />
                </div>
            </aside>
        </div>
    );
};

export default RightSidebar;
