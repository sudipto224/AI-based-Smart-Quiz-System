<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->integer('score');
            $table->integer('total_questions');
            $table->string('time_taken')->nullable();
            $table->integer('seconds_taken')->nullable();
            $table->boolean('is_suspicious')->default(false);
            $table->integer('tab_switch_count')->default(0);
            $table->float('avg_time_per_question')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};