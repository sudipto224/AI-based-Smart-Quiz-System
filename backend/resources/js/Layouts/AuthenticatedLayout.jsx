import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Brand from '@/Components/Brand';

export default function AuthenticatedLayout({ children }) {

    const { auth } = usePage().props;

    return (

        <div className="min-h-screen bg-gray-100 overflow-x-hidden">

            <nav className="bg-white border-b border-gray-100 shadow-sm">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-wrap items-center justify-between min-h-16 py-3 gap-3">


                        {/* LOGO */}

                        <Link href="/dashboard" className="flex-shrink-0">

                            <Brand
                                logoClassName="w-9 h-9"
                                textClassName="text-base lg:text-lg"
                                hideTaglineOnMobile={true}
                            />

                        </Link>



                        {/* NAV LINKS */}

                        <div className="flex items-center gap-3 flex-wrap">


                            <Link
                                href="/dashboard"
                                className="text-xs sm:text-sm text-gray-700 hover:text-indigo-600"
                            >
                                Dashboard
                            </Link>


                            <Link
                                href={route('profile.index')}
                                className="text-xs sm:text-sm text-gray-700 hover:text-indigo-600"
                            >
                                Profile
                            </Link>


                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-xs sm:text-sm text-red-600 hover:text-red-800"
                            >
                                Logout
                            </Link>


                        </div>


                    </div>


                </div>


            </nav>



            <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                {children}

            </main>


        </div>

    );
}