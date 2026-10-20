<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TeacherMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isApprovedTeacher()) {
            abort(403, 'Only approved teachers can access this feature.');
        }

        return $next($request);
    }
}
