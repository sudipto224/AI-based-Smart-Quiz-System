
<?php

use App\Http\Controllers\StudentQuizSessionController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherQuizSessionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Quizora Extra Feature Routes
|--------------------------------------------------------------------------
|
| New features:
| 1. AI Distractor Quality Checker
| 2. Teacher-created Live Quiz Rooms
|
*/

Route::middleware(
    'auth'
)->group(function () {

    // ================= AI QUALITY CHECKER =================

    Route::post(
        '/teacher/check-question-quality',
        [
            TeacherController::class,
            'checkQuestionQuality',
        ]
    )->middleware('teacher')->name(
        'teacher.check-question-quality'
    );

    // ================= TEACHER LIVE QUIZ =================

    Route::prefix(
        'teacher/live-quiz-rooms'
    )
        ->name(
            'teacher.quiz-rooms.'
        )
        ->middleware('teacher')
        ->group(function () {

            Route::get(
                '/',
                [
                    TeacherQuizSessionController::class,
                    'index',
                ]
            )->name('index');

            Route::post(
                '/',
                [
                    TeacherQuizSessionController::class,
                    'store',
                ]
            )->name('store');

            Route::get(
                '/{quizSession}',
                [
                    TeacherQuizSessionController::class,
                    'show',
                ]
            )->name('show');

            Route::post(
                '/{quizSession}/start',
                [
                    TeacherQuizSessionController::class,
                    'start',
                ]
            )->name('start');

            Route::post(
                '/{quizSession}/end',
                [
                    TeacherQuizSessionController::class,
                    'end',
                ]
            )->name('end');

            Route::get(
                '/{quizSession}/status',
                [
                    TeacherQuizSessionController::class,
                    'status',
                ]
            )->name('status');
        });

    // ================= STUDENT LIVE QUIZ =================

    Route::prefix(
        'student/live-quiz'
    )
        ->name(
            'student.quiz-rooms.'
        )
        ->group(function () {

            Route::get(
                '/',
                [
                    StudentQuizSessionController::class,
                    'joinPage',
                ]
            )->name('join');

            Route::post(
                '/join',
                [
                    StudentQuizSessionController::class,
                    'join',
                ]
            )->name(
                'join.submit'
            );

            Route::get(
                '/{quizSession}/waiting',
                [
                    StudentQuizSessionController::class,
                    'waiting',
                ]
            )->name('waiting');

            Route::get(
                '/{quizSession}/status',
                [
                    StudentQuizSessionController::class,
                    'status',
                ]
            )->name('status');

            Route::get(
                '/{quizSession}/quiz',
                [
                    StudentQuizSessionController::class,
                    'quiz',
                ]
            )->name('quiz');

            Route::post(
                '/{quizSession}/submit',
                [
                    StudentQuizSessionController::class,
                    'submit',
                ]
            )->name('submit');

            Route::get(
                '/{quizSession}/result',
                [
                    StudentQuizSessionController::class,
                    'result',
                ]
            )->name('result');
        });
});
