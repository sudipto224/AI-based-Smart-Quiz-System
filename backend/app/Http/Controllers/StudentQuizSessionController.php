<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use App\Models\QuizSession;
use App\Models\QuizSessionParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentQuizSessionController extends Controller
{
    private const SUBMISSION_GRACE_SECONDS = 15;

    public function joinPage()
    {
        $this->ensureStudent();

        return Inertia::render(
            'Student/QuizRooms/Join'
        );
    }

    public function join(
        Request $request
    ) {
        $this->ensureStudent();

        $validated =
            $request->validate([
                'code' =>
                    'required|string|max:20',
            ]);

        $code =
            strtoupper(
                trim(
                    $validated['code']
                )
            );

        $quizSession =
            QuizSession::where(
                'code',
                $code
            )
                ->with('course')
                ->first();

        if (!$quizSession) {
            return back()
                ->withErrors([
                    'code' =>
                        'Quiz room not found. Please check the room code.',
                ])
                ->withInput();
        }

        $this->refreshSessionState(
            $quizSession
        );

        if (
            $quizSession->status ===
            'ended'
        ) {
            return back()
                ->withErrors([
                    'code' =>
                        'This live quiz room has already ended.',
                ])
                ->withInput();
        }

        $participant =
            QuizSessionParticipant::firstOrCreate(
                [
                    'quiz_session_id' =>
                        $quizSession->id,

                    'user_id' =>
                        auth()->id(),
                ],

                [
                    'joined_at' =>
                        now(),
                ]
            );

        if (
            !$participant->joined_at
        ) {
            $participant->update([
                'joined_at' =>
                    now(),
            ]);
        }

        if (
            $quizSession->status ===
            'active'
        ) {
            return redirect()
                ->route(
                    'student.quiz-rooms.quiz',
                    $quizSession->id
                );
        }

        return redirect()
            ->route(
                'student.quiz-rooms.waiting',
                $quizSession->id
            );
    }

    public function waiting(
        QuizSession $quizSession
    ) {
        $this->ensureStudent();

        $this->getParticipant(
            $quizSession
        );

        $this->refreshSessionState(
            $quizSession
        );

        if (
            $quizSession->status ===
            'active'
        ) {
            return redirect()
                ->route(
                    'student.quiz-rooms.quiz',
                    $quizSession->id
                );
        }

        if (
            $quizSession->status ===
            'ended'
        ) {
            return redirect()
                ->route(
                    'student.quiz-rooms.join'
                )
                ->withErrors([
                    'code' =>
                        'This live quiz room has ended.',
                ]);
        }

        $quizSession->load(
            'course'
        );

        return Inertia::render(
            'Student/QuizRooms/Waiting',
            [
                'session' => [
                    'id' =>
                        $quizSession->id,

                    'title' =>
                        $quizSession->title,

                    'code' =>
                        $quizSession->code,

                    'status' =>
                        $quizSession->status,

                    'course' =>
                        $quizSession->course,

                    'participant_count' =>
                        $quizSession
                            ->participants()
                            ->count(),
                ],
            ]
        );
    }

    public function status(
        QuizSession $quizSession
    ) {
        $this->ensureStudent();

        $participant =
            $this->getParticipant(
                $quizSession
            );

        $this->refreshSessionState(
            $quizSession
        );

        return response()->json([
            'status' =>
                $quizSession->status,

            'remaining_seconds' =>
                $this
                    ->remainingSeconds(
                        $quizSession
                    ),

            'participant_count' =>
                $quizSession
                    ->participants()
                    ->count(),

            'submitted' =>
                $participant
                    ->submitted_at !==
                null,

            'result_url' =>
                $participant
                    ->submitted_at
                    ? route(
                        'student.quiz-rooms.result',
                        $quizSession->id
                    )
                    : null,
        ]);
    }

    public function quiz(
        QuizSession $quizSession
    ) {
        $this->ensureStudent();

        $participant =
            $this->getParticipant(
                $quizSession
            );

        $this->refreshSessionState(
            $quizSession
        );

        if (
            $participant
                ->submitted_at
        ) {
            return redirect()
                ->route(
                    'student.quiz-rooms.result',
                    $quizSession->id
                );
        }

        if (
            $quizSession->status ===
            'waiting'
        ) {
            return redirect()
                ->route(
                    'student.quiz-rooms.waiting',
                    $quizSession->id
                );
        }

        if (
            $quizSession->status ===
                'ended' &&
            !$this
                ->withinSubmissionGrace(
                    $quizSession
                )
        ) {
            return redirect()
                ->route(
                    'student.quiz-rooms.join'
                )
                ->withErrors([
                    'code' =>
                        'This live quiz has ended.',
                ]);
        }

        if (
            !$participant->started_at
        ) {
            $participant->update([
                'started_at' =>
                    now(),
            ]);

            $participant->refresh();
        }

        $quizSession->load([
            'course',
            'questions',
        ]);

        $questions =
            $quizSession
                ->questions
                ->sortBy(
                    fn ($question) =>
                        $question
                            ->pivot
                            ->position
                )
                ->values()
                ->map(
                    function (
                        $question
                    ) {
                        /*
                         * SECURITY:
                         * Correct answer and explanation
                         * are deliberately NOT sent before
                         * submission.
                         */
                        return [
                            'id' =>
                                $question->id,

                            'question' =>
                                $question
                                    ->question,

                            'option1' =>
                                $question
                                    ->option1,

                            'option2' =>
                                $question
                                    ->option2,

                            'option3' =>
                                $question
                                    ->option3,

                            'option4' =>
                                $question
                                    ->option4,
                        ];
                    }
                );

        return Inertia::render(
            'Student/QuizRooms/Quiz',
            [
                'session' => [
                    'id' =>
                        $quizSession->id,

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
                ],

                'course' =>
                    $quizSession
                        ->course,

                'questions' =>
                    $questions,

                'remaining_seconds' =>
                    $this
                        ->remainingSeconds(
                            $quizSession
                        ),
            ]
        );
    }

    public function submit(
        Request $request,
        QuizSession $quizSession
    ) {
        $this->ensureStudent();

        $participant =
            $this->getParticipant(
                $quizSession
            );

        $this->refreshSessionState(
            $quizSession
        );

        if (
            $participant
                ->submitted_at &&
            $participant
                ->quiz_attempt_id
        ) {
            return redirect()
                ->route(
                    'student.quiz-rooms.result',
                    $quizSession->id
                );
        }

        $canSubmit =
            $quizSession->status ===
                'active' ||
            (
                $quizSession->status ===
                    'ended' &&
                $this
                    ->withinSubmissionGrace(
                        $quizSession
                    )
            );

        if (!$canSubmit) {
            return back()
                ->withErrors([
                    'quiz' =>
                        'The live quiz submission window is closed.',
                ]);
        }

        $validated =
            $request->validate([
                'answers' =>
                    'present|array',

                'tab_switch_count' =>
                    'required|integer|min:0|max:10000',
            ]);

        $quizSession->load(
            'questions'
        );

        $questions =
            $quizSession
                ->questions
                ->sortBy(
                    fn ($question) =>
                        $question
                            ->pivot
                            ->position
                )
                ->values();

        $submittedAnswers =
            $validated['answers'];

        $cleanAnswers = [];

        $score = 0;

        foreach (
            $questions as $question
        ) {
            $selected =
                $submittedAnswers[
                    (string)
                    $question->id
                ]
                ??
                $submittedAnswers[
                    $question->id
                ]
                ??
                null;

            if (
                $selected !== null
            ) {
                $allowedOptions = [
                    $question->option1,
                    $question->option2,
                    $question->option3,
                    $question->option4,
                ];

                if (
                    in_array(
                        $selected,
                        $allowedOptions,
                        true
                    )
                ) {
                    $cleanAnswers[
                        (string)
                        $question->id
                    ] = $selected;
                }
            }

            if (
                isset(
                    $cleanAnswers[
                        (string)
                        $question->id
                    ]
                ) &&
                $cleanAnswers[
                    (string)
                    $question->id
                ] ===
                    $question
                        ->correct_answer
            ) {
                $score++;
            }
        }

        $totalQuestions =
            $questions->count();

        $startedAt =
            $participant
                ->started_at
            ??
            $participant
                ->joined_at
            ??
            now();

        $totalSeconds =
            max(
                0,
                (int)
                $startedAt
                    ->diffInSeconds(
                        now()
                    )
            );

        $totalSeconds =
            min(
                $totalSeconds,

                (int)
                $quizSession
                    ->duration_seconds
                +
                self::
                    SUBMISSION_GRACE_SECONDS
            );

        $avgTime =
            $totalQuestions > 0
                ? $totalSeconds /
                    $totalQuestions
                : 0;

        $tabSwitches =
            (int)
            $validated[
                'tab_switch_count'
            ];

        $isSuspicious =
            $tabSwitches > 0 ||
            (
                $totalQuestions >
                    0 &&
                $avgTime < 5
            );

        DB::transaction(
            function () use (
                $participant,
                $quizSession,
                $score,
                $totalQuestions,
                $cleanAnswers,
                $totalSeconds,
                $isSuspicious,
                $tabSwitches,
                $avgTime,
                $startedAt
            ) {
                $locked =
                    QuizSessionParticipant::whereKey(
                        $participant->id
                    )
                        ->lockForUpdate()
                        ->firstOrFail();

                if (
                    $locked
                        ->submitted_at &&
                    $locked
                        ->quiz_attempt_id
                ) {
                    return;
                }

                $attempt =
                    QuizAttempt::create([
                        'user_id' =>
                            auth()->id(),

                        'course_id' =>
                            $quizSession
                                ->course_id,

                        'quiz_session_id' =>
                            $quizSession->id,

                        'score' =>
                            $score,

                        'total_questions' =>
                            $totalQuestions,

                        'answers' =>
                            $cleanAnswers,

                        'time_taken' =>
                            gmdate(
                                'H:i:s',
                                $totalSeconds
                            ),

                        'seconds_taken' =>
                            $totalSeconds,

                        'is_suspicious' =>
                            $isSuspicious,

                        'tab_switch_count' =>
                            $tabSwitches,

                        'avg_time_per_question' =>
                            $avgTime,

                        'started_at' =>
                            $startedAt,
                    ]);

                $locked->update([
                    'quiz_attempt_id' =>
                        $attempt->id,

                    'submitted_at' =>
                        now(),
                ]);
            }
        );

        return redirect()
            ->route(
                'student.quiz-rooms.result',
                $quizSession->id
            );
    }

    public function result(
        QuizSession $quizSession
    ) {
        $this->ensureStudent();

        $participant =
            $this->getParticipant(
                $quizSession
            );

        if (
            !$participant
                ->submitted_at ||
            !$participant
                ->quiz_attempt_id
        ) {
            if (
                $quizSession->status ===
                'waiting'
            ) {
                return redirect()
                    ->route(
                        'student.quiz-rooms.waiting',
                        $quizSession->id
                    );
            }

            return redirect()
                ->route(
                    'student.quiz-rooms.quiz',
                    $quizSession->id
                );
        }

        $attempt =
            QuizAttempt::whereKey(
                $participant
                    ->quiz_attempt_id
            )
                ->where(
                    'user_id',
                    auth()->id()
                )
                ->where(
                    'quiz_session_id',
                    $quizSession->id
                )
                ->firstOrFail();

        $quizSession->load([
            'course',
            'questions',
        ]);

        $questions =
            $quizSession
                ->questions
                ->sortBy(
                    fn ($question) =>
                        $question
                            ->pivot
                            ->position
                )
                ->values()
                ->map(
                    function (
                        $question
                    ) {
                        return [
                            'id' =>
                                $question->id,

                            'question' =>
                                $question
                                    ->question,

                            'option1' =>
                                $question
                                    ->option1,

                            'option2' =>
                                $question
                                    ->option2,

                            'option3' =>
                                $question
                                    ->option3,

                            'option4' =>
                                $question
                                    ->option4,

                            'correct_answer' =>
                                $question
                                    ->correct_answer,

                            'explanation' =>
                                $question
                                    ->explanation,
                        ];
                    }
                );

        return Inertia::render(
            'Student/QuizRooms/Result',
            [
                'session' => [
                    'id' =>
                        $quizSession->id,

                    'title' =>
                        $quizSession->title,

                    'code' =>
                        $quizSession->code,

                    'course' =>
                        $quizSession
                            ->course,
                ],

                'attempt' =>
                    $attempt,

                'questions' =>
                    $questions,
            ]
        );
    }

    private function ensureStudent(): void
    {
        if (
            !auth()->check() ||
            auth()->user()->is_teacher
        ) {
            abort(403);
        }
    }

    private function getParticipant(
        QuizSession $quizSession
    ): QuizSessionParticipant {
        return QuizSessionParticipant::where(
            'quiz_session_id',
            $quizSession->id
        )
            ->where(
                'user_id',
                auth()->id()
            )
            ->firstOrFail();
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

    private function withinSubmissionGrace(
        QuizSession $quizSession
    ): bool {
        if (
            $quizSession->status !==
                'ended' ||
            !$quizSession->ended_at
        ) {
            return false;
        }

        return now()
            ->lessThanOrEqualTo(
                $quizSession
                    ->ended_at
                    ->copy()
                    ->addSeconds(
                        self::
                            SUBMISSION_GRACE_SECONDS
                    )
            );
    }
}