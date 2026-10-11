<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Question;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TeacherController extends Controller
{
    // ===================== COURSE MANAGEMENT =====================

    public function index()
    {
        $this->ensureTeacher();

        $courses = Course::where('teacher_id', auth()->id())
            ->withCount('questions')
            ->get();

        return Inertia::render('Teacher/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        $this->ensureTeacher();

        return Inertia::render('Teacher/Courses/Create');
    }

    public function store(Request $request)
    {
        $this->ensureTeacher();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_per_question' => 'required|integer|min:5|max:300',
        ]);

        Course::create([
            'teacher_id' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'time_per_question' => $validated['time_per_question'],
        ]);

        return redirect()
            ->route('teacher.courses.index')
            ->with('success', 'Course created successfully!');
    }

    public function edit(Course $course)
    {
        $this->ensureTeacher();
        $this->ensureCourseOwner($course);

        return Inertia::render('Teacher/Courses/Edit', [
            'course' => $course,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $this->ensureTeacher();
        $this->ensureCourseOwner($course);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_per_question' => 'required|integer|min:5|max:300',
        ]);

        $course->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'time_per_question' => $validated['time_per_question'],
        ]);

        return redirect()
            ->route('teacher.courses.index')
            ->with('success', 'Course updated successfully!');
    }

    public function destroy(Course $course)
    {
        $this->ensureTeacher();
        $this->ensureCourseOwner($course);

        $course->delete();

        return redirect()
            ->route('teacher.courses.index')
            ->with('success', 'Course deleted successfully!');
    }

    // ===================== QUESTION MANAGEMENT =====================

    public function questions($course_id)
    {
        $this->ensureTeacher();

        $course = Course::with('questions')
            ->where('teacher_id', auth()->id())
            ->findOrFail($course_id);

        return Inertia::render('Teacher/Questions/Index', [
            'course' => $course,
            'questions' => $course->questions,
        ]);
    }

    public function createQuestion($course_id)
    {
        $this->ensureTeacher();

        $course = Course::where('teacher_id', auth()->id())
            ->findOrFail($course_id);

        return Inertia::render('Teacher/Questions/Create', [
            'course' => $course,
        ]);
    }

    public function storeQuestion(Request $request, $course_id)
    {
        $this->ensureTeacher();

        $course = Course::where('teacher_id', auth()->id())
            ->findOrFail($course_id);

        $validated = $request->validate([
            'question' => 'required|string',
            'option1' => 'required|string',
            'option2' => 'required|string',
            'option3' => 'required|string',
            'option4' => 'required|string',
            'correct_answer' => 'required|string',
            'explanation' => 'required|string',
        ]);

        $options = [
            trim($validated['option1']),
            trim($validated['option2']),
            trim($validated['option3']),
            trim($validated['option4']),
        ];

        if (!$this->hasFourUniqueOptions($options)) {
            return back()
                ->withErrors([
                    'option1' =>
                        'All four options must be non-empty and unique.',
                ])
                ->withInput();
        }

        $correctAnswer = trim($validated['correct_answer']);

        if (!in_array($correctAnswer, $options, true)) {
            return back()
                ->withErrors([
                    'correct_answer' =>
                        'Correct answer must exactly match one of the four options.',
                ])
                ->withInput();
        }

        $course->questions()->create([
            'question' => trim($validated['question']),
            'option1' => $options[0],
            'option2' => $options[1],
            'option3' => $options[2],
            'option4' => $options[3],
            'correct_answer' => $correctAnswer,
            'explanation' => trim($validated['explanation']),
        ]);

        return redirect()
            ->route('teacher.questions', $course_id)
            ->with('success', 'Question added successfully!');
    }

    public function editQuestion($id)
    {
        $this->ensureTeacher();

        $question = Question::with('course')->findOrFail($id);

        if (
            (int) $question->course->teacher_id !==
            (int) auth()->id()
        ) {
            abort(403);
        }

        return Inertia::render('Teacher/Questions/Edit', [
            'question' => $question,
            'course' => $question->course,
        ]);
    }

    public function updateQuestion(Request $request, $id)
    {
        $this->ensureTeacher();

        $question = Question::with('course')->findOrFail($id);

        if (
            (int) $question->course->teacher_id !==
            (int) auth()->id()
        ) {
            abort(403);
        }

        $validated = $request->validate([
            'question' => 'required|string',
            'option1' => 'required|string',
            'option2' => 'required|string',
            'option3' => 'required|string',
            'option4' => 'required|string',
            'correct_answer' => 'required|string',
            'explanation' => 'required|string',
        ]);

        $options = [
            trim($validated['option1']),
            trim($validated['option2']),
            trim($validated['option3']),
            trim($validated['option4']),
        ];

        if (!$this->hasFourUniqueOptions($options)) {
            return back()
                ->withErrors([
                    'option1' =>
                        'All four options must be non-empty and unique.',
                ])
                ->withInput();
        }

        $correctAnswer = trim($validated['correct_answer']);

        if (!in_array($correctAnswer, $options, true)) {
            return back()
                ->withErrors([
                    'correct_answer' =>
                        'Correct answer must exactly match one of the four options.',
                ])
                ->withInput();
        }

        $question->update([
            'question' => trim($validated['question']),
            'option1' => $options[0],
            'option2' => $options[1],
            'option3' => $options[2],
            'option4' => $options[3],
            'correct_answer' => $correctAnswer,
            'explanation' => trim($validated['explanation']),
        ]);

        return redirect()
            ->route(
                'teacher.questions',
                $question->course_id
            )
            ->with(
                'success',
                'Question updated successfully!'
            );
    }

    public function destroyQuestion($id)
    {
        $this->ensureTeacher();

        $question = Question::with('course')->findOrFail($id);

        if (
            (int) $question->course->teacher_id !==
            (int) auth()->id()
        ) {
            abort(403);
        }

        $courseId = $question->course_id;

        $question->delete();

        return redirect()
            ->route('teacher.questions', $courseId)
            ->with(
                'success',
                'Question deleted successfully!'
            );
    }

    // ===================== AI QUESTION GENERATION =====================

    public function generateAIQuestion(Request $request)
    {
        $this->ensureTeacher();

        $validated = $request->validate([
            'topic' => 'required|string|max:150',
            'course_id' => 'required|exists:courses,id',
        ]);

        $course = Course::where(
            'teacher_id',
            auth()->id()
        )->findOrFail(
            $validated['course_id']
        );

        $topic = trim(
            $validated['topic']
        );

        $result = $this->generateQuestionWithGroq(
            $course,
            $topic
        );

        if ($result !== null) {
            return response()->json(
                $result
            );
        }

        return response()->json([
            'message' =>
                "AI service is temporarily unavailable. Please try again or create the '{$topic}' question manually for {$course->name}.",
        ], 503);
    }

    private function generateQuestionWithGroq(
        Course $course,
        string $topic
    ): ?array {
        $apiKey = config(
            'services.groq.api_key'
        );

        if (
            empty($apiKey) ||
            $apiKey === 'your_groq_api_key_here'
        ) {
            Log::error(
                'Groq API key is missing or not set in .env'
            );

            return null;
        }

        $url =
            'https://api.groq.com/openai/v1/chat/completions';

        $model =
            'openai/gpt-oss-120b';

        $existingQuestions =
            $course->questions()
                ->latest()
                ->limit(15)
                ->pluck('question')
                ->filter()
                ->values()
                ->all();

        $existingQuestionText =
            empty($existingQuestions)
                ? 'None.'
                : "- " .
                    implode(
                        "\n- ",
                        $existingQuestions
                    );

        $systemPrompt = <<<PROMPT
You are an expert university-level educational MCQ generator.

Generate exactly ONE academically accurate multiple-choice question.

STRICT RULES:
1. Use ONLY the selected course and selected topic.
2. Never mix unrelated courses or subjects.
3. Do not mention Mobile Computing unless it is genuinely relevant.
4. Do not add seed values, timestamps, random numbers, or artificial context.
5. Generate exactly four unique, non-empty options.
6. Exactly one option must be correct.
7. correct_answer must exactly match one complete option string.
8. Provide a clear educational explanation.
9. Return ONLY valid JSON.
10. Do not include Markdown, headings, or code fences.
PROMPT;

        $userPrompt = <<<PROMPT
Selected Course: {$course->name}
Selected Topic: {$topic}

Generate one university-level MCQ strictly for this course and topic.

Do not copy or closely repeat these existing questions:
{$existingQuestionText}

Return exactly this JSON structure:
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
PROMPT;

        try {
            $response =
                Http::withHeaders([
                    'Authorization' =>
                        'Bearer ' . $apiKey,
                    'Content-Type' =>
                        'application/json',
                ])
                    ->timeout(35)
                    ->post(
                        $url,
                        [
                            'model' =>
                                $model,

                            'messages' => [
                                [
                                    'role' =>
                                        'system',
                                    'content' =>
                                        $systemPrompt,
                                ],
                                [
                                    'role' =>
                                        'user',
                                    'content' =>
                                        $userPrompt,
                                ],
                            ],

                            'temperature' =>
                                0.65,

                            'top_p' =>
                                0.9,

                            'response_format' => [
                                'type' =>
                                    'json_object',
                            ],
                        ]
                    );

            if (
                !$response->successful()
            ) {
                Log::error(
                    'Groq API error',
                    [
                        'status' =>
                            $response->status(),

                        'body' =>
                            $response->body(),

                        'course_id' =>
                            $course->id,

                        'topic' =>
                            $topic,

                        'requested_model' =>
                            $model,
                    ]
                );

                return null;
            }

            Log::info(
                'Groq AI model used',
                [
                    'requested_model' =>
                        $model,

                    'served_model' =>
                        $response->json(
                            'model'
                        ),

                    'course_id' =>
                        $course->id,

                    'course_name' =>
                        $course->name,

                    'topic' =>
                        $topic,
                ]
            );

            $content = trim(
                (string)
                $response->json(
                    'choices.0.message.content',
                    ''
                )
            );

            if ($content === '') {
                return null;
            }

            $content =
                preg_replace(
                    '/^```(?:json)?\s*|\s*```$/i',
                    '',
                    $content
                );

            $data =
                json_decode(
                    trim($content),
                    true
                );

            if (
                json_last_error() !==
                    JSON_ERROR_NONE ||
                !is_array($data)
            ) {
                Log::error(
                    'Invalid JSON from Groq',
                    [
                        'json_error' =>
                            json_last_error_msg(),
                    ]
                );

                return null;
            }

            if (
                !isset(
                    $data['question'],
                    $data['options'],
                    $data['correct_answer'],
                    $data['explanation']
                ) ||
                !is_string(
                    $data['question']
                ) ||
                !is_array(
                    $data['options']
                ) ||
                !is_string(
                    $data['correct_answer']
                ) ||
                !is_string(
                    $data['explanation']
                )
            ) {
                return null;
            }

            $questionText =
                trim(
                    $data['question']
                );

            $correctAnswer =
                trim(
                    $data['correct_answer']
                );

            $explanation =
                trim(
                    $data['explanation']
                );

            $options =
                array_values(
                    array_map(
                        fn ($option) =>
                            is_string($option)
                                ? trim($option)
                                : '',
                        $data['options']
                    )
                );

            if (
                $questionText === '' ||
                $explanation === '' ||
                !$this->hasFourUniqueOptions(
                    $options
                )
            ) {
                return null;
            }

            if (
                !in_array(
                    $correctAnswer,
                    $options,
                    true
                )
            ) {
                return null;
            }

            $duplicateExists =
                $course->questions()
                    ->whereRaw(
                        'LOWER(TRIM(question)) = ?',
                        [
                            mb_strtolower(
                                $questionText
                            ),
                        ]
                    )
                    ->exists();

            if ($duplicateExists) {
                Log::warning(
                    'Groq generated a duplicate question',
                    [
                        'course_id' =>
                            $course->id,

                        'question' =>
                            $questionText,
                    ]
                );

                return null;
            }

            return [
                'question' =>
                    $questionText,

                'options' =>
                    $options,

                'correct_answer' =>
                    $correctAnswer,

                'explanation' =>
                    $explanation,

                'course' =>
                    $course->name,

                'topic' =>
                    $topic,
            ];

        } catch (\Throwable $e) {
            Log::error(
                'Groq API exception',
                [
                    'message' =>
                        $e->getMessage(),

                    'course_id' =>
                        $course->id,

                    'topic' =>
                        $topic,

                    'requested_model' =>
                        $model,
                ]
            );

            return null;
        }
    }

    // ===================== AI DISTRACTOR QUALITY CHECKER =====================

    public function checkQuestionQuality(
        Request $request
    ) {
        $this->ensureTeacher();

        $validated =
            $request->validate([
                'course_id' =>
                    'required|exists:courses,id',

                'question' =>
                    'required|string|max:2000',

                'option1' =>
                    'required|string|max:1000',

                'option2' =>
                    'required|string|max:1000',

                'option3' =>
                    'required|string|max:1000',

                'option4' =>
                    'required|string|max:1000',

                'correct_answer' =>
                    'required|string|max:1000',
            ]);

        $course =
            Course::where(
                'teacher_id',
                auth()->id()
            )->findOrFail(
                $validated['course_id']
            );

        $options = [
            trim(
                $validated['option1']
            ),

            trim(
                $validated['option2']
            ),

            trim(
                $validated['option3']
            ),

            trim(
                $validated['option4']
            ),
        ];

        if (
            !$this->hasFourUniqueOptions(
                $options
            )
        ) {
            return response()->json([
                'message' =>
                    'Please provide four unique, non-empty options before running the quality check.',
            ], 422);
        }

        $correctAnswer =
            trim(
                $validated['correct_answer']
            );

        if (
            !in_array(
                $correctAnswer,
                $options,
                true
            )
        ) {
            return response()->json([
                'message' =>
                    'Correct answer must exactly match one of the four options.',
            ], 422);
        }

        $apiKey =
            config(
                'services.groq.api_key'
            );

        if (
            empty($apiKey) ||
            $apiKey ===
                'your_groq_api_key_here'
        ) {
            return response()->json([
                'message' =>
                    'AI service is not configured.',
            ], 503);
        }

        $url =
            'https://api.groq.com/openai/v1/chat/completions';

        $model =
            'openai/gpt-oss-120b';

        $questionPayload =
            json_encode(
                [
                    'course' =>
                        $course->name,

                    'question' =>
                        trim(
                            $validated[
                                'question'
                            ]
                        ),

                    'options' =>
                        $options,

                    'correct_answer' =>
                        $correctAnswer,
                ],

                JSON_PRETTY_PRINT |
                JSON_UNESCAPED_UNICODE
            );

        $systemPrompt = <<<PROMPT
You are an expert university-level MCQ assessment-quality reviewer.

Do NOT solve the question. Review how well the MCQ is constructed.

Evaluate:
1. Whether the question stem is clear and unambiguous.
2. Whether exactly one answer is defensibly correct.
3. Whether the three incorrect options are plausible distractors.
4. Whether any distractor is obviously silly, unrelated, or too weak.
5. Whether options duplicate each other or have nearly identical meaning.
6. Whether the correct answer is accidentally obvious because it is much longer, more detailed, or differently formatted.
7. Whether grammatical clues reveal the correct answer.
8. Whether options are reasonably balanced in style, specificity, and length.
9. Whether distractors represent realistic misconceptions.
10. Whether this MCQ is appropriate for a university-level quiz.

Return ONLY valid JSON.

Use exactly:
{
  "score": 85,
  "verdict": "Good",
  "strengths": ["..."],
  "issues": ["..."],
  "suggestions": ["..."],
  "option_analysis": [
    {
      "option": "...",
      "role": "correct",
      "quality": "strong",
      "reason": "..."
    }
  ]
}

Rules:
score = integer from 0 to 100.

verdict must be:
Excellent
Good
Needs Improvement
Poor

role must be:
correct
distractor

quality must be:
strong
medium
weak

option_analysis must include all four options.

No Markdown.
No code fences.
PROMPT;

        $userPrompt = <<<PROMPT
Review this MCQ from the course "{$course->name}":

{$questionPayload}
PROMPT;

        try {
            $response =
                Http::withHeaders([
                    'Authorization' =>
                        'Bearer ' . $apiKey,

                    'Content-Type' =>
                        'application/json',
                ])
                    ->timeout(35)
                    ->post(
                        $url,
                        [
                            'model' =>
                                $model,

                            'messages' => [
                                [
                                    'role' =>
                                        'system',

                                    'content' =>
                                        $systemPrompt,
                                ],

                                [
                                    'role' =>
                                        'user',

                                    'content' =>
                                        $userPrompt,
                                ],
                            ],

                            'temperature' =>
                                0.2,

                            'top_p' =>
                                0.9,

                            'response_format' => [
                                'type' =>
                                    'json_object',
                            ],
                        ]
                    );

            if (
                !$response->successful()
            ) {
                Log::error(
                    'Question quality checker Groq error',
                    [
                        'status' =>
                            $response->status(),

                        'course_id' =>
                            $course->id,

                        'requested_model' =>
                            $model,
                    ]
                );

                return response()->json([
                    'message' =>
                        'AI quality check failed. Please try again.',
                ], 503);
            }

            Log::info(
                'Groq AI model used for question quality check',
                [
                    'requested_model' =>
                        $model,

                    'served_model' =>
                        $response->json(
                            'model'
                        ),

                    'course_id' =>
                        $course->id,

                    'course_name' =>
                        $course->name,
                ]
            );

            $content =
                trim(
                    (string)
                    $response->json(
                        'choices.0.message.content',
                        ''
                    )
                );

            $content =
                preg_replace(
                    '/^```(?:json)?\s*|\s*```$/i',
                    '',
                    $content
                );

            $data =
                json_decode(
                    trim($content),
                    true
                );

            if (
                json_last_error() !==
                    JSON_ERROR_NONE ||
                !is_array($data)
            ) {
                return response()->json([
                    'message' =>
                        'AI returned an invalid quality-analysis response.',
                ], 503);
            }

            $allowedVerdicts = [
                'Excellent',
                'Good',
                'Needs Improvement',
                'Poor',
            ];

            $allowedQualities = [
                'strong',
                'medium',
                'weak',
            ];

            $allowedRoles = [
                'correct',
                'distractor',
            ];

            $score =
                max(
                    0,
                    min(
                        100,
                        (int)
                        (
                            $data['score']
                            ?? 0
                        )
                    )
                );

            $verdict =
                $data['verdict']
                ?? 'Needs Improvement';

            if (
                !in_array(
                    $verdict,
                    $allowedVerdicts,
                    true
                )
            ) {
                $verdict =
                    'Needs Improvement';
            }

            $strengths =
                $this->cleanStringList(
                    $data['strengths']
                    ?? []
                );

            $issues =
                $this->cleanStringList(
                    $data['issues']
                    ?? []
                );

            $suggestions =
                $this->cleanStringList(
                    $data['suggestions']
                    ?? []
                );

            $optionAnalysis = [];

            if (
                is_array(
                    $data[
                        'option_analysis'
                    ] ?? null
                )
            ) {
                foreach (
                    $data[
                        'option_analysis'
                    ] as $item
                ) {
                    if (
                        !is_array($item)
                    ) {
                        continue;
                    }

                    $option =
                        trim(
                            (string)
                            (
                                $item['option']
                                ?? ''
                            )
                        );

                    $role =
                        (string)
                        (
                            $item['role']
                            ?? 'distractor'
                        );

                    $quality =
                        (string)
                        (
                            $item['quality']
                            ?? 'medium'
                        );

                    $reason =
                        trim(
                            (string)
                            (
                                $item['reason']
                                ?? ''
                            )
                        );

                    if (
                        $option === '' ||
                        $reason === ''
                    ) {
                        continue;
                    }

                    if (
                        !in_array(
                            $role,
                            $allowedRoles,
                            true
                        )
                    ) {
                        $role =
                            $option ===
                            $correctAnswer
                                ? 'correct'
                                : 'distractor';
                    }

                    if (
                        !in_array(
                            $quality,
                            $allowedQualities,
                            true
                        )
                    ) {
                        $quality =
                            'medium';
                    }

                    $optionAnalysis[] = [
                        'option' =>
                            $option,

                        'role' =>
                            $role,

                        'quality' =>
                            $quality,

                        'reason' =>
                            $reason,
                    ];
                }
            }

            foreach (
                $options as $option
            ) {
                $exists =
                    collect(
                        $optionAnalysis
                    )->contains(
                        fn ($item) =>
                            $item['option']
                            === $option
                    );

                if (!$exists) {
                    $optionAnalysis[] = [
                        'option' =>
                            $option,

                        'role' =>
                            $option ===
                            $correctAnswer
                                ? 'correct'
                                : 'distractor',

                        'quality' =>
                            'medium',

                        'reason' =>
                            'The AI did not return a separate analysis for this option.',
                    ];
                }
            }

            return response()->json([
                'score' =>
                    $score,

                'verdict' =>
                    $verdict,

                'strengths' =>
                    $strengths,

                'issues' =>
                    $issues,

                'suggestions' =>
                    $suggestions,

                'option_analysis' =>
                    array_values(
                        $optionAnalysis
                    ),
            ]);

        } catch (\Throwable $e) {
            Log::error(
                'Question quality checker exception',
                [
                    'message' =>
                        $e->getMessage(),

                    'course_id' =>
                        $course->id,

                    'requested_model' =>
                        $model,
                ]
            );

            return response()->json([
                'message' =>
                    'AI quality checker is temporarily unavailable.',
            ], 503);
        }
    }

    // ===================== SUSPICIOUS ATTEMPTS =====================

    public function suspiciousAttempts()
    {
        $this->ensureTeacher();

        $courseIds =
            Course::where(
                'teacher_id',
                auth()->id()
            )->pluck('id');

        if (
            $courseIds->isEmpty()
        ) {
            return Inertia::render(
                'Teacher/Suspicious',
                [
                    'attempts' => [],
                ]
            );
        }

        $attempts =
            QuizAttempt::whereIn(
                'course_id',
                $courseIds
            )
                ->where(
                    'is_suspicious',
                    true
                )
                ->with([
                    'user',
                    'course',
                ])
                ->orderBy(
                    'created_at',
                    'desc'
                )
                ->get();

        return Inertia::render(
            'Teacher/Suspicious',
            [
                'attempts' =>
                    $attempts,
            ]
        );
    }

    // ===================== HELPERS =====================

    private function ensureTeacher(): void
    {
        if (
            !auth()->check() ||
            !auth()->user()->is_teacher
        ) {
            abort(403);
        }
    }

    private function ensureCourseOwner(
        Course $course
    ): void {
        if (
            (int)
            $course->teacher_id !==
            (int)
            auth()->id()
        ) {
            abort(403);
        }
    }

    private function hasFourUniqueOptions(
        array $options
    ): bool {
        if (
            count($options) !== 4
        ) {
            return false;
        }

        $normalised =
            array_map(
                fn ($option) =>
                    mb_strtolower(
                        trim(
                            (string)
                            $option
                        )
                    ),
                $options
            );

        if (
            in_array(
                '',
                $normalised,
                true
            )
        ) {
            return false;
        }

        return
            count(
                array_unique(
                    $normalised
                )
            ) === 4;
    }

    private function cleanStringList(
        $value
    ): array {
        if (
            !is_array($value)
        ) {
            return [];
        }

        return array_values(
            array_filter(
                array_map(
                    fn ($item) =>
                        is_string($item)
                            ? trim($item)
                            : '',
                    $value
                )
            )
        );
    }
}