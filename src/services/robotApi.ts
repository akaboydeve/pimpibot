// Robot API Service
import { API_CONFIG } from '@/config/api';

// Types
export interface PromptRequest {
    prompt: string;
    deviceId?: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    job_id?: string;
    data?: {
        response?: string;
        robot_commands?: string[];
    };
    error?: string;
}

// Send a sequence of remote control commands to the robot
export async function sendRemoteSequence(commands: string[], deviceId: string = 'esp32-robot1'): Promise<ApiResponse> {
    try {
        // Make the API request with JSON body
        const response = await fetch(`${API_CONFIG.BASE_URL}/remote/sequence`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commands: commands,
                device_id: deviceId
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send remote command sequence:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Send a remote control command to the robot
export async function sendRemoteCommand(command: string, deviceId: string = 'esp32-robot1'): Promise<ApiResponse> {
    try {
        // Build the query parameters
        const params = new URLSearchParams();
        params.append('command', command);
        params.append('device_id', deviceId);

        // Make the API request
        const response = await fetch(`${API_CONFIG.BASE_URL}/remote/command?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send remote command:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Submit a command to the robot
export async function submitPrompt(prompt: string, deviceId?: string): Promise<ApiResponse> {
    try {
        const params = new URLSearchParams();
        if (deviceId) {
            params.append('device_id', deviceId);
        }

        const queryString = params.toString();
        const url = `${API_CONFIG.BASE_URL}/prompt${queryString ? '?' + queryString : ''}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to submit prompt:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Check the status of a job
export async function checkJobStatus(jobId: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/job/${jobId}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to check job status:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Poll for job completion
export async function pollJobCompletion(jobId: string): Promise<ApiResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < API_CONFIG.MAX_WAIT_TIME) {
        const result = await checkJobStatus(jobId);

        if (result.message === "Job completed") {
            return result;
        } else if (result.message.includes("failed") || !result.success) {
            return result;
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.POLL_INTERVAL));
    }

    return {
        success: false,
        message: "Timeout waiting for job completion",
        job_id: jobId,
    };
}

// Submit a prompt and wait for completion
export async function executePrompt(prompt: string, deviceId?: string): Promise<ApiResponse> {
    // Submit the prompt
    const submitResponse = await submitPrompt(prompt, deviceId);

    if (!submitResponse.success || !submitResponse.job_id) {
        return submitResponse;
    }

    // Poll for completion
    return await pollJobCompletion(submitResponse.job_id);
}

// Get all connected devices
export async function getDevices(): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/devices`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to get devices:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Check API health with a more tolerant approach
export async function checkHealth(): Promise<ApiResponse> {
    try {
        // Try health endpoint first
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
                signal: AbortSignal.timeout(2000) // 2s timeout
            });

            if (response.ok) {
                return { success: true, message: "API is online" };
            }
        } catch (e) {
            // Silently fail and try the second method
        }

        // If health endpoint fails, try to access any endpoint
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL.split('/api')[0]}`, {
                signal: AbortSignal.timeout(2000) // 2s timeout
            });

            if (response.ok || response.status === 404) {
                // Even a 404 means the server is running, just endpoint not found
                return { success: true, message: "API is online" };
            }
        } catch (e) {
            // Silently fail
        }

        return { success: false, message: "API is offline" };
    } catch (error) {
        console.error('Failed to check API health:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
} 