<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'quiz_session_question',
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
                        'question_id'
                    )
                    ->constrained(
                        'questions'
                    )
                    ->cascadeOnDelete();

                $table
                    ->unsignedInteger(
                        'position'
                    )
                    ->default(1);

                $table->timestamps();

                $table->unique([
                    'quiz_session_id',
                    'question_id',
                ]);

                $table->index([
                    'quiz_session_id',
                    'position',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'quiz_session_question'
        );
    }
};