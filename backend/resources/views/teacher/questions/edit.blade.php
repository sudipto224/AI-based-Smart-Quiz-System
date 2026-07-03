@extends('layouts.app')

@section('title', 'Edit Question')

@section('content')
<div class="container mx-auto max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">✏️ Edit Question</h1>
    <form action="{{ route('teacher.questions.update', $question->id) }}" method="POST" class="space-y-4">
        @csrf @method('PUT')
        <div>
            <label class="block font-semibold">Question Text</label>
            <textarea name="question" required class="w-full border p-2 rounded-lg">{{ $question->question }}</textarea>
        </div>
        <div>
            <label class="block font-semibold">Option 1</label>
            <input type="text" name="option1" value="{{ $question->option1 }}" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Option 2</label>
            <input type="text" name="option2" value="{{ $question->option2 }}" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Option 3</label>
            <input type="text" name="option3" value="{{ $question->option3 }}" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Option 4</label>
            <input type="text" name="option4" value="{{ $question->option4 }}" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Correct Answer</label>
            <input type="text" name="correct_answer" value="{{ $question->correct_answer }}" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Explanation</label>
            <textarea name="explanation" required class="w-full border p-2 rounded-lg">{{ $question->explanation }}</textarea>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg">Update Question</button>
    </form>
</div>
@endsection