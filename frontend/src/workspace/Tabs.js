// Tabs.js
import React from 'react';
import { usePages } from '../ContextProvider'; // Adjust the import path according to your project structure

const Tabs = () => {
    const { pages, activePageKey, setActivePage, removePage } = usePages();

    return (
        <div className="overflow-x-auto mb-4">
            <div className="flex space-x-2">
                {pages.map(page => (
                    <div key={page.key} className="flex-none relative group">
                        <button
                            className={`px-4 py-2 text-sm font-medium truncate ${activePageKey === page.key ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white rounded-t-lg`}
                            onClick={() => setActivePage(page.key)}
                        >
                            {page.title}
                        </button>
                        <button
                            className="absolute top-4 right-2 bg-red-500 text-white rounded-full p-1 text-xs transform translate-x-1/2 -translate-y-1/2 hidden group-hover:block"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent setActivePage from being called
                                removePage(page.key);
                            }}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
