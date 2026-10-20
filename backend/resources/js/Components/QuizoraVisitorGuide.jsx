
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';

const topics = [
    {
        id: 'introduction',
        title: 'Explore Quizora',
        description: 'Learn what Quizora offers.',
        icon: 'compass',
        steps: [
            {
                title: 'Welcome to Quizora',
                description: 'Quizora is an AI-based smart quiz platform for students and teachers.',
                selector: '#home h1',
            },
            {
                title: 'Explore the features',
                description: 'Discover AI question generation, live quizzes, results and leaderboards.',
                selector: '#features h2',
            },
            {
                title: 'How it works',
                description: 'See how students and teachers get started.',
                selector: '#how-it-works h2',
            },
            {
                title: 'Create your account',
                description: 'Click Get started to create your Quizora account.',
                selector: 'a[href="/register"]',
                action: '/register',
                actionLabel: 'Open Registration',
            },
        ],
    },
    {
        id: 'student',
        title: 'Register as a student',
        description: 'Start your learning journey.',
        icon: 'graduation',
        steps: [
            {
                title: 'Student workspace',
                description: 'Students can explore courses, take quizzes, view results and join live sessions.',
                heading: 'For students',
            },
            {
                title: 'Open registration',
                description: 'Click Get started to open the registration form.',
                selector: 'a[href="/register"]',
                action: '/register',
                actionLabel: 'Register Now',
            },
            {
                title: 'Choose student registration',
                description: 'Enter your details and register as a student. After registration, use your student dashboard.',
                action: '/register',
                actionLabel: 'Go to Registration',
            },
        ],
    },
    {
        id: 'teacher',
        title: 'Register as a teacher',
        description: 'Understand teacher approval.',
        icon: 'book',
        steps: [
            {
                title: 'Explore teacher features',
                description: 'Teachers can manage courses, create AI questions and host live quizzes.',
                heading: 'For teachers',
            },
            {
                title: 'Administrator approval',
                description: 'A new teacher account requires administrator approval before accessing teacher features.',
                text: 'Teacher registration requires',
            },
            {
                title: 'Apply for teacher access',
                description: 'Open registration, complete your details and select the teacher registration option.',
                selector: 'a[href="/register"]',
                action: '/register',
                actionLabel: 'Apply as Teacher',
            },
            {
                title: 'Wait for approval',
                description: 'Your application remains pending until an administrator approves it. You can check the status after login.',
            },
        ],
    },
    {
        id: 'login',
        title: 'How to log in',
        description: 'Access your existing account.',
        icon: 'user',
        steps: [
            {
                title: 'Find the login button',
                description: 'Use Log in in the top navigation to access your account.',
                selector: 'a[href="/login"]',
                action: '/login',
                actionLabel: 'Open Login',
            },
            {
                title: 'Enter your credentials',
                description: 'Enter your registered email and password, then submit the login form.',
                action: '/login',
                actionLabel: 'Go to Login',
            },
            {
                title: 'Open your dashboard',
                description: 'After login, Quizora directs you to the appropriate student, teacher, admin or approval-status page.',
            },
        ],
    },
    {
        id: 'features',
        title: 'Discover website features',
        description: 'Tour the main sections.',
        icon: 'sparkles',
        steps: [
            {
                title: 'Platform features',
                description: 'This section explains the major learning and teaching features.',
                selector: '#features h2',
            },
            {
                title: 'Learn the workflow',
                description: 'Understand registration, quizzes and result review.',
                selector: '#how-it-works h2',
            },
            {
                title: 'Meet the team',
                description: 'Learn about the people behind Quizora.',
                selector: '#team h2',
            },
            {
                title: 'Contact the team',
                description: 'Find contact information for questions and feedback.',
                selector: '#contact h2',
            },
        ],
    },
];

