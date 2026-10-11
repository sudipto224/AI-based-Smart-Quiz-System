<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | 1. QUIZ SESSIONS TABLE
        |--------------------------------------------------------------------------
        */

        if (!Schema::hasTable('quiz_sessions')) {

            Schema::create('quiz_sessions', function (Blueprint $table) {
                $table->id();

                $table->foreignId('course_id')
                    ->constrained('courses')
                    ->cascadeOnDelete();

                $table->foreignId('teacher_id')
                    ->constrained('users')
                    ->cascadeOnDelete();

                $table->string('title', 150)->nullable();

                $table->string('code', 20)->unique();

                $table->string('status', 20)
                    ->default('waiting');

                $table->unsignedInteger('duration_seconds')
                    ->default(0);

                $table->timestamp('started_at')->nullable();

                $table->timestamp('ended_at')->nullable();

                $table->timestamps();
            });

        } else {

            if (!Schema::hasColumn('quiz_sessions', 'course_id')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->unsignedBigInteger('course_id')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'teacher_id')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->unsignedBigInteger('teacher_id')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'title')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->string('title', 150)->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'code')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->string('code', 20)->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'status')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->string('status', 20)
                        ->default('waiting');
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'duration_seconds')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->unsignedInteger('duration_seconds')
                        ->default(0);
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'started_at')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->timestamp('started_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'ended_at')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->timestamp('ended_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'created_at')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->timestamp('created_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_sessions', 'updated_at')) {
                Schema::table('quiz_sessions', function (Blueprint $table) {
                    $table->timestamp('updated_at')->nullable();
                });
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 2. QUIZ SESSION QUESTION TABLE
        |--------------------------------------------------------------------------
        */

        if (!Schema::hasTable('quiz_session_question')) {

            Schema::create('quiz_session_question', function (Blueprint $table) {
                $table->id();

                $table->foreignId('quiz_session_id')
                    ->constrained('quiz_sessions')
                    ->cascadeOnDelete();

                $table->foreignId('question_id')
                    ->constrained('questions')
                    ->cascadeOnDelete();

                $table->unsignedInteger('position')
                    ->default(1);

                $table->timestamps();

                $table->unique([
                    'quiz_session_id',
                    'question_id',
                ]);
            });

        } else {

            if (!Schema::hasColumn('quiz_session_question', 'quiz_session_id')) {
                Schema::table('quiz_session_question', function (Blueprint $table) {
                    $table->unsignedBigInteger('quiz_session_id')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_question', 'question_id')) {
                Schema::table('quiz_session_question', function (Blueprint $table) {
                    $table->unsignedBigInteger('question_id')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_question', 'position')) {
                Schema::table('quiz_session_question', function (Blueprint $table) {
                    $table->unsignedInteger('position')->default(1);
                });
            }

            if (!Schema::hasColumn('quiz_session_question', 'created_at')) {
                Schema::table('quiz_session_question', function (Blueprint $table) {
                    $table->timestamp('created_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_question', 'updated_at')) {
                Schema::table('quiz_session_question', function (Blueprint $table) {
                    $table->timestamp('updated_at')->nullable();
                });
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 3. QUIZ SESSION PARTICIPANTS TABLE
        |--------------------------------------------------------------------------
        */

        if (!Schema::hasTable('quiz_session_participants')) {

            Schema::create('quiz_session_participants', function (Blueprint $table) {
                $table->id();

                $table->foreignId('quiz_session_id')
                    ->constrained('quiz_sessions')
                    ->cascadeOnDelete();

                $table->foreignId('user_id')
                    ->constrained('users')
                    ->cascadeOnDelete();

                $table->foreignId('quiz_attempt_id')
                    ->nullable()
                    ->constrained('quiz_attempts')
                    ->nullOnDelete();

                $table->timestamp('joined_at')->nullable();

                $table->timestamp('started_at')->nullable();

                $table->timestamp('submitted_at')->nullable();

                $table->timestamps();

                $table->unique([
                    'quiz_session_id',
                    'user_id',
                ]);
            });

        } else {

            if (!Schema::hasColumn('quiz_session_participants', 'quiz_session_id')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->unsignedBigInteger('quiz_session_id')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_participants', 'user_id')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->unsignedBigInteger('user_id')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_participants', 'quiz_attempt_id')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->unsignedBigInteger('quiz_attempt_id')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_participants', 'joined_at')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->timestamp('joined_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_participants', 'started_at')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->timestamp('started_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_participants', 'submitted_at')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->timestamp('submitted_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_participants', 'created_at')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->timestamp('created_at')->nullable();
                });
            }

            if (!Schema::hasColumn('quiz_session_participants', 'updated_at')) {
                Schema::table('quiz_session_participants', function (Blueprint $table) {
                    $table->timestamp('updated_at')->nullable();
                });
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 4. QUIZ ATTEMPTS → LIVE QUIZ CONNECTION
        |--------------------------------------------------------------------------
        */

        if (
            Schema::hasTable('quiz_attempts') &&
            !Schema::hasColumn('quiz_attempts', 'quiz_session_id')
        ) {
            Schema::table('quiz_attempts', function (Blueprint $table) {
                $table->unsignedBigInteger('quiz_session_id')
                    ->nullable()
                    ->after('course_id');
            });
        }
    }


    public function down(): void
    {
        /*
         * This is intentionally non-destructive.
         *
         * We do not automatically remove columns/tables during rollback,
         * because this migration is being used to repair an existing
         * development database without deleting project data.
         */
    }
};