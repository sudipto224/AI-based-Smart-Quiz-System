
import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Brand from '@/Components/Brand';

// Background Slideshow Images
const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
        label: 'Smarter classrooms',
    },
    {
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
        label: 'Collaborative learning',
    },
    {
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80',
        label: 'Focused learning',
    },
];

const features = [
    {
        icon: 'sparkles',
        title: 'AI Question Generation',
        text: 'Create course-focused quiz questions with AI assistance.',
        tag: 'CREATE',
    },
    {
        icon: 'users',
        title: 'Live Classroom Quiz',
        text: 'Turn a class into a collaborative, real-time quiz experience.',
        tag: 'ENGAGE',
    },
    {
        icon: 'book',
        title: 'Organized Courses',
        text: 'Keep questions and learning activities neatly grouped by course.',
        tag: 'ORGANIZE',
    },
    {
        icon: 'chart',
        title: 'Results & Feedback',
        text: 'Review performance and learn from every completed assessment.',
        tag: 'IMPROVE',
    },
    {
        icon: 'shield',
        title: 'Activity Monitoring',
        text: 'Help teachers review unusual quiz behavior.',
        tag: 'REVIEW',
    },
    {
        icon: 'trophy',
        title: 'Course Leaderboards',
        text: 'Recognize progress with course-based rankings.',
        tag: 'CELEBRATE',
    },
];

const team = [
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

function Icon({ name, className = 'h-5 w-5' }) {
    const shapes = {
        arrow: (
            <path d="M4 12h16m-7-7 7 7-7 7" />
        ),
        check: (
            <path d="m5 12 4 4L19 6" />
        ),
        menu: (
            <path d="M4 7h16M4 12h16M4 17h16" />
        ),
        close: (
            <path d="M5 5l14 14M19 5 5 19" />
        ),
        sparkles: (
            <>
                <path d="m12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" />
                <path d="m19 17 .6 1.5L21 19l-1.4.5L19 21l-.5-1.5L17 19l1.5-.5L19 17Z" />
            </>
        ),
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3 20v-2a6 6 0 0 1 12 0v2H3M17 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5v1" />
            </>
        ),
        book: (
            <>
                <path d="M12 6C9.5 4.5 6.5 4 3 5v14c3.5-1 6.5-.5 9 1 2.5-1.5 5.5-2 9-1V5c-3.5-1-6.5-.5-9 1ZM12 6v14" />
            </>
        ),
        chart: (
            <>
                <path d="M4 4v16h16M7 16l4-5 3 2 5-6" />
                <path d="M16 7h3v3" />
            </>
        ),
        shield: (
            <>
                <path d="m12 2 8 4v6c0 5-3 8.5-8 10-5-1.5-8-5-8-10V6l8-4Z" />
                <path d="m9 12 2 2 4-4" />
            </>
        ),
        trophy: (
            <>
                <path d="M7 3h10v7a5 5 0 0 1-10 0V3Zm0 2H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4M12 15v4m-4 2h8" />
            </>
        ),
        graduation: (
            <>
                <path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c3.5 2.5 8.5 2.5 12 0v-5m4-3v7" />
            </>
        ),
        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        mail: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
            </>
        ),
        phone: (
            <path d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-3-2 2a15 15 0 0 1-6-6l2-2-3-5Z" />
        ),
        pin: (
            <>
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        play: (
            <path d="m8 5 11 7-11 7V5Z" />
        ),
        pause: (
            <path d="M9 5v14m6-14v14" />
        ),
        monitor: (
            <>
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 22h8m-4-4v4" />
            </>
        ),
    };

    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {shapes[name] || shapes.sparkles}
        </svg>
    );
}

