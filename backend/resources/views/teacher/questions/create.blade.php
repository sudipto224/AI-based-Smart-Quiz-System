@extends('layouts.app')

@section('title', 'Add Question')

@section('content')
<div class="container mx-auto max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">➕ Add Question for {{ $course->name }}</h1>
    <form action="{{ route('teacher.questions.store', $course->id) }}" method="POST" class="space-y-4">
        @csrf
        <div>
            <label class="block font-semibold">Question Text</label>
            <textarea name="question" required class="w-full border p-2 rounded-lg"></textarea>
        </div>
        <div>
            <label class="block font-semibold">Option 1</label>
            <input type="text" name="option1" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Option 2</label>
            <input type="text" name="option2" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Option 3</label>
            <input type="text" name="option3" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Option 4</label>
            <input type="text" name="option4" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Correct Answer (exact text)</label>
            <input type="text" name="correct_answer" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Explanation</label>
            <textarea name="explanation" required class="w-full border p-2 rounded-lg"></textarea>
        </div>
        <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg">Save Question</button>
    </form>
</div>
@endsection