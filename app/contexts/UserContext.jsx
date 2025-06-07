"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext({
    userId: null,
    setUserId: () => { },
    userInfo: null,
});

// Mock user data - in a real app, this would come from an API
const MOCK_USERS = {
    'user1': { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    'user2': { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'manager' },
    'user3': { id: 'user3', name: 'Guest User', email: 'guest@example.com', role: 'viewer' },
};

export function UserProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Check if user ID exists in localStorage
        const storedUserId = localStorage.getItem('currentUserId') || 'user1';
        setUserId(storedUserId);

        // Load user info from mock data
        setUserInfo(MOCK_USERS[storedUserId]);
    }, []);

    // Update localStorage when userId changes
    useEffect(() => {
        if (userId) {
            localStorage.setItem('currentUserId', userId);
            setUserInfo(MOCK_USERS[userId]);
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId, userInfo }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
