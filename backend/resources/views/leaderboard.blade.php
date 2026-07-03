@extends('layouts.app')

@section('title', 'Leaderboard')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">🏆 Leaderboard – {{ $course->name }}</h1>

    <table class="w-full border-collapse border">
        <thead>
            <tr class="bg-blue-600 text-white">
                <th class="border p-2">#</th>
                <th class="border p-2">Student</th>
                <th class="border p-2">Score</th>
                <th class="border p-2">Time</th>
            </tr>
        </thead>
        <tbody>
            @foreach($leaderboard as $index => $attempt)
            <tr class="border">
                <td class="border p-2 text-center">{{ $index+1 }}</td>
                <td class="border p-2">{{ $attempt->user->name }}</td>
                <td class="border p-2">{{ $attempt->score }}/{{ $attempt->total_questions }}</td>
                <td class="border p-2">{{ $attempt->time_taken }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($leaderboard->isEmpty())
        <p class="text-gray-500 mt-4">No attempts yet. Be the first!</p>
    @endif
</div>
@endsection