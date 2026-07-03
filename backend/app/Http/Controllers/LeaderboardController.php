<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\QuizAttempt;

class LeaderboardController extends Controller
{
    public function show($course_id)
    {
        $course = Course::findOrFail($course_id);

        $leaderboard = QuizAttempt::where('course_id', $course_id)
            ->where('is_suspicious', false)
            ->with('user')
            ->orderBy('score', 'desc')
            ->orderBy('seconds_taken', 'asc')
            ->get()
            ->unique('user_id')
            ->take(10);

        return view('leaderboard', compact('course', 'leaderboard'));
    }
}