import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Brand from '@/Components/Brand';

export default function Welcome({ auth }) {
    const teamMembers = [
        {
            name: 'Sudipto Das',
            role: 'Team Leader + Backend',
            image: '/images/team/sudipto.jpeg',
        },
        {
            name: 'Rakibur Rahman Mishan',
            role: 'Artificial Intelligence',
            image: '/images/team/rakibur.jpeg',
        },
        {
            name: 'Aditi Roy',
            role: 'Database + Frontend',
            image: '/images/team/aditi.jpeg',
        },
    ];

    const scrollTo = (id) => {
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen bg-white">

                {/* ================= HEADER ================= */}
                <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                        {/* Quizora Logo + Name */}
                        <Link
                            href="/"
                            className="flex items-center"
                        >
                            <Brand
                                logoClassName="h-11 w-11"
                                textClassName="text-lg lg:text-xl"
                                hideTaglineOnMobile={true}
                            />
                        </Link>

                        {/* Navigation */}
                        <div className="hidden items-center space-x-6 font-medium text-gray-700 md:flex">

                            <button
                                type="button"
                                onClick={() => scrollTo('home')}
                                className="transition hover:text-indigo-600"
                            >
                                Home
                            </button>

                            <button
                                type="button"
                                onClick={() => scrollTo('features')}
                                className="transition hover:text-indigo-600"
                            >
                                About
                            </button>

                            <button
                                type="button"
                                onClick={() => scrollTo('contact')}
                                className="transition hover:text-indigo-600"
                            >
                                Contact Us
                            </button>

                        </div>

                        {/* Login / Register / Dashboard */}
                        <div className="flex items-center space-x-3">

                            {auth?.user ? (

                                <Link
                                    href="/dashboard"
                                    className="rounded-full bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-indigo-700"
                                >
                                    Dashboard
                                </Link>

                            ) : (

                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-full border border-indigo-300 px-5 py-2.5 font-medium text-indigo-600 transition hover:bg-indigo-50"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="rounded-full bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-indigo-700"
                                    >
                                        Register
                                    </Link>
                                </>

                            )}

                        </div>

                    </div>

                </header>


                {/* ================= HERO SECTION ================= */}
                <section
                    id="home"
                    className="relative flex min-h-[80vh] items-center justify-center bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                    }}
                >

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white sm:px-6 lg:px-8">

                        {/* Brand Badge */}
                        <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur">

                            <span className="font-bold text-indigo-300">
                                Quizora
                            </span>

                            <span className="ml-1">
                                – AI-Based Smart Quiz
                            </span>

                        </div>

                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-lg md:text-6xl lg:text-7xl">

                            AI-Powered Smart Quiz

                            <span className="block text-indigo-300">
                                Platform
                            </span>

                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200 md:text-xl">

                            Create, take, and analyze quizzes with AI.
                            For teachers and students.

                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">

                            <Link
                                href={
                                    auth?.user
                                        ? '/dashboard'
                                        : '/register'
                                }
                                className="rounded-full bg-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-500"
                            >
                                Get Started
                            </Link>

                            <button
                                type="button"
                                onClick={() => scrollTo('features')}
                                className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10"
                            >
                                Learn More
                            </button>

                        </div>

                    </div>

                </section>


                {/* ================= ABOUT / FEATURES ================= */}
                <section
                    id="features"
                    className="bg-gray-50 py-20"
                >

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <h2 className="mb-3 text-center text-3xl font-bold text-gray-800">
                            About Quizora
                        </h2>

                        <p className="mb-12 text-center text-gray-600">
                            Smart tools for modern quiz management
                        </p>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                            {/* AI Question Generation */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow transition hover:shadow-xl">

                                <div className="mb-4 text-4xl">
                                    🤖
                                </div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    AI Question Generation
                                </h3>

                                <p className="mt-3 leading-relaxed text-gray-600">
                                    Generate course-aware MCQs using AI with
                                    four options, a correct answer, and an
                                    educational explanation.
                                </p>

                            </div>

                            {/* Suspicious Activity */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow transition hover:shadow-xl">

                                <div className="mb-4 text-4xl">
                                    🛡️
                                </div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    Suspicious Activity Detection
                                </h3>

                                <p className="mt-3 leading-relaxed text-gray-600">
                                    Monitor tab switching and unusually fast
                                    quiz completion to support fair
                                    assessment.
                                </p>

                            </div>

                            {/* Result */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow transition hover:shadow-xl">

                                <div className="mb-4 text-4xl">
                                    📊
                                </div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    Results & Leaderboard
                                </h3>

                                <p className="mt-3 leading-relaxed text-gray-600">
                                    Students receive detailed results,
                                    explanations, scores, and course-wise
                                    leaderboard rankings.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= TEAM ================= */}
                <section className="bg-white py-20">

                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
                            Meet Our Team
                        </h2>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

                            {teamMembers.map((member, index) => (

                                <div
                                    key={index}
                                    className="rounded-2xl border border-gray-100 bg-gray-50 p-7 text-center shadow-md transition hover:shadow-xl"
                                >

                                    {/* Photo */}
                                    <div className="mb-5 flex justify-center">

                                        <div className="rounded-xl border border-gray-200 bg-white p-1 shadow-md">

                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="h-40 w-32 rounded-lg object-cover object-top"
                                            />

                                        </div>

                                    </div>

                                    <h4 className="text-lg font-bold text-gray-800">
                                        {member.name}
                                    </h4>

                                    <p className="mt-1 text-sm font-medium text-indigo-600">
                                        {member.role}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* ================= CONTACT ================= */}
                <section
                    id="contact"
                    className="bg-gray-50 py-20"
                >

                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

                        <h2 className="mb-6 text-3xl font-bold text-gray-800">
                            Contact Us
                        </h2>

                        <p className="mb-8 text-gray-600">
                            Have questions or feedback? Reach out to us anytime.
                        </p>

                        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-md">

                            <p className="text-gray-700">
                                <strong>Email:</strong>{' '}
                                team03.cse4204@nubtk.edu
                            </p>

                            <p className="mt-2 text-gray-700">
                                <strong>Phone:</strong>{' '}
                                +880 1701 054096
                            </p>

                            <p className="mt-2 text-gray-700">
                                <strong>Address:</strong>{' '}
                                Northern University of Business and Technology,
                                Khulna
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================= FOOTER ================= */}
                <footer className="bg-gray-900 py-8">

                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

                        <div className="mb-4 flex justify-center">

                            <Brand
                                logoClassName="h-9 w-9"
                                textClassName="text-lg"
                                light={true}
                            />

                        </div>

                        <p className="text-sm text-gray-400">
                            © 2026 Team CSE4204-8A-T03. All rights reserved.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Built with Laravel, React, Tailwind CSS, and Groq AI
                        </p>

                    </div>

                </footer>

            </div>
        </>
    );
}