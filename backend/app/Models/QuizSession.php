<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'teacher_id',
        'title',
        'code',
        'status',
        'duration_seconds',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(
            Course::class
        );
    }

    public function teacher()
    {
        return $this->belongsTo(
            User::class,
            'teacher_id'
        );
    }

    public function questions()
    {
        return $this->belongsToMany(
            Question::class,
            'quiz_session_question'
        )
            ->withPivot(
                'position'
            )
            ->withTimestamps();
    }

    public function participants()
    {
        return $this->hasMany(
            QuizSessionParticipant::class
        );
    }

    public function attempts()
    {
        return $this->hasMany(
            QuizAttempt::class
        );
    }
}