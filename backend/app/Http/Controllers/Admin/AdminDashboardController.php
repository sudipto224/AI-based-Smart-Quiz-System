<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the protected administrator dashboard.
     */
    public function index(): Response
    {
        $pendingTeachers = User::query()
            ->where('is_admin', false)
            ->where('teacher_status', 'pending')
            ->select([
                'id',
                'name',
                'email',
                'teacher_status',
                'created_at',
            ])
            ->latest()
            ->get();

        $approvedTeachers = User::query()
            ->where('is_admin', false)
            ->where('is_teacher', true)
            ->where('teacher_status', 'approved')
            ->select([
                'id',
                'name',
                'email',
                'teacher_status',
                'created_at',
            ])
            ->latest()
            ->get();

        $inactiveTeachers = User::query()
            ->where('is_admin', false)
            ->whereIn('teacher_status', [
                'rejected',
                'revoked',
            ])
            ->select([
                'id',
                'name',
                'email',
                'teacher_status',
                'created_at',
            ])
            ->latest()
            ->get();

        $statistics = [
            'total_users' => User::where(
                'is_admin',
                false
            )->count(),

            'students' => User::where(
                'is_admin',
                false
            )
                ->where('is_teacher', false)
                ->whereNull('teacher_status')
                ->count(),

            'pending_teachers' => $pendingTeachers->count(),

            'approved_teachers' => $approvedTeachers->count(),

            'inactive_teachers' => $inactiveTeachers->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'statistics' => $statistics,
            'pendingTeachers' => $pendingTeachers,
            'approvedTeachers' => $approvedTeachers,
            'inactiveTeachers' => $inactiveTeachers,
        ]);
    }

    /**
     * Approve a pending teacher after identity verification.
     */
    public function approve(User $user): RedirectResponse
    {
        $updated = User::query()
            ->whereKey($user->id)
            ->where('is_admin', false)
            ->where('is_teacher', false)
            ->where('teacher_status', 'pending')
            ->update([
                'is_teacher' => true,
                'teacher_status' => 'approved',
            ]);

        abort_unless(
            $updated === 1,
            409,
            'This teacher request is no longer pending.'
        );

        return redirect()
            ->route('admin.dashboard')
            ->with(
                'success',
                'Teacher approved successfully.'
            );
    }

    /**
     * Reject a pending teacher application.
     */
    public function reject(User $user): RedirectResponse
    {
        $updated = User::query()
            ->whereKey($user->id)
            ->where('is_admin', false)
            ->where('is_teacher', false)
            ->where('teacher_status', 'pending')
            ->update([
                'is_teacher' => false,
                'teacher_status' => 'rejected',
            ]);

        abort_unless(
            $updated === 1,
            409,
            'This teacher request is no longer pending.'
        );

        return redirect()
            ->route('admin.dashboard')
            ->with(
                'success',
                'Teacher application rejected.'
            );
    }

    /**
     * Revoke an approved teacher's access.
     *
     * Existing courses, questions, and results
     * are NOT deleted or modified.
     */
    public function revoke(User $user): RedirectResponse
    {
        $updated = User::query()
            ->whereKey($user->id)
            ->where('is_admin', false)
            ->where('is_teacher', true)
            ->where('teacher_status', 'approved')
            ->update([
                'is_teacher' => false,
                'teacher_status' => 'revoked',
            ]);

        abort_unless(
            $updated === 1,
            409,
            'This account is not an approved teacher.'
        );

        return redirect()
            ->route('admin.dashboard')
            ->with(
                'success',
                'Teacher access revoked. Existing data preserved.'
            );
    }
}
