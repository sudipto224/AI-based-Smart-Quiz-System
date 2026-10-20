
<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Quizora Administrator Routes
|--------------------------------------------------------------------------
|
| Every route in this group requires:
| 1. Authenticated user
| 2. Administrator permission
|
| Student and Teacher users cannot access these routes.
|
*/

Route::middleware([
    'auth',
    'admin',
])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Admin Dashboard
        Route::get(
            '/dashboard',
            [
                AdminDashboardController::class,
                'index',
            ]
        )->name('dashboard');

        // Approve pending teacher
        Route::post(
            '/teachers/{user}/approve',
            [
                AdminDashboardController::class,
                'approve',
            ]
        )->name('teachers.approve');

        // Reject pending teacher
        Route::post(
            '/teachers/{user}/reject',
            [
                AdminDashboardController::class,
                'reject',
            ]
        )->name('teachers.reject');

        // Revoke approved teacher access
        Route::post(
            '/teachers/{user}/revoke',
            [
                AdminDashboardController::class,
                'revoke',
            ]
        )->name('teachers.revoke');
    });
