<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->is_teacher) {
            $courses = Course::where('teacher_id', $user->id)->withCount('questions')->get();
            return Inertia::render('Teacher/Dashboard', ['courses' => $courses]);
        }

        $courses = Course::all();
        return Inertia::render('Student/Dashboard', ['courses' => $courses]);
    }
}