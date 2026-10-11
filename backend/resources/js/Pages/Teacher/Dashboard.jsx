import React from 'react';

import {
    Head,
    Link,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function Dashboard({
    courses = [],
}) {
    return (
        <AuthenticatedLayout>

            <Head title="Teacher Dashboard - Quizora" />


            <div className="py-12">

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">


                    {/* ===================== MAIN CARD ===================== */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


                        {/* ===================== WELCOME ===================== */}

                        <h1 className="text-2xl font-bold text-gray-900 mb-6">
                            👋 Welcome, Teacher!
                        </h1>


                        {/* ===================== MAIN ACTION BUTTONS ===================== */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">


                            {/* MANAGE COURSES */}

                            <Link
                                href={route(
                                    'teacher.courses.index'
                                )}
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-md"
                            >
                                <span>
                                    📚
                                </span>

                                <span>
                                    Manage Courses
                                </span>
                            </Link>


                            {/* LIVE QUIZ ROOMS */}

                            <Link
                                href={route(
                                    'teacher.quiz-rooms.index'
                                )}
                                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                            >
                                <span>
                                    🎮
                                </span>

                                <span>
                                    Live Quiz Rooms
                                </span>
                            </Link>


                            {/* SUSPICIOUS ATTEMPTS */}

                            <Link
                                href={route(
                                    'teacher.suspicious'
                                )}
                                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-red-600 hover:shadow-md"
                            >
                                <span>
                                    🚨
                                </span>

                                <span>
                                    Suspicious Attempts
                                </span>
                            </Link>

                        </div>


                        {/* ===================== COURSE SECTION ===================== */}

                        <div>

                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Your Courses
                                </h2>


                                <Link
                                    href={route(
                                        'teacher.courses.create'
                                    )}
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                >
                                    + Add New Course
                                </Link>

                            </div>


                            {/* ===================== NO COURSES ===================== */}

                            {courses.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">

                                    <div className="text-4xl">
                                        📚
                                    </div>

                                    <p className="mt-3 font-medium text-gray-700">
                                        No courses created yet.
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Create your first course to start adding quiz questions.
                                    </p>


                                    <Link
                                        href={route(
                                            'teacher.courses.create'
                                        )}
                                        className="mt-4 inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                        Create Course
                                    </Link>

                                </div>

                            ) : (

                                <div className="space-y-2">

                                    {courses.map(
                                        (
                                            course
                                        ) => (

                                            <Link
                                                key={
                                                    course.id
                                                }
                                                href={route(
                                                    'teacher.questions',
                                                    course.id
                                                )}
                                                className="flex flex-col gap-2 rounded-lg border border-gray-200 px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50 sm:flex-row sm:items-center sm:justify-between"
                                            >

                                                <div>

                                                    <p className="font-medium text-gray-900">
                                                        {
                                                            course.name
                                                        }
                                                    </p>


                                                    {course.description && (

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {
                                                                course.description
                                                            }
                                                        </p>

                                                    )}

                                                </div>


                                                <div className="flex items-center gap-3">

                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">

                                                        {
                                                            course.questions_count ??
                                                            course.questions?.length ??
                                                            0
                                                        }{' '}

                                                        questions

                                                    </span>


                                                    <span className="text-indigo-600">
                                                        →
                                                    </span>

                                                </div>

                                            </Link>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}