
<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('registration screen can be rendered', function () {
    $this->get('/register')->assertOk();
});

test('public pages return valid Inertia responses on client navigation', function () {
    $version = hash_file('xxh128', public_path('build/manifest.json'));

    $this->assertNotFalse($version);

    foreach (['/', '/register', '/login', '/forgot-password'] as $path) {
        $this->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
            ->get($path)
            ->assertOk()
            ->assertHeader('X-Inertia', 'true')
            ->assertJsonStructure([
                'component',
                'props',
                'url',
                'version',
            ]);
    }
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

test('teacher registration creates a pending approval request', function () {
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
    $this->assertFalse($user->is_teacher);
    $this->assertSame('pending', $user->teacher_status);
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('generated route URLs honor forwarded HTTPS from the deployment proxy', function () {
    $this->withServerVariables([
        'HTTP_HOST' => 'quizora.example',
        'HTTP_X_FORWARDED_PROTO' => 'https',
    ]);

    $this->get('/register')
        ->assertOk();

    $this->assertSame('https', parse_url(route('login'), PHP_URL_SCHEME));
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
