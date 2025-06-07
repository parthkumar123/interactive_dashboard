import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultWidgets = [
    {
        id: 'widget1',
        type: 'table',
        title: 'Recent Customers',
        visible: true,
        x: 0,
        y: 0,
        w: 6,
        h: 2,
        minW: 2,
        minH: 2
    },
    {
        id: 'widget2',
        type: 'chart',
        chartType: 'bar',
        title: 'Monthly Revenue',
        visible: true,
        x: 6,
        y: 0,
        w: 6,
        h: 2,
        minW: 2,
        minH: 2
    },
    {
        id: 'widget3',
        type: 'chart',
        chartType: 'line',
        title: 'Sales Trends',
        visible: true,
        x: 0,
        y: 2,
        w: 4,
        h: 2,
        minW: 2,
        minH: 2
    },
    {
        id: 'widget4',
        type: 'chart',
        chartType: 'pie',
        title: 'Customer Distribution',
        visible: true,
        x: 4,
        y: 2,
        w: 4,
        h: 2,
        minW: 2,
        minH: 2
    },
    {
        id: 'widget5',
        type: 'stats',
        title: 'Key Metrics',
        visible: true,
        x: 8,
        y: 2,
        w: 4,
        h: 2,
        minW: 2,
        minH: 1
    },
];

export const useDashboardStore = create(
    persist(
        (set) => ({
            widgets: defaultWidgets,
            layouts: { lg: defaultWidgets },

            // Function to update widget positions after drag or resize
            updateLayouts: (newLayouts) => set((state) => {
                const updatedWidgets = state.widgets.map(widget => {
                    const matchingLayout = newLayouts.lg?.find(item => item.i === widget.id);
                    if (matchingLayout) {
                        return {
                            ...widget,
                            x: matchingLayout.x,
                            y: matchingLayout.y,
                            w: matchingLayout.w,
                            h: matchingLayout.h,
                        };
                    }
                    return widget;
                });

                return {
                    widgets: updatedWidgets,
                    layouts: newLayouts
                };
            }),

            // Function to toggle widget visibility
            toggleWidgetVisibility: (widgetId) => set((state) => {
                const updatedWidgets = state.widgets.map(widget =>
                    widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
                );

                return { widgets: updatedWidgets };
            }),

            // Function to add a new widget
            addWidget: (widgetType, title) => set((state) => {
                const newId = `widget${state.widgets.length + 1}`;

                let chartType = null;
                if (widgetType === 'chart') {
                    chartType = 'bar'; // Default chart type
                }

                const newWidget = {
                    id: newId,
                    type: widgetType,
                    title: title,
                    visible: true,
                    chartType,
                    x: 0,
                    y: Infinity, // Place at the bottom
                    w: 6,
                    h: 2,
                    minW: 2,
                    minH: 2
                };

                return {
                    widgets: [...state.widgets, newWidget],
                };
            }),

            // Function to update widget properties (like chart type)
            updateWidget: (widgetId, properties) => set((state) => {
                const updatedWidgets = state.widgets.map(widget =>
                    widget.id === widgetId ? { ...widget, ...properties } : widget
                );

                return { widgets: updatedWidgets };
            }),

            // Function to remove a widget
            removeWidget: (widgetId) => set((state) => ({
                widgets: state.widgets.filter(widget => widget.id !== widgetId)
            })),
        }),
        {
            name: 'dashboard-storage',
            getStorage: () => localStorage,
        }
    )
);
