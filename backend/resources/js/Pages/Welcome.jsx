import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {
    const teamMembers = [
        { name: 'Sudipto Das', role: 'Team Leader + Backend', avatar: '👨‍💻' },
        { name: 'Chaon Das', role: 'Frontend', avatar: '🎨' },
        { name: 'Rakibur Rahman Mishan', role: 'Artificial Intelligence', avatar: '🧠' },
        { name: 'Aditi Roy', role: 'Database', avatar: '🗄️' },
    ];

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Navbar */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <ApplicationLogo className="w-10 h-10 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-800 tracking-tight">AI-Based Smart Quiz</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
                        <button onClick={() => scrollTo('home')} className="hover:text-indigo-600 transition">Home</button>
                        <button onClick={() => scrollTo('features')} className="hover:text-indigo-600 transition">About</button>
                        <button onClick={() => scrollTo('contact')} className="hover:text-indigo-600 transition">Contact Us</button>
                    </div>
                    <div className="flex items-center space-x-3">
                        {auth.user ? (
                            <Link href="/dashboard" className="px-5 py-2.5 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="px-5 py-2.5 rounded-full font-medium text-indigo-600 border border-indigo-300 hover:bg-indigo-50 transition">
                                    Login
                                </Link>
                                <Link href="/register" className="px-5 py-2.5 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
                        AI-Powered Smart Quiz
                        <span className="block text-indigo-300">Platform</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow">
                        Create, take, and analyze quizzes with AI. For teachers and students.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link href={auth.user ? '/dashboard' : '/register'} className="px-8 py-3.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg hover:shadow-xl">
                            Get Started
                        </Link>
                        <button onClick={() => scrollTo('features')} className="px-8 py-3.5 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Features / About Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">✨ About This Platform</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: '📝', title: 'AI Question Generation', desc: 'Generate MCQs instantly using AI (Groq) with options, answer, and explanation.' },
                            { icon: '🛡️', title: 'Cheating Detection', desc: 'Track tab switches and flag suspicious attempts for fair assessment.' },
                            { icon: '📊', title: 'Instant Results & Leaderboard', desc: 'Get feedback with explanations and view rankings by score and time.' },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition border border-gray-100 hover:border-indigo-200">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                                <p className="mt-3 text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">👥 Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, i) => (
                            <div key={i} className="text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-xl transition border border-gray-100 hover:border-indigo-200">
                                <div className="text-5xl mb-3">{member.avatar}</div>
                                <h4 className="text-lg font-semibold text-gray-800">{member.name}</h4>
                                <p className="text-sm text-indigo-600 font-medium mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">📬 Contact Us</h2>
                    <p className="text-gray-600 mb-8">Have questions or feedback? Reach out to us anytime.</p>
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-2xl mx-auto">
                        <p className="text-gray-700"><strong>Email:</strong> team03.cse4204@nubtk.edu</p>
                        <p className="text-gray-700 mt-2"><strong>Phone:</strong> +880 1701 054096</p>
                        <p className="text-gray-700 mt-2"><strong>Address:</strong> Northern University of Business and Technology, Khulna</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                    <p>© 2026 Team CSE4204-8A-T03. All rights reserved.</p>
                    <p className="mt-1">Built with Laravel, React, Tailwind CSS, and Google Gemini AI</p>
                </div>
            </footer>
        </div>
    );
}