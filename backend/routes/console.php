
<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Run once from the trusted local backend terminal:
 * php artisan quizora:create-admin
 *
 * This NEVER upgrades an existing user. It creates a separate administrator
 * only after asking for name, email, two password entries, and confirmation.
 */
Artisan::command('quizora:create-admin', function () {
    $this->info('Quizora | Create the first administrator');

    // Step 1 database migration must exist before this command is used.
    if (!Schema::hasColumns('users', ['is_admin', 'is_teacher', 'teacher_status'])) {
        $this->error('The approval columns are missing. Complete Step 1 first.');
        return 1;
    }

    // Initial setup supports one administrator. Do not change existing admins.
    if (User::where('is_admin', true)->exists()) {
        $this->warn('An administrator already exists. No accounts were changed.');
        return 1;
    }

    $name = trim((string) $this->ask('Admin full name'));
    $email = strtolower(trim((string) $this->ask('New admin email')));

    if ($name === '' || mb_strlen($name) > 255) {
        $this->error('Name must contain 1–255 characters.');
        return 1;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
        $this->error('Please provide a valid email address.');
        return 1;
    }

    if (User::whereRaw('LOWER(email) = ?', [$email])->exists()) {
        $this->error('This email already belongs to a user. Use a NEW email for the admin.');
        return 1;
    }

    $password = (string) $this->secret('Strong admin password (hidden)');
    $confirmation = (string) $this->secret('Confirm admin password (hidden)');

    $strong = strlen($password) >= 12
        && preg_match('/[A-Z]/', $password)
        && preg_match('/[a-z]/', $password)
        && preg_match('/[0-9]/', $password)
        && preg_match('/[^A-Za-z0-9]/', $password);

    if (!$strong) {
        $this->error('Password needs 12+ characters, uppercase, lowercase, number, and symbol.');
        return 1;
    }

    if (!hash_equals($password, $confirmation)) {
        $this->error('The passwords do not match. No account was created.');
        return 1;
    }

    $this->line('Administrator email: ' . $email);
    $this->line('Database connection: ' . config('database.default'));

    if (!$this->confirm('Create the NEW administrator account?', false)) {
        $this->warn('Cancelled. No changes were made.');
        return 1;
    }

    // Assign privileged fields only in this trusted local CLI command.
    $admin = new User();
    $admin->name = $name;
    $admin->email = $email;
    $admin->password = $password; // Hashed by the User model cast.
    $admin->is_admin = true;
    $admin->is_teacher = false;
    $admin->teacher_status = null;
    $admin->save();

    $this->info('Administrator account created successfully (ID: ' . $admin->id . ').');
    $this->comment('Do not share your admin password. Admin Dashboard is added in Step 4.');
    return 0;
})->purpose('Safely create the first Quizora administrator');