function GuideIcon({ name, size = 18 }) {
    const paths = {
        compass: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="m16 8-3 5-5 3 3-5 5-3Z" />
            </>
        ),
        graduation: (
            <>
                <path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c3 2 9 2 12 0v-5" />
                <path d="M22 9v7" />
            </>
        ),
        book: (
            <>
                <path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z" />
                <path d="M12 6v14" />
            </>
        ),
        user: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </>
        ),
        sparkles: (
            <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
        ),
        arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
        back: <path d="M19 12H5m6 6-6-6 6-6" />,
        close: <path d="M5 5l14 14M19 5 5 19" />,
        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 5 5" />
            </>
        ),
        check: <path d="m5 12 4 4L19 6" />,
        help: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1.5-2 3m0 3h.01" />
            </>
        ),
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name] || paths.help}
        </svg>
    );
}

function findTarget(step) {
    if (!step) return null;

    let candidates = [];

    if (step.selector) {
        try {
            candidates = Array.from(
                document.querySelectorAll(step.selector)
            );
        } catch {
            return null;
        }
    } else if (step.heading) {
        candidates = Array.from(
            document.querySelectorAll('h2, h3')
        ).filter(element =>
            element.textContent.trim() === step.heading
        );
    } else if (step.text) {
        candidates = Array.from(
            document.querySelectorAll('p')
        ).filter(element =>
            element.textContent.includes(step.text)
        );
    }

    return candidates.find(element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none'
        );
    }) || null;
}

