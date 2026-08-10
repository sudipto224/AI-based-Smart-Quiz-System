import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Quiz({ course, questions }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(course.time_per_question);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [quizStartTime] = useState(Date.now());

    const timerRef = useRef(null);
    const { data, setData, post, processing } = useForm({
        course_id: course.id,
        answers: {},
        tab_switch_count: 0,
        quiz_start_time: quizStartTime,
    });

    // Timer logic
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleNext();
                    return course.time_per_question;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentQuestion]);

    // Tab switch detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount((prev) => prev + 1);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const handleAnswer = (questionId, option) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setTimeLeft(course.time_per_question);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        const finalAnswers = { ...answers };
        if (!finalAnswers[questions[currentQuestion]?.id]) {
            finalAnswers[questions[currentQuestion]?.id] = '';
        }

        setData({
            course_id: course.id,
            answers: finalAnswers,
            tab_switch_count: tabSwitchCount,
            quiz_start_time: quizStartTime,
        });

        post(route('quiz.submit'));
    };

    const question = questions[currentQuestion];

    if (!question) {
        return (
            <AuthenticatedLayout>
                <Head title="Quiz - AI Smart Quiz" />
                <div className="py-12 text-center">
                    <p className="text-gray-500">No questions available for this course.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Quiz - ${course.name}`} />
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
                            <span className="text-sm text-gray-500">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                        </div>

                        {/* Timer */}
                        <div className={`text-center mb-6 ${timeLeft <= 10 ? 'text-red-600 font-bold animate-pulse' : 'text-gray-700'}`}>
                            ⏱️ <span className="text-2xl font-mono">{timeLeft}</span> sec
                        </div>

                        {/* Question */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h3>
                            <div className="space-y-3">
                                {['option1', 'option2', 'option3', 'option4'].map((optKey, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition hover:bg-indigo-50 ${
                                            answers[question.id] === question[optKey]
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question_${question.id}`}
                                            value={question[optKey]}
                                            checked={answers[question.id] === question[optKey]}
                                            onChange={() => handleAnswer(question.id, question[optKey])}
                                            className="mr-3 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-gray-700">{question[optKey]}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-end">
                            {/* ✅ Loading State */}
                            <button
                                onClick={handleNext}
                                disabled={processing}
                                className="px-6 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Submitting...' : (currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next →')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}