import React from 'react';

import {
    Head,
    Link,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Result({
    session,
    attempt,
    questions = [],
}) {
    let answers = {};

    // ===================== SAFE ANSWER PARSING =====================

    if (attempt?.answers) {
        if (
            typeof attempt.answers ===
            'string'
        ) {
            try {
                answers =
                    JSON.parse(
                        attempt.answers
                    );
            } catch (error) {
                console.error(
                    'Could not parse saved live quiz answers:',
                    error
                );

                answers = {};
            }
        } else {
            answers =
                attempt.answers;
        }
    }

    // ===================== GET STUDENT ANSWER =====================

    const getAnswer = (
        questionId
    ) => {
        return (
            answers[
                String(
                    questionId
                )
            ]
            ??
            answers[
                questionId
            ]
            ??
            null
        );
    };

    // ===================== SCORE PERCENTAGE =====================

    const totalQuestions =
        Number(
            attempt?.total_questions ||
            0
        );

    const score =
        Number(
            attempt?.score ||
            0
        );

    const percentage =
        totalQuestions > 0
            ? Math.round(
                (
                    score /
                    totalQuestions
                ) *
                    100
            )
            : 0;

    // ===================== PERFORMANCE MESSAGE =====================

    const performanceMessage =
        () => {
            if (
                percentage >=
                90
            ) {
                return 'Excellent performance!';
            }

            if (
                percentage >=
                75
            ) {
                return 'Great job!';
            }

            if (
                percentage >=
                60
            ) {
                return 'Good effort!';
            }

            if (
                percentage >=
                40
            ) {
                return 'Keep practicing!';
            }

            return 'Review the explanations and try again.';
        };

    return (
        <AuthenticatedLayout>

            <Head title="Live Quiz Result - Quizora" />


            <div className="py-10">

                <div className="mx-auto max-w-4xl space-y-7 px-4 sm:px-6 lg:px-8">


                    {/* ===================== RESULT SUMMARY ===================== */}

                    <div className="rounded-3xl bg-white p-8 text-center shadow-xl">

                        <div className="text-6xl">
                            🎉
                        </div>


                        <h1 className="mt-4 text-3xl font-black text-gray-900">
                            Live Quiz Completed
                        </h1>


                        <p className="mt-2 text-lg font-medium text-gray-700">
                            {
                                session?.title
                            }
                        </p>


                        <p className="mt-1 text-sm text-gray-500">

                            {
                                session
                                    ?.course
                                    ?.name
                            }

                            {session?.code && (
                                <>
                                    {' • '}
                                    <span className="font-mono font-semibold">
                                        {
                                            session.code
                                        }
                                    </span>
                                </>
                            )}

                        </p>


                        {/* SCORE */}

                        <div className="mt-8">

                            <p className="text-6xl font-black text-indigo-600">

                                {score}
                                {' / '}
                                {
                                    totalQuestions
                                }

                            </p>


                            <p className="mt-2 text-2xl font-bold text-gray-800">
                                {
                                    percentage
                                }
                                %
                            </p>


                            <p className="mt-2 text-gray-600">
                                {
                                    performanceMessage()
                                }
                            </p>

                        </div>


                        {/* INFO CARDS */}

                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

                            <div className="rounded-xl bg-indigo-50 p-4">

                                <p className="text-2xl font-bold text-indigo-700">
                                    {
                                        score
                                    }
                                </p>

                                <p className="text-xs font-medium text-indigo-600">
                                    Correct Answers
                                </p>

                            </div>


                            <div className="rounded-xl bg-red-50 p-4">

                                <p className="text-2xl font-bold text-red-700">

                                    {
                                        Math.max(
                                            0,
                                            totalQuestions -
                                                score
                                        )
                                    }

                                </p>

                                <p className="text-xs font-medium text-red-600">
                                    Incorrect / Unanswered
                                </p>

                            </div>


                            <div className="rounded-xl bg-purple-50 p-4">

                                <p className="text-xl font-bold text-purple-700">

                                    {
                                        attempt
                                            ?.time_taken ||
                                        '00:00:00'
                                    }

                                </p>

                                <p className="text-xs font-medium text-purple-600">
                                    Time Taken
                                </p>

                            </div>

                        </div>


                        {/* SUSPICIOUS MESSAGE */}

                        {attempt?.is_suspicious && (

                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">

                                <p className="font-semibold text-red-700">
                                    ⚠ This attempt has been marked for teacher review.
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    The system detected suspicious quiz behavior.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* ===================== DETAILED REVIEW ===================== */}

                    <div>

                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            📝 Detailed Review
                        </h2>


                        {questions.length ===
                        0 ? (

                            <div className="rounded-2xl bg-white p-8 text-center shadow">

                                <p className="text-gray-500">
                                    No question review data is available.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-5">

                                {questions.map(
                                    (
                                        question,
                                        index
                                    ) => {

                                        const selected =
                                            getAnswer(
                                                question.id
                                            );


                                        const hasAnswer =
                                            selected !==
                                                null &&
                                            selected !==
                                                undefined &&
                                            selected !==
                                                '';


                                        const isCorrect =
                                            hasAnswer &&
                                            selected ===
                                                question.correct_answer;


                                        return (

                                            <div
                                                key={
                                                    question.id
                                                }
                                                className={`rounded-2xl border-2 p-6 shadow-sm ${
                                                    isCorrect
                                                        ? 'border-green-200 bg-green-50'
                                                        : 'border-red-200 bg-red-50'
                                                }`}
                                            >

                                                {/* QUESTION NUMBER */}

                                                <div className="flex flex-wrap items-center justify-between gap-3">

                                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                                                        Question{' '}
                                                        {
                                                            index +
                                                            1
                                                        }{' '}

                                                        of{' '}
                                                        {
                                                            questions.length
                                                        }

                                                    </p>


                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            isCorrect
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >

                                                        {isCorrect
                                                            ? '✓ Correct'
                                                            : '✗ Incorrect'}

                                                    </span>

                                                </div>


                                                {/* QUESTION */}

                                                <h3 className="mt-3 text-lg font-semibold leading-relaxed text-gray-900">

                                                    {
                                                        question.question
                                                    }

                                                </h3>


                                                {/* ANSWER INFO */}

                                                <div className="mt-5 space-y-2 text-sm">

                                                    <p>

                                                        <span className="font-semibold text-gray-700">
                                                            Your answer:
                                                        </span>{' '}

                                                        <span
                                                            className={
                                                                isCorrect
                                                                    ? 'font-semibold text-green-700'
                                                                    : 'font-semibold text-red-700'
                                                            }
                                                        >

                                                            {hasAnswer
                                                                ? selected
                                                                : 'Not answered'}

                                                        </span>

                                                    </p>


                                                    {!isCorrect && (

                                                        <p>

                                                            <span className="font-semibold text-gray-700">
                                                                Correct answer:
                                                            </span>{' '}

                                                            <span className="font-semibold text-green-700">

                                                                {
                                                                    question.correct_answer
                                                                }

                                                            </span>

                                                        </p>

                                                    )}

                                                </div>


                                                {/* EXPLANATION */}

                                                <div className="mt-5 rounded-xl border border-indigo-100 bg-white p-4">

                                                    <p className="text-sm font-semibold text-indigo-700">
                                                        💡 Explanation
                                                    </p>


                                                    <p className="mt-2 text-sm leading-relaxed text-gray-700">

                                                        {
                                                            question.explanation ||
                                                            'No explanation provided.'
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </div>


                    {/* ===================== NAVIGATION ===================== */}

                    <div className="flex flex-wrap gap-3">

                        <Link
                            href="/dashboard"
                            className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700"
                        >
                            ← Dashboard
                        </Link>


                        <Link
                            href={route(
                                'student.quiz-rooms.join'
                            )}
                            className="rounded-full bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                        >
                            🎮 Join Another Live Quiz
                        </Link>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}