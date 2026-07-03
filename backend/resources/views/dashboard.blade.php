@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">👋 Welcome, {{ auth()->user()->name }}!</h1>

    @if(auth()->user()->is_teacher)
        <div class="bg-blue-100 p-4 rounded-lg mb-4">
            <h2 class="text-xl font-semibold">📚 Teacher Panel</h2>
            <a href="{{ route('teacher.courses.index') }}" class="text-blue-600 underline">Manage Courses</a> |
            <a href="{{ route('teacher.suspicious') }}" class="text-red-600 underline">View Suspicious Attempts</a>
        </div>
    @else
        <div class="bg-green-100 p-4 rounded-lg mb-4">
            <h2 class="text-xl font-semibold">📖 Student Panel</h2>
            <p>Available courses will be shown here.</p>
        </div>
    @endif

    <div class="mt-4">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded-lg">Logout</button>
        </form>
    </div>
</div>
@endsection