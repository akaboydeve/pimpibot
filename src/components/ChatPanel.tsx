"use client";

import { useState, useRef, useEffect } from 'react';
import { executePrompt, ApiResponse } from '@/services/robotApi';

// Define SpeechRecognition type to handle browser prefixes
interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'bot' | 'system';
    text: string;
    timestamp: Date;
    status?: 'pending' | 'success' | 'error';
    commands?: string[];
}

interface ChatPanelProps {
    onLogCommand?: (command: string | any) => void;
    deviceId?: string;
}

export default function ChatPanel({ onLogCommand, deviceId = 'esp32-robot1' }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            sender: 'bot',
            text: 'Hello! I am PimpiBot. You can send me commands like "move forward twice, then turn left".',
            timestamp: new Date(),
            status: 'success'
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const recognition = useRef<any>(null);

    // Initialize speech recognition once
    useEffect(() => {
        // Browser compatibility check
        const SpeechRecognition = (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.lang = 'en-US';

            recognition.current.onresult = (e: any) => {
                const transcript = e.results[0][0].transcript;
                setNewMessage(prev => (prev + ' ' + transcript).trim());
            };

            recognition.current.onend = () => setIsListening(false);
        }

        return () => {
            if (recognition.current) {
                try {
                    recognition.current.stop();
                } catch (e) { }
            }
        };
    }, []);

    // Toggle voice input
    const toggleVoice = () => {
        if (!recognition.current) return;

        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
            setIsListening(true);
        }
    };

    // Method to log commands from AI response without sending additional API calls
    const logCommands = (commands: string[]) => {
        if (!commands?.length || !onLogCommand) return;

        // For single commands, just log them directly
        if (commands.length === 1) {
            onLogCommand(commands[0]);
            return;
        }

        // For multiple commands, create a sequence log entry
        onLogCommand({
            isSequence: true,
            commands,
            success: true,
            message: "Commands executed by server"
        });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || isProcessing) return;

        // Stop listening if active
        if (isListening && recognition.current) {
            recognition.current.stop();
        }

        // Add user message
        const userMessageId = Date.now().toString();
        const userMessage: ChatMessage = {
            id: userMessageId,
            sender: 'user',
            text: newMessage,
            timestamp: new Date()
        };

        // Add processing message
        const processingMessage: ChatMessage = {
            id: `processing-${userMessageId}`,
            sender: 'system',
            text: 'Processing your request...',
            timestamp: new Date(),
            status: 'pending'
        };

        setMessages(prev => [...prev, userMessage, processingMessage]);
        setNewMessage('');
        setIsProcessing(true);

        // Auto-scroll to bottom
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        try {
            // Call the API
            const response = await executePrompt(userMessage.text, deviceId);

            // Remove processing message
            setMessages(prev => prev.filter(msg => msg.id !== processingMessage.id));

            if (response.success && response.data?.response) {
                // Add bot response
                const botMessage: ChatMessage = {
                    id: `response-${userMessageId}`,
                    sender: 'bot',
                    text: response.data.response,
                    timestamp: new Date(),
                    status: 'success',
                    commands: response.data.robot_commands
                };

                setMessages(prev => [...prev, botMessage]);

                // Log commands if available
                if (response.data.robot_commands?.length) {
                    logCommands(response.data.robot_commands);
                }
            } else {
                // Add error message
                setMessages(prev => [...prev, {
                    id: `error-${userMessageId}`,
                    sender: 'system',
                    text: response.message || 'An error occurred.',
                    timestamp: new Date(),
                    status: 'error'
                }]);
            }
        } catch (error) {
            // Handle unexpected errors
            setMessages(prev => [
                ...prev.filter(msg => msg.id !== processingMessage.id),
                {
                    id: `error-${userMessageId}`,
                    sender: 'system',
                    text: error instanceof Error ? error.message : 'An unexpected error occurred.',
                    timestamp: new Date(),
                    status: 'error'
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (messagesEndRef.current && chatMessagesRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 150;

            if (isNearBottom) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get appropriate CSS classes based on message type
    const getMessageClasses = (message: ChatMessage) => {
        // Base classes for all messages
        let classes = "chat-message max-w-[85%] p-3 rounded-lg mb-2 ";

        // Add classes based on sender
        if (message.sender === 'user') {
            classes += "chat-message-user ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 ";
        } else if (message.sender === 'bot') {
            classes += "chat-message-bot mr-auto bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 ";
        } else {
            // System messages
            if (message.status === 'pending') {
                classes += "chat-message-system mx-auto bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm italic ";
            } else if (message.status === 'error') {
                classes += "chat-message-error mx-auto bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm italic ";
            } else {
                classes += "chat-message-system mx-auto bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm italic ";
            }
        }

        return classes;
    };

    // Render command badges if present
    const renderCommandBadges = (commands?: string[]) => {
        if (!commands || commands.length === 0) return null;

        return (
            <div className="command-badges flex flex-wrap gap-1 mt-2">
                {commands.map((command, index) => (
                    <span
                        key={index}
                        className="command-badge text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                        {command}
                    </span>
                ))}
            </div>
        );
    };

    // Spinner for processing state
    const renderSpinner = () => (
        <div className="typing-indicator flex space-x-1 mt-1 justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
    );

    return (
        <div className="chat-panel h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="chat-header bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                <h2 className="chat-title text-lg font-semibold text-gray-800 dark:text-white">PimpiBot Chat</h2>
            </div>

            <div
                ref={chatMessagesRef}
                className="chat-messages flex-grow overflow-y-auto p-3 pb-4 overscroll-contain"
            >
                <div className="space-y-2">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={getMessageClasses(message)}
                        >
                            <div className="chat-message-text">{message.text}</div>

                            {message.status === 'pending' && renderSpinner()}

                            {renderCommandBadges(message.commands)}

                            <div className="chat-message-timestamp text-xs text-right mt-1 opacity-70">
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="chat-input-area p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a command or click mic to speak..."
                            disabled={isProcessing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />

                        {recognition.current && (
                            <button
                                type="button"
                                onClick={toggleVoice}
                                disabled={isProcessing}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                        ${isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300'}`}
                                title={isListening ? "Stop recording" : "Use voice input"}
                                aria-label={isListening ? "Stop recording" : "Use voice input"}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing || !newMessage.trim()}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                                disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Sending...' : 'Send'}
                    </button>
                </form>

                {isListening && (
                    <div className="mt-2 text-xs text-center text-red-500 dark:text-red-400 animate-pulse">
                        Listening...
                    </div>
                )}
            </div>
        </div>
    );
} 