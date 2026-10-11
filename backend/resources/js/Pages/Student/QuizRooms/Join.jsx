import React from 'react';

import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Join() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(
            route(
                'student.quiz-rooms.join.submit'
            )
        );
    };

    return (
        <AuthenticatedLayout>

            <Head title="Join Live Quiz - Quizora" />

            <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">

                <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">

                    <div className="text-6xl">
                        🎮
                    </div>

                    <h1 className="mt-4 text-3xl font-black">
                        Join Live Quiz
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Enter the room code provided by your teacher.
                    </p>

                    <form
                        onSubmit={
                            submit
                        }
                        className="mt-8"
                    >

                        <input
                            type="text"
                            value={
                                data.code
                            }
                            onChange={(e) =>
                                setData(
                                    'code',
                                    e.target.value
                                        .toUpperCase()
                                        .replace(
                                            /[^A-Z0-9-]/g,
                                            ''
                                        )
                                        .slice(
                                            0,
                                            20
                                        )
                                )
                            }
                            placeholder="DBMS-4821"
                            className="w-full rounded-2xl border-2 px-5 py-4 text-center font-mono text-2xl font-black uppercase tracking-widest"
                            autoFocus
                            required
                        />

                        {errors.code && (
                            <p className="mt-3 text-sm text-red-600">
                                {
                                    errors.code
                                }
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={
                                processing
                            }
                            className="mt-5 w-full rounded-full bg-indigo-600 px-6 py-3.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing
                                ? 'Joining...'
                                : 'Join Quiz Room'}
                        </button>

                    </form>

                    <div className="mt-7 rounded-xl bg-indigo-50 p-4 text-left text-sm text-gray-600">

                        <p className="font-semibold text-indigo-700">
                            How it works
                        </p>

                        <p className="mt-1">
                            You will enter a waiting room.
                            When the teacher starts the quiz,
                            your quiz will open automatically.
                        </p>

                    </div>

                    <Link
                        href="/dashboard"
                        className="inline-block mt-6 text-sm text-gray-500"
                    >
                        ← Dashboard
                    </Link>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}