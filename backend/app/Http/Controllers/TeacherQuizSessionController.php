<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\QuizSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherQuizSessionController extends Controller
{
    public function index()
    {
        $this->ensureTeacher();

        $activeSessions =
            QuizSession::where(
                'teacher_id',
                auth()->id()
            )
                ->where(
                    'status',
                    'active'
                )
                ->get();

        foreach (
            $activeSessions as $session
        ) {
            $this->refreshSessionState(
                $session
            );
        }

        $courses =
            Course::where(
                'teacher_id',
                auth()->id()
            )
                ->withCount(
                    'questions'
                )
                ->orderBy('name')
                ->get();

        $sessions =
            QuizSession::where(
                'teacher_id',
                auth()->id()
            )
                ->with(
                    'course'
                )
                ->withCount(
                    'questions'
                )
                ->withCount(
                    'participants'
                )
                ->withCount([
                    'participants as submitted_count'
                        => function (
                            $query
                        ) {
                            $query
                                ->whereNotNull(
                                    'submitted_at'
                                );
                        },
                ])
                ->latest()
                ->get()
                ->map(
                    fn (
                        QuizSession $session
                    ) =>
                        $this
                            ->summaryPayload(
                                $session
                            )
                )
                ->values();

        return Inertia::render(
            'Teacher/QuizRooms/Index',
            [
                'courses' =>
                    $courses,

                'sessions' =>
                    $sessions,
            ]
        );
    }

    public function store(
        Request $request
    ) {
        $this->ensureTeacher();

        $validated =
            $request->validate(
                [
                    'course_id' =>
                        'required|exists:courses,id',

                    'title' =>
                        'nullable|string|max:150',

                    'code_prefix' => [
                        'nullable',
                        'string',
                        'min:2',
                        'max:6',
                        'regex:/^[A-Za-z0-9]+$/',
                    ],

                    'question_count' =>
                        'required|integer|min:1|max:50',
                ],

                [
                    'code_prefix.regex' =>
                        'Code prefix may contain only letters and numbers.',
                ]
            );

        $course =
            Course::where(
                'teacher_id',
                auth()->id()
            )->findOrFail(
                $validated[
                    'course_id'
                ]
            );

        $availableQuestions =
            $course
                ->questions()
                ->count();

        $questionCount =
            (int)
            $validated[
                'question_count'
            ];

        if (
            $availableQuestions <
            $questionCount
        ) {
            return back()
                ->withErrors([
                    'question_count' =>
                        "This course has only {$availableQuestions} available questions.",
                ])
                ->withInput();
        }

        $durationSeconds =
            $questionCount *
            (int)
            $course
                ->time_per_question;

        $session =
            DB::transaction(
                function () use (
                    $validated,
                    $course,
                    $questionCount,
                    $durationSeconds
                ) {
                    $title =
                        trim(
                            (string)
                            (
                                $validated[
                                    'title'
                                ] ?? ''
                            )
                        );

                    $session =
                        QuizSession::create([
                            'course_id' =>
                                $course->id,

                            'teacher_id' =>
                                auth()->id(),

                            'title' =>
                                $title !== ''
                                    ? $title
                                    : $course->name .
                                        ' Live Quiz',

                            'code' =>
                                $this
                                    ->generateRoomCode(
                                        $validated[
                                            'code_prefix'
                                        ] ?? null
                                    ),

                            'status' =>
                                'waiting',

                            'duration_seconds' =>
                                $durationSeconds,
                        ]);

                    $questionIds =
                        $course
                            ->questions()
                            ->inRandomOrder()
                            ->limit(
                                $questionCount
                            )
                            ->pluck('id')
                            ->values();

                    $attach = [];

                    foreach (
                        $questionIds
                        as $index =>
                            $questionId
                    ) {
                        $attach[
                            $questionId
                        ] = [
                            'position' =>
                                $index + 1,
                        ];
                    }

                    $session
                        ->questions()
                        ->attach(
                            $attach
                        );

                    return $session;
                }
            );

        return redirect()
            ->route(
                'teacher.quiz-rooms.show',
                $session->id
            )
            ->with(
                'success',
                'Live quiz room created successfully.'
            );
    }

    public function show(
        QuizSession $quizSession
    ) {
        $this->ensureTeacher();

        $this->ensureOwner(
            $quizSession
        );

        $this->refreshSessionState(
            $quizSession
        );

        $quizSession->load([
            'course',

            'participants.user',

            'participants.attempt',
        ]);

        return Inertia::render(
            'Teacher/QuizRooms/Show',
            [
                'session' =>
                    $this
                        ->detailedPayload(
                            $quizSession
                        ),
            ]
        );
    }

    public function start(
        QuizSession $quizSession
    ) {
        $this->ensureTeacher();

        $this->ensureOwner(
            $quizSession
        );

        $this->refreshSessionState(
            $quizSession
        );

        if (
            $quizSession->status !==
            'waiting'
        ) {
            return back()
                ->withErrors([
                    'session' =>
                        'Only a waiting room can be started.',
                ]);
        }

        if (
            $quizSession
                ->questions()
                ->count() === 0
        ) {
            return back()
                ->withErrors([
                    'session' =>
                        'This room has no questions.',
                ]);
        }

        $quizSession->update([
            'status' =>
                'active',

            'started_at' =>
                now(),

            'ended_at' =>
                null,
        ]);

        return back()
            ->with(
                'success',
                'Live quiz started.'
            );
    }

    public function end(
        QuizSession $quizSession
    ) {
        $this->ensureTeacher();

        $this->ensureOwner(
            $quizSession
        );

        $this->refreshSessionState(
            $quizSession
        );

        if (
            $quizSession->status ===
            'ended'
        ) {
            return back();
        }

        $quizSession->update([
            'status' =>
                'ended',

            'ended_at' =>
                now(),
        ]);

        return back()
            ->with(
                'success',
                'Live quiz room ended.'
            );
    }

    public function status(
        QuizSession $quizSession
    ) {
        $this->ensureTeacher();

        $this->ensureOwner(
            $quizSession
        );

        $this->refreshSessionState(
            $quizSession
        );

        $quizSession->load([
            'course',
            'participants.user',
            'participants.attempt',
        ]);

        return response()->json(
            $this->detailedPayload(
                $quizSession
            )
        );
    }

    private function ensureTeacher(): void
    {
        if (
            !auth()->check() ||
            !auth()->user()->is_teacher
        ) {
            abort(403);
        }
    }

    private function ensureOwner(
        QuizSession $quizSession
    ): void {
        if (
            (int)
            $quizSession
                ->teacher_id !==
            (int)
            auth()->id()
        ) {
            abort(403);
        }
    }

    private function refreshSessionState(
        QuizSession $quizSession
    ): void {
        if (
            $quizSession->status !==
                'active' ||
            !$quizSession->started_at
        ) {
            return;
        }

        $endsAt =
            $quizSession
                ->started_at
                ->copy()
                ->addSeconds(
                    (int)
                    $quizSession
                        ->duration_seconds
                );

        if (
            now()->greaterThanOrEqualTo(
                $endsAt
            )
        ) {
            $quizSession->update([
                'status' =>
                    'ended',

                'ended_at' =>
                    $endsAt,
            ]);

            $quizSession->refresh();
        }
    }

    private function remainingSeconds(
        QuizSession $quizSession
    ): int {
        if (
            $quizSession->status !==
                'active' ||
            !$quizSession->started_at
        ) {
            return 0;
        }

        $endsAt =
            $quizSession
                ->started_at
                ->copy()
                ->addSeconds(
                    (int)
                    $quizSession
                        ->duration_seconds
                );

        return max(
            0,
            (int)
            now()->diffInSeconds(
                $endsAt,
                false
            )
        );
    }

    private function summaryPayload(
        QuizSession $quizSession
    ): array {
        return [
            'id' =>
                $quizSession->id,

            'course_id' =>
                $quizSession
                    ->course_id,

            'title' =>
                $quizSession->title,

            'code' =>
                $quizSession->code,

            'status' =>
                $quizSession->status,

            'duration_seconds' =>
                (int)
                $quizSession
                    ->duration_seconds,

            'remaining_seconds' =>
                $this
                    ->remainingSeconds(
                        $quizSession
                    ),

            'course' =>
                $quizSession->course,

            'questions_count' =>
                (int)
                (
                    $quizSession
                        ->questions_count
                    ?? 0
                ),

            'participants_count' =>
                (int)
                (
                    $quizSession
                        ->participants_count
                    ?? 0
                ),

            'submitted_count' =>
                (int)
                (
                    $quizSession
                        ->submitted_count
                    ?? 0
                ),
        ];
    }

    private function detailedPayload(
        QuizSession $quizSession
    ): array {
        $participants =
            $quizSession
                ->participants
                ->sortBy(
                    'joined_at'
                )
                ->values()
                ->map(
                    function (
                        $participant
                    ) {
                        return [
                            'id' =>
                                $participant
                                    ->id,

                            'name' =>
                                $participant
                                    ->user
                                    ?->name
                                ?? 'Student',

                            'email' =>
                                $participant
                                    ->user
                                    ?->email
                                ?? '',

                            'joined_at' =>
                                $participant
                                    ->joined_at
                                    ?->toIso8601String(),

                            'started_at' =>
                                $participant
                                    ->started_at
                                    ?->toIso8601String(),

                            'submitted_at' =>
                                $participant
                                    ->submitted_at
                                    ?->toIso8601String(),

                            'submitted' =>
                                $participant
                                    ->submitted_at !==
                                null,

                            'score' =>
                                $participant
                                    ->attempt
                                    ?->score,

                            'total_questions' =>
                                $participant
                                    ->attempt
                                    ?->total_questions,

                            'time_taken' =>
                                $participant
                                    ->attempt
                                    ?->time_taken,

                            'is_suspicious' =>
                                (bool)
                                (
                                    $participant
                                        ->attempt
                                        ?->is_suspicious
                                    ?? false
                                ),
                        ];
                    }
                );

        return [
            'id' =>
                $quizSession->id,

            'course_id' =>
                $quizSession
                    ->course_id,

            'title' =>
                $quizSession->title,

            'code' =>
                $quizSession->code,

            'status' =>
                $quizSession->status,

            'duration_seconds' =>
                (int)
                $quizSession
                    ->duration_seconds,

            'remaining_seconds' =>
                $this
                    ->remainingSeconds(
                        $quizSession
                    ),

            'course' =>
                $quizSession->course,

            'questions_count' =>
                $quizSession
                    ->questions()
                    ->count(),

            'participant_count' =>
                $participants
                    ->count(),

            'submitted_count' =>
                $participants
                    ->where(
                        'submitted',
                        true
                    )
                    ->count(),

            'participants' =>
                $participants,
        ];
    }

    private function generateRoomCode(
        ?string $requestedPrefix
    ): string {
        $prefix =
            strtoupper(
                trim(
                    (string)
                    $requestedPrefix
                )
            );

        if ($prefix === '') {
            $prefix = 'QUIZ';
        }

        $prefix =
            preg_replace(
                '/[^A-Z0-9]/',
                '',
                $prefix
            );

        $prefix =
            substr(
                $prefix,
                0,
                6
            );

        if (
            strlen($prefix) < 2
        ) {
            $prefix = 'QUIZ';
        }

        do {
            $code =
                $prefix .
                '-' .
                random_int(
                    1000,
                    9999
                );
        } while (
            QuizSession::where(
                'code',
                $code
            )->exists()
        );

        return $code;
    }
}