
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'student_practice_quizzes',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId('user_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->string('title', 150);

                // topic or material
                $table->string('source_type', 20);

                $table->unsignedTinyInteger(
                    'total_questions'
                );

                // Contains correct answers.
                // Do not expose before quiz submission.
                $table->json('questions');

                $table->json('answers')->nullable();

                $table->unsignedTinyInteger('score')
                    ->nullable();

                $table->timestamp('completed_at')
                    ->nullable();

                $table->timestamps();

                $table->index([
                    'user_id',
                    'created_at',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'student_practice_quizzes'
        );
    }
};
