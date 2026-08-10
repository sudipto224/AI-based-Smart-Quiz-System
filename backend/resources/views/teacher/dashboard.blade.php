@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="text-2xl font-bold mb-4">👋 Welcome, {{ auth()->user()->name }}!</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Manage Courses -->
        <div class="card">
            <h2 class="text-xl font-semibold mb-2">📚 Manage Courses</h2>
            <p class="text-gray-600 mb-4">Create, edit, or delete courses for your students.</p>
            <a href="{{ route('teacher.courses.index') }}" class="btn btn-primary">Go to Courses</a>
        </div>

        <!-- Suspicious Attempts -->
        <div class="card">
            <h2 class="text-xl font-semibold mb-2">🚨 Suspicious Attempts</h2>
            <p class="text-gray-600 mb-4">Review flagged quiz attempts for cheating detection.</p>
            <a href="{{ route('teacher.suspicious') }}" class="btn btn-danger">View Suspicious</a>
        </div>
    </div>
</div>
@endsection