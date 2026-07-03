<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Question;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TeacherController extends Controller
{
    // No constructor needed – middleware applied in routes

    // ========== COURSE MANAGEMENT ==========
    public function index()
    {
        $courses = Course::where('teacher_id', auth()->id())->get();
        return view('teacher.courses.index', compact('courses'));
    }

    public function create()
    {
        return view('teacher.courses.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_per_question' => 'required|integer|min:5|max:300',
        ]);

        Course::create([
            'teacher_id' => auth()->id(),
            'name' => $request->name,
            'description' => $request->description,
            'time_per_question' => $request->time_per_question,
        ]);

        return redirect()->route('teacher.courses.index')->with('success', 'Course created successfully!');
    }

    public function edit(Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }
        return view('teacher.courses.edit', compact('course'));
    }

    public function update(Request $request, Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_per_question' => 'required|integer|min:5|max:300',
        ]);

        $course->update($request->all());

        return redirect()->route('teacher.courses.index')->with('success', 'Course updated successfully!');
    }

    public function destroy(Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }
        $course->delete();
        return redirect()->route('teacher.courses.index')->with('success', 'Course deleted successfully!');
    }

    // ========== QUESTION MANAGEMENT ==========
    public function questions($course_id)
    {
        $course = Course::where('teacher_id', auth()->id())->findOrFail($course_id);
        $questions = $course->questions;
        return view('teacher.questions.index', compact('course', 'questions'));
    }

    public function createQuestion($course_id)
    {
        $course = Course::where('teacher_id', auth()->id())->findOrFail($course_id);
        return view('teacher.questions.create', compact('course'));
    }

    public function storeQuestion(Request $request, $course_id)
    {
        $course = Course::where('teacher_id', auth()->id())->findOrFail($course_id);

        $request->validate([
            'question' => 'required|string',
            'option1' => 'required|string',
            'option2' => 'required|string',
            'option3' => 'required|string',
            'option4' => 'required|string',
            'correct_answer' => 'required|string',
            'explanation' => 'required|string',
        ]);

        $course->questions()->create($request->all());

        return redirect()->route('teacher.questions', $course_id)->with('success', 'Question added successfully!');
    }

    public function editQuestion($id)
    {
        $question = Question::findOrFail($id);
        $course = $question->course;

        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        return view('teacher.questions.edit', compact('question', 'course'));
    }

    public function updateQuestion(Request $request, $id)
    {
        $question = Question::findOrFail($id);
        $course = $question->course;

        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'question' => 'required|string',
            'option1' => 'required|string',
            'option2' => 'required|string',
            'option3' => 'required|string',
            'option4' => 'required|string',
            'correct_answer' => 'required|string',
            'explanation' => 'required|string',
        ]);

        $question->update($request->all());

        return redirect()->route('teacher.questions', $course->id)->with('success', 'Question updated successfully!');
    }

    public function destroyQuestion($id)
    {
        $question = Question::findOrFail($id);
        $course_id = $question->course_id;

        if ($question->course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $question->delete();

        return redirect()->route('teacher.questions', $course_id)->with('success', 'Question deleted successfully!');
    }

    // ========== AI QUESTION GENERATION ==========
    public function generateAIQuestion(Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:100',
            'course_id' => 'required|exists:courses,id',
        ]);

        $course = Course::findOrFail($request->course_id);
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $apiKey = config('services.gemini.api_key');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}";

        $prompt = "Generate one multiple-choice question about the topic \"{$request->topic}\" for a university-level course. Return ONLY valid JSON in this exact format: {\"question\":\"...\", \"options\":[\"A. ...\", \"B. ...\", \"C. ...\", \"D. ...\"], \"correct_answer\":\"A. ...\", \"explanation\":\"...\"}. Ensure the correct_answer exactly matches one of the option strings.";

        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->post($url, [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'AI service failed: ' . $response->body()], 500);
        }

        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $text = preg_replace('/```json|```/', '', $text);
        $data = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['question'], $data['options'], $data['correct_answer'], $data['explanation'])) {
            return response()->json(['error' => 'Invalid AI response format'], 500);
        }

        return response()->json($data);
    }

    // ========== SUSPICIOUS ATTEMPTS ==========
    public function suspiciousAttempts()
    {
        $course = Course::where('teacher_id', auth()->id())->where('name', 'Mobile Computing Lab')->firstOrFail();
        $attempts = QuizAttempt::where('course_id', $course->id)
            ->where('is_suspicious', true)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('teacher.suspicious', compact('attempts', 'course'));
    }
}