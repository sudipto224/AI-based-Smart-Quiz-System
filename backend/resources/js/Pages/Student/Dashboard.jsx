
import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function Icon({ name, className = 'h-5 w-5' }) {
    const paths = {
        arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
        book: <>
            <path d="M12 7c-2.5-2-5.5-2.5-9-1v14c3.5-1.5 6.5-1 9 1 2.5-2 5.5-2.5 9-1V6c-3.5-1.5-6.5-1-9 1Z"/>
            <path d="M12 7v14"/>
        </>,
        search: <>
            <circle cx="11" cy="11" r="7"/>
            <path d="m16 16 5 5"/>
        </>,
        clock: <>
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 2"/>
        </>,
        trophy: <>
            <path d="M7 3h10v7a5 5 0 0 1-10 0V3ZM7 5H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4M12 15v4m-4 2h8"/>
        </>,
        play: <path d="m8 5 11 7-11 7V5Z" />,
        users: <>
            <circle cx="9" cy="8" r="3"/>
            <path d="M3 20v-2a6 6 0 0 1 12 0v2H3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1"/>
        </>,
        leaf: <>
            <path d="M20 4C9 4 5 8 5 14a6 6 0 0 0 6 6c6 0 10-4 9-16Z"/>
            <path d="M5 20c3-5 7-8 12-11"/>
        </>,
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
            {paths[name] || paths.book}
        </svg>
    );
}

function Insight({ icon, label, value, caption }) {
    return (
        <div className="rounded-[20px] border border-[#E2E8DF] bg-white px-5 py-5 shadow-[0_6px_20px_rgba(23,56,39,0.035)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#748277]">
                        {label}
                    </p>
                    <p className="quizora-display mt-3 break-words text-[27px] font-semibold leading-tight tracking-tight text-[#213D32]">
                        {value}
                    </p>
                </div>
                <span className="rounded-xl bg-[#E7F1E9] p-2.5 text-[#276447]">
                    <Icon name={icon} className="h-5 w-5" />
                </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#75817A]">
                {caption}
            </p>
        </div>
    );
}

