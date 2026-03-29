import React from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-gray-800 uppercase tracking-wider">Dashboard</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{adminUser.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{adminUser.role}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-primary-200">
                            {adminUser.email ? adminUser.email[0].toUpperCase() : 'A'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
