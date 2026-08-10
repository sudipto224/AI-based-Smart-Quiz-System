import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ courses }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Manage Courses - AI Smart Quiz" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">📚 My Courses</h2>
                            <Link href={route('teacher.courses.create')} className="px-4 py-2 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow">
                                + Create Course
                            </Link>
                        </div>

                        {flash?.success && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{flash.success}</div>
                        )}

                        {courses.length === 0 ? (
                            <p className="text-gray-500">No courses found. Create your first course!</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <div key={course.id} className="border rounded-xl p-5 hover:shadow-lg transition border-gray-100 hover:border-indigo-200">
                                        <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                                        <p className="text-gray-600 text-sm">{course.description || 'No description'}</p>
                                        <p className="text-sm text-gray-500 mt-1">⏱️ {course.time_per_question} sec/question</p>
                                        <p className="text-sm text-gray-500">📝 {course.questions_count || 0} questions</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <Link href={route('teacher.questions', course.id)} className="text-sm text-indigo-600 hover:underline">Questions</Link>
                                            <Link href={route('teacher.courses.edit', course.id)} className="text-sm text-blue-600 hover:underline">Edit</Link>
                                            <Link href={route('teacher.courses.destroy', course.id)} method="delete" as="button" className="text-sm text-red-600 hover:underline" onClick={(e) => { if (!confirm('Delete this course?')) e.preventDefault(); }}>Delete</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}