import React, {
    useEffect,
    useState,
} from 'react';

import {
    Head,
    router,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import axios from 'axios';

export default function Waiting({
    session,
}) {
    const [
        participantCount,
        setParticipantCount,
    ] = useState(
        session.participant_count ||
            1
    );

    const [
        message,
        setMessage,
    ] = useState(
        'Waiting for your teacher to start the quiz...'
    );

    useEffect(() => {
        let mounted = true;

        const check =
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

                    setParticipantCount(
                        response.data
                            .participant_count ||
                            0
                    );

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
                        setMessage(
                            'Quiz started! Opening quiz...'
                        );

                        router.visit(
                            route(
                                'student.quiz-rooms.quiz',
                                session.id
                            )
                        );

                        return;
                    }

                    if (
                        response.data
                            .status ===
                        'ended'
                    ) {
                        setMessage(
                            'This live quiz has ended.'
                        );

                        setTimeout(
                            () =>
                                router.visit(
                                    route(
                                        'student.quiz-rooms.join'
                                    )
                                ),
                            1200
                        );
                    }

                } catch (error) {
                    console.error(
                        error
                    );
                }
            };

        check();

        const timer =
            setInterval(
                check,
                2000
            );

        return () => {
            mounted = false;

            clearInterval(
                timer
            );
        };

    }, [session.id]);

    return (
        <AuthenticatedLayout>

            <Head title="Waiting Room - Quizora" />

            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

                    <div className="text-6xl">
                        ⏳
                    </div>

                    <h1 className="mt-4 text-3xl font-black">
                        You're in!
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {
                            session.title
                        }
                    </p>

                    <p className="text-sm text-gray-500">
                        {
                            session.course
                                ?.name
                        }
                    </p>

                    <div className="mt-7 rounded-2xl bg-indigo-50 p-6">

                        <p className="text-xs uppercase tracking-widest text-gray-500">
                            Room Code
                        </p>

                        <p className="mt-2 font-mono text-4xl font-black text-indigo-600 tracking-widest">
                            {
                                session.code
                            }
                        </p>

                    </div>

                    <p className="mt-6 font-semibold">
                        👥{' '}
                        {
                            participantCount
                        }{' '}
                        {participantCount ===
                        1
                            ? 'student'
                            : 'students'}{' '}
                        joined
                    </p>

                    <div className="mx-auto mt-7 h-11 w-11 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                    <p className="mt-5 font-medium text-indigo-700">
                        {
                            message
                        }
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Keep this page open. It checks the room every 2 seconds.
                    </p>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}