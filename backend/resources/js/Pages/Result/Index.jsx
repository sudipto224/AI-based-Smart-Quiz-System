import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Result({ attempt, questions }) {
    const answers = JSON.parse(attempt.answers || '{}');

    return (
        <AuthenticatedLayout>
            <Head title={`Result - ${attempt.course.name}`} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        {/* Score */}
                        <div className="text-center border-b pb-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">🎯 Your Score</h2>
                            <p className="text-5xl font-bold text-indigo-600 mt-2">
                                {attempt.score} / {attempt.total_questions}
                            </p>
                            <p className="text-gray-500 mt-1">Time taken: {attempt.time_taken}</p>
                            {attempt.is_suspicious && (
                                <p className="mt-2 text-red-600 font-semibold">
                                    ⚠️ This attempt will be reviewed by the teacher.
                                </p>
                            )}
                        </div>

                        {/* Question-wise Breakdown */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Detailed Review</h3>
                        {questions.map((q, index) => {
                            const userAnswer = answers[q.id] || '(Not answered)';
                            const isCorrect = userAnswer === q.correct_answer;

                            return (
                                <div key={q.id} className={`p-4 mb-4 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                    <p className="font-medium text-gray-800">
                                        {index + 1}. {q.question}
                                    </p>
                                    <div className="mt-2 text-sm">
                                        <p>
                                            <span className="font-semibold">Your answer:</span>{' '}
                                            <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                                {userAnswer}
                                            </span>
                                        </p>
                                        {!isCorrect && (
                                            <p>
                                                <span className="font-semibold">Correct answer:</span>{' '}
                                                <span className="text-green-700">{q.correct_answer}</span>
                                            </p>
                                        )}
                                        <p className="text-gray-600 mt-1">{q.explanation}</p>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="mt-6 flex justify-center">
                            <Link href={route('leaderboard.show', attempt.course_id)} className="px-6 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md">
                                🏆 View Leaderboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}