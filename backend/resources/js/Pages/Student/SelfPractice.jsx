
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const primary =
    'rounded-xl bg-[#235F46] px-5 py-3 font-bold text-white transition hover:bg-[#174631] disabled:cursor-not-allowed disabled:opacity-50';

const secondary =
    'rounded-xl border border-[#CBDDCF] px-5 py-3 font-bold text-[#235F46] transition hover:bg-[#EAF3E9]';

export default function SelfPractice({
    mode = 'create',
    history = [],
    practiceQuiz = null,
    questions = [],
    result = null,
    review = [],
}) {
    const create = useForm({
        source_type: 'topic',
        topic: '',
        material: null,
        question_count: '5',
    });

    const attempt = useForm({
        answers: {},
    });

    const generate = (e) => {
        e.preventDefault();

        create.post(
            route('student.ai-practice.generate'),
            {
                forceFormData: true,
                preserveScroll: true,
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();

        attempt.post(
            route(
                'student.ai-practice.submit',
                practiceQuiz.id
            )
        );
    };

    return (
        <AuthenticatedLayout theme="student">
            <Head title="My AI Practice - Quizora" />

            <div className="mx-auto max-w-5xl space-y-6 pb-12">

                {/* PAGE HEADER */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#317355]">
                            Independent learning
                        </p>

                        <h1 className="quizora-display mt-2 text-3xl font-semibold text-[#193F30]">
                            {mode === 'create'
                                ? 'Create My AI Quiz'
                                : mode === 'quiz'
                                    ? 'My Practice Quiz'
                                    : 'My Quiz Result'}
                        </h1>

                        <p className="mt-2 text-sm text-[#708277]">
                            {mode === 'create'
                                ? 'Study any topic or upload your own notes. No teacher is needed.'
                                : practiceQuiz?.title}
                        </p>
                    </div>

                    <Link
                        href={route('dashboard')}
                        className={secondary}
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* CREATE AI QUIZ */}
                {mode === 'create' && (
                    <>
                        <section className="rounded-3xl border border-[#DDE8DD] bg-white p-5 shadow-sm sm:p-8">
                            <h2 className="text-xl font-bold text-[#1E4031]">
                                What would you like to practice?
                            </h2>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {[
                                    [
                                        'topic',
                                        '✍️ Write a Topic',
                                        'Example: Data Structure - Stack',
                                    ],
                                    [
                                        'material',
                                        '📄 Upload Study Material',
                                        'PDF or PowerPoint (.pptx)',
                                    ],
                                ].map(([value, label, sub]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            create.setData(
                                                'source_type',
                                                value
                                            );
                                            create.clearErrors();
                                        }}
                                        className={`rounded-2xl border-2 p-5 text-left transition ${
                                            create.data.source_type === value
                                                ? 'border-[#2A704F] bg-[#ECF6EB]'
                                                : 'border-[#E1E7E0] hover:border-[#A9CAB1]'
                                        }`}
                                    >
                                        <span className="block font-bold text-[#244B37]">
                                            {label}
                                        </span>

                                        <span className="mt-1 block text-xs text-[#728376]">
                                            {sub}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <form
                                onSubmit={generate}
                                className="mt-7 space-y-5"
                            >
                                {/* TOPIC INPUT */}
                                {create.data.source_type === 'topic' ? (
                                    <div>
                                        <label
                                            className="mb-2 block text-sm font-bold text-[#244B37]"
                                            htmlFor="study-topic"
                                        >
                                            Your Topic
                                        </label>

                                        <input
                                            id="study-topic"
                                            required
                                            maxLength={150}
                                            value={create.data.topic}
                                            onChange={(e) =>
                                                create.setData(
                                                    'topic',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. Data Structures - Linked List"
                                            className="w-full rounded-xl border-[#C9DACB] focus:border-[#2A704F] focus:ring-[#2A704F]"
                                        />

                                        {create.errors.topic && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {create.errors.topic}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* FILE UPLOAD */}
                                        <div>
                                            <label
                                                className="mb-2 block text-sm font-bold text-[#244B37]"
                                                htmlFor="study-material"
                                            >
                                                Your PDF or PPTX (max 10 MB)
                                            </label>

                                            <input
                                                id="study-material"
                                                required
                                                type="file"
                                                accept=".pdf,.pptx"
                                                onChange={(e) =>
                                                    create.setData(
                                                        'material',
                                                        e.target.files?.[0] || null
                                                    )
                                                }
                                                className="block w-full rounded-xl border border-[#C9DACB] p-3 text-sm"
                                            />

                                            {create.errors.material && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {create.errors.material}
                                                </p>
                                            )}
                                        </div>

                                        {/* OPTIONAL TITLE */}
                                        <div>
                                            <label
                                                className="mb-2 block text-sm font-bold text-[#244B37]"
                                                htmlFor="study-title"
                                            >
                                                Quiz Title (optional)
                                            </label>

                                            <input
                                                id="study-title"
                                                value={create.data.topic}
                                                maxLength={150}
                                                onChange={(e) =>
                                                    create.setData(
                                                        'topic',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g. My Linked List Notes"
                                                className="w-full rounded-xl border-[#C9DACB] focus:border-[#2A704F] focus:ring-[#2A704F]"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* QUESTION COUNT */}
                                <fieldset>
                                    <legend className="mb-2 block text-sm font-bold text-[#244B37]">
                                        Number of Questions
                                    </legend>

                                    <div className="flex flex-wrap gap-3">
                                        {['5', '10'].map((count) => (
                                            <label
                                                key={count}
                                                className="cursor-pointer rounded-xl border border-[#C9DACB] px-4 py-3 text-sm text-[#244B37]"
                                            >
                                                <input
                                                    type="radio"
                                                    name="question_count"
                                                    checked={
                                                        create.data.question_count === count
                                                    }
                                                    onChange={() =>
                                                        create.setData(
                                                            'question_count',
                                                            count
                                                        )
                                                    }
                                                    className="mr-2 text-green-700"
                                                />

                                                {count} MCQs
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                {create.errors.question_count && (
                                    <p className="text-sm text-red-600">
                                        {create.errors.question_count}
                                    </p>
                                )}

                                {create.errors.ai && (
                                    <p
                                        role="alert"
                                        className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                                    >
                                        {create.errors.ai}
                                    </p>
                                )}

                                {/* GENERATE BUTTON */}
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <p className="max-w-lg text-xs leading-5 text-[#718276]">
                                        Your material is sent to the AI
                                        provider for question creation.
                                        AI answers may contain mistakes.
                                        This is for personal practice,
                                        not an official course result.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={create.processing}
                                        className={primary}
                                    >
                                        {create.processing
                                            ? 'Generating with Groq AI...'
                                            : '✨ Generate My AI Quiz'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* MY PREVIOUS QUIZZES */}
                        <section className="rounded-3xl border border-[#DDE8DD] bg-white p-5 sm:p-7">
                            <h2 className="text-xl font-bold text-[#1E4031]">
                                My Recent Practice
                            </h2>

                            {history.length === 0 ? (
                                <p className="mt-3 text-sm text-[#718276]">
                                    You have not created any AI quizzes yet.
                                </p>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {history.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route(
                                                'student.ai-practice.show',
                                                item.id
                                            )}
                                            className="flex flex-col justify-between gap-2 rounded-xl border border-[#DFE8DF] p-4 transition hover:bg-[#F3F9F1] sm:flex-row sm:items-center"
                                        >
                                            <span className="font-semibold text-[#244B37]">
                                                {item.title}
                                            </span>

                                            <span className="text-sm text-[#4B765C]">
                                                {item.completed_at
                                                    ? `Score: ${item.score}/${item.total_questions}`
                                                    : 'Continue Quiz'} →
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}

                {/* QUIZ ATTEMPT */}
                {mode === 'quiz' && (
                    <form
                        onSubmit={submit}
                        className="space-y-5"
                    >
                        <div className="rounded-xl bg-[#E8F3E8] p-4 text-sm font-medium text-[#276347]">
                            Choose one option for each question.
                            Correct answers will appear after you submit.
                        </div>

                        {questions.map((item, index) => (
                            <fieldset
                                key={item.id}
                                className="rounded-2xl border border-[#DDE8DD] bg-white p-5 sm:p-7"
                            >
                                <legend className="sr-only">
                                    Question {index + 1}
                                </legend>

                                <p className="mb-4 text-base font-bold text-[#214432]">
                                    {index + 1}. {item.question}
                                </p>

                                <div className="space-y-2">
                                    {item.options.map(
                                        (option, optionIndex) => (
                                            <label
                                                key={optionIndex}
                                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                                                    attempt.data.answers[item.id] === option
                                                        ? 'border-[#26764D] bg-[#EDF8EE]'
                                                        : 'border-[#E4EBE2] hover:bg-[#F7FAF5]'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${item.id}`}
                                                    checked={
                                                        attempt.data.answers[item.id] === option
                                                    }
                                                    onChange={() =>
                                                        attempt.setData(
                                                            'answers',
                                                            {
                                                                ...attempt.data.answers,
                                                                [item.id]: option,
                                                            }
                                                        )
                                                    }
                                                    className="mt-1 text-green-700"
                                                />

                                                <span className="break-words">
                                                    {option}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </fieldset>
                        ))}

                        {attempt.errors.answers && (
                            <p
                                role="alert"
                                className="text-sm text-red-600"
                            >
                                {attempt.errors.answers}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5">
                            <Link
                                href={route('student.ai-practice.index')}
                                className={secondary}
                            >
                                Back to My Practice
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    attempt.processing ||
                                    Object.keys(
                                        attempt.data.answers
                                    ).length === 0
                                }
                                className={primary}
                            >
                                {attempt.processing
                                    ? 'Submitting...'
                                    : 'Submit Quiz & See Result'}
                            </button>
                        </div>
                    </form>
                )}

                {/* PERSONAL RESULT */}
                {mode === 'result' && (
                    <>
                        <section className="rounded-3xl bg-[#173E32] p-8 text-white">
                            <p className="text-sm uppercase tracking-widest text-[#C3E5CC]">
                                Your Personal Practice Result
                            </p>

                            <p className="quizora-display mt-4 text-5xl font-semibold">
                                {result.score} / {result.total}
                            </p>

                            <p className="mt-3 text-sm text-[#D4E7D8]">
                                {Math.round(
                                    (result.score / result.total) * 100
                                )}% correct — not added to the
                                public leaderboard.
                            </p>
                        </section>

                        <section className="space-y-4">
                            {review.map((item, index) => (
                                <article
                                    key={index}
                                    className="rounded-2xl border border-[#DDE8DD] bg-white p-5 sm:p-7"
                                >
                                    <p className="font-bold text-[#214432]">
                                        {index + 1}. {item.question}
                                    </p>

                                    <p
                                        className={`mt-3 text-sm ${
                                            item.is_correct
                                                ? 'text-green-700'
                                                : 'text-red-700'
                                        }`}
                                    >
                                        Your answer:{' '}
                                        {item.your_answer || 'Not answered'}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[#216044]">
                                        Correct answer:{' '}
                                        {item.correct_answer}
                                    </p>

                                    <p className="mt-2 text-sm text-[#60776A]">
                                        Explanation: {item.explanation}
                                    </p>
                                </article>
                            ))}
                        </section>

                        <Link
                            href={route(
                                'student.ai-practice.index'
                            )}
                            className={`inline-block ${primary}`}
                        >
                            Create Another AI Quiz
                        </Link>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
