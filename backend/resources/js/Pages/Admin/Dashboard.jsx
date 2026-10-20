
import React, { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function Icon({ name, className = 'h-5 w-5' }) {
    const paths = {
        users: <>
            <circle cx="9" cy="8" r="3"/>
            <path d="M3 20v-2a6 6 0 0 1 12 0v2H3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1"/>
        </>,
        shield: <>
            <path d="m12 2 8 4v6c0 5-3 8.5-8 10-5-1.5-8-5-8-10V6l8-4Z"/>
            <path d="m9 12 2 2 4-4"/>
        </>,
        clock: <>
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 2"/>
        </>,
        check: <path d="m5 12 4 4 10-10" />,
        close: <path d="M5 5l14 14M19 5 5 19" />,
        search: <>
            <circle cx="11" cy="11" r="7"/>
            <path d="m16 16 5 5"/>
        </>,
        lock: <>
            <rect x="4" y="10" width="16" height="11" rx="2"/>
            <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
        </>,
        layers: <>
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <path d="M8 9h8M8 13h8M8 17h5"/>
        </>,
    };

    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name] || paths.shield}
        </svg>
    );
}

function Stat({ icon, title, value, helper }) {
    return (
        <div className="rounded-[20px] border border-[#E6E3DD] bg-white p-5 shadow-[0_6px_22px_rgba(46,45,40,.035)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A8B82]">
                        {title}
                    </p>
                    <p className="quizora-display mt-3 text-[32px] font-semibold leading-tight text-[#252D2A]">
                        {value}
                    </p>
                </div>
                <span className="rounded-xl bg-[#F3EAE0] p-2.5 text-[#9B633A]">
                    <Icon name={icon} />
                </span>
            </div>
            <p className="mt-3 text-xs text-[#95978D]">
                {helper}
            </p>
        </div>
    );
}

const statusClasses = {
    pending: 'bg-[#FFF2D7] text-[#8D6724]',
    approved: 'bg-[#E6F1E6] text-[#356C47]',
    rejected: 'bg-[#FBE7E3] text-[#9D4C3F]',
    revoked: 'bg-[#EDEBE7] text-[#64635F]',
};

function formatDate(date) {
    if (!date) return '—';

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
        ? '—'
        : parsed.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
}

