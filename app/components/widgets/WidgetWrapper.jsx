"use client";

import { useState } from 'react';
import { ArrowsPointingOutIcon, XMarkIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useDashboardStore } from '../../store/dashboardStore';

export default function WidgetWrapper({ widget, children, onResize, className = "" }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { toggleWidgetVisibility, removeWidget } = useDashboardStore();

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleRemove = () => {
        removeWidget(widget.id);
    };

    const handleHide = () => {
        toggleWidgetVisibility(widget.id);
    };

    const fullscreenClass = isFullscreen
        ? "fixed inset-0 z-50 bg-white p-6 overflow-auto"
        : "";

    return (
        <div className={`${fullscreenClass} ${className} bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col`}>
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="font-medium text-gray-800">{widget.title}</h3>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={handleRefresh}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ArrowPathIcon className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleFullscreen}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ArrowsPointingOutIcon className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                        onClick={handleHide}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <EyeSlashIcon className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                        onClick={handleRemove}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <XMarkIcon className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-auto">
                {children}
            </div>
        </div>
    );
}
