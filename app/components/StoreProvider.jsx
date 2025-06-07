"use client";

import { useEffect, useState } from 'react';
import { DashboardStoreProvider } from '../contexts/DashboardStoreContext';

// This component ensures that the Zustand store only runs on the client side
// to prevent hydration mismatch errors
export default function StoreProvider({ children }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="min-h-screen bg-gray-100" />;
    }

    return (
        <DashboardStoreProvider>
            {children}
        </DashboardStoreProvider>
    );
}
