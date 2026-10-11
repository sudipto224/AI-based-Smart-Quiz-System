<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Services\MaterialTextExtractor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MaterialQuizController extends Controller
{
    public function show(Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Teacher/Questions/MaterialGenerator', [
            'course' => $course,
        ]);
    }

    public function generate(Request $request, Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'material' => 'required|file|mimes:pdf,pptx|max:10240',
            'question_count' => 'required|in:5,10',
        ]);

        $extractor = new MaterialTextExtractor();

        try {
            $materialText = $extractor->extract($request->file('material'));
        } catch (\Throwable $exception) {
            return back()->withErrors([
                'material' => $exception->getMessage(),
            ])->withInput();
        }

        try {
            $questions = $this->generateQuestionsFromMaterial(
                $course,
                $materialText,
                (int) $request->question_count
            );
        } catch (\Throwable $exception) {
            Log::error('Material AI generation failed', [
                'course_id' => $course->id,
                'course_name' => $course->name,
                'error' => $exception->getMessage(),
            ]);

            return back()->withErrors([
                'material' => 'AI service is temporarily unavailable. Please try again.',
            ])->withInput();
        }

        if (empty($questions)) {
            return back()->withErrors([
                'material' => 'AI returned an invalid set of questions. Please try again.',
            ])->withInput();
        }

        return Inertia::render('Teacher/Questions/MaterialPreview', [
            'course' => $course,
            'questions' => $questions,
            'question_count' => count($questions),
        ]);
    }

    public function save(Request $request, Course $course): RedirectResponse
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|size:4',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_answer' => 'required|string',
            'questions.*.explanation' => 'required|string',
        ]);

        $questions = $request->input('questions');
        $savedCount = 0;

        DB::transaction(function () use ($course, $questions, &$savedCount) {
            foreach ($questions as $questionData) {
                $options = array_map('trim', $questionData['options']);
                $correct = trim($questionData['correct_answer']);
                $questionText = trim($questionData['question']);
                $explanation = trim($questionData['explanation']);

                if ($questionText === '' || $explanation === '' || $correct === '') {
                    continue;
                }

                if (count($options) !== 4 || in_array('', $options, true)) {
                    continue;
                }

                if (!in_array($correct, $options, true)) {
                    continue;
                }

                if (count(array_unique(array_map('mb_strtolower', $options))) !== 4) {
                    continue;
                }

                $course->questions()->create([
                    'question' => $questionText,
                    'option1' => $options[0],
                    'option2' => $options[1],
                    'option3' => $options[2],
                    'option4' => $options[3],
                    'correct_answer' => $correct,
                    'explanation' => $explanation,
                ]);

                $savedCount++;
            }
        });

        return redirect()
            ->route('teacher.questions', $course->id)
            ->with('success', "{$savedCount} questions added successfully!");
    }

    private function generateQuestionsFromMaterial(
        Course $course,
        string $materialText,
        int $questionCount
    ): array {
        $apiKey = config('services.groq.api_key');

        if (empty($apiKey) || $apiKey === 'your_groq_api_key_here') {
            Log::error('Groq API key is missing or not set in .env');
            throw new \RuntimeException('AI configuration is missing.');
        }

        $url = 'https://api.groq.com/openai/v1/chat/completions';

        $systemPrompt = <<<PROMPT
You are an expert university-level educational MCQ generator.

Selected Course:
{$course->name}

Generate exactly {$questionCount} multiple-choice questions using ONLY the supplied course material.

STRICT RULES:

1. Every question must be directly related to the selected course and supported by the supplied material.
2. Use ONLY information found in the supplied material.
3. Do not mix information from unrelated courses or subjects.
4. Do not mention Mobile Computing unless it is genuinely part of the selected course/material.
5. Do not introduce seed numbers, timestamps, random values, artificial context, or unrelated examples.
6. Generate exactly the requested number of questions.
7. Every question must contain exactly four unique, non-empty options.
8. Exactly one option must be correct.
9. correct_answer must exactly match one of the four option strings.
10. Give a short, clear educational explanation.
11. Avoid duplicate or nearly identical questions.
12. Return ONLY valid JSON.

Required format:

{
    "questions": [
        {
            "question": "...",
            "options": [
                "A. ...",
                "B. ...",
                "C. ...",
                "D. ..."
            ],
            "correct_answer": "A. ...",
            "explanation": "..."
        }
    ]
}

COURSE MATERIAL:

{$materialText}
PROMPT;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])
            ->timeout(60)
            ->post($url, [
                'model' => 'openai/gpt-oss-120b',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                ],
                'temperature' => 0.3,
                'top_p' => 0.9,
                'response_format' => [
                    'type' => 'json_object',
                ],
            ]);

        if (!$response->successful()) {
            Log::error('Groq API error for material generator', [
                'status' => $response->status(),
                'body' => $response->body(),
                'course_id' => $course->id,
                'course_name' => $course->name,
            ]);

            throw new \RuntimeException('AI service is temporarily unavailable.');
        }

        $content = trim((string) $response->json('choices.0.message.content', ''));

        if ($content === '') {
            Log::error('Groq returned empty material response', ['course_id' => $course->id]);
            throw new \RuntimeException('AI returned no content.');
        }

        $content = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $content);
        $content = trim($content);

        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data) || !isset($data['questions']) || !is_array($data['questions'])) {
            Log::error('Invalid JSON from Groq material generator', ['content' => $content]);
            throw new \RuntimeException('AI returned invalid data.');
        }

        $questions = [];
        $questionTexts = [];

        foreach ($data['questions'] as $index => $item) {
            if (
                !is_array($item) ||
                empty($item['question']) ||
                !is_array($item['options']) ||
                count($item['options']) !== 4 ||
                empty($item['correct_answer']) ||
                empty($item['explanation'])
            ) {
                throw new \RuntimeException('AI returned invalid question structure.');
            }

            $options = array_map(fn ($option) => is_string($option) ? trim($option) : '', $item['options']);
            $questionText = trim($item['question']);
            $correctAnswer = trim($item['correct_answer']);
            $explanation = trim($item['explanation']);

            if (
                $questionText === '' ||
                $explanation === '' ||
                in_array('', $options, true) ||
                count(array_unique(array_map('mb_strtolower', $options))) !== 4 ||
                !in_array($correctAnswer, $options, true)
            ) {
                throw new \RuntimeException('AI returned invalid option or answer values.');
            }

            $normalizedQuestion = mb_strtolower(trim($questionText));
            if (in_array($normalizedQuestion, $questionTexts, true)) {
                throw new \RuntimeException('AI returned duplicate questions.');
            }

            $questionTexts[] = $normalizedQuestion;
            $questions[] = [
                'question' => $questionText,
                'options' => $options,
                'correct_answer' => $correctAnswer,
                'explanation' => $explanation,
            ];
        }

        if (count($questions) !== $questionCount) {
            Log::error('Groq returned wrong question count', [
                'expected' => $questionCount,
                'received' => count($questions),
                'content' => $content,
            ]);
            throw new \RuntimeException('AI returned an unexpected number of questions.');
        }

        return $questions;
    }
}
