<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'quiz_attempts',
            function (
                Blueprint $table
            ) {
                $table
                    ->foreignId(
                        'quiz_session_id'
                    )
                    ->nullable()
                    ->after(
                        'course_id'
                    )
                    ->constrained(
                        'quiz_sessions'
                    )
                    ->nullOnDelete();

                $table->index([
                    'quiz_session_id',
                    'user_id',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'quiz_attempts',
            function (
                Blueprint $table
            ) {
                $table->dropIndex([
                    'quiz_session_id',
                    'user_id',
                ]);

                $table
                    ->dropConstrainedForeignId(
                        'quiz_session_id'
                    );
            }
        );
    }
};