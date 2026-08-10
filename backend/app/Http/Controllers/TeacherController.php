<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Question;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    // ===================== COURSE MANAGEMENT =====================

    public function index()
    {
        $courses = Course::where('teacher_id', auth()->id())->withCount('questions')->get();
        return Inertia::render('Teacher/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Teacher/Courses/Create');
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
        return Inertia::render('Teacher/Courses/Edit', [
            'course' => $course,
        ]);
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

    // ===================== QUESTION MANAGEMENT =====================

    public function questions($course_id)
    {
        $course = Course::with('questions')->where('teacher_id', auth()->id())->findOrFail($course_id);
        return Inertia::render('Teacher/Questions/Index', [
            'course' => $course,
            'questions' => $course->questions,
        ]);
    }

    public function createQuestion($course_id)
    {
        $course = Course::where('teacher_id', auth()->id())->findOrFail($course_id);
        return Inertia::render('Teacher/Questions/Create', [
            'course' => $course,
        ]);
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
        $question = Question::with('course')->findOrFail($id);
        if ($question->course->teacher_id !== auth()->id()) {
            abort(403);
        }
        return Inertia::render('Teacher/Questions/Edit', [
            'question' => $question,
            'course' => $question->course,
        ]);
    }

    public function updateQuestion(Request $request, $id)
    {
        $question = Question::findOrFail($id);
        if ($question->course->teacher_id !== auth()->id()) {
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

        return redirect()->route('teacher.questions', $question->course_id)->with('success', 'Question updated successfully!');
    }

    public function destroyQuestion($id)
    {
        $question = Question::findOrFail($id);
        if ($question->course->teacher_id !== auth()->id()) {
            abort(403);
        }
        $course_id = $question->course_id;
        $question->delete();

        return redirect()->route('teacher.questions', $course_id)->with('success', 'Question deleted successfully!');
    }

    // ===================== AI QUESTION GENERATION (WEEK 8 UPDATED) =====================

    public function generateAIQuestion(Request $request)
    {
        // Validate input
        $request->validate([
            'topic' => 'required|string|max:100',
            'course_id' => 'required|exists:courses,id',
        ]);

        $course = Course::findOrFail($request->course_id);
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        // Check if AI_MODE is 'dummy' or 'real'
        $aiMode = env('AI_MODE', 'real');

        if ($aiMode === 'dummy') {
            Log::info('AI_MODE is set to dummy – returning fallback question');
            return $this->generateDummyQuestion($request->topic);
        }

        // Try Groq API
        $result = $this->generateQuestionWithGroq($request->topic);
        if ($result) {
            return $result;
        }

        // Fallback to dummy if Groq fails
        Log::warning('Groq API failed – falling back to dummy question');
        return $this->generateDummyQuestion($request->topic);
    }

    /**
     * Generate question using Groq API (Llama 3.3 70B) - UPDATED PROMPT
     */
    private function generateQuestionWithGroq($topic)
    {
        $apiKey = config('services.groq.api_key');
        if (empty($apiKey) || $apiKey === 'your_groq_api_key_here') {
            Log::error('Groq API key is missing or not set in .env');
            return null;
        }

        $url = "https://api.groq.com/openai/v1/chat/completions";

        // Add randomness for variety
        $randomSeed = rand(1000, 9999);
        $timestamp = time();

        // ===== UPDATED PROMPT (WEEK 8) =====
        $systemPrompt = "You are an expert in mobile computing education. Generate high-quality, university-level multiple-choice questions that test conceptual understanding and practical knowledge.";

        $userPrompt = "Generate a unique, high-quality multiple-choice question about the topic '{$topic}' for a university-level mobile computing course. The question should test conceptual understanding. Return ONLY valid JSON in this exact format: {\"question\":\"...\", \"options\":[\"A. ...\", \"B. ...\", \"C. ...\", \"D. ...\"], \"correct_answer\":\"A. ...\", \"explanation\":\"...\"}. Ensure the correct_answer exactly matches one of the option strings. Make sure the explanation is clear, educational, and detailed. Use the seed number {$randomSeed} and timestamp {$timestamp} to vary the output.";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json'
            ])->timeout(30)->post($url, [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt]
                ],
                'temperature' => 1.0,
                'top_p' => 0.9,
                'response_format' => ['type' => 'json_object']
            ]);

            if (!$response->successful()) {
                Log::error('Groq API error: ' . $response->body());
                return null;
            }

            $content = $response->json()['choices'][0]['message']['content'] ?? '';
            $content = preg_replace('/```json|```/', '', $content);
            $data = json_decode($content, true);

            // Validate JSON structure
            if (json_last_error() !== JSON_ERROR_NONE || 
                !isset($data['question'], $data['options'], $data['correct_answer'], $data['explanation'])) {
                Log::error('Invalid JSON from Groq: ' . $content);
                return null;
            }

            // Validate that correct_answer exists in options
            $options = $data['options'];
            $correct = $data['correct_answer'];
            if (!in_array($correct, $options)) {
                Log::warning('Correct answer not found in options – adjusting');
                $data['correct_answer'] = $options[0] ?? $correct;
            }

            return response()->json($data);

        } catch (\Exception $e) {
            Log::error('Groq API exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Generate dummy (mock) question for fallback - UPDATED WITH BETTER RESPONSE
     */
    private function generateDummyQuestion($topic)
    {
        // Expanded dummy questions database
        $dummyQuestions = [
            'Mobile IP' => [
                'question' => 'What is the primary function of a Home Agent in Mobile IP?',
                'options' => [
                    'A. Maintains a permanent IP address for the mobile node',
                    'B. Forwards packets to the mobile node\'s current location',
                    'C. Encrypts all data transmission',
                    'D. Authenticates the user\'s password'
                ],
                'correct_answer' => 'A. Maintains a permanent IP address for the mobile node',
                'explanation' => 'The Home Agent is a router on the home network that maintains the mobile node\'s permanent IP address and forwards packets to the mobile node when it is away from home.'
            ],
            'Handoff' => [
                'question' => 'What is the main purpose of a handoff in mobile networks?',
                'options' => [
                    'A. To maintain continuous connectivity during movement',
                    'B. To increase data transmission speed',
                    'C. To encrypt user data',
                    'D. To authenticate the user'
                ],
                'correct_answer' => 'A. To maintain continuous connectivity during movement',
                'explanation' => 'Handoff (or handover) is the process of transferring an ongoing call or data session from one base station to another when a mobile user moves between cells, ensuring uninterrupted service.'
            ],
            'Ad hoc' => [
                'question' => 'What is an Ad Hoc Network?',
                'options' => [
                    'A. A network with fixed infrastructure',
                    'B. A decentralized network of mobile devices communicating directly',
                    'C. A network that requires a central server',
                    'D. A network only for voice communication'
                ],
                'correct_answer' => 'B. A decentralized network of mobile devices communicating directly',
                'explanation' => 'An Ad Hoc Network is a decentralized wireless network where each device participates in routing by forwarding data for other nodes, without relying on fixed infrastructure.'
            ],
            'Routing' => [
                'question' => 'What is a key challenge in mobile ad hoc network routing?',
                'options' => [
                    'A. Fixed topology',
                    'B. Dynamic topology due to node mobility',
                    'C. Unlimited bandwidth',
                    'D. Stable connections'
                ],
                'correct_answer' => 'B. Dynamic topology due to node mobility',
                'explanation' => 'In mobile ad hoc networks, the topology changes frequently as nodes move, making routing a significant challenge.'
            ]
        ];

        // Try to match topic
        $matched = false;
        $response = null;
        foreach ($dummyQuestions as $key => $data) {
            if (stripos($topic, $key) !== false) {
                $response = $data;
                $matched = true;
                break;
            }
        }

        // If no match, generate generic response
        if (!$matched) {
            $response = [
                'question' => "What is the role of {$topic} in mobile computing?",
                'options' => [
                    'A. First important function of ' . $topic,
                    'B. Second important function of ' . $topic,
                    'C. Third important function of ' . $topic,
                    'D. Fourth important function of ' . $topic
                ],
                'correct_answer' => 'A. First important function of ' . $topic,
                'explanation' => "This is a fallback question generated because the AI service is temporarily unavailable. Please try again later."
            ];
        }

        return response()->json($response);
    }

    // ===================== SUSPICIOUS ATTEMPTS =====================

    public function suspiciousAttempts()
    {
        // Get all courses belonging to this teacher
        $courseIds = Course::where('teacher_id', auth()->id())->pluck('id');
        
        if ($courseIds->isEmpty()) {
            return Inertia::render('Teacher/Suspicious', [
                'attempts' => [],
            ]);
        }

        // Get suspicious attempts for teacher's courses
        $attempts = QuizAttempt::whereIn('course_id', $courseIds)
            ->where('is_suspicious', true)
            ->with(['user', 'course'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Teacher/Suspicious', [
            'attempts' => $attempts,
        ]);
    }
}