@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="text-2xl font-bold mb-4">👋 Welcome, {{ auth()->user()->name }}!</h1>

    <div class="card">
        <h2 class="text-xl font-semibold mb-4">📖 Available Courses</h2>

        @if($courses->isEmpty())
            <p class="text-gray-500">No courses available right now. Please check back later.</p>
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($courses as $course)
                <div class="border rounded-lg p-4 shadow-sm">
                    <h3 class="font-semibold text-lg">{{ $course->name }}</h3>
                    <p class="text-gray-600 text-sm">{{ $course->description }}</p>
                    <p class="text-sm text-gray-500 mt-1">⏱️ {{ $course->time_per_question }} sec per question</p>
                    <a href="{{ route('quiz.show', $course->id) }}" class="btn btn-success mt-2 inline-block">Start Quiz</a>
                </div>
                @endforeach
            </div>
        @endif
    </div>

    <!-- Leaderboard Link -->
    <div class="mt-4">
        <a href="{{ route('leaderboard.show', 1) }}" class="btn btn-primary">🏆 View Leaderboard</a>
    </div>
</div>
@endsection