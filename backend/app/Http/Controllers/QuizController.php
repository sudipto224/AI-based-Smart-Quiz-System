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

        $course = Course::with('questions')
            ->findOrFail($request->course_id);

        $questions = $course->questions;

        $totalQuestions = $questions->count();

        // Student selected answers
        $answers = $request->input('answers', []);

        // ===================== CALCULATE SCORE =====================
        $score = 0;

        foreach ($questions as $question) {

            if (
                array_key_exists(
                    (string) $question->id,
                    $answers
                ) &&
                $answers[(string) $question->id]
                    === $question->correct_answer
            ) {
                $score++;
            }

            elseif (
                array_key_exists(
                    $question->id,
                    $answers
                ) &&
                $answers[$question->id]
                    === $question->correct_answer
            ) {
                $score++;
            }
        }

        // ===================== CHEATING DETECTION =====================

        $tabSwitches =
            $request->tab_switch_count;

        $startTime =
            $request->quiz_start_time;

        $endTime =
            now()->timestamp * 1000;

        $totalMs =
            max(
                0,
                $endTime - $startTime
            );

        $totalSeconds =
            $totalMs / 1000;

        $avgTime =
            $totalQuestions > 0
                ? $totalSeconds / $totalQuestions
                : 0;

        $isSuspicious =
            $tabSwitches > 0 ||
            (
                $totalQuestions > 0 &&
                $avgTime < 5
            );

        // ===================== SAVE ATTEMPT =====================

        $attempt = QuizAttempt::create([

            'user_id' =>
                auth()->id(),

            'course_id' =>
                $course->id,

            'score' =>
                $score,

            'total_questions' =>
                $totalQuestions,

            // IMPORTANT:
            // Save student's selected answers
            'answers' =>
                $answers,

            'time_taken' =>
                gmdate(
                    'H:i:s',
                    (int) $totalSeconds
                ),

            'seconds_taken' =>
                (int) $totalSeconds,

            'is_suspicious' =>
                $isSuspicious,

            'tab_switch_count' =>
                $tabSwitches,

            'avg_time_per_question' =>
                $avgTime,

            'started_at' =>
                Carbon::createFromTimestampMs(
                    $startTime
                ),
        ]);

        return redirect()
            ->route(
                'result.show',
                $attempt->id
            );
    }
}