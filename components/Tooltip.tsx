import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top - 8, // 8px margin above
                left: rect.left + rect.width / 2
            });
            setIsVisible(true);
        }
    };

    return (
        <div
            className="relative flex items-center justify-center"
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && createPortal(
                <div
                    className="fixed z-[100] px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transform -translate-x-1/2 -translate-y-full pointer-events-none animate-fade-in tracking-wide"
                    style={{ top: coords.top, left: coords.left }}
                >
                    {content}
                </div>,
                document.body
            )}
        </div>
    );
};
