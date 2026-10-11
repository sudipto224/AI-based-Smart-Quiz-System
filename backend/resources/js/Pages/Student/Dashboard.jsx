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

            <Head title="Student Dashboard - Quizora" />


            <div className="py-6 sm:py-12">

                <div className="w-full max-w-6xl mx-auto">


                    {/* ===================== MAIN CARD ===================== */}

                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full overflow-hidden">


                        {/* ===================== WELCOME ===================== */}

                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">

                            👋 Welcome, Student!

                        </h1>


                        <p className="mt-2 text-sm sm:text-base text-gray-500">

                            Choose a course to start a quiz or join a live classroom quiz.

                        </p>



                        {/* ===================== LIVE QUIZ BUTTON ===================== */}

                        <div className="mt-6 mb-8">


                            <Link

                                href={route(
                                    'student.quiz-rooms.join'
                                )}

                                className="group flex w-full items-center justify-between rounded-2xl bg-indigo-600 px-4 sm:px-6 py-4 sm:py-5 text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg"

                            >


                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">


                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl sm:text-2xl">

                                        🎮

                                    </div>



                                    <div className="min-w-0">


                                        <p className="text-base sm:text-lg font-bold">

                                            Join Live Quiz

                                        </p>



                                        <p className="mt-1 text-xs sm:text-sm text-indigo-100 break-words">

                                            Enter the room code provided by your teacher.

                                        </p>


                                    </div>


                                </div>



                                <div className="hidden sm:block text-2xl transition group-hover:translate-x-1">

                                    →

                                </div>



                            </Link>


                        </div>




                        {/* ===================== AVAILABLE COURSES ===================== */}


                        <div>


                            <h2 className="text-lg font-semibold text-gray-900 mb-4">

                                Available Courses

                            </h2>




                            {courses.length === 0 ? (


                                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">


                                    <div className="text-4xl">

                                        📚

                                    </div>



                                    <p className="mt-3 font-medium text-gray-700">

                                        No courses are available yet.

                                    </p>



                                    <p className="mt-1 text-sm text-gray-500">

                                        Your teacher has not created any courses yet.

                                    </p>


                                </div>



                            ) : (



                                <div className="space-y-4">



                                    {courses.map((course) => (



                                        <div

                                            key={course.id}

                                            className="rounded-xl border border-gray-200 p-4 sm:p-5 transition hover:border-indigo-200 hover:shadow-sm overflow-hidden"

                                        >



                                            {/* COURSE NAME */}


                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">

                                                {course.name}

                                            </h3>





                                            {/* DESCRIPTION */}


                                            {course.description && (


                                                <p className="mt-1 text-sm sm:text-base text-gray-600 break-words">

                                                    {course.description}

                                                </p>


                                            )}




                                            {/* TIMER */}


                                            <p className="mt-2 text-sm text-gray-500">


                                                ⏱ {course.time_per_question} sec/question


                                            </p>





                                            {/* ACTION BUTTONS */}


                                            <div className="mt-4 flex flex-wrap gap-3">



                                                <Link

                                                    href={route(
                                                        'quiz.show',
                                                        course.id
                                                    )}

                                                    className="rounded-lg bg-indigo-600 px-4 sm:px-5 py-2.5 text-sm sm:text-base font-medium text-white transition hover:bg-indigo-700"

                                                >

                                                    Start Quiz

                                                </Link>





                                                <Link

                                                    href={route(
                                                        'leaderboard.show',
                                                        course.id
                                                    )}

                                                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 sm:px-5 py-2.5 text-sm sm:text-base font-medium text-indigo-700 transition hover:bg-indigo-100"

                                                >

                                                    🏆 Leaderboard

                                                </Link>



                                            </div>




                                        </div>



                                    ))}



                                </div>



                            )}




                        </div>



                    </div>



                </div>



            </div>



        </AuthenticatedLayout>

    );

}