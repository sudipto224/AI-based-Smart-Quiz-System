@extends('layouts.app')

@section('title', 'Create Course')

@section('content')
<div class="container mx-auto max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">➕ Create New Course</h1>
    <form action="{{ route('teacher.courses.store') }}" method="POST" class="space-y-4">
        @csrf
        <div>
            <label class="block font-semibold">Course Name</label>
            <input type="text" name="name" required class="w-full border p-2 rounded-lg">
        </div>
        <div>
            <label class="block font-semibold">Description</label>
            <textarea name="description" class="w-full border p-2 rounded-lg"></textarea>
        </div>
        <div>
            <label class="block font-semibold">Time Per Question (seconds)</label>
            <input type="number" name="time_per_question" value="30" min="5" max="300" required class="w-full border p-2 rounded-lg">
        </div>
        <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg">Save Course</button>
    </form>
</div>
@endsection