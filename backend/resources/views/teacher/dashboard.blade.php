@extends('layouts.app')

@section('title', 'Teacher Dashboard')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">👋 Welcome, {{ auth()->user()->name }}!</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-blue-100 p-4 rounded-lg">
            <h2 class="text-xl font-semibold">📚 Courses</h2>
            <a href="{{ route('teacher.courses.index') }}" class="text-blue-600 underline">Manage Courses</a>
        </div>
        <div class="bg-red-100 p-4 rounded-lg">
            <h2 class="text-xl font-semibold">🚨 Suspicious Attempts</h2>
            <a href="{{ route('teacher.suspicious') }}" class="text-red-600 underline">View Suspicious</a>
        </div>
    </div>
</div>
@endsection