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
    /**
     * Display the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate registration information
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

        // Create user account
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_teacher' => $request->boolean('is_teacher'),
        ]);

        // Dispatch registration event
        event(new Registered($user));

        // Automatically log in the new user
        Auth::login($user);

        // Redirect directly to dashboard
        return redirect()->route('dashboard');
    }
}
