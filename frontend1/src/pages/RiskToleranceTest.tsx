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

const RISK_TOLERANCE_QUESTIONS = [
    { id: 1, question: "I prefer a guaranteed smaller reward over a risky larger one", reverse: true },
    { id: 2, question: "I'm comfortable with taking calculated risks", reverse: false },
    { id: 3, question: "I would rather have job security than high pay with uncertainty", reverse: true },
    { id: 4, question: "I enjoy trying new things even if they might fail", reverse: false },
    { id: 5, question: "I prefer proven methods over experimental approaches", reverse: true },
    { id: 6, question: "I'm willing to invest time in uncertain ventures", reverse: false },
    { id: 7, question: "I avoid situations where outcomes are unpredictable", reverse: true },
    { id: 8, question: "I'm excited by challenges with unknown outcomes", reverse: false },
    { id: 9, question: "I prefer stable income over variable commission", reverse: true },
    { id: 10, question: "I would start my own business if I had a good idea", reverse: false },
    { id: 11, question: "I stick to what I know works", reverse: true },
    { id: 12, question: "I embrace change and uncertainty", reverse: false },
    { id: 13, question: "I prefer detailed plans over spontaneous decisions", reverse: true },
    { id: 14, question: "I'm comfortable making decisions with incomplete information", reverse: false },
    { id: 15, question: "I avoid financial investments with market fluctuations", reverse: true }
];

const ACTIVE_RISK_TOLERANCE_QUESTIONS = RISK_TOLERANCE_QUESTIONS.slice(0, 10);

const AGREEMENT_OPTIONS = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" }
];

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const getRiskProfile = (score: number) => {
    if (score >= 80) return { level: "Very High", desc: "Risk Taker", emoji: "🚀", color: "from-red-600 to-orange-600" };
    if (score >= 60) return { level: "High", desc: "Adventurous", emoji: "🎯", color: "from-orange-600 to-yellow-600" };
    if (score >= 40) return { level: "Moderate", desc: "Balanced", emoji: "⚖️", color: "from-yellow-600 to-green-600" };
    if (score >= 20) return { level: "Low", desc: "Cautious", emoji: "🛡️", color: "from-green-600 to-blue-600" };
    return { level: "Very Low", desc: "Risk Averse", emoji: "🔒", color: "from-blue-600 to-purple-600" };
};

export default function RiskToleranceTest() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [questions, setQuestions] = useState(ACTIVE_RISK_TOLERANCE_QUESTIONS);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [riskScore, setRiskScore] = useState(0);

    useEffect(() => {
        setQuestions(shuffleArray(ACTIVE_RISK_TOLERANCE_QUESTIONS));
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
        let total = 0;
        questions.forEach((q, index) => {
            const score = answers[index];
            total += q.reverse ? (6 - score) : score;
        });

        const percentage = Math.round((total / (questions.length * 5)) * 100);
        setRiskScore(percentage);
        setShowResults(true);

        // Submit to backend API
        const submitToBackend = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/assessment/risk`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            answers: answers.map((answer, index) => ({
                                questionId: questions[index].id,
                                value: answer,
                                reverse: questions[index].reverse
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
            markAssessmentComplete(user.id, 'risk');
        }

        toast({
            title: 'Risk Tolerance Assessment Complete!',
            description: `Your risk profile: ${getRiskProfile(percentage).desc}`,
        });
    };

    const handleRetake = () => {
        setQuestions(shuffleArray(ACTIVE_RISK_TOLERANCE_QUESTIONS));
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResults(false);
        setRiskScore(0);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (showResults) {
        const profile = getRiskProfile(riskScore);

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

                <div className="container mx-auto px-4 py-12 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="text-6xl mb-6">{profile.emoji}</div>
                        <h1 className="text-4xl font-bold mb-4">Your Risk Profile</h1>

                        <Card className={`p-12 bg-gradient-to-r ${profile.color} border-0 mb-8`}>
                            <div className="text-7xl mb-4">{profile.emoji}</div>
                            <h2 className="text-3xl font-bold mb-2">{profile.desc}</h2>
                            <div className="text-5xl font-bold mb-4">{riskScore}%</div>
                            <p className="text-xl opacity-90">Risk Tolerance Level: {profile.level}</p>
                        </Card>

                        <Card className="p-8 bg-gray-800/50 border-gray-700 text-left mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-white">What This Means</h3>
                            <div className="space-y-4 text-gray-300">
                                {riskScore >= 80 && (
                                    <>
                                        <p>✅ You're comfortable with significant uncertainty</p>
                                        <p>✅ You thrive in entrepreneurial environments</p>
                                        <p>✅ You embrace change and challenges</p>
                                        <p>⚠️ Consider balancing risk with stable foundations</p>
                                    </>
                                )}
                                {riskScore >= 60 && riskScore < 80 && (
                                    <>
                                        <p>✅ You take calculated risks</p>
                                        <p>✅ You're open to new opportunities</p>
                                        <p>✅ You balance risk and reward well</p>
                                        <p>💡 Great for growth-stage companies</p>
                                    </>
                                )}
                                {riskScore >= 40 && riskScore < 60 && (
                                    <>
                                        <p>✅ You have a balanced approach</p>
                                        <p>✅ You evaluate risks carefully</p>
                                        <p>✅ You're comfortable with moderate uncertainty</p>
                                        <p>💡 Suited for most career paths</p>
                                    </>
                                )}
                                {riskScore < 40 && (
                                    <>
                                        <p>✅ You value stability and security</p>
                                        <p>✅ You make well-planned decisions</p>
                                        <p>✅ You prefer predictable outcomes</p>
                                        <p>💡 Great for established companies and public sector</p>
                                    </>
                                )}
                            </div>
                        </Card>

                        <div className="flex gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={handleRetake}
                                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                            >
                                Retake Test (Questions will shuffle)
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/assessments')}
                                className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/50"
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
                            <Brain className="h-5 w-5 text-yellow-400" />
                            <span className="font-semibold">Risk Tolerance</span>
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
                        <span className="text-sm font-semibold text-yellow-400">{progress.toFixed(0)}%</span>
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
                            <div className="text-sm text-yellow-400 font-semibold mb-2">Question {currentQuestion + 1}</div>
                            <h2 className="text-3xl font-bold text-center mb-2">{question.question}</h2>
                            <p className="text-center text-gray-400">How much do you agree?</p>
                        </div>

                        <div className="space-y-3">
                            {AGREEMENT_OPTIONS.map((option) => (
                                <motion.button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full p-4 rounded-xl border-2 text-center transition-all ${answers[currentQuestion] === option.value
                                        ? 'border-yellow-500 bg-yellow-900/50 text-white'
                                        : 'border-gray-700 bg-gray-900/50 hover:border-yellow-700 text-gray-300'
                                        }`}
                                >
                                    <span className="font-medium">{option.label}</span>
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
                                        ? 'bg-yellow-500'
                                        : answers[index] !== undefined
                                            ? 'bg-yellow-700'
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
