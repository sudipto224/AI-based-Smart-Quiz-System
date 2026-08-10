import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ courses }) {
    return (
        <AuthenticatedLayout>
            <Head title="Teacher Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">👋 Welcome, Teacher!</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link href={route('teacher.courses.index')} className="bg-blue-500 text-white p-4 rounded text-center hover:bg-blue-600">
                                    📚 Manage Courses
                                </Link>
                                <Link href={route('teacher.suspicious')} className="bg-red-500 text-white p-4 rounded text-center hover:bg-red-600">
                                    🚨 Suspicious Attempts
                                </Link>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold mb-2">Your Courses</h2>
                                {courses.length === 0 ? (
                                    <p className="text-gray-500">No courses created yet.</p>
                                ) : (
                                    courses.map(course => (
                                        <div key={course.id} className="border p-2 rounded mb-1">
                                            {course.name} ({course.questions_count || 0} questions)
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}