<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizSessionParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_session_id',
        'user_id',
        'quiz_attempt_id',
        'joined_at',
        'started_at',
        'submitted_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    public function quizSession()
    {
        return $this->belongsTo(
            QuizSession::class
        );
    }

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function attempt()
    {
        return $this->belongsTo(
            QuizAttempt::class,
            'quiz_attempt_id'
        );
    }
}