<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Rules\Password::defaults(),
            ],
            'is_teacher' => 'sometimes|boolean',
        ], [
            'name.required' => 'Please enter your full name.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Please enter your password.',
            'password.confirmed' => 'Passwords do not match.',
        ]);

        $requestedTeacher = (bool) ($validated['is_teacher'] ?? false);

        // Never allow self-registration to grant privileged roles.
        // An applicant waits for an administrator's verified approval.
        $user = new User([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->is_teacher = false;
        $user->teacher_status = $requestedTeacher ? 'pending' : null;
        $user->is_admin = false;
        $user->save();

        event(new Registered($user));
        Auth::login($user);

        // The dashboard controller shows the pending page to applicants.
        return redirect()->route('dashboard');
    }
}
