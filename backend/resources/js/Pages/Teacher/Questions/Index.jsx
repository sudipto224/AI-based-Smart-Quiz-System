import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ course, questions }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title={`Questions - ${course.name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">❓ Questions – {course.name}</h2>
                            <Link href={route('teacher.questions.create', course.id)} className="px-4 py-2 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow">+ Add Question</Link>
                        </div>

                        {flash?.success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{flash.success}</div>}

                        {questions.length === 0 ? (
                            <p className="text-gray-500">No questions yet. Add your first question!</p>
                        ) : (
                            <div className="space-y-4">
                                {questions.map((q, index) => (
                                    <div key={q.id} className="border rounded-xl p-4 hover:shadow transition">
                                        <p className="font-medium text-gray-800">{index+1}. {q.question}</p>
                                        <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-2">
                                            <span>✅ {q.correct_answer}</span>
                                            <Link href={route('teacher.questions.edit', q.id)} className="text-blue-600 hover:underline">Edit</Link>
                                            <Link href={route('teacher.questions.destroy', q.id)} method="delete" as="button" className="text-red-600 hover:underline" onClick={(e) => { if (!confirm('Delete this question?')) e.preventDefault(); }}>Delete</Link>
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