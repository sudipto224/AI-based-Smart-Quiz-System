import React, { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { GUIDES, ROLE_STYLE } from './quizoraGuideData';

// The assistant is intentionally deterministic: no API calls, private data
// collection, password requests or automatic modification of account data.
function detectRole(user) {
    if (!user) return null;

    const admin = user.is_admin === true || user.is_admin === 1 || user.is_admin === '1';
    const teacher = user.is_teacher === true || user.is_teacher === 1 || user.is_teacher === '1';

    if (admin) return 'admin';
    if (teacher && user.teacher_status === 'approved') return 'teacher';
    if (user.teacher_status === 'pending' ||
        user.teacher_status === 'rejected' ||
        user.teacher_status === 'revoked') {
        return 'applicant';
    }
    return 'student';
}

function Icon({ name, size = 20 }) {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    };

    const icons = {
        sparkles: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" /></>,
        compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" /></>,
        arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
        back: <path d="M19 12H5m6 6-6-6 6-6" />,
        close: <path d="M5 5l14 14M19 5 5 19" />,
        book: <><path d="M12 6c-2-2-6-2-9-1v14c3-1 7-1 9 1 2-2 6-2 9-1V5c-3-1-7-1-9 1ZM12 6v14" /></>,
        users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2H3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1" /></>,
        user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
        shield: <><path d="m12 2 8 4v6c0 5-3 8.5-8 10-5-1.5-8-5-8-10V6l8-4Z" /><path d="m9 12 2 2 4-4" /></>,
        check: <path d="m5 12 4 4L19 6" />,
        lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
        file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
        list: <><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" /></>,
        clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
        search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
        pin: <><path d="M12 22V12m0 0 5-5M12 12 7 7M9 2h6m-8 8 5 2 5-2" /></>,
        help: <><circle cx="12" cy="12" r="9" /><path d="M9.4 9a2.8 2.8 0 1 1 5.1 1.5c-.6.8-2.5 1.2-2.5 3.2m0 3h.01" /></>,
    };

    return <svg {...common}>{icons[name] || icons.help}</svg>;
}

function isOnStepPage(step, path) {
    if (step.at && path !== step.at) return false;
    if (step.starts && !path.startsWith(step.starts)) return false;
    return true;
}

function locateTarget(step) {
    if (!step.target) return null;

    try {
        const elements = Array.from(document.querySelectorAll(step.target))
            .filter(element => !element.closest('[data-quizora-guide-panel]'));

        if (step.contains) {
            return elements.find(element =>
                (element.textContent || '')
                    .toLowerCase()
                    .includes(step.contains.toLowerCase())
            ) || null;
        }

        return elements[0] || null;
    } catch {
        return null;
    }
}

