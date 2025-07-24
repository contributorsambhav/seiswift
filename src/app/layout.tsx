import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SeiSwift - International Web3 Transactions",
  description: "Seamless international transactions powered by Web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-8">
                  <Link 
                    href="/" 
                    className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    SeiSwift
                  </Link>
                  <div className="hidden md:flex space-x-6">
                    <Link 
                      href="/" 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Home
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
                
                {/* Mobile menu button - you can expand this later */}
                <div className="md:hidden">
                  <button className="text-gray-600 hover:text-gray-900">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>
          
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}