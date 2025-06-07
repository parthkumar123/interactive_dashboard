"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Types of notifications
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
};

const NotificationContext = createContext({
    notifications: [],
    addNotification: () => { },
    removeNotification: () => { },
});

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback(
        ({ type = NOTIFICATION_TYPES.INFO, message, duration = 5000 }) => {
            const id = Date.now().toString();

            setNotifications(prevNotifications => [
                ...prevNotifications,
                { id, type, message }
            ]);

            if (duration) {
                setTimeout(() => {
                    removeNotification(id);
                }, duration);
            }

            return id;
        },
        []
    );

    const removeNotification = useCallback(id => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
            }}
        >
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);

function NotificationContainer() {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`flex items-center justify-between px-4 py-3 rounded shadow-md animate-fade-in ${notification.type === NOTIFICATION_TYPES.SUCCESS
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : notification.type === NOTIFICATION_TYPES.ERROR
                                ? 'bg-red-50 border-l-4 border-red-500'
                                : 'bg-blue-50 border-l-4 border-blue-500'
                        }`}
                >
                    <div className="flex items-center">
                        {notification.type === NOTIFICATION_TYPES.SUCCESS ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        ) : notification.type === NOTIFICATION_TYPES.ERROR ? (
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                        ) : (
                            <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                        )}
                        <p className="text-sm font-medium">
                            {notification.message}
                        </p>
                    </div>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
