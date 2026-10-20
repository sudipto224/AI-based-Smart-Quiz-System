<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        /*
         * Administrator goes to Admin Dashboard.
         */
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        /*
         * Existing approved teachers retain
         * their dashboard and course information.
         */
        if ($user->isApprovedTeacher()) {
            $courses = Course::where(
                'teacher_id',
                $user->id
            )
                ->withCount('questions')
                ->get();

            return Inertia::render(
                'Teacher/Dashboard',
                [
                    'courses' => $courses,
                ]
            );
        }

        /*
         * Pending, rejected and revoked teacher
         * applications cannot access teacher tools.
         */
        if (
            $user->teacher_status !== null ||
            $user->is_teacher
        ) {
            return Inertia::render(
                'Teacher/ApprovalStatus',
                [
                    'status' => $user->teacher_status
                        ?? 'pending',
                ]
            );
        }

        /*
         * Regular student dashboard.
         */
        return Inertia::render(
            'Student/Dashboard',
            [
                'courses' => Course::all(),
            ]
        );
    }
}
