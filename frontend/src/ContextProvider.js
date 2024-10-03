import React, { createContext, useContext, useState } from 'react';
import LandingPage from './workspace/LandingPage';
import PlatformDashboard from './platform/PlatformDashboard';
import { v4 as uuidv4 } from 'uuid';

// Pages Context begins here


  const PagesContext = createContext();

export const PagesProvider = ({ children }) => {
    // Initial pages array
    const [pages, setPages] = useState([
        { key: `page__${uuidv4()}`, title: 'Welcome', content: <LandingPage /> },
        { key: `page__${uuidv4()}`, title: 'Share', content: <PlatformDashboard /> },
        // Additional initial pages...
    ]);
    const [activePageKey, setActivePageKey] = useState(pages.length > 0 ? pages[0].key : null);

    const addPage = (newPage) => {
        if (pages.length >= 6) {
            // Find the oldest page that is not currently active
            const oldestNonActivePageIndex = pages.findIndex(page => page.key !== activePageKey);
            // If all pages are somehow active (which should not happen in practice), or no non-active page is found, default to removing the first page
            const indexToRemove = oldestNonActivePageIndex !== -1 ? oldestNonActivePageIndex : 0;
            const updatedPages = [...pages];
            updatedPages.splice(indexToRemove, 1); // Remove the oldest non-active page
            setPages([...updatedPages, newPage]);
        } else {
            setPages([...pages, newPage]);
        }
        // Automatically make the new page the active page
        setActivePageKey(newPage.key);
    };

    const removePage = (pageKey) => {
        const updatedPages = pages.filter(page => page.key !== pageKey);
        setPages(updatedPages);
        // If the active page was removed or there's no active page, set the next available page as active
        if (!updatedPages.find(page => page.key === activePageKey) || !activePageKey) {
            setActivePageKey(updatedPages.length > 0 ? updatedPages[0].key : null);
        }
    };

    const setActivePage = (key) => {
        setActivePageKey(key);
    };

    return (
        <PagesContext.Provider value={{ pages, activePageKey, addPage, removePage, setActivePage }}>
            {children}
        </PagesContext.Provider>
    );
};

// Custom hook to use the PagesContext
export const usePages = () => useContext(PagesContext);
// Pages context ends here

// Messages context begins here

// Initial Messages array
const initialMessages = [
    { key: `message__${uuidv4()}`, title: 'Coming soon', content: 
    <p>More features coming soon!
    For now, try Plasmidfinder with "Genetically-Encoded Yellow Fluorescent cAMP Indicator"
    to extract the Flamindo2 plasmid sequence from Odaka et al 2014.
    </p>
    }
];

// Create the context
const MessagesContext = createContext();

// Provider component
export const MessagesProvider = ({ children }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [activeMessageKey, setActiveMessageKey] = useState(messages.length > 0 ? messages[0].key : null);


    const addMessage = (newMessage) => {
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setActiveMessageKey(newMessage.key); // Automatically set the new message as active
    };

    // Function to remove a Message by key
    const removeMessage = (MessageKey) => {
        const updatedMessages = messages.filter(message => message.key !== MessageKey);
        setMessages(updatedMessages);
        if (updatedMessages.length > 0) {
            setActiveMessageKey(updatedMessages[0].key); // Set to first Message or another logic
        } else {
            setActiveMessageKey(null); // No Messages left
        }
    };
    

    // Function to set the active Message
    const setActiveMessage = (key) => {
        setActiveMessageKey(key);
    };

    return (
        <MessagesContext.Provider value={{ messages, activeMessageKey, addMessage, removeMessage, setActiveMessage }}>
            {children}
        </MessagesContext.Provider>
    );
};

// Custom hook to use the MessagesContext
export const useMessages = () => useContext(MessagesContext);

// Messages Context ends here

// Files Context starts here

const FilesContext = createContext();

export const useFiles = () => useContext(FilesContext);

export const FilesProvider = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const triggerUpdate = () => {
    setUpdateTrigger(prev => !prev); // Toggle to trigger re-render
  };

  // Include updateTrigger in the context value
  return (
    <FilesContext.Provider value={{ updateTrigger, triggerUpdate }}>
      {children}
    </FilesContext.Provider>
  );
};

// Files Context ends here

// Cards Context starts here


// Initial search Cards array
const initialCards = [
    // Example initial Card; you can start with an empty array if you prefer
    { key: `card_${uuidv4()}`, type: "plasmid", title: "Example Card 001", imageUrl: "https://via.placeholder.com/150", bulletPoints: ["Point 1", "Point 2", "Point 3"], objectData: "abcd" },
    { key: `card_${uuidv4()}`, type: "plasmid", title: "Example Card 002", imageUrl: "https://via.placeholder.com/150", bulletPoints: ["Point 1", "Point 2", "Point 3"], objectData: "efgh" },
    
];

// Create the context
const CardsContext = createContext();

// Provider component
export const CardsProvider = ({ children }) => {
    const [Cards, setCards] = useState(initialCards);

    // Function to add a new Card
    const addCard = (newCard) => {
        setCards([...Cards, newCard]);
    };

    // Function to remove a Card by id
    const removeCard = (CardId) => {
        const updatedCards = Cards.filter(Card => Card.id !== CardId);
        setCards(updatedCards);
    };

    return (
        <CardsContext.Provider value={{ Cards, addCard, removeCard }}>
            {children}
        </CardsContext.Provider>
    );
};

// Custom hook to use the CardsContext
export const useCards = () => useContext(CardsContext);

// Cards Context ends here