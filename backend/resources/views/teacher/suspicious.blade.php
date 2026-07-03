@extends('layouts.app')

@section('title', 'Suspicious Attempts')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-bold text-red-600 mb-4">🚨 Suspicious Attempts</h1>
    <p class="mb-4">Course: <strong>{{ $course->name }}</strong></p>

    <table class="w-full border-collapse border">
        <thead>
            <tr class="bg-red-600 text-white">
                <th class="border p-2">Student</th>
                <th class="border p-2">Score</th>
                <th class="border p-2">Tab Switches</th>
                <th class="border p-2">Avg Time</th>
                <th class="border p-2">Attempted At</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attempts as $attempt)
            <tr class="border">
                <td class="border p-2">{{ $attempt->user->name }}</td>
                <td class="border p-2">{{ $attempt->score }}/{{ $attempt->total_questions }}</td>
                <td class="border p-2">{{ $attempt->tab_switch_count }}</td>
                <td class="border p-2">{{ number_format($attempt->avg_time_per_question, 1) }} sec</td>
                <td class="border p-2">{{ $attempt->created_at->format('Y-m-d H:i') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="mt-4">
        {{ $attempts->links() }}
    </div>
</div>
@endsection