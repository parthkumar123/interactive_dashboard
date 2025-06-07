"use client";

import { useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { Cog6ToothIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function WidgetList() {
    const [isOpen, setIsOpen] = useState(false);
    const { widgets, toggleWidgetVisibility } = useDashboardStore();

    return (
        <div className="fixed right-5 bottom-5 z-20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
            >
                <Cog6ToothIcon className="h-6 w-6" />
            </button>

            {isOpen && (
                <div className="absolute bottom-16 right-0 w-64 bg-white shadow-xl rounded-lg border overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b">
                        <h3 className="font-medium">Manage Widgets</h3>
                    </div>
                    <div className="p-2 max-h-80 overflow-y-auto">
                        {widgets.map(widget => (
                            <div
                                key={widget.id}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                            >
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-sm">{widget.title}</span>
                                </div>
                                <button
                                    onClick={() => toggleWidgetVisibility(widget.id)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    {widget.visible ? (
                                        <EyeIcon className="h-4 w-4 text-gray-600" />
                                    ) : (
                                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-gray-50 border-t text-xs text-gray-500 text-center">
                        Click on a widget to toggle its visibility
                    </div>
                </div>
            )}
        </div>
    );
}
