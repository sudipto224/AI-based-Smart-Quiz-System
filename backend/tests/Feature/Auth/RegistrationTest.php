
<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('registration screen can be rendered', function () {
    $this->get('/register')->assertOk();
});

test('new users can register without email verification', function () {
    Notification::fake();

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'test@example.com')
        ->firstOrFail();

    $this->assertAuthenticatedAs($user);
    $this->assertFalse($user->is_teacher);

    $response->assertRedirect(
        route('dashboard', absolute: false)
    );

    $this->get('/dashboard')->assertOk();

    Notification::assertNothingSent();
});

test('users can register as teachers', function () {
    $response = $this->post('/register', [
        'name' => 'Test Teacher',
        'email' => 'teacher@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'is_teacher' => true,
    ]);

    $user = User::where('email', 'teacher@example.com')
        ->firstOrFail();

    $this->assertAuthenticatedAs($user);
    $this->assertTrue($user->is_teacher);
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('unverified users can access dashboard', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk();
});

test('registration requires email address', function () {
    $this->postJson('/register', [
        'name' => 'Test User',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])
    ->assertUnprocessable()
    ->assertJsonValidationErrors(['email']);
});

test('registration rejects invalid email', function () {
    $this->postJson('/register', [
        'name' => 'Test User',
        'email' => 'invalid-email',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])
    ->assertUnprocessable()
    ->assertJsonValidationErrors(['email']);
});

test('registration prevents duplicate email', function () {
    User::factory()->create([
        'email' => 'test@example.com',
    ]);

    $this->postJson('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])
    ->assertUnprocessable()
    ->assertJsonValidationErrors(['email']);
});
