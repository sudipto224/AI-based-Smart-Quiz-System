import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MaterialPreview({ course, questions }) {
    const [localQuestions, setLocalQuestions] = useState(questions);
    const { data, setData, post, processing } = useForm({ questions });

    useEffect(() => {
        setData('questions', localQuestions);
    }, [localQuestions]);

    const removeQuestion = (index) => {
        setLocalQuestions((current) => current.filter((_, idx) => idx !== index));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.material-generator.save', course.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Generated Questions - ${course.name}`} />
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Generated Questions – {course.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">Review the generated questions and remove any you do not want to save.</p>
                            </div>
                            <Link href={route('teacher.questions', course.id)} className="px-4 py-2 rounded-full text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Back to Questions</Link>
                        </div>

                        {localQuestions.length === 0 ? (
                            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-800">No questions are left to save. Please go back and generate again.</div>
                        ) : (
                            <div className="space-y-6">
                                {localQuestions.map((question, index) => (
                                    <div key={index} className="rounded-2xl border p-6 shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-indigo-600">Question {index + 1}</p>
                                                <p className="mt-2 text-lg font-medium text-gray-800">{question.question}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="mt-4 space-y-2 text-gray-700">
                                            {question.options.map((option, optionIndex) => (
                                                <p key={optionIndex} className="pl-4">{option}</p>
                                            ))}
                                            <p className="mt-3 text-sm text-green-700"><strong>Correct Answer:</strong> {question.correct_answer}</p>
                                            <p className="mt-2 text-sm text-gray-600"><strong>Explanation:</strong> {question.explanation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-8">
                            <input type="hidden" name="questions" value={JSON.stringify(localQuestions)} />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <Link href={route('teacher.questions', course.id)} className="px-4 py-2 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition text-center">Cancel</Link>
                                <button
                                    type="submit"
                                    disabled={processing || localQuestions.length === 0}
                                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-indigo-300"
                                >
                                    {processing ? 'Saving Questions...' : 'Save All Questions'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
