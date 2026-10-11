import React from 'react';

import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({
    courses = [],
    sessions = [],
}) {
    const firstCourse =
        courses[0] || null;

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        course_id:
            firstCourse?.id || '',

        title: '',

        code_prefix: '',

        question_count:
            firstCourse
                ? Math.min(
                    5,
                    firstCourse.questions_count
                )
                : 5,
    });

    const selectedCourse =
        courses.find(
            (course) =>
                String(course.id) ===
                String(data.course_id)
        ) || null;

    const submit = (e) => {
        e.preventDefault();

        post(
            route(
                'teacher.quiz-rooms.store'
            )
        );
    };

    const statusClass = (
        status
    ) => {
        if (
            status === 'active'
        ) {
            return 'bg-green-100 text-green-700';
        }

        if (
            status === 'ended'
        ) {
            return 'bg-gray-200 text-gray-700';
        }

        return 'bg-amber-100 text-amber-700';
    };

    return (
        <AuthenticatedLayout>

            <Head title="Live Quiz Rooms - Quizora" />

            <div className="py-10">

                <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">

                    {/* HEADER */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                🎮 Live Quiz Rooms
                            </h1>

                            <p className="mt-2 text-gray-600">
                                Create a classroom quiz,
                                share a room code,
                                monitor students,
                                and start everyone together.
                            </p>
                        </div>

                        <Link
                            href="/dashboard"
                            className="text-indigo-600 font-medium"
                        >
                            ← Dashboard
                        </Link>

                    </div>


                    {/* ================= CREATE ROOM ================= */}

                    <div className="rounded-2xl bg-white p-6 shadow-lg">

                        <h2 className="text-xl font-semibold text-gray-900">
                            Create New Live Room
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Questions will be randomly selected
                            from the selected course.
                        </p>

                        {courses.length === 0 ? (

                            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-amber-700">
                                Create a course and add questions first.
                            </div>

                        ) : (

                            <form
                                onSubmit={submit}
                                className="mt-6 grid gap-5 md:grid-cols-2"
                            >

                                {/* COURSE */}

                                <div>
                                    <label className="block text-sm font-medium">
                                        Course
                                    </label>

                                    <select
                                        value={data.course_id}
                                        onChange={(e) => {
                                            const courseId =
                                                e.target.value;

                                            const course =
                                                courses.find(
                                                    (item) =>
                                                        String(
                                                            item.id
                                                        ) ===
                                                        String(
                                                            courseId
                                                        )
                                                );

                                            setData(
                                                'course_id',
                                                courseId
                                            );

                                            if (course) {
                                                setData(
                                                    'question_count',
                                                    Math.min(
                                                        5,
                                                        course.questions_count
                                                    )
                                                );
                                            }
                                        }}
                                        className="mt-1 w-full rounded-xl border-gray-300"
                                        required
                                    >

                                        {courses.map(
                                            (course) => (
                                                <option
                                                    key={course.id}
                                                    value={course.id}
                                                >
                                                    {course.name}
                                                    {' — '}
                                                    {course.questions_count}
                                                    {' questions'}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    {errors.course_id && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.course_id}
                                        </p>
                                    )}
                                </div>


                                {/* ROOM TITLE */}

                                <div>
                                    <label className="block text-sm font-medium">
                                        Room Title
                                    </label>

                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData(
                                                'title',
                                                e.target.value
                                            )
                                        }
                                        placeholder="DBMS Class Quiz"
                                        className="mt-1 w-full rounded-xl border-gray-300"
                                    />
                                </div>


                                {/* PREFIX */}

                                <div>
                                    <label className="block text-sm font-medium">
                                        Code Prefix
                                    </label>

                                    <input
                                        type="text"
                                        value={data.code_prefix}
                                        onChange={(e) =>
                                            setData(
                                                'code_prefix',
                                                e.target.value
                                                    .toUpperCase()
                                                    .replace(
                                                        /[^A-Z0-9]/g,
                                                        ''
                                                    )
                                                    .slice(
                                                        0,
                                                        6
                                                    )
                                            )
                                        }
                                        placeholder="DBMS"
                                        className="mt-1 w-full rounded-xl border-gray-300 uppercase"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">
                                        Example: DBMS → DBMS-4821
                                    </p>

                                    {errors.code_prefix && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.code_prefix}
                                        </p>
                                    )}
                                </div>


                                {/* QUESTION COUNT */}

                                <div>
                                    <label className="block text-sm font-medium">
                                        Number of Questions
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        max={
                                            selectedCourse
                                                ?.questions_count ||
                                            50
                                        }
                                        value={
                                            data.question_count
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'question_count',
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border-gray-300"
                                        required
                                    />

                                    {selectedCourse && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Available:{' '}
                                            {
                                                selectedCourse.questions_count
                                            }
                                            . Approximate duration:{' '}
                                            {Number(
                                                data.question_count ||
                                                    0
                                            ) *
                                                Number(
                                                    selectedCourse.time_per_question ||
                                                        0
                                                )}{' '}
                                            seconds.
                                        </p>
                                    )}

                                    {errors.question_count && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.question_count}
                                        </p>
                                    )}
                                </div>


                                {/* CREATE BUTTON */}

                                <div className="md:col-span-2">

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Creating...'
                                            : '➕ Create Live Quiz Room'}
                                    </button>

                                </div>

                            </form>
                        )}

                    </div>


                    {/* ================= ROOM LIST ================= */}

                    <div className="rounded-2xl bg-white p-6 shadow-lg">

                        <h2 className="text-xl font-semibold text-gray-900 mb-5">
                            Your Quiz Rooms
                        </h2>

                        {sessions.length === 0 ? (

                            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                                No live quiz rooms created yet.
                            </div>

                        ) : (

                            <div className="space-y-4">

                                {sessions.map(
                                    (session) => (

                                        <div
                                            key={session.id}
                                            className="flex flex-col gap-4 rounded-2xl border p-5 lg:flex-row lg:items-center lg:justify-between"
                                        >

                                            {/* ROOM INFORMATION */}

                                            <div>

                                                <div className="flex flex-wrap gap-2 items-center">

                                                    <h3 className="font-semibold text-gray-900">
                                                        {session.title}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                                            session.status
                                                        )}`}
                                                    >
                                                        {session.status}
                                                    </span>

                                                </div>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {session.course?.name}
                                                </p>

                                                <p className="font-mono font-bold text-xl text-indigo-600 mt-2">
                                                    {session.code}
                                                </p>

                                            </div>


                                            {/* STATISTICS */}

                                            <div className="flex gap-6 text-sm">

                                                <div>
                                                    <p className="font-bold text-lg">
                                                        {
                                                            session.questions_count
                                                        }
                                                    </p>

                                                    <p className="text-gray-500">
                                                        Questions
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="font-bold text-lg text-blue-700">
                                                        {
                                                            session.participants_count
                                                        }
                                                    </p>

                                                    <p className="text-gray-500">
                                                        Joined
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="font-bold text-lg text-green-700">
                                                        {
                                                            session.submitted_count
                                                        }
                                                    </p>

                                                    <p className="text-gray-500">
                                                        Submitted
                                                    </p>
                                                </div>

                                            </div>


                                            {/* OPEN ROOM */}

                                            <a
                                                href={`/teacher/live-quiz-rooms/${session.id}`}
                                                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
                                            >
                                                Open Room
                                            </a>

                                        </div>

                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}