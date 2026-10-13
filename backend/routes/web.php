
<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\MaterialQuizController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ===================== PUBLIC ROUTES =====================

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
});

// ===================== AUTH ROUTES =====================

require __DIR__ . '/auth.php';

// ===================== AUTHENTICATED ROUTES =====================
// Only login is required.

Route::middleware(['auth'])->group(function () {

    // ===================== DASHBOARD =====================

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ===================== PROFILE =====================

    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    // ===================== TEACHER ROUTES =====================

    Route::middleware(['teacher'])
        ->prefix('teacher')
        ->name('teacher.')
        ->group(function () {

            // COURSE MANAGEMENT

            Route::get('/courses', [TeacherController::class, 'index'])
                ->name('courses.index');

            Route::get('/courses/create', [TeacherController::class, 'create'])
                ->name('courses.create');

            Route::post('/courses', [TeacherController::class, 'store'])
                ->name('courses.store');

            Route::get('/courses/{course}/edit', [TeacherController::class, 'edit'])
                ->name('courses.edit');

            Route::put('/courses/{course}', [TeacherController::class, 'update'])
                ->name('courses.update');

            Route::delete('/courses/{course}', [TeacherController::class, 'destroy'])
                ->name('courses.destroy');

            // QUESTION MANAGEMENT

            Route::get('/courses/{course_id}/questions', [TeacherController::class, 'questions'])
                ->name('questions');

            Route::get('/courses/{course_id}/questions/create', [TeacherController::class, 'createQuestion'])
                ->name('questions.create');

            Route::post('/courses/{course_id}/questions', [TeacherController::class, 'storeQuestion'])
                ->name('questions.store');

            Route::get('/questions/{id}/edit', [TeacherController::class, 'editQuestion'])
                ->name('questions.edit');

            Route::put('/questions/{id}', [TeacherController::class, 'updateQuestion'])
                ->name('questions.update');

            Route::delete('/questions/{id}', [TeacherController::class, 'destroyQuestion'])
                ->name('questions.destroy');

            // AI QUESTION GENERATION

            Route::post('/generate-ai-question', [TeacherController::class, 'generateAIQuestion'])
                ->name('generate-ai-question');

            // MATERIAL BASED AI QUIZ GENERATION

            Route::get('/courses/{course}/material-generator', [MaterialQuizController::class, 'show'])
                ->name('material-generator.show');

            Route::post('/courses/{course}/material-generator/generate', [MaterialQuizController::class, 'generate'])
                ->name('material-generator.generate');

            Route::post('/courses/{course}/material-generator/save', [MaterialQuizController::class, 'save'])
                ->name('material-generator.save');

            // SUSPICIOUS ATTEMPTS

            Route::get('/suspicious-attempts', [TeacherController::class, 'suspiciousAttempts'])
                ->name('suspicious');
        });

    // ===================== STUDENT QUIZ ROUTES =====================

    Route::get('/quiz/{course_id}', [QuizController::class, 'show'])
        ->name('quiz.show');

    Route::post('/quiz/submit', [QuizController::class, 'submit'])
        ->name('quiz.submit');

    Route::get('/result/{attempt_id}', [ResultController::class, 'show'])
        ->name('result.show');

    Route::get('/leaderboard/{course_id}', [LeaderboardController::class, 'show'])
        ->name('leaderboard.show');
});

// ===================== QUIZORA EXTRA FEATURES =====================
// AI Distractor Quality Checker
// Teacher Live Quiz Room
// Student Live Quiz

require __DIR__ . '/quizora_features.php';
