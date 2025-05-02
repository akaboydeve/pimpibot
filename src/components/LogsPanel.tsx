"use client";

import { useEffect, useRef } from 'react';

interface LogEntry {
    timestamp: Date;
    command: string;
    status: 'success' | 'error' | 'pending';
    isSequence?: boolean;
    commands?: string[];
}

interface LogsPanelProps {
    logs: LogEntry[];
}

export default function LogsPanel({ logs }: LogsPanelProps) {
    const logsEndRef = useRef<HTMLDivElement>(null);
    const logsContentRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when new logs are added
    useEffect(() => {
        if (logsEndRef.current && logsContentRef.current) {
            // Check if the user is near the bottom before scrolling
            const { scrollTop, scrollHeight, clientHeight } = logsContentRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

            if (isNearBottom) {
                logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [logs]);

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const getCommandIcon = (command: string) => {
        switch (command) {
            case 'forward':
                return '↑';
            case 'backward':
                return '↓';
            case 'left':
                return '←';
            case 'right':
                return '→';
            case 'stop':
                return '■';
            default:
                return command.startsWith('Sequence:') ? '⏯' : '●';
        }
    };

    // Render command badges for sequence commands
    const renderSequenceCommands = (log: LogEntry) => {
        if (!log.isSequence || !log.commands || log.commands.length === 0) return null;

        return (
            <div className="sequence-commands mt-2 flex flex-wrap gap-1">
                {log.commands.map((cmd, idx) => (
                    <span
                        key={idx}
                        className="command-badge text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                        {cmd}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="logs-panel h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="logs-header bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                <h2 className="logs-title text-lg font-semibold text-gray-800 dark:text-white">Command Logs</h2>
            </div>

            <div
                ref={logsContentRef}
                className="logs-content flex-grow overflow-y-auto p-3 overscroll-contain"
            >
                {logs.length === 0 ? (
                    <div className="logs-empty text-center text-gray-500 dark:text-gray-400 p-3">
                        No commands have been issued yet.
                    </div>
                ) : (
                    <ul className="logs-list space-y-2">
                        {logs.map((log, index) => (
                            <li key={index} className="logs-entry p-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <div className="logs-entry-header flex items-center justify-between">
                                    <span className="logs-timestamp text-xs text-gray-500 dark:text-gray-400">
                                        {formatTime(log.timestamp)}
                                    </span>
                                    <span className={`logs-status px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(log.status)}`}>
                                        {log.status}
                                    </span>
                                </div>
                                <div className="logs-entry-content mt-1 flex items-center">
                                    <span className="logs-command-icon w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-2">
                                        {getCommandIcon(log.command)}
                                    </span>
                                    <span className="logs-command-text font-mono text-sm text-gray-800 dark:text-gray-200 capitalize">
                                        {log.command}
                                    </span>
                                </div>
                                {renderSequenceCommands(log)}
                            </li>
                        ))}
                    </ul>
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
} 