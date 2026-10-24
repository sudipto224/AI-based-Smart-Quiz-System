
<?php

use App\Http\Controllers\StudentAiPracticeController;
use Illuminate\Support\Facades\Route;

// Loaded inside the authenticated route group.

Route::prefix('student/ai-practice')
    ->name('student.ai-practice.')
    ->group(function () {

        // Create AI Quiz page
        Route::get(
            '/',
            [StudentAiPracticeController::class, 'index']
        )->name('index');

        // Generate questions with Groq AI
        Route::post(
            '/generate',
            [StudentAiPracticeController::class, 'generate']
        )
            ->middleware('throttle:4,10')
            ->name('generate');

        // View own quiz or result
        Route::get(
            '/{practiceQuiz}',
            [StudentAiPracticeController::class, 'show']
        )->name('show');

        // Submit answers
        Route::post(
            '/{practiceQuiz}/submit',
            [StudentAiPracticeController::class, 'submit']
        )->name('submit');
    });
