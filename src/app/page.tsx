import Link from 'next/link';

export default function Home() {
    return (
        <div className="home-container flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <div className="home-content text-center">
                <h1 className="home-title text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    Welcome to PimpiBot Control Center
                </h1>
                <p className="home-description mb-8 text-gray-600 dark:text-gray-400">
                    Use the sidebar to navigate to different sections
                </p>
                <Link
                    href="/dashboard"
                    className="home-dashboard-link inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
} 