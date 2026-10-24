<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPracticeQuiz extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'source_type',
        'total_questions',
        'questions',
        'answers',
        'score',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'questions' => 'array',
            'answers' => 'array',
            'score' => 'integer',
            'total_questions' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