export default function Dashboard({
    statistics = {},
    pendingTeachers = [],
    approvedTeachers = [],
    inactiveTeachers = [],
}) {
    const { auth } = usePage().props;
    const adminName =
        auth?.user?.name?.trim() || 'Administrator';

    const [tab, setTab] = useState('pending');
    const [search, setSearch] = useState('');
    const [processing, setProcessing] = useState(null);
    const [notice, setNotice] = useState('');

    const pending = Array.isArray(pendingTeachers)
        ? pendingTeachers : [];
    const approved = Array.isArray(approvedTeachers)
        ? approvedTeachers : [];
    const inactive = Array.isArray(inactiveTeachers)
        ? inactiveTeachers : [];

    const tabs = [
        { id: 'pending', label: 'Pending requests', items: pending },
        { id: 'approved', label: 'Approved teachers', items: approved },
        { id: 'inactive', label: 'Rejected / revoked', items: inactive },
    ];

    const activeItems =
        tab === 'pending' ? pending
        : tab === 'approved' ? approved
        : inactive;

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return term
            ? activeItems.filter(item =>
                `${item.name || ''} ${item.email || ''}`
                    .toLowerCase()
                    .includes(term))
            : activeItems;
    }, [activeItems, search]);

    const takeAction = (action, teacher) => {
        if (processing !== null) return;

        const text = {
            approve:
                `Have you verified ${teacher.name}'s identity as a genuine teacher?\n\nApprove this application?`,
            reject:
                `Reject the application from ${teacher.name}?`,
            revoke:
                `Revoke teacher access for ${teacher.name}?\n\nTheir courses, questions, and results will remain stored.`,
        }[action];

        if (!window.confirm(text)) return;

        setProcessing(`${action}-${teacher.id}`);
        setNotice('');

        router.post(
            route(`admin.teachers.${action}`, teacher.id),
            {},
            {
                preserveScroll: true,

                onSuccess: () => setNotice({
                    approve: 'Teacher approved successfully.',
                    reject: 'Application rejected.',
                    revoke: 'Teacher access revoked.',
                }[action]),

                onError: () => setNotice(
                    'Action could not be completed. Please reload and check the account status.'
                ),

                onFinish: () => setProcessing(null),
            }
        );
    };

    return (
        <AuthenticatedLayout theme="admin">
            <Head title="Admin Dashboard - Quizora" />

            <div className="space-y-8 pb-10">

                {/* ADMIN HERO */}
                <section className="relative overflow-hidden rounded-[28px] bg-[#272E2A] px-6 py-10 text-white sm:px-10 sm:py-12">
                    <div className="pointer-events-none absolute -right-14 -top-20 h-72 w-72 rounded-full border-[50px] border-white/5" />
                    <div className="pointer-events-none absolute -bottom-28 right-28 h-52 w-52 rounded-full bg-[#C38A55]/10 blur-3xl" />

                    <div className="relative flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E3CDAE]">
                                <Icon name="shield" className="h-4 w-4" />
                                ADMINISTRATION CONSOLE
                            </span>

                            <h1 className="quizora-display mt-6 break-words text-3xl font-semibold tracking-tight sm:text-[42px]">
                                Good to see you,{' '}
                                <span className="text-[#D7B18C]">
                                    {adminName}.
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-[#CFD4CC] sm:text-base">
                                Review teacher applications, manage access
                                and keep the Quizora workspace organized.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-2 rounded-xl border border-[#777970]/50 bg-white/10 px-4 py-3 text-xs font-bold text-[#E6D4BD]">
                            <Icon name="lock" className="h-4 w-4" />
                            Restricted admin area
                        </span>
                    </div>
                </section>

                {/* STATISTICS */}
                <section aria-label="Platform overview">
                    <div className="mb-5">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#9B6C44]">
                            PLATFORM HEALTH
                        </p>
                        <h2 className="quizora-display mt-2 text-[28px] font-semibold text-[#2D332E]">
                            Overview at a glance
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Stat
                            icon="users"
                            title="Registered users"
                            value={statistics.total_users ?? 0}
                            helper="Excludes administrators"
                        />
                        <Stat
                            icon="layers"
                            title="Students"
                            value={statistics.students ?? 0}
                            helper="Regular student accounts"
                        />
                        <Stat
                            icon="clock"
                            title="Awaiting review"
                            value={statistics.pending_teachers ?? pending.length}
                            helper="Teacher applications"
                        />
                        <Stat
                            icon="shield"
                            title="Approved faculty"
                            value={statistics.approved_teachers ?? approved.length}
                            helper="Active teacher accounts"
                        />
                    </div>
                </section>

                {/* TEACHER MANAGEMENT */}
                <section className="overflow-hidden rounded-[24px] border border-[#E4E3DE] bg-white">
                    <div className="border-b border-[#EAE8E3] px-5 py-6 sm:px-8 sm:py-8">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A2734D]">
                                    PEOPLE & PERMISSIONS
                                </p>
                                <h2 className="quizora-display mt-2 text-[28px] font-semibold text-[#2B332D]">
                                    Teacher management
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#8A8F87]">
                                    Review applicants and manage approved
                                    teacher access.
                                </p>
                            </div>

                            <span className="inline-flex self-start items-center gap-2 rounded-full bg-[#F3EEE7] px-4 py-2 text-xs font-bold text-[#8E653F]">
                                <Icon name="lock" className="h-4 w-4" />
                                Verified admin only
                            </span>
                        </div>

                        {notice && (
                            <div
                                role="status"
                                className="mt-5 rounded-xl border border-[#DFD3C3] bg-[#FAF5EE] px-4 py-3 text-sm font-semibold text-[#83583A]"
                            >
                                {notice}
                            </div>
                        )}

                        {/* STATUS TABS */}
                        <div
                            role="tablist"
                            aria-label="Teacher categories"
                            className="mt-7 flex flex-wrap gap-2"
                        >
                            {tabs.map(item => (
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={tab === item.id}
                                    key={item.id}
                                    onClick={() => {
                                        setTab(item.id);
                                        setSearch('');
                                        setNotice('');
                                    }}
                                    className={`rounded-xl px-4 py-3 text-xs font-bold transition sm:text-sm ${
                                        tab === item.id
                                            ? 'bg-[#303B34] text-white'
                                            : 'bg-[#F4F3EF] text-[#6C736A] hover:bg-[#EAE9E3]'
                                    }`}
                                >
                                    {item.label}
                                    <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] ${
                                        tab === item.id
                                            ? 'bg-white/15 text-white'
                                            : 'bg-white text-[#6C736A]'
                                    }`}>
                                        {item.items.length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* SEARCH */}
                        <label className="relative mt-6 block max-w-sm">
                            <span className="sr-only">
                                Search teacher accounts
                            </span>
                            <Icon
                                name="search"
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#989C94]"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={event =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by name or email..."
                                className="w-full rounded-xl border-[#E3E3DE] bg-[#FAFAF8] py-3 pl-10 pr-4 text-sm text-[#333B35] placeholder-[#9A9E97] focus:border-[#A17D5C] focus:ring-[#EBE0D1]"
                            />
                        </label>
                    </div>

                    {/* ACCOUNTS TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[710px] text-left">
                            <thead className="bg-[#F8F8F5] text-[11px] font-extrabold uppercase tracking-[0.11em] text-[#899087]">
                                <tr>
                                    <th className="px-6 py-4">Account</th>
                                    <th className="px-6 py-4">Registered</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#F0EFEB]">
                                {filtered.map(teacher => (
                                    <tr
                                        key={teacher.id}
                                        className="transition hover:bg-[#FAF9F6]"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEE8DF] font-bold text-[#8A5E3F]">
                                                    {(teacher.name || 'T')
                                                        .trim()
                                                        .charAt(0)
                                                        .toUpperCase() || 'T'}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[#313930]">
                                                        {teacher.name}
                                                    </p>
                                                    <p className="mt-1 break-all text-xs text-[#8A8F87]">
                                                        {teacher.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-[#7D847A]">
                                            {formatDate(teacher.created_at)}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                                                statusClasses[teacher.teacher_status] ||
                                                statusClasses.pending
                                            }`}>
                                                {teacher.teacher_status || 'pending'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-2">
                                                {tab === 'pending' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={processing !== null}
                                                            onClick={() =>
                                                                takeAction('approve', teacher)
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg bg-[#34714B] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#285F3D] disabled:opacity-50"
                                                        >
                                                            <Icon name="check" className="h-3.5 w-3.5" />
                                                            Approve
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={processing !== null}
                                                            onClick={() =>
                                                                takeAction('reject', teacher)
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg border border-[#E9D1CA] bg-[#FFF5F2] px-3 py-2 text-xs font-bold text-[#A45346] transition hover:bg-[#FCEAE5] disabled:opacity-50"
                                                        >
                                                            <Icon name="close" className="h-3.5 w-3.5" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {tab === 'approved' && (
                                                    <button
                                                        type="button"
                                                        disabled={processing !== null}
                                                        onClick={() =>
                                                            takeAction('revoke', teacher)
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-[#E7CCC4] px-3 py-2 text-xs font-bold text-[#9B5146] transition hover:bg-[#FFF4F0] disabled:opacity-50"
                                                    >
                                                        <Icon name="lock" className="h-3.5 w-3.5" />
                                                        Revoke
                                                    </button>
                                                )}

                                                {tab === 'inactive' && (
                                                    <span className="text-xs font-medium text-[#969991]">
                                                        Access disabled
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filtered.length === 0 && (
                            <div className="px-6 py-14 text-center">
                                <Icon
                                    name="users"
                                    className="mx-auto h-9 w-9 text-[#A47B53]"
                                />
                                <h3 className="quizora-display mt-4 text-lg font-semibold text-[#303931]">
                                    {search
                                        ? 'No matching accounts'
                                        : tab === 'pending'
                                            ? 'No pending requests'
                                            : tab === 'approved'
                                                ? 'No approved teachers'
                                                : 'No inactive accounts'}
                                </h3>
                                <p className="mt-2 text-sm text-[#999D96]">
                                    {search
                                        ? 'Try another name or email.'
                                        : 'Accounts in this category will appear here.'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between gap-2 border-t border-[#EEEEE9] bg-[#FBFBF9] px-6 py-4 text-xs text-[#999D95] sm:flex-row sm:items-center">
                        <span>
                            Showing {filtered.length} of {activeItems.length} accounts
                        </span>
                        <span>
                            All changes require administrator authorization.
                        </span>
                    </div>
                </section>

                {/* VERIFICATION NOTE */}
                <section className="flex items-start gap-4 rounded-[20px] border border-[#E6DFD6] bg-[#F0EBE4] px-5 py-5 sm:px-7">
                    <span className="rounded-xl bg-white p-3 text-[#9D734E]">
                        <Icon name="shield" className="h-6 w-6" />
                    </span>
                    <div>
                        <h2 className="quizora-display text-lg font-semibold text-[#313932]">
                            Verify before granting access
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-[#747C72]">
                            Approve teachers only after checking their identity
                            with trusted institutional records. Revoking access
                            does not delete existing course, question or result
                            data.
                        </p>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
