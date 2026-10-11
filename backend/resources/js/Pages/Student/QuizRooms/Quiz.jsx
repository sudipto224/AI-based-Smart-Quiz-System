import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    Head,
    router,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import axios from 'axios';

export default function Quiz({
    session,
    course,
    questions,
    remaining_seconds,
}) {
    const storageKey =
        `quizora-live-${session.id}-answers`;

    const [
        answers,
        setAnswers,
    ] = useState(() => {
        try {
            const saved =
                sessionStorage.getItem(
                    storageKey
                );

            return saved
                ? JSON.parse(
                    saved
                )
                : {};

        } catch {
            return {};
        }
    });

    const [
        timeLeft,
        setTimeLeft,
    ] = useState(
        Math.max(
            0,
            Number(
                remaining_seconds ||
                    0
            )
        )
    );

    const [
        tabSwitchCount,
        setTabSwitchCount,
    ] = useState(0);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        submissionError,
        setSubmissionError,
    ] = useState('');

    const answersRef =
        useRef(
            answers
        );

    const tabSwitchRef =
        useRef(0);

    const submittedRef =
        useRef(false);

    useEffect(() => {
        answersRef.current =
            answers;

        try {
            sessionStorage.setItem(
                storageKey,
                JSON.stringify(
                    answers
                )
            );
        } catch {
            //
        }

    }, [
        answers,
        storageKey,
    ]);

    const submitQuiz =
        useCallback(
            () => {
                if (
                    submittedRef.current
                ) {
                    return;
                }

                submittedRef.current =
                    true;

                setSubmitting(true);

                setSubmissionError('');

                router.post(
                    route(
                        'student.quiz-rooms.submit',
                        session.id
                    ),
                    {
                        answers:
                            answersRef.current,

                        tab_switch_count:
                            tabSwitchRef.current,
                    },
                    {
                        preserveScroll:
                            true,

                        onSuccess:
                            () => {
                                try {
                                    sessionStorage.removeItem(
                                        storageKey
                                    );
                                } catch {
                                    //
                                }
                            },

                        onError:
                            (
                                errors
                            ) => {
                                submittedRef.current =
                                    false;

                                setSubmitting(
                                    false
                                );

                                setSubmissionError(
                                    errors.quiz ||
                                        'Submission failed. Please try again.'
                                );
                            },
                    }
                );
            },

            [
                session.id,
                storageKey,
            ]
        );

    // countdown
    useEffect(() => {
        const timer =
            setInterval(
                () => {
                    setTimeLeft(
                        (
                            current
                        ) => {
                            if (
                                current <=
                                1
                            ) {
                                clearInterval(
                                    timer
                                );

                                setTimeout(
                                    () =>
                                        submitQuiz(),
                                    0
                                );

                                return 0;
                            }

                            return (
                                current -
                                1
                            );
                        }
                    );
                },
                1000
            );

        return () =>
            clearInterval(
                timer
            );

    }, [
        submitQuiz,
    ]);

    // synchronize with teacher room
    useEffect(() => {
        let mounted = true;

        const sync =
            async () => {
                try {
                    const response =
                        await axios.get(
                            route(
                                'student.quiz-rooms.status',
                                session.id
                            )
                        );

                    if (!mounted) {
                        return;
                    }

                    if (
                        response.data
                            .submitted &&
                        response.data
                            .result_url
                    ) {
                        router.visit(
                            response.data
                                .result_url
                        );

                        return;
                    }

                    if (
                        response.data
                            .status ===
                        'active'
                    ) {
                        setTimeLeft(
                            Math.max(
                                0,
                                Number(
                                    response.data
                                        .remaining_seconds ||
                                        0
                                )
                            )
                        );
                    }

                    if (
                        response.data
                            .status ===
                        'ended'
                    ) {
                        setTimeLeft(
                            0
                        );

                        submitQuiz();
                    }

                } catch (error) {
                    console.error(
                        error
                    );
                }
            };

        const timer =
            setInterval(
                sync,
                2000
            );

        return () => {
            mounted = false;

            clearInterval(
                timer
            );
        };

    }, [
        session.id,
        submitQuiz,
    ]);

    // tab switch tracking
    useEffect(() => {
        const handler =
            () => {
                if (
                    document.hidden
                ) {
                    tabSwitchRef.current +=
                        1;

                    setTabSwitchCount(
                        tabSwitchRef.current
                    );
                }
            };

        document.addEventListener(
            'visibilitychange',
            handler
        );

        return () =>
            document.removeEventListener(
                'visibilitychange',
                handler
            );

    }, []);

    const choose = (
        questionId,
        option
    ) => {
        setAnswers(
            (
                current
            ) => ({
                ...current,

                [questionId]:
                    option,
            })
        );
    };

    const formatTime = (
        seconds
    ) => {
        const value =
            Math.max(
                0,
                Number(
                    seconds || 0
                )
            );

        const minutes =
            Math.floor(
                value / 60
            );

        const remaining =
            value % 60;

        return `${String(
            minutes
        ).padStart(
            2,
            '0'
        )}:${String(
            remaining
        ).padStart(
            2,
            '0'
        )}`;
    };

    const answeredCount =
        Object.values(
            answers
        ).filter(
            Boolean
        ).length;

    return (
        <AuthenticatedLayout>

            <Head title="Live Quiz - Quizora" />

            <div className="py-8">

                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                    <div className="sticky top-3 z-20 mb-6 rounded-2xl bg-white p-5 shadow-lg">

                        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">

                            <div>

                                <div className="flex gap-2 items-center">

                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                                        LIVE
                                    </span>

                                    <span className="font-mono text-xs text-gray-500">
                                        {
                                            session.code
                                        }
                                    </span>

                                </div>

                                <h1 className="mt-2 text-2xl font-bold">
                                    {
                                        session.title
                                    }
                                </h1>

                                <p className="text-sm text-gray-500">
                                    {
                                        course.name
                                    }
                                </p>

                            </div>

                            <div className="flex gap-3 items-center">

                                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
                                    {
                                        answeredCount
                                    }
                                    /
                                    {
                                        questions.length
                                    }{' '}
                                    answered
                                </span>

                                <span
                                    className={`rounded-full px-5 py-2 text-xl font-black ${
                                        timeLeft <=
                                        30
                                            ? 'animate-pulse bg-red-100 text-red-700'
                                            : 'bg-indigo-100 text-indigo-700'
                                    }`}
                                >
                                    ⏱{' '}
                                    {
                                        formatTime(
                                            timeLeft
                                        )
                                    }
                                </span>

                            </div>

                        </div>

                        {tabSwitchCount >
                            0 && (
                            <p className="mt-3 text-sm font-semibold text-red-600">
                                ⚠ Tab switches detected:{' '}
                                {
                                    tabSwitchCount
                                }
                            </p>
                        )}

                    </div>

                    {submissionError && (
                        <div className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">
                            {
                                submissionError
                            }
                        </div>
                    )}

                    <div className="space-y-6">

                        {questions.map(
                            (
                                question,
                                index
                            ) => {
                                const options =
                                    [
                                        question.option1,
                                        question.option2,
                                        question.option3,
                                        question.option4,
                                    ];

                                return (
                                    <div
                                        key={
                                            question.id
                                        }
                                        className="rounded-2xl bg-white p-6 shadow"
                                    >

                                        <p className="text-xs font-bold uppercase text-indigo-600">
                                            Question{' '}
                                            {index +
                                                1}{' '}
                                            of{' '}
                                            {
                                                questions.length
                                            }
                                        </p>

                                        <h2 className="mt-2 text-lg font-semibold leading-relaxed">
                                            {
                                                question.question
                                            }
                                        </h2>

                                        <div className="mt-5 space-y-3">

                                            {options.map(
                                                (
                                                    option,
                                                    optionIndex
                                                ) => {
                                                    const selected =
                                                        answers[
                                                            question
                                                                .id
                                                        ] ===
                                                        option;

                                                    return (
                                                        <label
                                                            key={
                                                                optionIndex
                                                            }
                                                            className={`flex cursor-pointer items-start rounded-xl border-2 p-4 ${
                                                                selected
                                                                    ? 'border-indigo-500 bg-indigo-50'
                                                                    : 'border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                        >

                                                            <input
                                                                type="radio"
                                                                name={`q-${question.id}`}
                                                                checked={
                                                                    selected
                                                                }
                                                                onChange={() =>
                                                                    choose(
                                                                        question.id,
                                                                        option
                                                                    )
                                                                }
                                                                className="mt-1"
                                                            />

                                                            <span className="ml-3">
                                                                {
                                                                    option
                                                                }
                                                            </span>

                                                        </label>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    <div className="mt-8 rounded-2xl bg-white p-5 shadow">

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                            <div>
                                <p className="font-semibold">
                                    Ready to finish?
                                </p>

                                <p className="text-sm text-gray-500">
                                    You answered{' '}
                                    {
                                        answeredCount
                                    }{' '}
                                    of{' '}
                                    {
                                        questions.length
                                    }.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={
                                    submitting
                                }
                                onClick={() => {
                                    if (
                                        confirm(
                                            'Submit your live quiz now?'
                                        )
                                    ) {
                                        submitQuiz();
                                    }
                                }}
                                className="rounded-full bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {submitting
                                    ? 'Submitting...'
                                    : 'Submit Quiz'}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}