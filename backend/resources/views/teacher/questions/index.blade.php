@extends('layouts.app')

@section('title', 'Questions')

@section('content')
<div class="container mx-auto">
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">❓ Questions for {{ $course->name }}</h1>
        <a href="{{ route('teacher.questions.create', $course->id) }}" class="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Question</a>
    </div>

    @if(session('success'))
        <div class="bg-green-100 text-green-800 p-3 rounded-lg mb-4">{{ session('success') }}</div>
    @endif

    <div class="space-y-4">
        @foreach($questions as $question)
        <div class="border p-4 rounded-lg shadow">
            <p class="font-semibold">{{ $question->question }}</p>
            <div class="text-sm text-gray-600 mt-1">
                <span>✅ Correct: {{ $question->correct_answer }}</span>
            </div>
            <div class="mt-2 space-x-2">
                <a href="{{ route('teacher.questions.edit', $question->id) }}" class="text-blue-600 underline">Edit</a>
                <form action="{{ route('teacher.questions.destroy', $question->id) }}" method="POST" class="inline">
                    @csrf @method('DELETE')
                    <button type="submit" class="text-red-600 underline" onclick="return confirm('Delete this question?')">Delete</button>
                </form>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection