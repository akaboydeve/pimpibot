'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface NavContextProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const NavContext = createContext<NavContextProps>({
    isSidebarOpen: false,
    toggleSidebar: () => { },
});

export const useNav = () => useContext(NavContext);

interface NavProviderProps {
    children: ReactNode;
}

export function NavProvider({ children }: NavProviderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <NavContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </NavContext.Provider>
    );
} 