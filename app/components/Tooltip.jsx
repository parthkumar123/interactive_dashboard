"use client";

import { useState, useRef, useEffect } from 'react';

export default function Tooltip({ children, content, position = "top" }) {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);
    const containerRef = useRef(null);
    const [tooltipStyle, setTooltipStyle] = useState({});

    const handleMouseEnter = () => {
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (isVisible && tooltipRef.current && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let style = {};
            switch (position) {
                case "top":
                    style = {
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '5px',
                    };
                    break;
                case "bottom":
                    style = {
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '5px',
                    };
                    break;
                case "left":
                    style = {
                        right: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginRight: '5px',
                    };
                    break;
                case "right":
                    style = {
                        left: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginLeft: '5px',
                    };
                    break;
                default:
                    style = {
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '5px',
                    };
            }

            setTooltipStyle(style);
        }
    }, [isVisible, position]);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={containerRef}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className="absolute z-[9999] px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap"
                    style={tooltipStyle}
                >
                    {content}
                    <div
                        className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${position === 'top' ? 'bottom-[-4px] left-1/2 ml-[-4px]' :
                            position === 'bottom' ? 'top-[-4px] left-1/2 ml-[-4px]' :
                                position === 'left' ? 'right-[-4px] top-1/2 mt-[-4px]' :
                                    'left-[-4px] top-1/2 mt-[-4px]'
                            }`}
                    />
                </div>
            )}
        </div>
    );
}
