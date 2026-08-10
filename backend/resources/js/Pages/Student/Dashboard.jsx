import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ courses }) {
    return (
        <AuthenticatedLayout>
            <Head title="Student Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">👋 Welcome, Student!</h1>
                            {courses.length === 0 ? (
                                <p className="text-gray-500">No courses available.</p>
                            ) : (
                                courses.map(course => (
                                    <div key={course.id} className="border p-4 rounded mb-3">
                                        <h3 className="text-lg font-semibold">{course.name}</h3>
                                        <p className="text-gray-600">{course.description}</p>
                                        <p className="text-sm text-gray-500">⏱️ {course.time_per_question} sec/question</p>
                                        <Link href={route('quiz.show', course.id)} className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                                            Start Quiz
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}