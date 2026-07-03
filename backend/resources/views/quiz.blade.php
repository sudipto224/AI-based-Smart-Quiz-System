@extends('layouts.app')

@section('title', 'Quiz')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">📝 Quiz: {{ $course->name }}</h1>

    <form action="{{ route('quiz.submit') }}" method="POST" id="quizForm">
        @csrf
        <input type="hidden" name="course_id" value="{{ $course->id }}">
        <input type="hidden" name="tab_switch_count" id="tab_switch_count" value="0">
        <input type="hidden" name="quiz_start_time" id="quiz_start_time" value="">

        @foreach($questions as $index => $question)
        <div class="border p-4 rounded-lg shadow mb-4">
            <p class="font-semibold">Q{{ $index+1 }}. {{ $question->question }}</p>
            <div class="ml-4 space-y-1 mt-2">
                <label><input type="radio" name="answers[{{ $question->id }}]" value="{{ $question->option1 }}"> {{ $question->option1 }}</label><br>
                <label><input type="radio" name="answers[{{ $question->id }}]" value="{{ $question->option2 }}"> {{ $question->option2 }}</label><br>
                <label><input type="radio" name="answers[{{ $question->id }}]" value="{{ $question->option3 }}"> {{ $question->option3 }}</label><br>
                <label><input type="radio" name="answers[{{ $question->id }}]" value="{{ $question->option4 }}"> {{ $question->option4 }}</label>
            </div>
        </div>
        @endforeach

        <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg">✅ Submit Quiz</button>
    </form>
</div>

<script>
    document.getElementById('quiz_start_time').value = Date.now();

    let tabSwitchCount = 0;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            tabSwitchCount++;
            document.getElementById('tab_switch_count').value = tabSwitchCount;
            console.log('Tab switched:', tabSwitchCount);
        }
    });
</script>
@endsection