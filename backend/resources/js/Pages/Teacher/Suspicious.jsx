import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Suspicious({ attempts }) {
    return (
        <AuthenticatedLayout>
            <Head title="Suspicious Attempts - AI Smart Quiz" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Suspicious Attempts</h1>

                        {attempts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">No suspicious attempts found.</p>
                                <p className="text-gray-400 text-sm mt-2">When a student switches tabs or answers too quickly, they will appear here.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border">
                                    <thead>
                                        <tr className="bg-red-600 text-white">
                                            <th className="border p-2 text-left">Student</th>
                                            <th className="border p-2 text-left">Course</th>
                                            <th className="border p-2 text-left">Score</th>
                                            <th className="border p-2 text-left">Tab Switches</th>
                                            <th className="border p-2 text-left">Avg Time</th>
                                            <th className="border p-2 text-left">Attempted At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((attempt) => (
                                            <tr key={attempt.id} className="border hover:bg-gray-50">
                                                <td className="border p-2">{attempt.user?.name || 'Unknown'}</td>
                                                <td className="border p-2">{attempt.course?.name || 'N/A'}</td>
                                                <td className="border p-2">{attempt.score}/{attempt.total_questions}</td>
                                                <td className="border p-2">{attempt.tab_switch_count}</td>
                                                <td className="border p-2">{attempt.avg_time_per_question?.toFixed(1) || 'N/A'} sec</td>
                                                <td className="border p-2">{new Date(attempt.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}