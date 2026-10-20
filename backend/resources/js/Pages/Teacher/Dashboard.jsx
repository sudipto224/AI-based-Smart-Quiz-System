
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
        plus: <path d="M12 4v16M4 12h16" />,
        questions: <>
            <rect x="4" y="3" width="16" height="18" rx="2"/>
            <path d="M9 8h6m-6 4h6m-6 4h3"/>
        </>,
        users: <>
            <circle cx="9" cy="8" r="3"/>
            <path d="M3 20v-2a6 6 0 0 1 12 0v2H3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1"/>
        </>,
        shield: <>
            <path d="m12 2 8 4v6c0 5-3 8.5-8 10-5-1.5-8-5-8-10V6l8-4Z"/>
            <path d="M12 8v5m0 3h.01"/>
        </>,
        edit: <>
            <path d="m15 5 4 4M4 20l4.5-1 11-11a2.12 2.12 0 0 0-3-3l-11 11L4 20Z"/>
        </>,
        layers: <>
            <rect x="5" y="4" width="15" height="15" rx="2"/>
            <path d="M2 8v12a2 2 0 0 0 2 2h12"/>
        </>,
        spark: <>
            <path d="m12 2 2.1 7 7 2.1-7 2.1L12 20l-2.1-6.8L3 11.1 9.9 9 12 2Z"/>
        </>,
    };

    return (
        <svg className={className}
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

function StatCard({ label, value, caption, icon }) {
    return (
        <div className="rounded-[20px] border border-[#EBE0D5] bg-white px-5 py-5 shadow-[0_6px_20px_rgba(101,64,42,.035)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#9A8779]">
                        {label}
                    </p>
                    <p className="quizora-display mt-3 text-3xl font-semibold text-[#513529]">
                        {value}
                    </p>
                </div>
                <span className="rounded-xl bg-[#F6E9DB] p-2.5 text-[#A05C40]">
                    <Icon name={icon} />
                </span>
            </div>
            <p className="mt-2 text-xs text-[#A29485]">
                {caption}
            </p>
        </div>
    );
}

function Shortcut({ href, icon, title, detail }) {
    return (
        <Link href={href}
            className="group flex items-start gap-4 rounded-[20px] border border-[#EDE1D6] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D6B69E] hover:shadow-[0_12px_30px_rgba(108,69,42,.08)]"
        >
            <span className="rounded-xl bg-[#F5E9DE] p-3 text-[#98543D]">
                <Icon name={icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="quizora-display block text-lg font-semibold text-[#51382B]">
                    {title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[#998678]">
                    {detail}
                </span>
            </span>
            <Icon name="arrow"
                className="h-4 w-4 shrink-0 text-[#B89A82] transition group-hover:translate-x-1"
            />
        </Link>
    );
}

export default function Dashboard({ courses = [] }) {
    const { auth } = usePage().props;
    const name = auth?.user?.name?.trim() || 'Teacher';
    const courseList = Array.isArray(courses) ? courses : [];
    const [search, setSearch] = useState('');

    const questionCount = course =>
        Math.max(
            0,
            Number(course.questions_count ?? course.questions?.length ?? 0) || 0
        );

    const totalQuestions = courseList.reduce(
        (sum, course) => sum + questionCount(course),
        0
    );

    const readyCourses = courseList.filter(
        course => questionCount(course) > 0
    ).length;

    const filteredCourses = useMemo(() => {
        const term = search.trim().toLowerCase();
        return term
            ? courseList.filter(course =>
                `${course.name || ''} ${course.description || ''}`
                    .toLowerCase()
                    .includes(term))
            : courseList;
    }, [courseList, search]);

    return (
        <AuthenticatedLayout theme="teacher">
            <Head title="Teacher Dashboard - Quizora" />

            <div className="space-y-8 pb-9">
                {/* FACULTY HERO */}
                <section className="relative overflow-hidden rounded-[28px] bg-[#663D2D] px-6 py-10 text-white sm:px-10 sm:py-12">
                    <div className="pointer-events-none absolute -right-14 -top-32 h-80 w-80 rounded-full border-[55px] border-white/5" />
                    <div className="pointer-events-none absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-[#D8A278]/15 blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F3D8C3]">
                                <Icon name="spark" className="h-4 w-4" />
                                FACULTY STUDIO
                            </span>

                            <h1 className="quizora-display mt-6 break-words text-3xl font-semibold leading-[1.16] tracking-tight sm:text-[42px]">
                                Welcome back,{' '}
                                <span className="text-[#F0C49A]">{name}.</span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-[#EFDBCF] sm:text-base">
                                Organize your courses, curate better assessments,
                                and keep your classroom on track.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
                            <Link
                                href={route('teacher.courses.create')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F6DDC7] px-5 py-3 text-sm font-extrabold text-[#643E2E] transition hover:bg-white"
                            >
                                <Icon name="plus" className="h-4 w-4" />
                                Create Course
                            </Link>

                            <a
                                href="#teacher-courses"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                My Courses
                                <Icon name="arrow" className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* COURSE OVERVIEW */}
                <section
                    className="grid gap-4 sm:grid-cols-3"
                    aria-label="Course overview"
                >
                    <StatCard
                        icon="book"
                        label="Courses Created"
                        value={courseList.length}
                        caption="Your course catalogue"
                    />
                    <StatCard
                        icon="questions"
                        label="Total Questions"
                        value={totalQuestions}
                        caption="Questions across your courses"
                    />
                    <StatCard
                        icon="layers"
                        label="Courses with Questions"
                        value={readyCourses}
                        caption="Courses with question content"
                    />
                </section>

                {/* TEACHING TOOLS */}
                <section>
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#B07552]">
                                TEACHING TOOLKIT
                            </p>
                            <h2 className="quizora-display mt-2 text-[28px] font-semibold text-[#4B3429]">
                                Everything within reach
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <Shortcut
                            href={route('teacher.courses.index')}
                            icon="book"
                            title="Course Management"
                            detail="Create, edit and organize courses."
                        />
                        <Shortcut
                            href={route('teacher.quiz-rooms.index')}
                            icon="users"
                            title="Live Classrooms"
                            detail="Host interactive live quiz sessions."
                        />
                        <Shortcut
                            href={route('teacher.suspicious')}
                            icon="shield"
                            title="Attempt Monitoring"
                            detail="Review flagged quiz activity."
                        />
                    </div>
                </section>

                {/* COURSE MANAGEMENT */}
                <section
                    id="teacher-courses"
                    className="scroll-mt-28 rounded-[24px] border border-[#E9DFD5] bg-white p-5 sm:p-8"
                >
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#AF7251]">
                                YOUR CATALOGUE
                            </p>
                            <h2 className="quizora-display mt-2 text-[28px] font-semibold text-[#4B3429]">
                                Courses & assessments
                            </h2>
                            <p className="mt-2 text-sm text-[#99887B]">
                                Edit a course or manage its questions.
                            </p>
                        </div>

                        <Link
                            href={route('teacher.courses.create')}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#98553D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#753E2D] md:self-auto"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Add Course
                        </Link>
                    </div>

                    {courseList.length > 0 && (
                        <label className="relative mt-6 block w-full md:max-w-sm">
                            <span className="sr-only">
                                Search your courses
                            </span>
                            <Icon
                                name="search"
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AD9C8E]"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={event =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search your courses..."
                                className="w-full rounded-xl border-[#EADFD4] bg-[#FCFAF7] py-3 pl-10 pr-4 text-sm text-[#513829] placeholder-[#A89689] focus:border-[#BA8060] focus:ring-[#EED7C9]"
                            />
                        </label>
                    )}

                    {courseList.length === 0 ? (
                        <div className="mt-7 rounded-2xl border border-dashed border-[#E4D4C5] bg-[#FCF8F3] px-5 py-12 text-center">
                            <Icon
                                name="book"
                                className="mx-auto h-9 w-9 text-[#AA6B4B]"
                            />
                            <h3 className="quizora-display mt-3 text-xl font-semibold text-[#5A3D2B]">
                                Create your first course
                            </h3>
                            <p className="mt-2 text-sm text-[#9A8777]">
                                Your courses will appear here once created.
                            </p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="mt-7 rounded-2xl border border-dashed border-[#E4D4C5] p-10 text-center">
                            <h3 className="font-bold text-[#60422D]">
                                No matching courses
                            </h3>
                            <p className="mt-2 text-sm text-[#9A8777]">
                                Try another search term.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="mt-3 text-sm font-bold text-[#99553D] underline"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="mt-7 grid gap-4 md:grid-cols-2">
                            {filteredCourses.map(course => {
                                const count = questionCount(course);

                                return (
                                    <article
                                        key={course.id}
                                        className="rounded-[20px] border border-[#EAE0D7] p-5 transition duration-200 hover:border-[#D4B49F] hover:shadow-[0_12px_30px_rgba(107,65,39,.07)]"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7ECE0] font-extrabold text-[#95573D]">
                                                {(course.name || 'C')
                                                    .trim()
                                                    .charAt(0)
                                                    .toUpperCase() || 'C'}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={route('teacher.questions', course.id)}
                                                    className="quizora-display break-words text-lg font-semibold text-[#52382B] hover:text-[#9A593F]"
                                                >
                                                    {course.name}
                                                </Link>
                                                <p className="mt-1 break-words text-sm leading-6 text-[#95867A]">
                                                    {course.description ||
                                                        'Manage questions and assessments for this course.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EAE4] pt-4">
                                            <span className="rounded-full bg-[#F8EEE5] px-3 py-1.5 text-xs font-bold text-[#9B583F]">
                                                {count} {count === 1
                                                    ? 'question'
                                                    : 'questions'}
                                            </span>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('teacher.courses.edit', course.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#DFD1C4] px-3 py-2 text-xs font-bold text-[#81543B] transition hover:bg-[#F9F1EA]"
                                                >
                                                    <Icon name="edit" className="h-3.5 w-3.5" />
                                                    Edit
                                                </Link>

                                                <Link
                                                    href={route('teacher.questions', course.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-[#98553D] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#75402D]"
                                                >
                                                    Questions
                                                    <Icon name="arrow" className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {courseList.length > 0 && (
                        <p className="mt-6 text-xs text-[#A79B90]">
                            Showing {filteredCourses.length} of{' '}
                            {courseList.length} courses
                        </p>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
