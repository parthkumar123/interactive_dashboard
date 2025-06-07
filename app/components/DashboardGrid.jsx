"use client";

import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '../store/dashboardStore';

// Widget components
import TableWidget from './widgets/TableWidget';
import ChartWidget from './widgets/ChartWidget';
import StatsWidget from './widgets/StatsWidget';

// Make the grid responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardGrid() {
    const { widgets, updateLayouts } = useDashboardStore();
    const [mounted, setMounted] = useState(false);

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

    // Render the appropriate widget based on its type
    const renderWidget = (widget) => {
        if (!widget.visible) return null;

        switch (widget.type) {
            case 'table':
                return <TableWidget widget={widget} />;
            case 'chart':
                return <ChartWidget widget={widget} />;
            case 'stats':
                return <StatsWidget widget={widget} />;
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
                margin={[16, 16]}
                containerPadding={[0, 0]}
                isDraggable={true}
                isResizable={true}
                useCSSTransforms={true}
            >
                {widgets
                    .filter(widget => widget.visible)
                    .map(widget => (
                        <div key={widget.id} className="widget-container">
                            {renderWidget(widget)}
                        </div>
                    ))}
            </ResponsiveGridLayout>
        </div>
    );
}