function SectionHeader({
    eyebrow,
    heading,
    description,
}) {
    return (
        <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#A66D48]">
                {eyebrow}
            </span>

            <h2 className="q-heading mt-4 text-[clamp(2rem,4vw,3.35rem)] font-bold leading-[1.18] tracking-tight text-[#18382F]">
                {heading}
            </h2>

            {description && (
                <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#647168] sm:text-lg">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [slide, setSlide] = useState(0);
    const [paused, setPaused] = useState(false);

    const loggedIn = Boolean(auth?.user);
    const startUrl = loggedIn ? '/dashboard' : '/register';

    // Automatic image slideshow
    useEffect(() => {
        if (
            paused ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setSlide(
                (current) => (current + 1) % heroSlides.length
            );
        }, 6500);

        return () => window.clearInterval(timer);
    }, [paused]);

    const links = [
        { label: 'Home', target: 'home' },
        { label: 'Features', target: 'features' },
        { label: 'How it works', target: 'how-it-works' },
        { label: 'Our team', target: 'team' },
        { label: 'Contact', target: 'contact' },
    ];

    const scrollTo = (target) => {
        setMobileMenuOpen(false);

        document.getElementById(target)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <>
            <Head title="Quizora | Smarter Quizzes. Better Learning.">
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
                    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style>{`
                .quizora-welcome {
                    font-family: 'DM Sans', system-ui, sans-serif;
                }

                .quizora-welcome .q-heading {
                    font-family: 'Sora', 'DM Sans', sans-serif;
                }

                .quizora-welcome .q-section {
                    scroll-margin-top: 88px;
                }

                .quizora-welcome .q-slide {
                    transition: opacity 1500ms ease-in-out,
                                transform 7000ms ease-out;
                }

                .quizora-welcome .q-slide.is-current {
                    transform: scale(1.045);
                }

                .quizora-welcome a:focus-visible,
                .quizora-welcome button:focus-visible,
                .quizora-welcome input:focus-visible {
                    outline: 3px solid #D6B18A;
                    outline-offset: 3px;
                }

                @media (prefers-reduced-motion: reduce) {
                    .quizora-welcome *,
                    .quizora-welcome *::before,
                    .quizora-welcome *::after {
                        animation-duration: .01ms !important;
                        transition-duration: .01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

            <div className="quizora-welcome min-h-screen overflow-x-hidden bg-[#FBFAF6] text-[#20382F]">

                {/* NAVIGATION */}

                <header className="sticky top-0 z-50 border-b border-[#EAE9E1] bg-[#FFFEFA]/95 backdrop-blur-xl">
                    <div className="mx-auto flex min-h-[84px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                        <Link
                            href="/"
                            aria-label="Quizora home"
                            className="shrink-0"
                        >
                            <Brand
                                logoClassName="h-11 w-11"
                                textClassName="text-lg lg:text-xl"
                                hideTaglineOnMobile
                            />
                        </Link>

                        <nav
                            className="hidden items-center gap-8 lg:flex"
                            aria-label="Main navigation"
                        >
                            {links.map((link) => (
                                <button
                                    key={link.target}
                                    type="button"
                                    onClick={() => scrollTo(link.target)}
                                    className="text-sm font-bold text-[#55655A] transition hover:text-[#21644C]"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 lg:flex">
                            {!loggedIn && (
                                <Link
                                    href="/login"
                                    className="rounded-xl px-5 py-3 text-sm font-extrabold text-[#365345] transition hover:bg-[#F1F3EB]"
                                >
                                    Log in
                                </Link>
                            )}

                            <Link
                                href={startUrl}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#205740] px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#143F2E]"
                            >
                                {loggedIn ? 'Dashboard' : 'Get started'}
                                <Icon name="arrow" className="h-4 w-4" />
                            </Link>
                        </div>

                        <button
                            type="button"
                            aria-controls="quizora-mobile-menu"
                            aria-expanded={mobileMenuOpen}
                            aria-label={
                                mobileMenuOpen
                                    ? 'Close menu'
                                    : 'Open menu'
                            }
                            onClick={() =>
                                setMobileMenuOpen((open) => !open)
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DCE5DC] text-[#234936] lg:hidden"
                        >
                            <Icon
                                name={mobileMenuOpen ? 'close' : 'menu'}
                            />
                        </button>
                    </div>

                    {/* MOBILE NAVIGATION */}

                    {mobileMenuOpen && (
                        <nav
                            id="quizora-mobile-menu"
                            aria-label="Mobile navigation"
                            className="border-t border-[#E8ECE6] bg-white px-4 py-4 shadow-xl lg:hidden"
                        >
                            <div className="mx-auto flex max-w-7xl flex-col gap-1">
                                {links.map((link) => (
                                    <button
                                        key={link.target}
                                        type="button"
                                        onClick={() =>
                                            scrollTo(link.target)
                                        }
                                        className="rounded-xl px-4 py-3 text-left text-base font-bold text-[#385447] hover:bg-[#EFF5EC]"
                                    >
                                        {link.label}
                                    </button>
                                ))}

                                <div className="mt-3 flex gap-3 border-t border-[#E9EEE8] pt-4">
                                    {!loggedIn && (
                                        <Link
                                            href="/login"
                                            className="rounded-xl border border-[#CBD9CE] px-5 py-3 text-sm font-bold"
                                        >
                                            Log in
                                        </Link>
                                    )}

                                    <Link
                                        href={startUrl}
                                        className="rounded-xl bg-[#205740] px-5 py-3 text-sm font-bold text-white"
                                    >
                                        {loggedIn
                                            ? 'Dashboard'
                                            : 'Get started'}
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    )}
                </header>

                {/* HERO BACKGROUND SLIDESHOW */}

                <section
                    id="home"
                    className="q-section relative isolate overflow-hidden bg-[#122C27]"
                >
                    {heroSlides.map((item, index) => (
                        <div
                            key={item.image}
                            aria-hidden="true"
                            className={`q-slide pointer-events-none absolute inset-0 bg-cover bg-center ${
                                index === slide
                                    ? 'is-current opacity-100'
                                    : 'opacity-0'
                            }`}
                            style={{
                                backgroundImage: `url("${item.image}")`,
                            }}
                        />
                    ))}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#102B25]/95 via-[#142D28]/88 to-[#102B25]/64" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#102720]/45 via-transparent to-[#102720]/15" />

                    <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.12fr_.88fr] lg:gap-14 lg:px-8 lg:py-24">

                        {/* HERO TEXT */}

                        <div className="max-w-3xl text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#DFEDD7] backdrop-blur-sm">
                                <Icon
                                    name="sparkles"
                                    className="h-4 w-4"
                                />
                                An intelligent way to learn
                            </span>

                            <h1 className="q-heading mt-7 text-5xl font-bold leading-[1.09] tracking-tight text-white sm:text-6xl xl:text-[74px]">
                                Make every quiz{' '}
                                <span className="text-[#D4E8B8]">
                                    count.
                                </span>
                            </h1>

                            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-[#EEF5EA] sm:text-xl sm:leading-9 lg:mx-0">
                                Quizora brings AI-assisted questions, live
                                classroom quizzes and useful feedback
                                together in one beautiful learning experience.
                            </p>

                            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">

                                <Link
                                    href={startUrl}
                                    className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#DCEBBE] px-7 py-4 text-base font-extrabold text-[#173D2C] shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white sm:w-auto"
                                >
                                    {loggedIn
                                        ? 'Go to Dashboard'
                                        : 'Start learning today'}

                                    <Icon
                                        name="arrow"
                                        className="h-5 w-5"
                                    />
                                </Link>

                                <button
                                    type="button"
                                    onClick={() =>
                                        scrollTo('how-it-works')
                                    }
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
                                >
                                    Explore how it works
                                </button>
                            </div>

                            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-[#DFEADC] lg:justify-start">
                                {[
                                    'Create with AI',
                                    'Join live quizzes',
                                    'Track your learning',
                                ].map((text) => (
                                    <span
                                        key={text}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <Icon
                                            name="check"
                                            className="h-4 w-4 text-[#D6E9AC]"
                                        />
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* QUIZ PREVIEW */}

                        <div className="relative mx-auto w-full max-w-[490px]">

                            <div className="absolute -inset-3 rotate-2 rounded-[28px] border border-white/15 bg-white/5" />

                            <div className="relative overflow-hidden rounded-[26px] border border-[#E5E9DD] bg-[#FFFEFA] shadow-[0_32px_70px_rgba(0,0,0,.25)]">

                                <div className="flex items-center justify-between border-b border-[#E9ECE4] bg-[#F8FAF3] px-5 py-4 sm:px-6">

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#235A42] text-white">
                                            <Icon name="monitor" />
                                        </span>

                                        <div>
                                            <p className="q-heading text-sm font-bold text-[#173D2D]">
                                                Your Quiz Workspace
                                            </p>

                                            <p className="mt-1 text-xs text-[#778579]">
                                                A preview of Quizora
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-[#E7F1E0] px-3 py-1 text-[11px] font-extrabold text-[#2E6544]">
                                        DEMO
                                    </span>
                                </div>

                                <div className="p-5 sm:p-6">

                                    <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#78847B]">
                                        <span>Sample question</span>
                                        <span>01 / 03</span>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8EEE5]">
                                        <div className="h-full w-1/3 rounded-full bg-[#407C54]" />
                                    </div>

                                    <h2 className="q-heading mt-6 text-xl font-bold leading-snug text-[#203D2D] sm:text-2xl">
                                        Which technology enables computers
                                        to learn from data?
                                    </h2>

                                    <div className="mt-5 space-y-3">

                                        {[
                                            {
                                                key: 'A',
                                                label: 'Machine Learning',
                                                selected: true,
                                            },
                                            {
                                                key: 'B',
                                                label: 'Word Processing',
                                            },
                                            {
                                                key: 'C',
                                                label: 'File Compression',
                                            },
                                        ].map((option) => (
                                            <div
                                                key={option.key}
                                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold ${
                                                    option.selected
                                                        ? 'border-[#A9CBAF] bg-[#EDF6E8] text-[#245B3F]'
                                                        : 'border-[#E5E9E2] text-[#748077]'
                                                }`}
                                            >

                                                <span
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                        option.selected
                                                            ? 'bg-[#286548] text-white'
                                                            : 'bg-[#F0F2ED]'
                                                    }`}
                                                >
                                                    {option.key}
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    {option.label}
                                                </span>

                                                {option.selected && (
                                                    <Icon
                                                        name="check"
                                                        className="h-4 w-4"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F3EFE7] px-4 py-3 text-xs font-bold text-[#8C633F]">
                                        <span>
                                            Small steps. Real progress.
                                        </span>

                                        <Icon
                                            name="sparkles"
                                            className="h-4 w-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SLIDESHOW CONTROLS */}

                    <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 pb-8 sm:px-6 lg:px-8">

                        <div
                            className="flex items-center gap-3"
                            aria-label="Hero background photos"
                        >
                            {heroSlides.map((item, index) => (
                                <button
                                    key={item.image}
                                    type="button"
                                    onClick={() => setSlide(index)}
                                    aria-label={`Show photo ${index + 1}: ${item.label}`}
                                    aria-pressed={slide === index}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        slide === index
                                            ? 'w-9 bg-[#DCEBBE]'
                                            : 'w-2.5 bg-white/45 hover:bg-white/80'
                                    }`}
                                />
                            ))}

                            <span className="ml-2 text-xs font-bold text-white/80">
                                {heroSlides[slide].label}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setPaused((value) => !value)
                            }
                            aria-label={
                                paused
                                    ? 'Resume background slideshow'
                                    : 'Pause background slideshow'
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm hover:bg-white/20"
                        >
                            <Icon
                                name={paused ? 'play' : 'pause'}
                                className="h-4 w-4"
                            />

                            {paused
                                ? 'Play slideshow'
                                : 'Pause slideshow'}
                        </button>
                    </div>
                </section>

                {/* BENEFIT STRIP */}

                <section className="border-b border-[#E8EDE4] bg-white">

                    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-9 sm:grid-cols-3 sm:px-6 lg:px-8">

                        {[
                            {
                                icon: 'sparkles',
                                title: 'AI-assisted creation',
                                text: 'Build questions with less effort',
                            },
                            {
                                icon: 'users',
                                title: 'Learning together',
                                text: 'Bring your classroom online',
                            },
                            {
                                icon: 'chart',
                                title: 'Actionable feedback',
                                text: 'Turn attempts into progress',
                            },
                        ].map((item) => (

                            <div
                                key={item.title}
                                className="flex items-center gap-4"
                            >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E7F0E3] text-[#286447]">
                                    <Icon
                                        name={item.icon}
                                        className="h-6 w-6"
                                    />
                                </span>

                                <div>
                                    <p className="q-heading text-base font-bold text-[#213B30]">
                                        {item.title}
                                    </p>

                                    <p className="mt-1 text-sm text-[#7A867C]">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FEATURES SECTION */}

                <section
                    id="features"
                    className="q-section bg-[#FBFAF6] py-20 sm:py-28"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <SectionHeader
                            eyebrow="PURPOSE-BUILT FOR LEARNING"
                            heading="Everything your classroom needs, in one place."
                            description="A focused experience for creating assessments, taking quizzes and understanding progress."
                        />

                        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                            {features.map((feature) => (

                                <article
                                    key={feature.title}
                                    className="group rounded-[24px] border border-[#E6E8DE] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#AAC9AF] hover:shadow-[0_16px_45px_rgba(26,56,36,.07)] sm:p-8"
                                >
                                    <div className="flex items-center justify-between gap-3">

                                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9F1E6] text-[#286548]">
                                            <Icon
                                                name={feature.icon}
                                                className="h-7 w-7"
                                            />
                                        </span>

                                        <span className="text-[10px] font-extrabold tracking-[0.17em] text-[#AA8C6B]">
                                            {feature.tag}
                                        </span>
                                    </div>

                                    <h3 className="q-heading mt-7 text-xl font-bold text-[#213C2F]">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-3 text-base leading-8 text-[#738076]">
                                        {feature.text}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TEACHER AND STUDENT SECTION */}

                <section className="bg-white py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <SectionHeader
                            eyebrow="DESIGNED FOR BOTH SIDES"
                            heading="Better teaching. More confident learning."
                            description="A natural workspace for teachers and students, with features tailored to their role."
                        />

                        <div className="mt-12 grid gap-6 lg:grid-cols-2">

                            {/* TEACHERS */}

                            <article className="relative overflow-hidden rounded-[28px] bg-[#EAF2E7] p-8 sm:p-10">

                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#276349] text-white">
                                    <Icon
                                        name="graduation"
                                        className="h-7 w-7"
                                    />
                                </span>

                                <h3 className="q-heading mt-7 text-3xl font-bold text-[#214833]">
                                    For teachers
                                </h3>

                                <p className="mt-4 max-w-lg text-base leading-8 text-[#5C7462]">
                                    Create questions, arrange courses,
                                    host live quizzes and review how
                                    students performed.
                                </p>

                                <ul className="mt-7 space-y-3 text-base font-bold text-[#345F45]">

                                    {[
                                        'AI-supported preparation',
                                        'Live quiz rooms',
                                        'Review attempts and results',
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-3"
                                        >
                                            <Icon
                                                name="check"
                                                className="h-5 w-5"
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={startUrl}
                                    className="mt-9 inline-flex items-center gap-2 text-base font-extrabold text-[#245F42] hover:underline"
                                >
                                    {loggedIn
                                        ? 'Open your dashboard'
                                        : 'Register as a teacher'}

                                    <Icon name="arrow" />
                                </Link>

                                <p className="mt-3 text-xs text-[#738A79]">
                                    Teacher registration requires
                                    administrator approval.
                                </p>
                            </article>

                            {/* STUDENTS */}

                            <article className="relative overflow-hidden rounded-[28px] bg-[#F8EFE3] p-8 sm:p-10">

                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A76D48] text-white">
                                    <Icon
                                        name="book"
                                        className="h-7 w-7"
                                    />
                                </span>

                                <h3 className="q-heading mt-7 text-3xl font-bold text-[#653D29]">
                                    For students
                                </h3>

                                <p className="mt-4 max-w-lg text-base leading-8 text-[#8A705E]">
                                    Explore course quizzes, join a
                                    classroom with a code and learn
                                    from clear feedback.
                                </p>

                                <ul className="mt-7 space-y-3 text-base font-bold text-[#8B5E42]">

                                    {[
                                        'Take course-based quizzes',
                                        'Join interactive sessions',
                                        'Explore course leaderboards',
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-3"
                                        >
                                            <Icon
                                                name="check"
                                                className="h-5 w-5"
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={startUrl}
                                    className="mt-9 inline-flex items-center gap-2 text-base font-extrabold text-[#975E3E] hover:underline"
                                >
                                    {loggedIn
                                        ? 'Open your dashboard'
                                        : 'Get started as a student'}

                                    <Icon name="arrow" />
                                </Link>
                            </article>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}

                <section
                    id="how-it-works"
                    className="q-section border-y border-[#E6E9E0] bg-[#F4F6F0] py-20 sm:py-28"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <SectionHeader
                            eyebrow="THREE SIMPLE STEPS"
                            heading="Getting started is refreshingly easy."
                            description="Everything is organized so that learning stays the priority."
                        />

                        <div className="mt-14 grid gap-5 md:grid-cols-3">

                            {[
                                {
                                    number: '01',
                                    icon: 'users',
                                    title: 'Create your account',
                                    text: 'Sign up as a student or apply for a teacher account.',
                                },
                                {
                                    number: '02',
                                    icon: 'book',
                                    title: 'Create or take a quiz',
                                    text: 'Teachers prepare questions and students take course or live quizzes.',
                                },
                                {
                                    number: '03',
                                    icon: 'chart',
                                    title: 'Review the outcome',
                                    text: 'Use scores and feedback to understand what to improve next.',
                                },
                            ].map((item) => (

                                <article
                                    key={item.number}
                                    className="rounded-[24px] border border-[#E1E6DA] bg-white p-8"
                                >

                                    <div className="flex items-center justify-between">

                                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F1E5] text-[#286447]">
                                            <Icon
                                                name={item.icon}
                                                className="h-6 w-6"
                                            />
                                        </span>

                                        <span className="q-heading text-4xl font-bold text-[#D6E2D3]">
                                            {item.number}
                                        </span>
                                    </div>

                                    <h3 className="q-heading mt-7 text-xl font-bold text-[#234232]">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-base leading-8 text-[#708072]">
                                        {item.text}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TEAM SECTION */}

                <section
                    id="team"
                    className="q-section bg-white py-20 sm:py-28"
                >
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                        <SectionHeader
                            eyebrow="THE PEOPLE BEHIND QUIZORA"
                            heading="Built by a team that cares about learning."
                            description="Combining software engineering, AI and design to create a more engaging quiz experience."
                        />

                        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            {team.map((person) => (

                                <article
                                    key={person.name}
                                    className="rounded-[24px] border border-[#E6E8E0] bg-[#FCFCF9] p-7 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#E5EBE0]"
                                >
                                    <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl bg-[#E8EFE3] ring-4 ring-white">

                                        <span
                                            aria-hidden="true"
                                            className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#316D4A]"
                                        >
                                            {person.name
                                                .split(' ')
                                                .slice(0, 2)
                                                .map((part) => part[0])
                                                .join('')}
                                        </span>

                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full object-cover object-top"
                                            onError={(event) => {
                                                event.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>

                                    <h3 className="q-heading mt-6 text-lg font-bold text-[#254332]">
                                        {person.name}
                                    </h3>

                                    <p className="mt-2 text-sm font-bold text-[#A3704C]">
                                        {person.role}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT SECTION */}

                <section
                    id="contact"
                    className="q-section bg-[#F7F6F0] py-20 sm:py-28"
                >
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                        <SectionHeader
                            eyebrow="LET'S CONNECT"
                            heading="Have a question? Get in touch."
                            description="Contact our team with ideas, questions or suggestions about Quizora."
                        />

                        <div className="mt-12 grid gap-5 md:grid-cols-3">

                            {[
                                {
                                    icon: 'mail',
                                    title: 'Email us',
                                    text: 'team03.cse4204@nubtk.edu',
                                    href: 'mailto:team03.cse4204@nubtk.edu',
                                },
                                {
                                    icon: 'phone',
                                    title: 'Call us',
                                    text: '+880 1701 054096',
                                    href: 'tel:+8801701054096',
                                },
                                {
                                    icon: 'pin',
                                    title: 'Find us',
                                    text: 'Northern University of Business and Technology, Khulna',
                                },
                            ].map((info) => (

                                <div
                                    key={info.title}
                                    className="rounded-[22px] border border-[#E7E5DA] bg-white p-7 text-center"
                                >

                                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2E6] p-3 text-[#2D664A]">
                                        <Icon
                                            name={info.icon}
                                            className="h-6 w-6"
                                        />
                                    </span>

                                    <h3 className="q-heading mt-5 text-lg font-bold text-[#294332]">
                                        {info.title}
                                    </h3>

                                    {info.href ? (
                                        <a
                                            href={info.href}
                                            className="mt-3 block break-words text-base text-[#687A6C] hover:text-[#235D43] hover:underline"
                                        >
                                            {info.text}
                                        </a>
                                    ) : (
                                        <p className="mt-3 break-words text-base leading-7 text-[#687A6C]">
                                            {info.text}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FINAL CALL TO ACTION */}

                <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">

                    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#1E4B38] px-6 py-16 text-center sm:px-10 sm:py-20">

                        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[48px] border-white/5" />

                        <div className="relative mx-auto max-w-2xl">

                            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D8E7BE]">
                                YOUR NEXT CHALLENGE AWAITS
                            </span>

                            <h2 className="q-heading mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl">
                                Bring more meaning to every quiz.
                            </h2>

                            <p className="mt-5 text-lg leading-8 text-[#D4E3D8]">
                                Start learning, teaching and growing
                                with Quizora.
                            </p>

                            <Link
                                href={startUrl}
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#DFEDC3] px-8 py-4 text-base font-extrabold text-[#234733] transition hover:bg-white"
                            >
                                {loggedIn
                                    ? 'Open Dashboard'
                                    : 'Get started'}

                                <Icon name="arrow" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}

                <footer className="bg-[#172C25] text-white">

                    <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">

                        <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-10 lg:flex-row lg:items-start">

                            <div className="max-w-md">
                                <Brand
                                    light
                                    hideTaglineOnMobile={false}
                                    logoClassName="h-10 w-10"
                                    textClassName="text-base lg:text-lg"
                                />

                                <p className="mt-4 text-base leading-7 text-[#B6CABD]">
                                    Smarter assessments. Better classroom
                                    experiences. More meaningful learning.
                                </p>
                            </div>

                            <nav
                                className="flex flex-wrap gap-x-7 gap-y-3"
                                aria-label="Footer navigation"
                            >

                                {links.map((link) => (
                                    <button
                                        key={link.target}
                                        type="button"
                                        onClick={() =>
                                            scrollTo(link.target)
                                        }
                                        className="text-sm font-bold text-[#D0DED3] hover:text-white"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="flex flex-col justify-between gap-3 pt-7 text-sm text-[#9FB8A7] sm:flex-row">

                            <p>
                                © {new Date().getFullYear()} Team
                                CSE4204-8A-T03. All rights reserved.
                            </p>

                            <p>
                                Built with Laravel, React, Tailwind CSS
                                &amp; Groq AI.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
