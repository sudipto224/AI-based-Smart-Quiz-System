import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Leaderboard({ course, leaderboard }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Leaderboard - ${course.name}`} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                            🏆 Leaderboard – {course.name}
                        </h2>
                        <p className="text-center text-gray-500 text-sm mb-6">
                            Top 10 students (suspicious attempts excluded)
                        </p>

                        {leaderboard.length === 0 ? (
                            <p className="text-center text-gray-500">No attempts yet. Be the first!</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-indigo-600 text-white">
                                            <th className="px-4 py-2 rounded-l-xl text-left">#</th>
                                            <th className="px-4 py-2 text-left">Student</th>
                                            <th className="px-4 py-2 text-center">Score</th>
                                            <th className="px-4 py-2 rounded-r-xl text-center">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((attempt, index) => {
                                            const isCurrentUser = attempt.user_id === window?.Laravel?.user?.id;
                                            return (
                                                <tr
                                                    key={attempt.id}
                                                    className={`border-b ${isCurrentUser ? 'bg-indigo-50 font-semibold' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="px-4 py-3 text-left">{index + 1}</td>
                                                    <td className="px-4 py-3 text-left">{attempt.user.name}</td>
                                                    <td className="px-4 py-3 text-center">{attempt.score}/{attempt.total_questions}</td>
                                                    <td className="px-4 py-3 text-center">{attempt.time_taken}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link href={route('dashboard')} className="text-indigo-600 hover:underline">
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}