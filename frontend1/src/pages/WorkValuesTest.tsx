import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { markAssessmentComplete } from '@/lib/assessmentUtils';

const WORK_VALUES_QUESTIONS = [
    { id: 1, question: "Having job security and stability", category: "security" },
    { id: 2, question: "Making a high income", category: "financial" },
    { id: 3, question: "Helping others and making a difference", category: "altruism" },
    { id: 4, question: "Having opportunities for advancement", category: "achievement" },
    { id: 5, question: "Working independently with minimal supervision", category: "autonomy" },
    { id: 6, question: "Having flexible work hours", category: "work-life" },
    { id: 7, question: "Being recognized for my work", category: "recognition" },
    { id: 8, question: "Working in a creative environment", category: "creativity" },
    { id: 9, question: "Having good relationships with coworkers", category: "social" },
    { id: 10, question: "Continuous learning and development", category: "growth" },
    { id: 11, question: "Having a clear career path", category: "achievement" },
    { id: 12, question: "Working on challenging problems", category: "challenge" },
    { id: 13, question: "Having a good work-life balance", category: "work-life" },
    { id: 14, question: "Making my own decisions at work", category: "autonomy" },
    { id: 15, question: "Contributing to society", category: "altruism" },
    { id: 16, question: "Having variety in my work", category: "creativity" },
    { id: 17, question: "Receiving bonuses and incentives", category: "financial" },
    { id: 18, question: "Being part of a supportive team", category: "social" },
    { id: 19, question: "Having job stability even during economic downturns", category: "security" },
    { id: 20, question: "Receiving public acknowledgment", category: "recognition" }
];

const ACTIVE_WORK_VALUES_QUESTIONS = WORK_VALUES_QUESTIONS.slice(0, 10);

const IMPORTANCE_OPTIONS = [
    { value: 1, label: "Not Important", emoji: "😐" },
    { value: 2, label: "Somewhat Important", emoji: "🙂" },
    { value: 3, label: "Important", emoji: "😊" },
    { value: 4, label: "Very Important", emoji: "😍" },
    { value: 5, label: "Extremely Important", emoji: "🔥" }
];

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function WorkValuesTest() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [questions, setQuestions] = useState(ACTIVE_WORK_VALUES_QUESTIONS);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        setQuestions(shuffleArray(ACTIVE_WORK_VALUES_QUESTIONS));
    }, []);

    const handleAnswer = (value: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = value;
        setAnswers(newAnswers);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                calculateResults();
            }
        }, 300);
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateResults = () => {
        const values: any = {};

        questions.forEach((q, index) => {
            if (!values[q.category]) {
                values[q.category] = { total: 0, count: 0 };
            }
            values[q.category].total += answers[index];
            values[q.category].count += 1;
        });

        const averages: any = {};
        Object.keys(values).forEach(key => {
            averages[key] = Math.round((values[key].total / values[key].count / 5) * 100);
        });

        setResults(averages);
        setShowResults(true);

        // Submit to backend API
        const submitToBackend = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await fetch('http://localhost:5000/api/assessment/values', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            answers: answers.map((answer, index) => ({
                                questionId: questions[index].id,
                                value: answer,
                                category: questions[index].category
                            }))
                        })
                    });
                }
            } catch (error) {
                console.error('Error submitting to backend:', error);
            }
        };

        submitToBackend();

        // Mark assessment as completed (user-specific)
        if (user) {
            markAssessmentComplete(user.id, 'values');
        }

        toast({
            title: 'Work Values Assessment Complete!',
            description: 'Your work priorities are identified',
        });
    };

    const handleRetake = () => {
        setQuestions(shuffleArray(ACTIVE_WORK_VALUES_QUESTIONS));
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResults(false);
        setResults(null);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (showResults && results) {
        const sortedValues = Object.entries(results).sort((a: any, b: any) => b[1] - a[1]);

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
                <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/assessments')}
                            className="text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Assessments
                        </Button>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="text-center mb-12">
                            <div className="text-6xl mb-6">💎</div>
                            <h1 className="text-4xl font-bold mb-4">Your Work Values</h1>
                            <p className="text-xl text-gray-400">What matters most to you in your career</p>
                        </div>

                        <div className="grid gap-6 mb-12">
                            {sortedValues.map(([value, score]: any, index) => (
                                <motion.div
                                    key={value}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`p-6 ${index < 3 ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-700' : 'bg-gray-800/50 border-gray-700'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {index < 3 && <span className="text-2xl">🏆</span>}
                                                <h3 className="text-xl font-bold capitalize text-white">{value.replace('-', ' ')}</h3>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-400">{score}%</span>
                                        </div>
                                        <Progress value={score} className="h-3" />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <Card className="p-8 bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-700 mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-white">Your Top Work Values</h3>
                            <div className="space-y-2">
                                {sortedValues.slice(0, 3).map(([value, score]: any, index) => (
                                    <div key={value} className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-orange-400">{index + 1}.</span>
                                        <span className="text-lg capitalize text-white">{value.replace('-', ' ')} ({score}%)</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="flex gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={handleRetake}
                                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                            >
                                Retake Test (Questions will shuffle)
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/assessments')}
                                className="border-orange-600 text-orange-400 hover:bg-orange-900/50"
                            >
                                Back to Assessment Center
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/assessments')}
                            className="text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                        <div className="h-6 w-px bg-gray-700" />
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-orange-400" />
                            <span className="font-semibold">Work Values</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-semibold text-orange-400">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>

                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Card className="p-8 bg-gray-800/50 border-gray-700 mb-8">
                        <div className="mb-8">
                            <div className="text-sm text-orange-400 font-semibold mb-2">Question {currentQuestion + 1}</div>
                            <h2 className="text-3xl font-bold text-center mb-2">{question.question}</h2>
                            <p className="text-center text-gray-400">How important is this to you?</p>
                        </div>

                        <div className="space-y-3">
                            {IMPORTANCE_OPTIONS.map((option) => (
                                <motion.button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === option.value
                                        ? 'border-orange-500 bg-orange-900/50 text-white'
                                        : 'border-gray-700 bg-gray-900/50 hover:border-orange-700 text-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-2xl">{option.emoji}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </Card>

                    <div className="flex items-center justify-between">
                        <Button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                            Previous
                        </Button>

                        <div className="flex gap-2">
                            {questions.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === currentQuestion
                                        ? 'bg-orange-500'
                                        : answers[index] !== undefined
                                            ? 'bg-orange-700'
                                            : 'bg-gray-700'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="w-24" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
