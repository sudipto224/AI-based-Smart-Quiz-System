import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex items-center space-x-2">
                                <ApplicationLogo className="w-8 h-8 text-indigo-600" />
                                <span className="text-lg font-bold text-gray-800 hidden sm:inline">AI-Based Smart Quiz</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-sm text-gray-700 hover:text-indigo-600">Dashboard</Link>
                            <Link href={route('profile.index')} className="text-sm text-gray-700 hover:text-indigo-600">Profile</Link>
                            <form method="POST" action={route('logout')}>
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content || ''} />
                                <button type="submit" className="text-sm text-red-600 hover:text-red-800">Logout</button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}