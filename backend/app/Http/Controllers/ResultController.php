<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function show($attempt_id)
    {
        $attempt = QuizAttempt::with(['user', 'course', 'course.questions'])
            ->findOrFail($attempt_id);

        if ($attempt->user_id !== auth()->id() && !auth()->user()->is_teacher) {
            abort(403);
        }

        return Inertia::render('Result/Index', [
            'attempt' => $attempt,
            'questions' => $attempt->course->questions,
        ]);
    }
}