export default function QuizoraGuide() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const role = detectRole(auth?.user);
    const guides = role ? (GUIDES[role] || []) : [];
    const palette = ROLE_STYLE[role] || ROLE_STYLE.student;
    const path = (url || '/dashboard').split('?')[0];
    const storageKey = `quizora-guide-v1:${auth?.user?.id || 'guest'}`;

    const [ready, setReady] = useState(false);
    const [open, setOpen] = useState(false);
    const [guideId, setGuideId] = useState(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [query, setQuery] = useState('');
    const [spotlight, setSpotlight] = useState(null);

    // Resume a walkthrough across Inertia page transitions in this tab only.
    useEffect(() => {
        try {
            const saved = JSON.parse(window.sessionStorage.getItem(storageKey) || '{}');
            const allowed = (GUIDES[detectRole(auth?.user)] || [])
                .some(guide => guide.id === saved.guideId);
            setOpen(Boolean(saved.open));
            setGuideId(allowed ? saved.guideId : null);
            setStepIndex(allowed ? Math.max(0, Number(saved.stepIndex) || 0) : 0);
        } catch {
            setOpen(false);
            setGuideId(null);
            setStepIndex(0);
        }
        setReady(true);
    }, [storageKey]);

    useEffect(() => {
        if (!ready) return;
        try {
            window.sessionStorage.setItem(storageKey, JSON.stringify({
                open,
                guideId,
                stepIndex,
            }));
        } catch {
            // Private browsing may deny storage. The guide still works.
        }
    }, [ready, storageKey, open, guideId, stepIndex]);

    const selectedGuide = guides.find(guide => guide.id === guideId) || null;
    const currentIndex = selectedGuide
        ? Math.min(Math.max(stepIndex, 0), selectedGuide.steps.length - 1)
        : 0;
    const activeStep = selectedGuide?.steps[currentIndex] || null;

    const filteredGuides = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return guides;

        return guides.filter(guide =>
            `${guide.title} ${guide.description} ${guide.keywords || ''}`
                .toLowerCase()
                .includes(term)
        );
    }, [guides, query]);

    const pageMatches = activeStep ? isOnStepPage(activeStep, path) : true;

    useEffect(() => {
        if (!open || !activeStep || !pageMatches) {
            setSpotlight(null);
            return undefined;
        }

        let stopped = false;
        const calculate = (scroll = false) => {
            if (stopped) return;

            const element = locateTarget(activeStep);
            if (!element) {
                setSpotlight(null);
                return;
            }

            if (scroll) {
                element.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                        ? 'auto' : 'smooth',
                    block: 'center',
                    inline: 'nearest',
                });
            }

            const rect = element.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) {
                setSpotlight(null);
                return;
            }

            const extra = 7;
            const next = {
                top: Math.max(0, rect.top - extra),
                left: Math.max(0, rect.left - extra),
                width: rect.width + extra * 2,
                height: rect.height + extra * 2,
            };

            setSpotlight(old =>
                old &&
                Math.abs(old.top - next.top) < 1 &&
                Math.abs(old.left - next.left) < 1 &&
                Math.abs(old.width - next.width) < 1 &&
                Math.abs(old.height - next.height) < 1
                    ? old : next
            );
        };

        const first = window.setTimeout(() => calculate(true), 90);
        const second = window.setTimeout(() => calculate(false), 650);
        const refresh = () => calculate(false);
        const afterClick = () => window.setTimeout(refresh, 140);

        window.addEventListener('resize', refresh);
        window.addEventListener('scroll', refresh, true);
        document.addEventListener('click', afterClick, true);

        return () => {
            stopped = true;
            window.clearTimeout(first);
            window.clearTimeout(second);
            window.removeEventListener('resize', refresh);
            window.removeEventListener('scroll', refresh, true);
            document.removeEventListener('click', afterClick, true);
        };
    }, [open, activeStep, pageMatches, path]);

    useEffect(() => {
        const esc = event => {
            if (event.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, []);

    if (!role) return null;

    const startGuide = guide => {
        setGuideId(guide.id);
        setStepIndex(0);
        setQuery('');
        setOpen(true);
    };

    const backToTopics = () => {
        setGuideId(null);
        setStepIndex(0);
        setSpotlight(null);
    };

    const goToPage = () => {
        if (activeStep?.go && path !== activeStep.go) {
            router.visit(activeStep.go, { preserveScroll: false });
        }
    };

    return (
        <>
            {open && spotlight && activeStep && pageMatches && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed z-[60] rounded-xl border-[3px] transition-all duration-150"
                    style={{
                        ...spotlight,
                        borderColor: '#E7CB86',
                        boxShadow: '0 0 0 9999px rgba(12,25,19,.45), 0 0 0 5px rgba(255,255,255,.7)',
                    }}
                />
            )}

            <div
                className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6"
                data-quizora-guide-panel
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
                {open && (
                    <section
                        role="dialog"
                        aria-modal="false"
                        aria-label="Quizora Smart Guide"
                        className="mb-3 flex w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-[22px] border border-[#E7E8E0] bg-white shadow-[0_24px_70px_rgba(12,28,20,.24)]"
                        style={{ maxHeight: 'min(660px, calc(100dvh - 108px))' }}
                    >
                        <header className="flex shrink-0 items-center justify-between gap-3 px-5 py-4 text-white"
                            style={{ background: palette.color }}>
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                    <Icon name="compass" size={22} />
                                </span>
                                <div className="min-w-0">
                                    <h2 className="truncate text-[16px] font-extrabold tracking-tight">
                                        Quizora Smart Guide
                                    </h2>
                                    <p className="text-[11px] font-medium text-white/80">
                                        {palette.name} · Interactive walkthrough
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close guide"
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-2 text-white hover:bg-white/15"
                            >
                                <Icon name="close" size={19} />
                            </button>
                        </header>

                        {selectedGuide ? (
                            <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
                                <button
                                    type="button"
                                    onClick={backToTopics}
                                    className="inline-flex items-center gap-2 text-xs font-bold hover:underline"
                                    style={{ color: palette.color }}
                                >
                                    <Icon name="back" size={15} />
                                    All guides
                                </button>

                                <div className="mt-5 flex items-start justify-between gap-3">
                                    <h3 className="text-lg font-extrabold leading-snug text-[#24332A]">
                                        {selectedGuide.title}
                                    </h3>
                                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                                        style={{ background: palette.soft, color: palette.text }}>
                                        {currentIndex + 1}/{selectedGuide.steps.length}
                                    </span>
                                </div>

                                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#EEF1EC]">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            background: palette.color,
                                            width: `${((currentIndex + 1) / selectedGuide.steps.length) * 100}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-5 rounded-2xl border border-[#E8EBE4] bg-[#FAFBF8] p-4">
                                    <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider"
                                        style={{ color: palette.color }}>
                                        <Icon name="pin" size={14} />
                                        Step {currentIndex + 1}
                                    </div>
                                    <h4 className="mt-3 text-base font-extrabold text-[#26372D]">
                                        {activeStep.title}
                                    </h4>
                                    <p className="mt-2 text-[13px] leading-6 text-[#66746A]">
                                        {activeStep.description}
                                    </p>
                                </div>

                                {!pageMatches ? (
                                    <div className="mt-4 rounded-xl border border-[#E7DDCA] bg-[#FFF9EC] p-3.5">
                                        <p className="text-xs font-bold text-[#87643B]">
                                            This step is on a different page.
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-[#987C56]">
                                            {activeStep.go
                                                ? 'Open the page below to see the highlighted control.'
                                                : 'Use the previous step to open the relevant quiz or course page.'}
                                        </p>
                                        {activeStep.go && (
                                            <button
                                                type="button"
                                                onClick={goToPage}
                                                className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-white"
                                                style={{ background: palette.color }}
                                            >
                                                Open this page <Icon name="arrow" size={14} />
                                            </button>
                                        )}
                                    </div>
                                ) : !spotlight && activeStep.target ? (
                                    <p className="mt-4 rounded-xl bg-[#F3F5F1] p-3 text-xs leading-5 text-[#68776C]">
                                        The highlighted control is not visible yet. It may require a course,
                                        an open tab, or some existing data. You can still read the guide.
                                    </p>
                                ) : (
                                    <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#437554]">
                                        <Icon name="check" size={15} />
                                        Follow the highlighted area on your page.
                                    </p>
                                )}

                                <div className="mt-6 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setStepIndex(index => Math.max(index - 1, 0))}
                                        disabled={currentIndex === 0}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#DEE4DD] px-4 py-3 text-xs font-bold text-[#4E6054] transition hover:bg-[#F3F6F2] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Icon name="back" size={14} /> Back
                                    </button>

                                    {currentIndex === selectedGuide.steps.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={backToTopics}
                                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold text-white"
                                            style={{ background: palette.color }}
                                        >
                                            Finish guide <Icon name="check" size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setStepIndex(index => index + 1)}
                                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold text-white"
                                            style={{ background: palette.color }}
                                        >
                                            Next step <Icon name="arrow" size={15} />
                                        </button>
                                    )}
                                </div>
                                <p className="mt-4 text-center text-[11px] leading-5 text-[#90998E]">
                                    Guidance only — no forms or permissions will be changed automatically.
                                </p>
                            </div>
                        ) : (
                            <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
                                <p className="text-lg font-extrabold tracking-tight text-[#28382D]">
                                    How can I help you?
                                </p>
                                <p className="mt-1 text-[13px] leading-6 text-[#768277]">
                                    Choose a topic for a guided tour of your actual Quizora pages.
                                </p>

                                <label className="relative mt-4 block">
                                    <span className="sr-only">Search help topics</span>
                                    <span className="pointer-events-none absolute left-3.5 top-3.5 text-[#8F9A8F]">
                                        <Icon name="search" size={17} />
                                    </span>
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={event => setQuery(event.target.value)}
                                        placeholder="Search a how-to topic..."
                                        className="w-full rounded-xl border-[#DEE5DE] bg-[#F9FBF8] py-3 pl-10 pr-3 text-sm text-[#34483B] placeholder-[#8E9B91] focus:border-[#659678] focus:ring-[#CBE0CF]"
                                    />
                                </label>

                                <div className="mt-4 space-y-2">
                                    {filteredGuides.length > 0 ? filteredGuides.map(guide => (
                                        <button
                                            key={guide.id}
                                            type="button"
                                            onClick={() => startGuide(guide)}
                                            className="group flex w-full items-center gap-3 rounded-xl border border-[#E9EDE6] bg-white px-3 py-3.5 text-left transition hover:border-[#A6C3AC] hover:bg-[#F9FCF8]"
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                                style={{ background: palette.soft, color: palette.color }}>
                                                <Icon name={guide.icon} size={19} />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[13px] font-extrabold text-[#2C3D32]">
                                                    {guide.title}
                                                </span>
                                                <span className="mt-1 block text-[11px] leading-4 text-[#859187]">
                                                    {guide.description}
                                                </span>
                                            </span>
                                            <span className="text-[#97A69A] group-hover:text-[#3B6E4E]">
                                                <Icon name="arrow" size={16} />
                                            </span>
                                        </button>
                                    )) : (
                                        <p className="rounded-xl bg-[#F5F7F4] p-5 text-center text-sm text-[#758379]">
                                            No matching guide. Try “course”, “quiz”, “teacher” or “room”.
                                        </p>
                                    )}
                                </div>

                                <p className="mt-5 text-center text-[11px] leading-5 text-[#95A097]">
                                </p>
                            </div>
                        )}
                    </section>
                )}

                <div className="flex justify-end">
                    <button
                        type="button"
                        aria-expanded={open}
                        aria-label={open ? 'Minimize Quizora Smart Guide' : 'Open Quizora Smart Guide'}
                        onClick={() => setOpen(current => !current)}
                        className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-3.5 font-extrabold text-white shadow-[0_12px_35px_rgba(18,39,25,.25)] transition hover:-translate-y-0.5 hover:shadow-xl"
                        style={{ background: palette.color }}
                    >
                        <Icon name={open ? 'close' : 'sparkles'} size={21} />
                        <span className="text-[13px] tracking-tight">
                            {open ? 'Close guide' : 'Need help?'}
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
}
