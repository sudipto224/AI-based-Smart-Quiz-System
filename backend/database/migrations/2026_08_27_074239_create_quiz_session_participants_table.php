<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'quiz_session_participants',
            function (
                Blueprint $table
            ) {
                $table->id();

                $table
                    ->foreignId(
                        'quiz_session_id'
                    )
                    ->constrained(
                        'quiz_sessions'
                    )
                    ->cascadeOnDelete();

                $table
                    ->foreignId(
                        'user_id'
                    )
                    ->constrained(
                        'users'
                    )
                    ->cascadeOnDelete();

                $table
                    ->foreignId(
                        'quiz_attempt_id'
                    )
                    ->nullable()
                    ->constrained(
                        'quiz_attempts'
                    )
                    ->nullOnDelete();

                $table
                    ->timestamp(
                        'joined_at'
                    )
                    ->nullable();

                $table
                    ->timestamp(
                        'started_at'
                    )
                    ->nullable();

                $table
                    ->timestamp(
                        'submitted_at'
                    )
                    ->nullable();

                $table->timestamps();

                $table->unique([
                    'quiz_session_id',
                    'user_id',
                ]);

                $table->index([
                    'quiz_session_id',
                    'submitted_at',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'quiz_session_participants'
        );
    }
};