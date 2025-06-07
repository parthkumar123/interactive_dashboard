"use client";

import { useState, useRef } from 'react';
import { ArrowsPointingOutIcon, XMarkIcon, EyeSlashIcon, ArrowPathIcon, EyeIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { useDashboardStore } from '../../contexts/DashboardStoreContext';
import { useNotification } from '../../contexts/NotificationContext';
import Tooltip from '../Tooltip';

export default function WidgetWrapper({ widget, children, onResize, className = "" }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const buttonRefs = useRef({
        refresh: null,
        fullscreen: null,
        hide: null,
        remove: null
    });

    const { toggleWidgetVisibility, removeWidget } = useDashboardStore();
    const { addNotification } = useNotification();

    const handleRefresh = (e) => {
        e.stopPropagation();
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            addNotification({
                type: 'success',
                message: `${widget.title} data refreshed successfully`,
                duration: 3000
            });
        }, 1000);
    };

    const handleFullscreen = (e) => {
        e.stopPropagation();

        // When going fullscreen, resize the widget to take up more space
        if (!isFullscreen) {
            if (onResize) {
                // Store original dimensions before expanding
                const originalSize = { w: widget.w, h: widget.h };

                // This will trigger the layout adjustment logic by expanding the widget
                onResize(widget.id, 12, 4, originalSize); // Set to full width (12 cols) and taller height
            }

            // Add a class to the body to prevent scrolling behind the fullscreen widget
            document.body.classList.add('widget-fullscreen-active');
        } else {
            // Remove the body class when exiting fullscreen
            document.body.classList.remove('widget-fullscreen-active');
        }

        setIsFullscreen(!isFullscreen);
        addNotification({
            type: 'info',
            message: isFullscreen ? `Exited fullscreen mode` : `${widget.title} in fullscreen mode`,
            duration: 2000
        });
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to remove this widget?')) {
            removeWidget(widget.id);
            addNotification({
                type: 'info',
                message: `${widget.title} widget removed`,
                duration: 3000
            });
        }
    };

    const handleHide = (e) => {
        e.stopPropagation();
        toggleWidgetVisibility(widget.id);
        addNotification({
            type: 'info',
            message: `${widget.title} widget hidden`,
            duration: 2000
        });
    };

    const handleExpand = (e) => {
        e.stopPropagation();

        if (onResize) {
            if (!isExpanded) {
                // Store original size before expanding
                const originalSize = { w: widget.w, h: widget.h };

                // Expand to take full row width
                onResize(widget.id, 12, 3, originalSize);

                addNotification({
                    type: 'info',
                    message: `${widget.title} expanded to full width`,
                    duration: 1500
                });
            } else {
                // Revert to original size if available
                if (widget.originalSize) {
                    onResize(widget.id, widget.originalSize.w, widget.originalSize.h);
                } else {
                    // Default fallback size
                    onResize(widget.id, 6, 2);
                }

                addNotification({
                    type: 'info',
                    message: `${widget.title} restored to original size`,
                    duration: 1500
                });
            }
        }

        setIsExpanded(!isExpanded);
    };

    const fullscreenClass = isFullscreen
        ? "fixed inset-0 z-50 bg-white p-6 overflow-auto widget-fullscreen"
        : "";

    const expandedClass = isExpanded && !isFullscreen
        ? "widget-expanded border-blue-200 shadow-md"
        : "";

    return (
        <div className={`${fullscreenClass} ${expandedClass} ${className} bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col transition-all duration-300 h-full`}>
            <div className={`widget-drag-handle flex items-center justify-between px-4 py-2 border-b sticky top-0 bg-white z-[100] 
                ${isFullscreen ? "" : `cursor-move hover:bg-blue-50 transition-colors ${isExpanded ? "bg-blue-50" : ""}`}`}
                style={{ overflow: 'visible' }}>
                <h3 className="font-medium text-gray-900">{widget.title}</h3>
                <div className="flex items-center gap-1">
                    <Tooltip content="Refresh data">
                        <button
                            ref={el => buttonRefs.current.refresh = el}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRefresh(e);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                            type="button"
                        >
                            <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </Tooltip>
                    <Tooltip content={isExpanded ? "Collapse widget" : "Expand widget to full width"}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleExpand(e);
                            }}
                            className={`p-1.5 hover:bg-gray-100 rounded-full ${isExpanded ? 'text-blue-500' : 'text-gray-500'}`}
                            type="button"
                        >
                            {isExpanded ?
                                <ArrowsPointingInIcon className="h-4 w-4" /> :
                                <ArrowsPointingOutIcon className="h-4 w-4" />
                            }
                        </button>
                    </Tooltip>
                    <Tooltip content="Toggle fullscreen">
                        <button
                            ref={el => buttonRefs.current.fullscreen = el}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFullscreen(e);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                            type="button"
                        >
                            <ArrowsPointingOutIcon className="h-4 w-4" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Hide widget">
                        <button
                            ref={el => buttonRefs.current.hide = el}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleHide(e);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                            type="button"
                        >
                            <EyeSlashIcon className="h-4 w-4" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Remove widget">
                        <button
                            ref={el => buttonRefs.current.remove = el}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemove(e);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-full text-red-500"
                            type="button"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-auto min-h-0">
                <div className="h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
