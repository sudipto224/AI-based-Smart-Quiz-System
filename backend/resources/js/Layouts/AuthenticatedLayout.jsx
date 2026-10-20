
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Brand from '@/Components/Brand';
import QuizoraGuide from '@/Components/QuizoraGuide';

const palettes = {
    student: {
        name: 'Student workspace',
        accent: '#21644C',
        background: '#F4F7F2',
        soft: '#E5F0E8',
    },
    teacher: {
        name: 'Faculty workspace',
        accent: '#99573F',
        background: '#FAF6F0',
        soft: '#F5E9DD',
    },
    admin: {
        name: 'Administration',
        accent: '#9E633C',
        background: '#F6F5F2',
        soft: '#F0E8DF',
    },
    default: {
        name: '',
        accent: '#4F46E5',
        background: '#F3F4F6',
        soft: '#EEF2FF',
    },
};

export default function AuthenticatedLayout({
    children,
    theme = 'default',
}) {
    const palette = palettes[theme] || palettes.default;

    return (
        <div
            className="quizora-shell min-h-screen overflow-x-hidden"
            style={{
                backgroundColor: palette.background,
                color: '#25302E',
            }}
        >
            <Head>
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style>{`
                .quizora-shell {
                    font-family: 'DM Sans', system-ui, sans-serif;
                }

                .quizora-shell .quizora-display {
                    font-family: 'Outfit', 'DM Sans',
                                 system-ui, sans-serif;
                }

                .quizora-shell a:focus-visible,
                .quizora-shell button:focus-visible,
                .quizora-shell input:focus-visible {
                    outline: 2px solid currentColor;
                    outline-offset: 3px;
                }

                @media (prefers-reduced-motion: reduce) {
                    .quizora-shell *,
                    .quizora-shell *::before,
                    .quizora-shell *::after {
                        transition-duration: 0.01ms !important;
                        animation-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <header className="sticky top-0 z-40 border-b border-[#E5E5E0] bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link
                            href="/dashboard"
                            aria-label="Quizora dashboard"
                            className="shrink-0"
                        >
                            <Brand
                                logoClassName="h-9 w-9"
                                textClassName="text-base lg:text-lg"
                                hideTaglineOnMobile={true}
                            />
                        </Link>

                        {theme !== 'default' && (
                            <span
                                className="hidden rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] sm:inline-flex"
                                style={{
                                    background: palette.soft,
                                    color: palette.accent,
                                }}
                            >
                                {palette.name}
                            </span>
                        )}
                    </div>

                    <nav
                        className="flex items-center gap-1 sm:gap-2"
                        aria-label="Account navigation"
                    >
                        <Link
                            href="/dashboard"
                            className="rounded-lg px-3 py-2 text-xs font-bold transition hover:bg-[#F4F5F2] sm:text-sm"
                            style={{ color: palette.accent }}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href={route('profile')}
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-[#56605C] transition hover:bg-[#F4F5F2] sm:text-sm"
                        >
                            Profile
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-lg border border-[#E6E4DF] px-3 py-2 text-xs font-bold text-[#755045] transition hover:bg-[#FAF0EC] sm:text-sm"
                        >
                            Logout
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
                {children}
            </main>

            {/* Role-aware, non-destructive website walkthrough assistant */}
            <QuizoraGuide />
        </div>
    );
}
