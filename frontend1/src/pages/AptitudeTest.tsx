import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowLeft, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { markAssessmentComplete } from '@/lib/assessmentUtils';

// Aptitude questions - Logical reasoning, patterns, math
const APTITUDE_QUESTIONS = [
    {
        id: 1,
        question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?",
        options: ["True", "False", "Cannot be determined"],
        correctAnswer: 0
    },
    {
        id: 2,
        question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "46"],
        correctAnswer: 1
    },
    {
        id: 3,
        question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        options: ["5 minutes", "15 minutes", "20 minutes", "100 minutes"],
        correctAnswer: 0
    },
    {
        id: 4,
        question: "Which figure completes the pattern? (Abstract reasoning)",
        options: ["Triangle", "Circle", "Square", "Pentagon"],
        correctAnswer: 2
    },
    {
        id: 5,
        question: "A bat and ball cost ₹110. The bat costs ₹100 more than the ball. How much does the ball cost?",
        options: ["₹5", "₹10", "₹15", "₹20"],
        correctAnswer: 0
    },
    {
        id: 6,
        question: "If you rearrange the letters 'CIFAIPC' you get the name of a(n):",
        options: ["City", "Animal", "Ocean", "Country"],
        correctAnswer: 2
    },
    {
        id: 7,
        question: "What is the next number in the series: 1, 1, 2, 3, 5, 8, 13, ?",
        options: ["18", "21", "24", "27"],
        correctAnswer: 1
    },
    {
        id: 8,
        question: "If PHONE is coded as QIPOF, how is TABLE coded?",
        options: ["UBCMF", "UCBMF", "TBALE", "UABMC"],
        correctAnswer: 0
    },
    {
        id: 9,
        question: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
        options: ["60 km/h", "75 km/h", "80 km/h", "90 km/h"],
        correctAnswer: 2
    },
    {
        id: 10,
        question: "Which number is the odd one out: 2, 5, 7, 12, 13?",
        options: ["2", "5", "7", "12"],
        correctAnswer: 3
    },
    {
        id: 11,
        question: "If A = 1, B = 2, C = 3... what is the sum of LOGIC?",
        options: ["52", "56", "60", "64"],
        correctAnswer: 1
    },
    {
        id: 12,
        question: "Complete the analogy: Hand is to Glove as Foot is to ?",
        options: ["Leg", "Shoe", "Walk", "Toe"],
        correctAnswer: 1
    },
    {
        id: 13,
        question: "How many triangles are in a pentagon with all diagonals drawn?",
        options: ["5", "10", "15", "35"],
        correctAnswer: 3
    },
    {
        id: 14,
        question: "If today is Monday, what day will it be 100 days from now?",
        options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        correctAnswer: 1
    },
    {
        id: 15,
        question: "Which of these is most unlike the others: Dog, Cat, Lion, Snake?",
        options: ["Dog", "Cat", "Lion", "Snake"],
        correctAnswer: 3
    }
];

const ACTIVE_APTITUDE_QUESTIONS = APTITUDE_QUESTIONS.slice(0, 10);

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function AptitudeTest() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [questions, setQuestions] = useState(ACTIVE_APTITUDE_QUESTIONS);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // Shuffle questions on mount
    useEffect(() => {
        setQuestions(shuffleArray(ACTIVE_APTITUDE_QUESTIONS));
    }, []);

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResults();
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateResults = () => {
        let correct = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                correct++;
            }
        });
        setScore(correct);
        setShowResults(true);

        // Submit to backend API
        const submitToBackend = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await fetch('http://localhost:5000/api/assessment/aptitude', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            answers: answers.map((answer, index) => ({
                                questionId: questions[index].id,
                                selectedAnswer: answer,
                                correctAnswer: questions[index].correctAnswer,
                                isCorrect: answer === questions[index].correctAnswer
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
            markAssessmentComplete(user.id, 'aptitude');
        }

        toast({
            title: 'Assessment Complete!',
            description: `You scored ${correct}/${questions.length}`,
        });
    };

    const handleRetake = () => {
        setQuestions(shuffleArray(ACTIVE_APTITUDE_QUESTIONS)); // Shuffle again
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResults(false);
        setScore(0);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (showResults) {
        const percentage = (score / questions.length) * 100;
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
                                Back to Assessments
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="text-6xl mb-6">🧠</div>
                        <h1 className="text-4xl font-bold mb-4">Aptitude Test Complete!</h1>

                        <Card className="p-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700 mb-8">
                            <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {percentage.toFixed(0)}%
                            </div>
                            <p className="text-2xl mb-2">Your Score: {score}/{questions.length}</p>
                            <p className="text-gray-300">
                                {percentage >= 80 ? 'Excellent logical reasoning!' :
                                    percentage >= 60 ? 'Good problem-solving skills!' :
                                        percentage >= 40 ? 'Room for improvement!' :
                                            'Keep practicing!'}
                            </p>
                        </Card>

                        <div className="flex gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={handleRetake}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                Retake Test (Questions will shuffle)
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/assessments')}
                                className="border-purple-600 text-purple-400 hover:bg-purple-900/50"
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
                            <Brain className="h-5 w-5 text-purple-400" />
                            <span className="font-semibold">Aptitude Test</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-semibold text-purple-400">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <Card className="p-8 bg-gray-800/50 border-gray-700 mb-8">
                        <div className="mb-6">
                            <div className="text-sm text-purple-400 font-semibold mb-2">Question {currentQuestion + 1}</div>
                            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
                        </div>

                        <div className="space-y-3">
                            {question.options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${answers[currentQuestion] === index
                                        ? 'border-purple-500 bg-purple-900/50 text-white'
                                        : 'border-gray-700 bg-gray-900/50 hover:border-purple-700 text-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{option}</span>
                                        {answers[currentQuestion] === index && (
                                            <Check className="w-5 h-5 text-purple-400" />
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </Card>

                    {/* Navigation */}
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
                                        ? 'bg-purple-500'
                                        : answers[index] !== undefined
                                            ? 'bg-purple-700'
                                            : 'bg-gray-700'
                                        }`}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={answers[currentQuestion] === undefined}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
