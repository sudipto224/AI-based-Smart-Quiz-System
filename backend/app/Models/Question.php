<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'level',
        'question',
        'option1',
        'option2',
        'option3',
        'option4',
        'correct_answer',
        'explanation',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}