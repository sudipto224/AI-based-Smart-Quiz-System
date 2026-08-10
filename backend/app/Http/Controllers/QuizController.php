<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\QuizAttempt;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    // ===================== SHOW QUIZ PAGE =====================
    public function show($course_id)
    {
        $course = Course::with('questions')->findOrFail($course_id);
        return Inertia::render('Quiz/Index', [
            'course' => $course,
            'questions' => $course->questions,
        ]);
    }

    // ===================== SUBMIT QUIZ =====================
    public function submit(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'answers' => 'required|array',
            'tab_switch_count' => 'required|integer',
            'quiz_start_time' => 'required|integer',
        ]);

        $course = Course::findOrFail($request->course_id);
        $questions = $course->questions;
        $totalQuestions = $questions->count();

        // Calculate score
        $score = 0;
        $answers = $request->answers;
        foreach ($questions as $question) {
            if (isset($answers[$question->id]) && $answers[$question->id] === $question->correct_answer) {
                $score++;
            }
        }

        // Cheating Detection
        $tabSwitches = $request->tab_switch_count;
        $startTime = $request->quiz_start_time;
        $endTime = now()->timestamp * 1000;
        $totalMs = $endTime - $startTime;
        $totalSeconds = $totalMs / 1000;
        $avgTime = $totalSeconds / $totalQuestions;

        $isSuspicious = false;
        if ($tabSwitches > 0 || $avgTime < 5) {
            $isSuspicious = true;
        }

        // Save attempt
        $attempt = QuizAttempt::create([
            'user_id' => auth()->id(),
            'course_id' => $course->id,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'time_taken' => gmdate('H:i:s', $totalSeconds),
            'seconds_taken' => (int) $totalSeconds,
            'is_suspicious' => $isSuspicious,
            'tab_switch_count' => $tabSwitches,
            'avg_time_per_question' => $avgTime,
            'started_at' => Carbon::createFromTimestampMs($startTime),
        ]);

        return redirect()->route('result.show', $attempt->id);
    }
}