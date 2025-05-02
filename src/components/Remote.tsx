"use client";

import { useState } from "react";

interface RemoteProps {
    onCommand: (command: string) => void;
}

export default function Remote({ onCommand }: RemoteProps) {
    const directionButtonClass = (command: string) => `
        remote-button remote-${command}
        w-16 h-16 rounded-full font-bold text-white text-2xl
        flex items-center justify-center
        shadow-md transition-all duration-150
        bg-gradient-to-br from-blue-400 to-blue-600
        hover:from-blue-500 hover:to-blue-700
        focus:ring-2 focus:ring-blue-300 focus:outline-none
        transform hover:scale-105 hover:shadow-lg
    `;

    const stopButtonClass = `
        remote-button remote-stop
        w-16 h-16 rounded-full font-bold text-white text-sm
        flex items-center justify-center
        shadow-md transition-all duration-150
        bg-gradient-to-br from-red-400 to-red-600
        hover:from-red-500 hover:to-red-700
        focus:ring-2 focus:ring-red-300 focus:outline-none
        transform hover:scale-105 hover:shadow-lg
    `;

    return (
        <div className="remote-container h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="remote-header mb-3 flex-shrink-0">
                <h2 className="remote-title text-lg font-semibold text-center text-gray-800 dark:text-white">PimpiBot Remote</h2>
            </div>

            <div className="remote-grid flex-grow grid grid-cols-3 gap-x-1 gap-y-2 place-items-center max-w-xs mx-auto w-full">
                {/* Empty space */}
                <div className="remote-cell"></div>

                {/* Up button */}
                <div className="remote-cell remote-up-cell">
                    <button
                        className={directionButtonClass("forward")}
                        onClick={() => onCommand("forward")}
                        aria-label="Move forward"
                    >
                        ↑
                    </button>
                </div>

                {/* Empty space */}
                <div className="remote-cell"></div>

                {/* Left button */}
                <div className="remote-cell remote-left-cell">
                    <button
                        className={directionButtonClass("left")}
                        onClick={() => onCommand("left")}
                        aria-label="Turn left"
                    >
                        ←
                    </button>
                </div>

                {/* Stop button */}
                <div className="remote-cell remote-stop-cell">
                    <button
                        className={stopButtonClass}
                        onClick={() => onCommand("stop")}
                        aria-label="Stop movement"
                    >
                        STOP
                    </button>
                </div>

                {/* Right button */}
                <div className="remote-cell remote-right-cell">
                    <button
                        className={directionButtonClass("right")}
                        onClick={() => onCommand("right")}
                        aria-label="Turn right"
                    >
                        →
                    </button>
                </div>

                {/* Empty space */}
                <div className="remote-cell"></div>

                {/* Down button */}
                <div className="remote-cell remote-down-cell">
                    <button
                        className={directionButtonClass("backward")}
                        onClick={() => onCommand("backward")}
                        aria-label="Move backward"
                    >
                        ↓
                    </button>
                </div>

                {/* Empty space */}
                <div className="remote-cell"></div>
            </div>
        </div>
    );
} 