import React, { useEffect } from 'react';
import { usePages, useMessages } from '../ContextProvider';

// Change the prop from `key` to `messageKey` to avoid confusion with React's reserved `key` prop
const Message = ({ messageKey, title, content, page }) => {
    console.log(messageKey, title, content, page)
    const { removeMessage } = useMessages();
    const { setActivePage } = usePages();

    // Automatically remove the message after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => removeMessage(messageKey), 5000); // 5000 milliseconds = 5 seconds

        // Cleanup function to clear the timeout if the component unmounts before the timer finishes
        return () => clearTimeout(timer);
    }, [removeMessage, messageKey]);

        // Define an onClick handler that checks if page prop exists before calling setActivePage
        const handleClick = () => {
            
            if (page) {
                setActivePage(page.key);
            }
        };

    return (
        <div className="bg-blue-50 shadow-lg rounded-lg p-4 w-full mx-auto" onClick={handleClick}>
            <div className="flex justify-between items-center">
                <h4 className="font-bold mb-2">{title}</h4>
                
            </div>
            <div>{content}</div>
        </div>
    );
};

export default Message;
