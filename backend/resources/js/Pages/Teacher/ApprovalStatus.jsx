
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const information = {
    pending: {
        title: 'Your teacher application is under review',
        description:
            'Your account has been created successfully. An administrator must verify and approve your teacher application before you can manage courses, questions, or live quizzes.',
        detail: 'Please contact the Quizora administrator if you need an update.',
        icon: '⏳',
        pill: 'Pending approval',
        pillStyle: 'bg-amber-50 text-amber-700 ring-amber-200',
    },
    rejected: {
        title: 'Teacher application not approved',
        description:
            'Your teacher access request was not approved. You cannot access teacher-only features.',
        detail: 'Please contact the Quizora administrator for clarification.',
        icon: 'ℹ️',
        pill: 'Rejected',
        pillStyle: 'bg-rose-50 text-rose-700 ring-rose-200',
    },
    revoked: {
        title: 'Teacher access has been revoked',
        description:
            'Your teacher permissions are currently disabled. Teacher-only pages are unavailable.',
        detail: 'Please contact the Quizora administrator if you believe this is a mistake.',
        icon: '🔒',
        pill: 'Access revoked',
        pillStyle: 'bg-rose-50 text-rose-700 ring-rose-200',
    },
    approved: {
        title: 'Your teacher account needs activation',
        description:
            'Your application is marked approved, but teacher access is not yet active. Both approval and teacher permission are required.',
        detail: 'Please contact the Quizora administrator to complete activation.',
        icon: 'ℹ️',
        pill: 'Activation required',
        pillStyle: 'bg-amber-50 text-amber-700 ring-amber-200',
    },
};

export default function ApprovalStatus({ status = 'pending' }) {
    const { auth } = usePage().props;
    const name = auth?.user?.name || 'Teacher';
    const info = information[status] || information.pending;

    return (
        <AuthenticatedLayout>
            <Head title="Teacher Application Status - Quizora" />

            <div className="mx-auto max-w-3xl py-8 sm:py-14">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-indigo-950/5">
                    <div className="h-2 bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-400" />

                    <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl">
                            <span role="img" aria-label="Application status">{info.icon}</span>
                        </div>

                        <p className="mt-6 text-sm font-semibold text-slate-500">
                            Welcome, {name}!
                        </p>
                        <span className={`mt-4 inline-flex rounded-full px-4 py-1.5 text-xs font-bold ring-1 ${info.pillStyle}`}>
                            {info.pill}
                        </span>

                        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            {info.title}
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                            {info.description}
                        </p>

                        <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm leading-6 text-indigo-900">
                            {info.detail}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link
                                href="/"
                                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                Back to Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                            >
                                Check Status Again
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
