<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;

class ResultController extends Controller
{
    public function show($attempt_id)
    {
        $attempt = QuizAttempt::with(['user', 'course', 'course.questions'])->findOrFail($attempt_id);

        if ($attempt->user_id !== auth()->id() && !auth()->user()->is_teacher) {
            abort(403);
        }

        return view('result', compact('attempt'));
    }
}