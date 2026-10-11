import React, { useEffect, useState } from 'react';
import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Show({ session }) {
    const [room, setRoom] = useState(session);

    const [copyText, setCopyText] =
        useState('Copy Code');

    // ===================== LIVE ROOM REFRESH =====================

    useEffect(() => {
        let mounted = true;

        const refreshRoom = async () => {
            try {
                const response = await axios.get(
                    route(
                        'teacher.quiz-rooms.status',
                        session.id
                    )
                );

                if (mounted) {
                    setRoom(response.data);
                }
            } catch (error) {
                console.error(
                    'Could not refresh live room:',
                    error
                );
            }
        };

        // First refresh immediately
        refreshRoom();

        // Then refresh every 2 seconds
        const timer = setInterval(
            refreshRoom,
            2000
        );

        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [session.id]);


    // ===================== START QUIZ =====================

    const startQuiz = () => {
        const confirmed = confirm(
            'Start this live quiz now? All joined students will begin together.'
        );

        if (!confirmed) {
            return;
        }

        router.post(
            route(
                'teacher.quiz-rooms.start',
                session.id
            ),
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    console.log(
                        'Live quiz started.'
                    );
                },

                onError: (errors) => {
                    console.error(
                        errors
                    );

                    alert(
                        errors.session ||
                        'Could not start the quiz.'
                    );
                },
            }
        );
    };


    // ===================== END QUIZ =====================

    const endQuiz = () => {
        const confirmed = confirm(
            'Are you sure you want to end this live quiz?'
        );

        if (!confirmed) {
            return;
        }

        router.post(
            route(
                'teacher.quiz-rooms.end',
                session.id
            ),
            {},
            {
                preserveScroll: true,

                onError: (errors) => {
                    console.error(
                        errors
                    );

                    alert(
                        errors.session ||
                        'Could not end the quiz.'
                    );
                },
            }
        );
    };


    // ===================== COPY ROOM CODE =====================

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(
                room.code
            );

            setCopyText('Copied!');

            setTimeout(() => {
                setCopyText(
                    'Copy Code'
                );
            }, 1500);
        } catch (error) {
            console.error(
                'Could not copy room code:',
                error
            );
        }
    };


    // ===================== FORMAT TIMER =====================

    const formatTime = (seconds) => {
        const value = Math.max(
            0,
            Number(seconds || 0)
        );

        const minutes =
            Math.floor(
                value / 60
            );

        const remainingSeconds =
            value % 60;

        return `${String(minutes).padStart(
            2,
            '0'
        )}:${String(
            remainingSeconds
        ).padStart(2, '0')}`;
    };


    // ===================== STATUS STYLE =====================

    const statusClass = (status) => {
        if (status === 'active') {
            return 'bg-green-100 text-green-700';
        }

        if (status === 'ended') {
            return 'bg-gray-200 text-gray-700';
        }

        return 'bg-amber-100 text-amber-700';
    };


    return (
        <AuthenticatedLayout>

            <Head title="Live Quiz Room - Quizora" />

            <div className="py-10">

                <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* ===================== BACK ===================== */}

                    <Link
                        href={route(
                            'teacher.quiz-rooms.index'
                        )}
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        ← Back to Live Quiz Rooms
                    </Link>


                    {/* ===================== ROOM HEADER ===================== */}

                    <div className="rounded-3xl bg-white p-8 text-center shadow-xl">

                        <span
                            className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${statusClass(
                                room.status
                            )}`}
                        >
                            {String(
                                room.status || 'waiting'
                            ).toUpperCase()}
                        </span>


                        <p className="mt-6 text-sm uppercase tracking-widest text-gray-500">
                            Student Join Code
                        </p>


                        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">

                            <h1 className="font-mono text-4xl font-black tracking-widest text-indigo-600 sm:text-5xl">
                                {room.code}
                            </h1>

                            <button
                                type="button"
                                onClick={copyCode}
                                className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                            >
                                📋 {copyText}
                            </button>

                        </div>


                        <h2 className="mt-6 text-2xl font-bold text-gray-900">
                            {room.title}
                        </h2>

                        <p className="mt-1 text-gray-500">
                            {room.course?.name ||
                                'Course'}
                        </p>


                        {/* ===================== STATISTICS ===================== */}

                        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">

                            {/* QUESTIONS */}

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-2xl font-bold text-gray-900">
                                    {room.questions_count ??
                                        0}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Questions
                                </p>

                            </div>


                            {/* JOINED */}

                            <div className="rounded-xl bg-blue-50 p-4">

                                <p className="text-2xl font-bold text-blue-700">
                                    {room.participant_count ??
                                        0}
                                </p>

                                <p className="text-xs text-blue-600">
                                    Joined
                                </p>

                            </div>


                            {/* SUBMITTED */}

                            <div className="rounded-xl bg-green-50 p-4">

                                <p className="text-2xl font-bold text-green-700">
                                    {room.submitted_count ??
                                        0}
                                </p>

                                <p className="text-xs text-green-600">
                                    Submitted
                                </p>

                            </div>


                            {/* TIMER */}

                            <div className="rounded-xl bg-purple-50 p-4">

                                <p className="text-2xl font-bold text-purple-700">

                                    {room.status === 'active'
                                        ? formatTime(
                                            room.remaining_seconds
                                        )
                                        : room.status ===
                                          'waiting'
                                        ? 'Ready'
                                        : '00:00'}

                                </p>

                                <p className="text-xs text-purple-600">
                                    Remaining
                                </p>

                            </div>

                        </div>


                        {/* ===================== CONTROL BUTTON ===================== */}

                        <div className="mt-7">

                            {room.status ===
                                'waiting' && (

                                <button
                                    type="button"
                                    onClick={
                                        startQuiz
                                    }
                                    className="rounded-full bg-green-600 px-8 py-3 font-bold text-white shadow hover:bg-green-700"
                                >
                                    ▶ Start Quiz
                                </button>

                            )}


                            {room.status ===
                                'active' && (

                                <button
                                    type="button"
                                    onClick={
                                        endQuiz
                                    }
                                    className="rounded-full bg-red-600 px-8 py-3 font-bold text-white shadow hover:bg-red-700"
                                >
                                    ■ End Quiz
                                </button>

                            )}


                            {room.status ===
                                'ended' && (

                                <div className="inline-block rounded-full bg-gray-100 px-6 py-3 font-semibold text-gray-600">
                                    Quiz Ended
                                </div>

                            )}

                        </div>

                    </div>


                    {/* ===================== PARTICIPANTS ===================== */}

                    <div className="rounded-3xl bg-white p-6 shadow-lg">

                        <div className="flex flex-wrap items-center justify-between gap-3">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    👥 Participants
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Student status updates automatically every 2 seconds.
                                </p>

                            </div>


                            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">

                                {room.participant_count ??
                                    0}{' '}

                                {(room.participant_count ??
                                    0) === 1
                                    ? 'Student'
                                    : 'Students'}

                            </span>

                        </div>


                        {/* NO PARTICIPANTS */}

                        {!room.participants ||
                        room.participants.length ===
                            0 ? (

                            <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-8 text-center">

                                <div className="text-4xl">
                                    👤
                                </div>

                                <p className="mt-3 font-medium text-gray-700">
                                    Waiting for students...
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Share room code{' '}
                                    <strong>
                                        {room.code}
                                    </strong>{' '}
                                    with your students.
                                </p>

                            </div>

                        ) : (

                            <div className="mt-5 overflow-x-auto">

                                <table className="min-w-full divide-y divide-gray-200">

                                    <thead>

                                        <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                                            <th className="px-3 py-3">
                                                Student
                                            </th>

                                            <th className="px-3 py-3">
                                                Status
                                            </th>

                                            <th className="px-3 py-3">
                                                Score
                                            </th>

                                            <th className="px-3 py-3">
                                                Time
                                            </th>

                                            <th className="px-3 py-3">
                                                Review
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {room.participants.map(
                                            (
                                                student
                                            ) => (

                                                <tr
                                                    key={
                                                        student.id
                                                    }
                                                >

                                                    {/* STUDENT */}

                                                    <td className="px-3 py-4">

                                                        <p className="font-semibold text-gray-900">
                                                            {student.name}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {student.email}
                                                        </p>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="px-3 py-4">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                student.submitted
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : student.started_at
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-amber-100 text-amber-700'
                                                            }`}
                                                        >

                                                            {student.submitted
                                                                ? 'Submitted'
                                                                : student.started_at
                                                                ? 'Taking Quiz'
                                                                : 'Joined'}

                                                        </span>

                                                    </td>


                                                    {/* SCORE */}

                                                    <td className="px-3 py-4 font-semibold text-gray-800">

                                                        {student.submitted
                                                            ? `${student.score ?? 0} / ${student.total_questions ?? 0}`
                                                            : '—'}

                                                    </td>


                                                    {/* TIME */}

                                                    <td className="px-3 py-4 text-gray-700">

                                                        {student.time_taken ||
                                                            '—'}

                                                    </td>


                                                    {/* REVIEW */}

                                                    <td className="px-3 py-4">

                                                        {student.submitted ? (

                                                            student.is_suspicious ? (

                                                                <span className="text-xs font-semibold text-red-700">
                                                                    ⚠ Suspicious
                                                                </span>

                                                            ) : (

                                                                <span className="text-xs font-semibold text-green-700">
                                                                    ✓ Normal
                                                                </span>

                                                            )

                                                        ) : (

                                                            <span className="text-gray-400">
                                                                —
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}