export default function QuizoraVisitorGuide() {
    const [open, setOpen] = useState(false);
    const [topicId, setTopicId] = useState(null);
    const [index, setIndex] = useState(0);
    const [query, setQuery] = useState('');
    const [highlight, setHighlight] = useState(null);

    const selectedTopic = topics.find(
        topic => topic.id === topicId
    );

    const step = selectedTopic?.steps[index] || null;

    const filteredTopics = useMemo(() => {
        const search = query.trim().toLowerCase();

        if (!search) return topics;

        return topics.filter(topic =>
            `${topic.title} ${topic.description}`
                .toLowerCase()
                .includes(search)
        );
    }, [query]);

    // Move the guide away from top-right Login/Register buttons.
    const isNavigationStep = Boolean(
        step?.selector?.includes('a[href="/login"]') ||
        step?.selector?.includes('a[href="/register"]')
    );

    useEffect(() => {
        if (!open || !step) {
            setHighlight(null);
            return undefined;
        }

        let stopped = false;

        const update = (scroll = false) => {
            if (stopped) return;

            const element = findTarget(step);

            if (!element) {
                setHighlight(null);
                return;
            }

            if (scroll) {
                const reducedMotion = window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches;

                element.scrollIntoView({
                    behavior: reducedMotion ? 'auto' : 'smooth',
                    block: 'center',
                    inline: 'nearest',
                });
            }

            const rect = element.getBoundingClientRect();
            const padding = 6;

            const next = {
                top: Math.max(0, rect.top - padding),
                left: Math.max(0, rect.left - padding),
                width: rect.width + padding * 2,
                height: rect.height + padding * 2,
            };

            setHighlight(previous => {
                if (
                    previous &&
                    Math.abs(previous.top - next.top) < 1 &&
                    Math.abs(previous.left - next.left) < 1 &&
                    Math.abs(previous.width - next.width) < 1 &&
                    Math.abs(previous.height - next.height) < 1
                ) {
                    return previous;
                }

                return next;
            });
        };

        const timer = window.setTimeout(
            () => update(true),
            120
        );

        const timer2 = window.setTimeout(
            () => update(false),
            650
        );

        const refresh = () => update(false);

        window.addEventListener('scroll', refresh, true);
        window.addEventListener('resize', refresh);

        return () => {
            stopped = true;
            window.clearTimeout(timer);
            window.clearTimeout(timer2);
            window.removeEventListener('scroll', refresh, true);
            window.removeEventListener('resize', refresh);
        };
    }, [open, topicId, index, step]);

    useEffect(() => {
        const handleEscape = event => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const startTopic = topic => {
        setTopicId(topic.id);
        setIndex(0);
        setQuery('');
        setOpen(true);
        setHighlight(null);
    };

    const resetTopic = () => {
        setTopicId(null);
        setIndex(0);
        setHighlight(null);
    };

    return (
        <>
            {/* INTERACTIVE SPOTLIGHT */}

            {open && step && highlight && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed z-[90] rounded-xl border-[3px] border-[#E7CB86] transition-all duration-150"
                    style={{
                        ...highlight,
                        boxShadow:
                            '0 0 0 9999px rgba(12,25,19,.40), 0 0 0 4px rgba(255,255,255,.65)',
                    }}
                />
            )}

            {/* COMPACT FLOATING GUIDE */}

            <div
                className={`fixed bottom-3 z-[100] sm:bottom-5 ${
                    isNavigationStep
                        ? 'left-3 sm:left-5'
                        : 'right-3 sm:right-5'
                }`}
                style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
            >
                {open && (
                    <section
                        role="dialog"
                        aria-modal="false"
                        aria-label="Quizora Visitor Guide"
                        className="mb-2 flex w-[min(350px,calc(100vw-24px))] flex-col overflow-hidden rounded-[20px] border border-[#E5E9E2] bg-white shadow-[0_18px_50px_rgba(12,28,20,.22)]"
                        style={{
                            maxHeight:
                                'min(420px, calc(100dvh - 112px))',
                        }}
                    >
                        {/* SMALLER HEADER */}

                        <header className="flex shrink-0 items-center justify-between gap-2 bg-[#205740] px-4 py-3 text-white">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                    <GuideIcon
                                        name="compass"
                                        size={19}
                                    />
                                </span>

                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-extrabold">
                                        Quizora Smart Guide
                                    </h2>

                                    <p className="text-[10px] text-white/80">
                                        Visitor guide · Interactive walkthrough
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                aria-label="Close guide"
                                onClick={() => setOpen(false)}
                                className="shrink-0 rounded-lg p-1.5 hover:bg-white/15"
                            >
                                <GuideIcon name="close" size={18} />
                            </button>
                        </header>

                        {/* SCROLLABLE CONTENT */}

                        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4">
                            {selectedTopic ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={resetTopic}
                                        className="flex items-center gap-2 text-xs font-bold text-[#205740] hover:underline"
                                    >
                                        <GuideIcon
                                            name="back"
                                            size={14}
                                        />
                                        All guides
                                    </button>

                                    <div className="mt-3.5 flex items-center justify-between gap-2">
                                        <h3 className="text-[16px] font-extrabold leading-snug text-[#26372D]">
                                            {selectedTopic.title}
                                        </h3>

                                        <span className="shrink-0 rounded-full bg-[#E7F1E9] px-2.5 py-1 text-[11px] font-bold text-[#205740]">
                                            {index + 1}/
                                            {selectedTopic.steps.length}
                                        </span>
                                    </div>

                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E9EEE8]">
                                        <div
                                            className="h-full rounded-full bg-[#205740] transition-all duration-300"
                                            style={{
                                                width: `${
                                                    ((index + 1) /
                                                        selectedTopic.steps.length) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-3.5 rounded-xl border border-[#E8EBE4] bg-[#FAFBF8] p-3.5">
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#205740]">
                                            Step {index + 1}
                                        </p>

                                        <h4 className="mt-2 text-sm font-extrabold text-[#26372D]">
                                            {step?.title}
                                        </h4>

                                        <p className="mt-1.5 text-[12px] leading-[1.7] text-[#68776C]">
                                            {step?.description}
                                        </p>
                                    </div>

                                    {(step?.selector ||
                                        step?.heading ||
                                        step?.text) && (
                                        <p className="mt-3 flex items-start gap-2 text-[11px] font-semibold leading-5 text-[#437554]">
                                            <span className="mt-0.5 shrink-0">
                                                <GuideIcon
                                                    name="check"
                                                    size={14}
                                                />
                                            </span>

                                            {highlight
                                                ? 'Follow the highlighted area on this page.'
                                                : 'Read the instruction to continue.'}
                                        </p>
                                    )}

                                    {step?.action && (
                                        <Link
                                            href={step.action}
                                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#E8F2E7] px-3.5 py-2.5 text-xs font-bold text-[#205740] transition hover:bg-[#D7E9D5]"
                                        >
                                            {step.actionLabel}

                                            <GuideIcon
                                                name="arrow"
                                                size={15}
                                            />
                                        </Link>
                                    )}

                                    {/* WALKTHROUGH CONTROLS */}

                                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EDF0EB] pt-3">
                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() =>
                                                setIndex(previous =>
                                                    Math.max(0, previous - 1)
                                                )
                                            }
                                            className="rounded-lg border border-[#DEE4DD] px-3 py-2.5 text-xs font-bold text-[#4E6054] transition hover:bg-[#F4F7F2] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    index ===
                                                    selectedTopic.steps.length - 1
                                                ) {
                                                    resetTopic();
                                                } else {
                                                    setIndex(previous =>
                                                        previous + 1
                                                    );
                                                }
                                            }}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#205740] px-3.5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#173F30]"
                                        >
                                            {index ===
                                            selectedTopic.steps.length - 1
                                                ? 'Finish guide'
                                                : 'Next step'}

                                            <GuideIcon
                                                name={
                                                    index ===
                                                    selectedTopic.steps.length - 1
                                                        ? 'check'
                                                        : 'arrow'
                                                }
                                                size={14}
                                            />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-base font-extrabold text-[#28382D]">
                                        Welcome to Quizora!
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-[#768277]">
                                        Choose a topic to learn how to use this website.
                                    </p>

                                    <label className="relative mt-3.5 block">
                                        <span className="sr-only">
                                            Search guide topics
                                        </span>

                                        <span className="pointer-events-none absolute left-3 top-3 text-[#8F9A8F]">
                                            <GuideIcon
                                                name="search"
                                                size={17}
                                            />
                                        </span>

                                        <input
                                            type="search"
                                            value={query}
                                            onChange={event =>
                                                setQuery(event.target.value)
                                            }
                                            placeholder="Search a help topic..."
                                            className="w-full rounded-xl border-[#DEE5DE] bg-[#F9FBF8] py-2.5 pl-9 pr-3 text-xs text-[#34483B] focus:border-[#659678] focus:ring-[#CBE0CF]"
                                        />
                                    </label>

                                    <div className="mt-3 space-y-2">
                                        {filteredTopics.map(topic => (
                                            <button
                                                type="button"
                                                key={topic.id}
                                                onClick={() =>
                                                    startTopic(topic)
                                                }
                                                className="flex w-full items-center gap-2.5 rounded-xl border border-[#E9EDE6] bg-white px-3 py-2.5 text-left transition hover:border-[#A6C3AC] hover:bg-[#F9FCF8]"
                                            >
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E7F1E9] text-[#205740]">
                                                    <GuideIcon
                                                        name={topic.icon}
                                                        size={17}
                                                    />
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[12px] font-extrabold text-[#2C3D32]">
                                                        {topic.title}
                                                    </span>

                                                    <span className="mt-0.5 block text-[10px] leading-4 text-[#859187]">
                                                        {topic.description}
                                                    </span>
                                                </span>

                                                <GuideIcon
                                                    name="arrow"
                                                    size={15}
                                                />
                                            </button>
                                        ))}

                                        {filteredTopics.length === 0 && (
                                            <p className="py-4 text-center text-xs text-[#758379]">
                                                No matching guide found.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                )}

                {/* COMPACT FLOATING BUTTON */}

                <div
                    className={`flex ${
                        isNavigationStep
                            ? 'justify-start'
                            : 'justify-end'
                    }`}
                >
                    <button
                        type="button"
                        aria-expanded={open}
                        aria-label={
                            open
                                ? 'Close Quizora Visitor Guide'
                                : 'Open Quizora Visitor Guide'
                        }
                        onClick={() =>
                            setOpen(previous => !previous)
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-[#205740] px-4 py-3 text-xs font-extrabold text-white shadow-[0_10px_30px_rgba(18,39,25,.22)] transition hover:-translate-y-0.5 hover:bg-[#174831]"
                    >
                        <GuideIcon
                            name={open ? 'close' : 'sparkles'}
                            size={18}
                        />

                        {open ? 'Close guide' : 'Need help?'}
                    </button>
                </div>
            </div>
        </>
    );
}
