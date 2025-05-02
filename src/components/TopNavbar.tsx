"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useNav } from '@/app/providers';

export default function TopNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { toggleSidebar } = useNav();

    return (
        <nav className="topnav-container fixed w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="topnav-content max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="topnav-left flex items-center">
                    <button
                        onClick={toggleSidebar}
                        type="button"
                        className="topnav-sidebar-toggle inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 mr-2"
                    >
                        <span className="sr-only">Toggle sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                    <Link href="/" className="topnav-logo flex items-center">
                        <span className="topnav-title self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                            PimpiBot
                        </span>
                    </Link>
                </div>

                <div className="topnav-controls flex md:order-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        type="button"
                        className="topnav-hamburger inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>

                <div className={`topnav-menu items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <ul className="topnav-items flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link href="/dashboard" className="topnav-link block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/settings" className="topnav-link block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Settings</Link>
                        </li>
                        <li>
                            <Link href="/stats" className="topnav-link block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Stats</Link>
                        </li>
                        <li>
                            <Link href="/about" className="topnav-link block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
} 