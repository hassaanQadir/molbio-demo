import React from 'react';
import Page from './Page';
import Message from './Message';
import Tabs from './Tabs'; //
import { usePages, useMessages } from '../ContextProvider';

const Workspace = () => {
    const { pages, activePageKey } = usePages();
    const { messages, activeMessageKey } = useMessages();

    const renderActivePage = () => {
        if (!activePageKey || pages.length === 0) {
            return <div>Time for bio fun time!</div>; // Or another fallback content
        }
        const activePage = pages.find(page => page.key === activePageKey);
        if (!activePage) {
            return <div>Page not found.</div>; // Fallback for missing active page
        }
        return <Page title={activePage.title} content={activePage.content} />;
    };

    const renderActiveMessage = () => {
        if (!activeMessageKey || messages.length === 0) {
            return <div></div>; // Or another fallback content
        }
        const activeMessage = messages.find(message => message.key === activeMessageKey);
        if (!activeMessage) {
            return <div>Message not found.</div>; // Fallback for missing active message
        }
        // Pass messageKey to Message component
        return <Message key={activeMessage.key} messageKey={activeMessage.key} title={activeMessage.title} content={activeMessage.content} page={activeMessage.page}/>;
    };
    

    return (
        <div className={`flex flex-col flex-1 p-4 min-h-screen overflow-hidden`}>
             {/* Container for Tabs */}
            <div className="w-full max-w-full overflow-hidden">
                <Tabs />
            </div>
            
            {/* Active page container */}
            <div className="flex flex-1 overflow-hidden">
                <div className="relative w-full">
                    {renderActivePage()}
                </div>
            </div>
            
            {/* Message display container */}
            <div className="absolute inset-x-0 bottom-10 px-4 max-w-2xl mx-auto">
                {renderActiveMessage()}
            </div>
        </div>
    );
};

export default Workspace;