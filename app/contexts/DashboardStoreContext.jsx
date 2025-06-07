"use client";

import { createContext, useContext, useMemo } from 'react';
import { createDashboardStore } from '../store/dashboardStore';
import { useUser } from '../contexts/UserContext';

const DashboardStoreContext = createContext(null);

export function DashboardStoreProvider({ children }) {
    const { userId } = useUser();

    // Create a user-specific dashboard store
    const store = useMemo(() => {
        if (!userId) return null;
        return createDashboardStore(userId);
    }, [userId]);

    // Don't render until we have a userId
    if (!store) return null;

    return (
        <DashboardStoreContext.Provider value={store}>
            {children}
        </DashboardStoreContext.Provider>
    );
}

// Custom hook to use the dashboard store
export const useDashboardStore = () => {
    const store = useContext(DashboardStoreContext);
    if (!store) {
        throw new Error("useDashboardStore must be used within a DashboardStoreProvider");
    }
    return store();
};
