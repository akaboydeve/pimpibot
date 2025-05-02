import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNavbar from "@/components/TopNavbar";
import SideNavbar from "@/components/SideNavbar";
import { NavProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PimpiBot Dashboard",
  description: "Control dashboard for autonomous AI robot PimpiBot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <NavProvider>
          <TopNavbar />
          <SideNavbar />
          <div className="app-content p-4 sm:ml-64 pt-20">
            {children}
          </div>
        </NavProvider>
      </body>
    </html>
  );
}
