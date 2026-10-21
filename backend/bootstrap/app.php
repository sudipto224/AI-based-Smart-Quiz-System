<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

return Application::configure(
    basePath: dirname(__DIR__)
)
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',

        then: function () {

            /*
             * Load additional Administrator Routes.
             *
             * Existing web.php and its routes
             * remain unchanged.
             */
            Route::middleware('web')
                ->group(
                    base_path('routes/admin.php')
                );
        },
    )

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_PROTO,
        );

        /*
         * Preserve Inertia and existing web middleware.
         */
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        /*
         * Teacher and Administrator authorization.
         */
        $middleware->alias([
            'teacher' => \App\Http\Middleware\TeacherMiddleware::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions) {

        $exceptions->shouldRenderJsonWhen(
            function (Request $request) {
                return $request->expectsJson();
            }
        );
    })

    ->create();
