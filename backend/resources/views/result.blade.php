@extends('layouts.app')

@section('title', 'Result')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">🎯 Quiz Result</h1>

    <div class="bg-gray-100 p-4 rounded-lg mb-4">
        <p class="text-xl">Score: <strong>{{ $attempt->score }}/{{ $attempt->total_questions }}</strong></p>
        <p>Time taken: {{ $attempt->time_taken }}</p>
    </div>

    @if($attempt->is_suspicious)
        <div class="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
            ⚠️ This attempt will be reviewed by the teacher.
        </div>
    @endif

    <a href="{{ route('leaderboard.show', $attempt->course_id) }}" class="bg-blue-600 text-white px-4 py-2 rounded-lg">🏆 View Leaderboard</a>
</div>
@endsection