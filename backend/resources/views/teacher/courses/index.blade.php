@extends('layouts.app')

@section('title', 'My Courses')

@section('content')
<div class="container mx-auto">
    <div class="flex justify-between items-center mb-4">
        <h1 style="font-size:24px; font-weight:bold;">📚 My Courses</h1>
        <a href="{{ route('teacher.courses.create') }}" style="display:inline-block; background-color:#2563eb; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">+ Create New Course</a>
    </div>

    @if(session('success'))
        <div style="background-color:#d1fae5; color:#065f46; padding:12px; border-radius:8px; margin-bottom:16px;">
            {{ session('success') }}
        </div>
    @endif

    @if($courses->isEmpty())
        <p style="color:#6b7280;">No courses found. Click "Create New Course" to add one.</p>
    @else
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            @foreach($courses as $course)
            <div style="border:1px solid #e5e7eb; padding:16px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="font-size:18px; font-weight:600;">{{ $course->name }}</h2>
                <p style="color:#4b5563;">{{ $course->description }}</p>
                <p style="font-size:14px; color:#6b7280;">⏱️ {{ $course->time_per_question }} sec per question</p>
                <div style="margin-top:8px; display:flex; gap:8px;">
                    <a href="{{ route('teacher.courses.edit', $course) }}" style="color:#2563eb; text-decoration:underline;">Edit</a>
                    <form action="{{ route('teacher.courses.destroy', $course) }}" method="POST" style="display:inline;">
                        @csrf @method('DELETE')
                        <button type="submit" style="color:#dc2626; text-decoration:underline; background:none; border:none; cursor:pointer;" onclick="return confirm('Delete this course?')">Delete</button>
                    </form>
                    <a href="{{ route('teacher.questions', $course->id) }}" style="color:#16a34a; text-decoration:underline;">Questions</a>
                </div>
            </div>
            @endforeach
        </div>
    @endif
</div>
@endsection