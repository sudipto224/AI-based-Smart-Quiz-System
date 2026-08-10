import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Create({ course }) {
    const [generating, setGenerating] = useState(false);
    const [topic, setTopic] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_answer: '',
        explanation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.questions.store', course.id));
    };

    const generateWithAI = async () => {
        if (!topic.trim()) {
            alert('Please enter a topic first.');
            return;
        }

        setGenerating(true);
        try {
            const response = await axios.post(route('teacher.generate-ai-question'), {
                topic: topic,
                course_id: course.id,
            });

            const result = response.data;
            setData({
                question: result.question || '',
                option1: result.options?.[0] || '',
                option2: result.options?.[1] || '',
                option3: result.options?.[2] || '',
                option4: result.options?.[3] || '',
                correct_answer: result.correct_answer || '',
                explanation: result.explanation || '',
            });
        } catch (error) {
            alert('AI generation failed. Please try again.');
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Question - AI Smart Quiz" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add Question – {course.name}</h2>

                        {/* AI Generator Section */}
                        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                            <h3 className="font-semibold text-indigo-700 mb-2">🤖 AI Question Generator</h3>
                            <div className="flex flex-wrap gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter topic (e.g., Mobile IP)"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={generateWithAI}
                                    disabled={generating}
                                    className="px-5 py-2 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow disabled:opacity-50"
                                >
                                    {generating ? 'Generating...' : '⚡ Generate with AI'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Generate a complete MCQ with options, correct answer, and explanation.</p>
                        </div>

                        {/* Manual Form */}
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question</label>
                                <textarea value={data.question} onChange={(e) => setData('question', e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" rows="2" required />
                                {errors.question && <p className="text-sm text-red-600 mt-1">{errors.question}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700">Option 1</label><input type="text" value={data.option1} onChange={(e) => setData('option1', e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Option 2</label><input type="text" value={data.option2} onChange={(e) => setData('option2', e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Option 3</label><input type="text" value={data.option3} onChange={(e) => setData('option3', e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Option 4</label><input type="text" value={data.option4} onChange={(e) => setData('option4', e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Correct Answer (exact text)</label>
                                <input type="text" value={data.correct_answer} onChange={(e) => setData('correct_answer', e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                                {errors.correct_answer && <p className="text-sm text-red-600 mt-1">{errors.correct_answer}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Explanation</label>
                                <textarea value={data.explanation} onChange={(e) => setData('explanation', e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" rows="2" required />
                                {errors.explanation && <p className="text-sm text-red-600 mt-1">{errors.explanation}</p>}
                            </div>
                            <div className="flex space-x-3">
                                <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow disabled:opacity-50">Save Question</button>
                                <Link href={route('teacher.questions', course.id)} className="px-6 py-2.5 rounded-full font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}