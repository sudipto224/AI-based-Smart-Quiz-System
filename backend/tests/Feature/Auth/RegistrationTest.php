<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users must verify their email after registering', function () {
    Notification::fake();

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'test@example.com')->firstOrFail();

    $this->assertAuthenticatedAs($user);
    expect($user->email_verified_at)->toBeNull();
    $response->assertRedirect(route('verification.notice', absolute: false));
    Notification::assertSentTo($user, VerifyEmail::class);

    $this->get(route('dashboard'))->assertRedirect(route('verification.notice'));

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $this->get($verificationUrl)
        ->assertRedirect(route('dashboard'));

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

test('registration requires an email address', function () {
    $this->postJson('/register', [
        'name' => 'Test User',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'Please enter your email address.');
});

test('registration rejects an invalid email address', function () {
    $this->postJson('/register', [
        'name' => 'Test User',
        'email' => 'not-an-email',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'Please enter a valid email address.');
});

test('registration rejects an email address that is already in use', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $this->postJson('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'This email address is already registered.');
});
