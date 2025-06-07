"use client";

import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '../contexts/DashboardStoreContext';
import { useNotification } from '../contexts/NotificationContext';

// Widget components
import TableWidget from './widgets/TableWidget';
import ChartWidget from './widgets/ChartWidget';
import StatsWidget from './widgets/StatsWidget';

// Make the grid responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardGrid() {
    const { widgets, updateLayouts, updateWidget } = useDashboardStore();
    const [mounted, setMounted] = useState(false);
    const [activeWidget, setActiveWidget] = useState(null);
    const { addNotification } = useNotification();

    // Ensure we're mounted before rendering the grid (for SSR compatibility)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Format widgets into the expected layout format
    const generateLayouts = () => {
        const layouts = { lg: [] };

        widgets.forEach(widget => {
            if (widget.visible) {
                layouts.lg.push({
                    i: widget.id,
                    x: widget.x,
                    y: widget.y,
                    w: widget.w,
                    h: widget.h,
                    minW: widget.minW || 2,
                    minH: widget.minH || 1,
                });
            }
        });

        return layouts;
    };

    const handleLayoutChange = (currentLayout, allLayouts) => {
        updateLayouts(allLayouts);
    };

    // Handler for manual widget resizing from components
    const handleWidgetResize = useCallback((widgetId, newWidth, newHeight, originalSize = null) => {
        setActiveWidget(widgetId);

        const targetWidget = widgets.find(w => w.id === widgetId);
        if (!targetWidget) return;

        const widgetsInSameRow = widgets.filter(w =>
            w.id !== widgetId &&
            w.visible &&
            // Check if widget is in same row or overlapping rows
            ((w.y === targetWidget.y) ||
                (w.y < targetWidget.y && (w.y + w.h) > targetWidget.y) ||
                (targetWidget.y < w.y && (targetWidget.y + targetWidget.h) > w.y))
        );

        // Calculate new layout with adjusted positions
        const updatedWidgets = widgets.map(w => {
            // Update the target widget with new dimensions
            if (w.id === widgetId) {
                return {
                    ...w,
                    w: newWidth || w.w,
                    h: newHeight || w.h,
                    wasExpanded: true,
                    // Store original size for restoring later
                    originalSize: originalSize || w.originalSize || { w: w.w, h: w.h }
                };
            }

            // Adjust widgets in the same row
            if (widgetsInSameRow.some(rowWidget => rowWidget.id === w.id)) {
                // Move widgets to next row if they're in same row as expanded widget
                return {
                    ...w,
                    y: targetWidget.y + (newHeight || targetWidget.h)
                };
            }

            return w;
        });

        // Update the store
        updateLayouts({
            lg: updatedWidgets.map(w => ({
                i: w.id,
                x: w.x,
                y: w.y,
                w: w.w,
                h: w.h,
                minW: w.minW || 2,
                minH: w.minH || 1
            }))
        });

        // Update widget state in store
        updatedWidgets.forEach(w => {
            if (w.id === widgetId) {
                updateWidget(w.id, {
                    w: w.w,
                    h: w.h,
                    originalSize: w.originalSize
                });
            }
        });

        addNotification({
            type: 'info',
            message: `Widget layout adjusted`,
            duration: 1500
        });
    }, [widgets, updateLayouts, updateWidget, addNotification]);

    // Render the appropriate widget based on its type
    const renderWidget = (widget) => {
        if (!widget.visible) return null;

        switch (widget.type) {
            case 'table':
                return <TableWidget widget={widget} onResize={handleWidgetResize} />;
            case 'chart':
                return <ChartWidget widget={widget} onResize={handleWidgetResize} />;
            case 'stats':
                return <StatsWidget widget={widget} onResize={handleWidgetResize} />;
            default:
                return <div>Unknown widget type</div>;
        }
    };

    // Don't render grid on server
    if (!mounted) return null;

    return (
        <div className="p-4">
            <ResponsiveGridLayout
                className="layout"
                layouts={generateLayouts()}
                onLayoutChange={(layout) => handleLayoutChange(layout, generateLayouts())}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={150}
                margin={[20, 20]}
                containerPadding={[10, 10]}
                isDraggable={true}
                isResizable={true}
                useCSSTransforms={true}
                preventCollision={false}
                compactType="vertical"
                isBounded={true}
                resizeHandles={['se']}
                draggableHandle=".widget-drag-handle"
                onResizeStart={(layout, oldItem, newItem, placeholder, e, element) => {
                    // When resize starts, set preventCollision to false to allow widgets to move
                    element.classList.add('widget-expanding');
                }}
                onDragStop={(layout) => {
                    // Additional handling to prevent overlap
                    const updatedLayout = layout.map(item => ({
                        ...item,
                        static: false
                    }));
                    handleLayoutChange(updatedLayout, { lg: updatedLayout });
                }}
                onResize={(layout, oldItem, newItem, placeholder, e, element) => {
                    // This will allow other widgets to reflow as this widget expands
                    const updatedLayout = layout.map(item => {
                        if (item.i === newItem.i) {
                            return {
                                ...item,
                                w: newItem.w,
                                h: newItem.h
                            };
                        }
                        return item;
                    });
                    handleLayoutChange(updatedLayout, { lg: updatedLayout });
                }}
                onResizeStop={(layout, oldItem, newItem, placeholder, e, element) => {
                    // Cleanup when resize stops
                    element.classList.remove('widget-expanding');
                    setActiveWidget(null);

                    // Find widgets that need to move to next row
                    const expandedWidget = widgets.find(w => w.id === newItem.i);
                    if (expandedWidget) {
                        const overlappingWidgets = layout.filter(item =>
                            item.i !== newItem.i &&
                            item.y <= (newItem.y + newItem.h - 1) &&
                            item.y >= newItem.y
                        );

                        if (overlappingWidgets.length > 0) {
                            // Adjust overlapping widgets
                            const adjustedLayout = layout.map(item => {
                                if (overlappingWidgets.some(w => w.i === item.i)) {
                                    return {
                                        ...item,
                                        y: newItem.y + newItem.h,
                                        static: false
                                    };
                                }
                                return {
                                    ...item,
                                    static: false
                                };
                            });
                            handleLayoutChange(adjustedLayout, { lg: adjustedLayout });
                        } else {
                            // No overlaps, just update the layout
                            const updatedLayout = layout.map(item => ({
                                ...item,
                                static: false
                            }));
                            handleLayoutChange(updatedLayout, { lg: updatedLayout });
                        }
                    }
                }}
            >
                {widgets
                    .filter(widget => widget.visible)
                    .map(widget => (
                        <div
                            key={widget.id}
                            className={`widget-container ${activeWidget === widget.id ? 'widget-expanding' : ''} ${widget.wasExpanded ? 'widget-expanded' : ''}`}
                        >
                            {renderWidget(widget)}
                        </div>
                    ))}
            </ResponsiveGridLayout>
        </div>
    );
}
