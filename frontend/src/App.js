import React, { useState } from 'react';
import { PagesProvider, MessagesProvider, FilesProvider, CardsProvider } from './ContextProvider.js';
import LeftSidebar from './leftsidebar/LeftSidebar.js';
import RightSidebar from './rightsidebar/RightSidebar.js';
import Workspace from './workspace/Workspace.js';


const App = () => {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(false); 

    const handleTryItOutClick = () => {
        setShowWelcomeScreen(false);
    };

    if (showWelcomeScreen) {
        return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to molbio.ai</h1>
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleTryItOutClick}>
                Try it out!
            </button>

         </div>
        );
    }

    return (
        <div className="flex h-screen overflow-auto scrollbar-thin">
            <CardsProvider>
            <FilesProvider>
            <MessagesProvider>
            <PagesProvider>
            <LeftSidebar 
                isSidebarOpen={isLeftSidebarOpen} 
                toggleSidebar={setIsLeftSidebarOpen}
            />
            <div className={`flex-1 ${isLeftSidebarOpen ? 'ml-60' : 'ml-0'} ${isRightSidebarOpen ? 'mr-56' : 'mr-0'} p-4 transition-margin duration-300`}>
                <Workspace />
            </div>
            <RightSidebar 
                isSidebarOpen={isRightSidebarOpen} 
                toggleSidebar={setIsRightSidebarOpen}
            />
            </PagesProvider>
            </MessagesProvider>
            </FilesProvider>
            </CardsProvider>
        </div>
    );
}

export default App;
