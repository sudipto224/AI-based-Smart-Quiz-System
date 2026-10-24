<?php

namespace Tests\Feature;

use App\Models\StudentPracticeQuiz;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class StudentAiPracticeTest extends TestCase
{
    use RefreshDatabase;

    private function student(): User
    {
        return User::factory()->create([
            'is_admin' => false,
            'is_teacher' => false,
            'teacher_status' => null,
        ]);
    }

    private function fakeGroq(): void
    {
        $items = [];

        for ($i = 1; $i <= 5; $i++) {
            $items[] = [
                'question' => "Question {$i}?",
                'options' => [
                    'Option A',
                    'Option B',
                    'Option C',
                    'Option D',
                ],
                'correct_answer' => 'Option B',
                'explanation' => 'Because B is correct.',
            ];
        }

        Http::fake([
            'api.groq.com/*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'questions' => $items,
                            ]),
                        ],
                    ],
                ],
            ], 200),
        ]);
    }

    public function test_student_creates_private_groq_quiz_and_scores_only_once(): void
    {
        config([
            'services.groq.api_key' => 'fake-key-for-test',
        ]);

        $this->fakeGroq();
        $user = $this->student();

        $this->actingAs($user)
            ->post(
                route('student.ai-practice.generate'),
                [
                    'source_type' => 'topic',
                    'topic' => 'Linked List',
                    'question_count' => 5,
                ]
            )
            ->assertRedirect();

        $quiz = StudentPracticeQuiz::firstOrFail();

        $this->assertSame(
            $user->id,
            $quiz->user_id
        );

        $this->assertCount(
            5,
            $quiz->questions
        );

        $this->actingAs($user)
            ->get(
                route('student.ai-practice.show', $quiz)
            )
            ->assertOk()
            ->assertDontSee('correct_answer');

        $this->actingAs($user)
            ->post(
                route('student.ai-practice.submit', $quiz),
                [
                    'answers' => [
                        '0' => 'Option B',
                        '1' => 'Option A',
                        '2' => 'Option B',
                    ],
                ]
            )
            ->assertRedirect();

        $this->assertSame(
            2,
            $quiz->fresh()->score
        );

        // Attempt to submit again.
        $this->actingAs($user)
            ->post(
                route('student.ai-practice.submit', $quiz),
                [
                    'answers' => [
                        '0' => 'Option B',
                        '1' => 'Option B',
                        '2' => 'Option B',
                        '3' => 'Option B',
                        '4' => 'Option B',
                    ],
                ]
            )
            ->assertRedirect();

        // Score must remain unchanged.
        $this->assertSame(
            2,
            $quiz->fresh()->score
        );
    }

    public function test_student_cannot_open_another_students_practice(): void
    {
        $owner = $this->student();
        $other = $this->student();

        $quiz = StudentPracticeQuiz::create([
            'user_id' => $owner->id,
            'title' => 'Stack',
            'source_type' => 'topic',
            'total_questions' => 5,
            'questions' => [],
        ]);

        $this->actingAs($other)
            ->get(
                route('student.ai-practice.show', $quiz)
            )
            ->assertForbidden();
    }

    public function test_approved_teacher_cannot_open_student_practice(): void
    {
        $teacher = User::factory()->create([
            'is_admin' => false,
            'is_teacher' => true,
            'teacher_status' => 'approved',
        ]);

        $this->actingAs($teacher)
            ->get(
                route('student.ai-practice.index')
            )
            ->assertForbidden();
    }
}
