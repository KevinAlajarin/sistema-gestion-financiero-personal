import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const value = {
        isSidebarOpen,
        toggleSidebar,
        globalLoading, 
        setGlobalLoading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};