import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        time_per_question: 30,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.courses.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Course - AI Smart Quiz" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Create New Course</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Time Per Question (seconds)</label>
                                <input
                                    type="number"
                                    value={data.time_per_question}
                                    onChange={(e) => setData('time_per_question', e.target.value)}
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    min="5"
                                    max="300"
                                    required
                                />
                                {errors.time_per_question && <p className="text-sm text-red-600 mt-1">{errors.time_per_question}</p>}
                            </div>

                            <div className="flex space-x-3">
                                {/* ✅ Loading State */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Course'}
                                </button>
                                <Link
                                    href={route('teacher.courses.index')}
                                    className="px-6 py-2.5 rounded-full font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}