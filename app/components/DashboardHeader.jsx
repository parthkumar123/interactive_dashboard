// Component for the dashboard header with controls
"use client";

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useDashboardStore } from '../store/dashboardStore';

export default function DashboardHeader() {
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [newWidgetTitle, setNewWidgetTitle] = useState('');
    const [newWidgetType, setNewWidgetType] = useState('table');

    const { addWidget } = useDashboardStore();

    const handleAddWidget = () => {
        if (newWidgetTitle.trim()) {
            addWidget(newWidgetType, newWidgetTitle);
            setNewWidgetTitle('');
            setShowAddMenu(false);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b z-10 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">CRM Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage your customer relationships efficiently</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowAddMenu(!showAddMenu)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Add Widget</span>
                        </button>

                        {showAddMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-20 border">
                                <h3 className="font-medium mb-2">Create New Widget</h3>
                                <div className="mb-3">
                                    <label className="block text-sm mb-1">Widget Title</label>
                                    <input
                                        type="text"
                                        value={newWidgetTitle}
                                        onChange={(e) => setNewWidgetTitle(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                        placeholder="Enter widget title"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm mb-1">Widget Type</label>
                                    <select
                                        value={newWidgetType}
                                        onChange={(e) => setNewWidgetType(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                    >
                                        <option value="table">Data Table</option>
                                        <option value="chart">Chart</option>
                                        <option value="stats">Stats</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowAddMenu(false)}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddWidget}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