export default function Dashboard({ courses = [] }) {
    const { auth } = usePage().props;
    const fullName = auth?.user?.name?.trim() || 'Student';
    const courseList = Array.isArray(courses) ? courses : [];
    const [search, setSearch] = useState('');

    const filteredCourses = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return courseList;

        return courseList.filter(course =>
            `${course.name || ''} ${course.description || ''}`
                .toLowerCase()
                .includes(term)
        );
    }, [courseList, search]);

    return (
        <AuthenticatedLayout theme="student">
            <Head title="Student Dashboard - Quizora" />

            <div className="space-y-8 pb-9">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden rounded-[28px] bg-[#173E32] px-6 py-10 text-white sm:px-10 sm:py-12">
                    <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border-[48px] border-white/5" />
                    <div className="pointer-events-none absolute bottom-0 right-24 h-32 w-32 rounded-full bg-[#A9C9A5]/10 blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4E9D4]">
                                <Icon name="leaf" className="h-4 w-4" />
                                Your learning space
                            </div>

                            <h1 className="quizora-display mt-6 break-words text-3xl font-semibold leading-[1.16] tracking-tight sm:text-[42px]">
                                A good day to learn,{' '}
                                <span className="text-[#C0E1BB]">
                                    {fullName}.
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-[#D2E1D7] sm:text-base">
                                Explore your courses, take a quick assessment,
                                or join your teacher's live session.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
                            <Link
                                href={route('student.quiz-rooms.join')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D3E8B9] px-5 py-3 text-sm font-extrabold text-[#1D4130] transition hover:bg-[#E5F2D4]"
                            >
                                <Icon name="play" className="h-4 w-4" />
                                Join Live Quiz
                            </Link>

                            <a
                                href="#student-courses"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Explore Courses
                                <Icon name="arrow" className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* DASHBOARD STATISTICS */}
                <section
                    className="grid gap-4 sm:grid-cols-3"
                    aria-label="Learning overview"
                >
                    <Insight
                        icon="book"
                        label="Course Library"
                        value={courseList.length}
                        caption="Courses available for practice"
                    />
                    <Insight
                        icon="users"
                        label="Live Classroom"
                        value="Join by code"
                        caption="Enter a code from your teacher"
                    />
                    <Insight
                        icon="trophy"
                        label="Your Rankings"
                        value="Per course"
                        caption="See how you compare in each course"
                    />
                </section>

                {/* LIVE CLASSROOM */}
                <section className="flex flex-col items-start justify-between gap-5 rounded-[22px] border border-[#DDE8D9] bg-[#E6F0E2] px-6 py-6 sm:flex-row sm:items-center sm:px-8">
                    <div className="flex items-start gap-4">
                        <span className="rounded-2xl bg-[#29654A] p-3 text-white">
                            <Icon name="users" className="h-6 w-6" />
                        </span>

                        <div>
                            <h2 className="quizora-display text-xl font-semibold text-[#1D4434]">
                                Joining a classroom session?
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-[#5C7163]">
                                Your teacher shares a room code. Enter it to
                                take part in a live quiz.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('student.quiz-rooms.join')}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#225E45] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#194B36]"
                    >
                        Join Room
                        <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                </section>

                {/* COURSE DIRECTORY */}
                <section
                    id="student-courses"
                    className="scroll-mt-28 rounded-[24px] border border-[#E4E9E2] bg-white p-5 sm:p-8"
                >
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#548367]">
                                COURSE DIRECTORY
                            </p>
                            <h2 className="quizora-display mt-2 text-[28px] font-semibold tracking-tight text-[#253F32]">
                                Find something to learn
                            </h2>
                            <p className="mt-2 text-sm text-[#738079]">
                                Choose a course to begin a quiz or explore
                                its leaderboard.
                            </p>
                        </div>

                        {courseList.length > 0 && (
                            <label className="relative w-full md:max-w-xs">
                                <span className="sr-only">
                                    Search courses
                                </span>
                                <Icon
                                    name="search"
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#829087]"
                                />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={event =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search courses..."
                                    className="w-full rounded-xl border-[#DFE8DE] bg-[#F9FBF7] py-3 pl-10 pr-4 text-sm text-[#263F33] placeholder-[#87938B] focus:border-[#438166] focus:ring-[#C7E2CD]"
                                />
                            </label>
                        )}
                    </div>

                    {courseList.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-dashed border-[#D7E4D7] bg-[#F6FAF5] px-5 py-12 text-center">
                            <Icon
                                name="book"
                                className="mx-auto h-9 w-9 text-[#397A59]"
                            />
                            <h3 className="quizora-display mt-3 text-xl font-semibold">
                                No courses available yet
                            </h3>
                            <p className="mt-2 text-sm text-[#718177]">
                                Your teacher has not added a course yet.
                                Please check back later.
                            </p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-dashed border-[#D7E4D7] p-10 text-center">
                            <h3 className="font-bold text-[#2B4938]">
                                No matching courses
                            </h3>
                            <p className="mt-2 text-sm text-[#718177]">
                                Try a different search.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="mt-3 text-sm font-bold text-[#27674B] underline"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredCourses.map((course, index) => (
                                <article
                                    key={course.id}
                                    className="group flex min-w-0 flex-col rounded-[20px] border border-[#E1E9DE] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#A4C5AD] hover:shadow-[0_12px_32px_rgba(29,76,53,.08)]"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F0E5] font-extrabold text-[#286246]">
                                            {(course.name || 'C')
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase() || 'C'}
                                        </span>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A39A]">
                                            {`Course ${String(index + 1).padStart(2, '0')}`}
                                        </span>
                                    </div>

                                    <h3 className="quizora-display mt-5 break-words text-lg font-semibold text-[#213E2F]">
                                        {course.name}
                                    </h3>

                                    <p className="mt-2 flex-1 break-words text-sm leading-6 text-[#7B867C]">
                                        {course.description ||
                                            'Practice key ideas and strengthen your understanding.'}
                                    </p>

                                    <div className="mt-5 flex items-center gap-2 border-t border-[#EAF0E9] pt-4 text-xs font-medium text-[#78867B]">
                                        <Icon name="clock" className="h-4 w-4" />
                                        {course.time_per_question
                                            ? `${course.time_per_question} seconds per question`
                                            : 'Quiz timing set by teacher'}
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-2">
                                        <Link
                                            href={route('quiz.show', course.id)}
                                            className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#235F46] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#174631] sm:text-sm"
                                        >
                                            <Icon name="play" className="h-4 w-4" />
                                            Start Quiz
                                        </Link>

                                        <Link
                                            href={route('leaderboard.show', course.id)}
                                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#CFDFCF] bg-[#F2F7EF] px-2 py-3 text-xs font-bold text-[#2A6146] transition hover:bg-[#E8F2E5] sm:text-sm"
                                        >
                                            <Icon name="trophy" className="h-4 w-4" />
                                            Leaderboard
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {courseList.length > 0 && (
                        <p className="mt-6 text-xs text-[#94A099]">
                            Showing {filteredCourses.length} of{' '}
                            {courseList.length} courses
                        </p>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
