'use client';

import { useState, useEffect } from 'react';
import Remote from '@/components/Remote';
import LogsPanel from '@/components/LogsPanel';
import ChatPanel from '@/components/ChatPanel';
import { checkHealth, sendRemoteCommand } from '@/services/robotApi';
import { API_CONFIG } from '@/config/api';

interface LogEntry {
    timestamp: Date;
    command: string;
    status: 'success' | 'error' | 'pending';
    isSequence?: boolean;
    commands?: string[];
}

// Special type for sequence handling
interface SequenceCommandObject {
    isSequence: boolean;
    commands: string[];
    success: boolean;
    message: string;
}

export default function DashboardPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const [deviceId, setDeviceId] = useState<string>('esp32-robot1');

    // Check API health on component mount
    useEffect(() => {
        const checkApiHealth = async () => {
            try {
                const healthResponse = await checkHealth();
                setApiStatus(healthResponse.success ? 'online' : 'offline');
            } catch (error) {
                setApiStatus('offline');
                console.error('API health check failed:', error);
            }
        };

        checkApiHealth();

        // Poll API health every minute
        const intervalId = setInterval(checkApiHealth, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCommand = async (commandOrSequence: string | SequenceCommandObject) => {
        // Handle sequence object (from AI-generated commands)
        if (typeof commandOrSequence !== 'string' && commandOrSequence.isSequence) {
            const sequenceObj = commandOrSequence;
            const commandList = sequenceObj.commands.join(', ');

            // Add a log entry for the sequence
            const newLog: LogEntry = {
                timestamp: new Date(),
                command: `Sequence: ${commandList}`,
                status: sequenceObj.success ? 'success' : 'error',
                isSequence: true,
                commands: sequenceObj.commands
            };

            setLogs(prevLogs => [...prevLogs, newLog]);
            console.log(`Command sequence executed: ${commandList}`);

            // Note: The actual API call was already made by the ChatPanel component
            return;
        }

        // If we get here, it's a single command (string) from button press
        const command = commandOrSequence as string;

        // Add a new log entry with pending status
        const newLog: LogEntry = {
            timestamp: new Date(),
            command,
            status: 'pending'
        };

        setLogs(prevLogs => [...prevLogs, newLog]);
        console.log(`Command sent: ${command}`);

        try {
            // Send the command to the robot API
            const response = await sendRemoteCommand(command, deviceId);

            // Update log entry based on response
            setLogs(prevLogs => {
                const updatedLogs = [...prevLogs];
                const lastIndex = updatedLogs.length - 1;

                if (lastIndex >= 0) {
                    updatedLogs[lastIndex].status = response.success ? 'success' : 'error';
                }

                return updatedLogs;
            });

            if (!response.success) {
                console.error(`Command failed: ${response.message}`);
            }
        } catch (error) {
            // Update log entry to error state
            setLogs(prevLogs => {
                const updatedLogs = [...prevLogs];
                const lastIndex = updatedLogs.length - 1;

                if (lastIndex >= 0) {
                    updatedLogs[lastIndex].status = 'error';
                }

                return updatedLogs;
            });

            console.error('Command execution error:', error);
        }
    };

    return (
        <div className="dashboard-container p-4 h-[calc(100vh-4rem)] overflow-hidden">
            <div className="dashboard-content h-full flex flex-col">
                <header className="dashboard-header mb-4 flex-shrink-0">
                    <h1 className="dashboard-title text-2xl font-bold text-gray-900 dark:text-white">
                        Robot Control
                    </h1>
                    <div className="flex flex-wrap items-center justify-between mt-1">
                        <div className="dashboard-subtitle-container">
                            <p className="dashboard-subtitle text-sm text-gray-600 dark:text-gray-400">
                                Click the buttons to control PimpiBot or use the chat interface
                            </p>
                            <div className="device-selector mt-2">
                                <label htmlFor="device-select" className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                    Robot:
                                </label>
                                <select
                                    id="device-select"
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    className="text-xs border rounded py-1 px-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                >
                                    <option value="esp32-robot1">Robot 1 (ESP32)</option>
                                    <option value="esp32-robot2">Robot 2 (ESP32)</option>
                                    <option value="rpi-robot1">Robot 3 (RPi)</option>
                                </select>
                            </div>
                        </div>

                        {apiStatus !== 'checking' && (
                            <div className="api-config mt-2 flex items-center gap-3">
                                <div className={`api-status inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${apiStatus === 'online'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}
                                >
                                    <span className={`w-2 h-2 mr-1.5 rounded-full ${apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    API {apiStatus}
                                </div>
                                <div className="server-url text-xs text-gray-500 dark:text-gray-400">
                                    Server: {API_CONFIG.BASE_URL.split('/api')[0]}
                                </div>
                                <div className="device-id text-xs text-gray-500 dark:text-gray-400">
                                    Device: {deviceId}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="dashboard-panels flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                    {/* Chat panel - full height on left */}
                    <div className="dashboard-chat-section h-full lg:col-span-1 lg:row-span-2 overflow-hidden">
                        <ChatPanel onLogCommand={handleCommand} deviceId={deviceId} />
                    </div>

                    {/* Right column with Remote and Logs stacked */}
                    <div className="dashboard-right-panels lg:col-span-2 h-full grid grid-cols-1 gap-4 min-h-0">
                        {/* Remote panel - top right */}
                        <div className="dashboard-remote-section h-full overflow-hidden">
                            <Remote onCommand={handleCommand} />
                        </div>

                        {/* Logs panel - bottom right */}
                        <div className="dashboard-logs-section h-full overflow-hidden">
                            <LogsPanel logs={logs} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 