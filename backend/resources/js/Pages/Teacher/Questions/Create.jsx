import React, { useState } from 'react';
import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Create({
    course,
}) {
    const [
        generating,
        setGenerating,
    ] = useState(false);

    const [
        topic,
        setTopic,
    ] = useState('');

    const [
        checkingQuality,
        setCheckingQuality,
    ] = useState(false);

    const [
        qualityResult,
        setQualityResult,
    ] = useState(null);

    const [
        qualityError,
        setQualityError,
    ] = useState('');

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_answer: '',
        explanation: '',
    });

    const clearQualityResult =
        () => {
            setQualityResult(null);
            setQualityError('');
        };

    const updateField = (
        field,
        value
    ) => {
        setData(
            field,
            value
        );

        clearQualityResult();
    };

    const submit = (e) => {
        e.preventDefault();

        post(
            route(
                'teacher.questions.store',
                course.id
            )
        );
    };

    const generateWithAI =
        async () => {
            const cleanTopic =
                topic.trim();

            if (!cleanTopic) {
                alert(
                    'Please enter a topic first.'
                );

                return;
            }

            setGenerating(true);

            clearQualityResult();

            try {
                const response =
                    await axios.post(
                        route(
                            'teacher.generate-ai-question'
                        ),
                        {
                            topic:
                                cleanTopic,

                            course_id:
                                course.id,
                        }
                    );

                const result =
                    response.data;

                if (
                    !result.question ||
                    !Array.isArray(
                        result.options
                    ) ||
                    result.options.length !==
                        4 ||
                    !result.correct_answer ||
                    !result.explanation
                ) {
                    throw new Error(
                        'Invalid AI response structure.'
                    );
                }

                setData({
                    question:
                        result.question,

                    option1:
                        result.options[
                            0
                        ],

                    option2:
                        result.options[
                            1
                        ],

                    option3:
                        result.options[
                            2
                        ],

                    option4:
                        result.options[
                            3
                        ],

                    correct_answer:
                        result.correct_answer,

                    explanation:
                        result.explanation,
                });

                alert(
                    `AI question generated for ${course.name} → ${cleanTopic}. Please review it before saving.`
                );

            } catch (error) {
                console.error(
                    error
                );

                const message =
                    error.response
                        ?.data
                        ?.message ||
                    'AI generation failed. Please try again or create the question manually.';

                alert(message);

            } finally {
                setGenerating(
                    false
                );
            }
        };

    const checkQuestionQuality =
        async () => {
            const required =
                [
                    data.question,
                    data.option1,
                    data.option2,
                    data.option3,
                    data.option4,
                    data.correct_answer,
                ];

            if (
                required.some(
                    (value) =>
                        !String(
                            value || ''
                        ).trim()
                )
            ) {
                setQualityError(
                    'Complete the question, all four options, and the correct answer first.'
                );

                setQualityResult(
                    null
                );

                return;
            }

            const options = [
                data.option1.trim(),
                data.option2.trim(),
                data.option3.trim(),
                data.option4.trim(),
            ];

            const uniqueOptions =
                new Set(
                    options.map(
                        (option) =>
                            option.toLowerCase()
                    )
                );

            if (
                uniqueOptions.size !==
                4
            ) {
                setQualityError(
                    'All four options must be unique before quality checking.'
                );

                setQualityResult(
                    null
                );

                return;
            }

            if (
                !options.includes(
                    data.correct_answer.trim()
                )
            ) {
                setQualityError(
                    'Correct Answer must exactly match one of the four option texts.'
                );

                setQualityResult(
                    null
                );

                return;
            }

            setCheckingQuality(
                true
            );

            setQualityError('');

            setQualityResult(
                null
            );

            try {
                const response =
                    await axios.post(
                        route(
                            'teacher.check-question-quality'
                        ),
                        {
                            course_id:
                                course.id,

                            question:
                                data.question,

                            option1:
                                data.option1,

                            option2:
                                data.option2,

                            option3:
                                data.option3,

                            option4:
                                data.option4,

                            correct_answer:
                                data.correct_answer,
                        }
                    );

                setQualityResult(
                    response.data
                );

            } catch (error) {
                console.error(
                    error
                );

                setQualityError(
                    error.response
                        ?.data
                        ?.message ||
                    'Unable to check question quality right now.'
                );

            } finally {
                setCheckingQuality(
                    false
                );
            }
        };

    const scoreClass = (
        score
    ) => {
        if (score >= 85) {
            return 'text-green-600';
        }

        if (score >= 70) {
            return 'text-blue-600';
        }

        if (score >= 50) {
            return 'text-amber-600';
        }

        return 'text-red-600';
    };

    const verdictClass = (
        verdict
    ) => {
        if (
            verdict ===
            'Excellent'
        ) {
            return 'bg-green-100 text-green-700';
        }

        if (
            verdict ===
            'Good'
        ) {
            return 'bg-blue-100 text-blue-700';
        }

        if (
            verdict ===
            'Needs Improvement'
        ) {
            return 'bg-amber-100 text-amber-700';
        }

        return 'bg-red-100 text-red-700';
    };

    const qualityClass = (
        quality
    ) => {
        if (
            quality ===
            'strong'
        ) {
            return 'bg-green-100 text-green-700';
        }

        if (
            quality ===
            'medium'
        ) {
            return 'bg-amber-100 text-amber-700';
        }

        return 'bg-red-100 text-red-700';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Question - Quizora" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            ➕ Add Question – {course.name}
                        </h2>

                        {/* ================= AI GENERATOR ================= */}

                        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">

                            <h3 className="font-semibold text-indigo-700 mb-2">
                                🤖 AI Question Generator
                            </h3>

                            <div className="flex flex-wrap gap-3">

                                <input
                                    type="text"
                                    placeholder={`Enter a ${course.name} topic`}
                                    value={topic}
                                    onChange={(e) =>
                                        setTopic(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key ===
                                            'Enter'
                                        ) {
                                            e.preventDefault();

                                            generateWithAI();
                                        }
                                    }}
                                    className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        generateWithAI
                                    }
                                    disabled={
                                        generating
                                    }
                                    className="px-5 py-2 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow disabled:opacity-50"
                                >
                                    {generating
                                        ? 'Generating...'
                                        : '⚡ Generate with AI'}
                                </button>

                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                AI will generate a question only for{' '}
                                <span className="font-semibold">
                                    {course.name}
                                </span>{' '}
                                and the topic you enter.
                            </p>

                        </div>

                        {/* ================= FORM ================= */}

                        <form
                            onSubmit={
                                submit
                            }
                            className="space-y-5"
                        >

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Question
                                </label>

                                <textarea
                                    value={
                                        data.question
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            'question',
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                    required
                                />

                                {errors.question && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {
                                            errors.question
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Option 1
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            data.option1
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                'option1',
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Option 2
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            data.option2
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                'option2',
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Option 3
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            data.option3
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                'option3',
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Option 4
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            data.option4
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                'option4',
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Correct Answer (exact option text)
                                </label>

                                <input
                                    type="text"
                                    value={
                                        data.correct_answer
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            'correct_answer',
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                    It must exactly match Option 1, 2, 3, or 4.
                                </p>

                                {errors.correct_answer && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {
                                            errors.correct_answer
                                        }
                                    </p>
                                )}
                            </div>

                            {/* ================= QUALITY CHECKER ================= */}

                            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <h3 className="font-semibold text-purple-800">
                                            🧠 AI Distractor Quality Checker
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Checks weak distractors,
                                            duplicate meanings,
                                            answer clues,
                                            option balance,
                                            and ambiguity.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            checkQuestionQuality
                                        }
                                        disabled={
                                            checkingQuality
                                        }
                                        className="shrink-0 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        {checkingQuality
                                            ? 'Checking...'
                                            : '✨ Check Question Quality'}
                                    </button>

                                </div>

                                {qualityError && (
                                    <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                                        {
                                            qualityError
                                        }
                                    </div>
                                )}

                                {qualityResult && (
                                    <div className="mt-5 space-y-5">

                                        <div className="rounded-xl bg-white p-4 shadow-sm">

                                            <div className="flex flex-wrap items-center justify-between gap-3">

                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Quality Score
                                                    </p>

                                                    <p
                                                        className={`text-3xl font-bold ${scoreClass(
                                                            qualityResult.score
                                                        )}`}
                                                    >
                                                        {
                                                            qualityResult.score
                                                        }
                                                        /100
                                                    </p>
                                                </div>

                                                <span
                                                    className={`rounded-full px-4 py-2 text-sm font-semibold ${verdictClass(
                                                        qualityResult.verdict
                                                    )}`}
                                                >
                                                    {
                                                        qualityResult.verdict
                                                    }
                                                </span>

                                            </div>
                                        </div>

                                        {qualityResult.strengths?.length >
                                            0 && (
                                            <div>
                                                <h4 className="font-semibold text-green-700">
                                                    ✅ Strengths
                                                </h4>

                                                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
                                                    {qualityResult.strengths.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={
                                                                    index
                                                                }
                                                            >
                                                                {
                                                                    item
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {qualityResult.issues?.length >
                                            0 && (
                                            <div>
                                                <h4 className="font-semibold text-red-700">
                                                    ⚠️ Issues
                                                </h4>

                                                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
                                                    {qualityResult.issues.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={
                                                                    index
                                                                }
                                                            >
                                                                {
                                                                    item
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {qualityResult.suggestions?.length >
                                            0 && (
                                            <div>
                                                <h4 className="font-semibold text-indigo-700">
                                                    💡 Suggestions
                                                </h4>

                                                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
                                                    {qualityResult.suggestions.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={
                                                                    index
                                                                }
                                                            >
                                                                {
                                                                    item
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {qualityResult.option_analysis
                                            ?.length >
                                            0 && (
                                            <div>

                                                <h4 className="font-semibold text-gray-800 mb-3">
                                                    Option Analysis
                                                </h4>

                                                <div className="space-y-3">

                                                    {qualityResult.option_analysis.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <div
                                                                key={
                                                                    index
                                                                }
                                                                className="rounded-xl border bg-white p-4"
                                                            >

                                                                <div className="flex flex-wrap items-center gap-2">

                                                                    <p className="font-medium text-gray-800">
                                                                        {
                                                                            item.option
                                                                        }
                                                                    </p>

                                                                    <span
                                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${qualityClass(
                                                                            item.quality
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            item.quality
                                                                        }
                                                                    </span>

                                                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                                                                        {
                                                                            item.role
                                                                        }
                                                                    </span>

                                                                </div>

                                                                <p className="mt-2 text-sm text-gray-600">
                                                                    {
                                                                        item.reason
                                                                    }
                                                                </p>

                                                            </div>
                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                    </div>
                                )}

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Explanation
                                </label>

                                <textarea
                                    value={
                                        data.explanation
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'explanation',
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                    required
                                />

                                {errors.explanation && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {
                                            errors.explanation
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    type="submit"
                                    disabled={
                                        processing
                                    }
                                    className="px-6 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : 'Save Question'}
                                </button>

                                <Link
                                    href={route(
                                        'teacher.questions',
                                        course.id
                                    )}
                                    className="px-6 py-2.5 rounded-full font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </Link>

                            </div>

                        </form>

                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}