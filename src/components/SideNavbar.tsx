"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNav } from '@/app/providers';

export default function SideNavbar() {
    const pathname = usePathname();
    const { isSidebarOpen } = useNav();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navLinkClass = (path: string) => `
        sidenav-link flex items-center p-2 text-gray-900 rounded-lg 
        dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group
        ${isActive(path) ? 'bg-gray-100 dark:bg-gray-700' : ''}
    `;

    // Apply the transform class based on the sidebar state
    const sidebarClass = `sidenav-container fixed top-0 left-0 z-40 w-64 h-screen pt-20 
        transition-transform bg-white border-r border-gray-200 
        dark:bg-gray-800 dark:border-gray-700
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`;

    return (
        <aside className={sidebarClass} aria-label="Sidebar">
            <div className="sidenav-content h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="sidenav-items space-y-2 font-medium">
                    <li className="sidenav-item">
                        <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                            <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                            </svg>
                            <span className="ml-3">Dashboard</span>
                        </Link>
                    </li>
                    <li className="sidenav-item">
                        <Link href="/settings" className={navLinkClass('/settings')}>
                            <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a1 1 0 0 0-2 0v7.268a2 2 0 0 0 0 3.464V16a1 1 0 1 0 2 0v-1.268a2 2 0 0 0 0-3.464V4Zm6 0a1 1 0 0 0-2 0v1.268a2 2 0 0 0 0 3.464V16a1 1 0 1 0 2 0V8.732a2 2 0 0 0 0-3.464V4Zm6 0a1 1 0 1 0-2 0v7.268a2 2 0 0 0 0 3.464V16a1 1 0 1 0 2 0v-1.268a2 2 0 0 0 0-3.464V4Z" />
                            </svg>
                            <span className="ml-3">Settings</span>
                        </Link>
                    </li>
                    <li className="sidenav-item">
                        <Link href="/stats" className={navLinkClass('/stats')}>
                            <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                            <span className="ml-3">Stats</span>
                        </Link>
                    </li>
                    <li className="sidenav-item">
                        <Link href="/about" className={navLinkClass('/about')}>
                            <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                            <span className="ml-3">About</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
} 