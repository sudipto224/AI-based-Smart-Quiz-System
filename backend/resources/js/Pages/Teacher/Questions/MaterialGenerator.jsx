import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MaterialGenerator({ course }) {
    const { data, setData, post, processing, errors } = useForm({
        material: null,
        question_count: '5',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('teacher.material-generator.generate', course.id), {
            preserveState: true,
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Generate Quiz from Material - ${course.name}`} />
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">📄 Generate Quiz from Material – {course.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">Upload a PDF or PPTX file and generate AI questions from the course material.</p>
                            </div>
                            <Link href={route('teacher.questions', course.id)} className="px-4 py-2 rounded-full text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Back to Questions</Link>
                        </div>

                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Choose PDF / PPTX</label>
                                <input
                                    type="file"
                                    accept=".pdf,.pptx"
                                    onChange={(event) => setData('material', event.target.files?.[0] ?? null)}
                                    className="mt-2 block w-full text-sm text-gray-700 file:border file:rounded-lg file:px-4 file:py-2 file:bg-indigo-50 file:text-indigo-700"
                                />
                                {errors.material && <p className="mt-2 text-sm text-red-600">{errors.material}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    {[5, 10].map((count) => (
                                        <label key={count} className="cursor-pointer rounded-xl border p-4 text-center hover:border-indigo-500 transition">
                                            <input
                                                type="radio"
                                                name="question_count"
                                                value={count}
                                                checked={data.question_count === String(count)}
                                                onChange={(event) => setData('question_count', event.target.value)}
                                                className="mr-2"
                                            />
                                            {count} Questions
                                        </label>
                                    ))}
                                </div>
                                {errors.question_count && <p className="mt-2 text-sm text-red-600">{errors.question_count}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <Link href={route('teacher.questions', course.id)} className="px-4 py-2 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition text-center">Cancel</Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-indigo-300"
                                >
                                    {processing ? 'Generating Questions...' : '🤖 Generate with AI'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
