<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaderboardController;
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

// ===================== AUTH ROUTES (Breeze) =====================
require __DIR__.'/auth.php';

// ===================== AUTHENTICATED ROUTES =====================
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');

    // ===================== TEACHER ROUTES =====================
    Route::middleware(['teacher'])->prefix('teacher')->name('teacher.')->group(function () {

        // Course Management
        Route::get('/courses', [TeacherController::class, 'index'])->name('courses.index');
        Route::get('/courses/create', [TeacherController::class, 'create'])->name('courses.create');
        Route::post('/courses', [TeacherController::class, 'store'])->name('courses.store');
        Route::get('/courses/{course}/edit', [TeacherController::class, 'edit'])->name('courses.edit');
        Route::put('/courses/{course}', [TeacherController::class, 'update'])->name('courses.update');
        Route::delete('/courses/{course}', [TeacherController::class, 'destroy'])->name('courses.destroy');

        // Question Management
        Route::get('/courses/{course_id}/questions', [TeacherController::class, 'questions'])->name('questions');
        Route::get('/courses/{course_id}/questions/create', [TeacherController::class, 'createQuestion'])->name('questions.create');
        Route::post('/courses/{course_id}/questions', [TeacherController::class, 'storeQuestion'])->name('questions.store');
        Route::get('/questions/{id}/edit', [TeacherController::class, 'editQuestion'])->name('questions.edit');
        Route::put('/questions/{id}', [TeacherController::class, 'updateQuestion'])->name('questions.update');
        Route::delete('/questions/{id}', [TeacherController::class, 'destroyQuestion'])->name('questions.destroy');

        // AI Question Generation
        Route::post('/generate-ai-question', [TeacherController::class, 'generateAIQuestion'])->name('generate-ai-question');

        // Suspicious Attempts
        Route::get('/suspicious-attempts', [TeacherController::class, 'suspiciousAttempts'])->name('suspicious');
    });

    // ===================== STUDENT QUIZ ROUTES =====================
    Route::get('/quiz/{course_id}', [QuizController::class, 'show'])->name('quiz.show');
    Route::post('/quiz/submit', [QuizController::class, 'submit'])->name('quiz.submit');
    Route::get('/result/{attempt_id}', [ResultController::class, 'show'])->name('result.show');
    Route::get('/leaderboard/{course_id}', [LeaderboardController::class, 'show'])->name('leaderboard.show');
});