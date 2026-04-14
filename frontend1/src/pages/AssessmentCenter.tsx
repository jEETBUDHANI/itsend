import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle2, Circle, ArrowLeft, Trophy, Target, Clock, Sparkles } from 'lucide-react';
import ChatbotWidget from '@/components/ChatbotWidget';
import { useAuth } from '@/contexts/AuthContext';
import { BackgroundBeams } from '@/components/ui/background-beams';

const assessments = [
    {
        id: 'riasec',
        title: 'Interest Assessment',
        description: 'Discover what you enjoy doing',
        icon: '🎯',
        route: '/test',
        duration: '10 min',
        color: 'from-blue-600 to-cyan-600'
    },
    {
        id: 'aptitude',
        title: 'Aptitude Test',
        description: 'Identify your natural strengths',
        icon: '🧠',
        route: '/assessments/aptitude',
        duration: '15 min',
        color: 'from-purple-600 to-pink-600'
    },
    {
        id: 'personality',
        title: 'Personality Profile',
        description: 'Understand how you behave',
        icon: '🎭',
        route: '/assessments/personality',
        duration: '12 min',
        color: 'from-green-600 to-emerald-600'
    },
    {
        id: 'values',
        title: 'Work Values',
        description: 'What matters to you most',
        icon: '💎',
        route: '/assessments/values',
        duration: '10 min',
        color: 'from-orange-600 to-red-600'
    },
    {
        id: 'risk',
        title: 'Risk Tolerance',
        description: 'Your comfort with uncertainty',
        icon: '🎯',
        route: '/assessments/risk',
        duration: '8 min',
        color: 'from-yellow-600 to-orange-600'
    }
];

export default function AssessmentCenter() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);

    // Load completed assessments from localStorage on mount (user-specific)
    useEffect(() => {
        if (user) {
            const storageKey = `completedAssessments_${user.id}`;
            const completed = localStorage.getItem(storageKey);
            if (completed) {
                setCompletedAssessments(JSON.parse(completed));
            }
        }
    }, [user]);

    const completionRate = (completedAssessments.length / assessments.length) * 100;

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Animated Background with Beams */}
            <div className="fixed inset-0 z-0">
                <BackgroundBeams className="opacity-50" />
            </div>

            <ChatbotWidget />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-300 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="h-6 w-px bg-white/20" />
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Brain className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                CareerPath Pro
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Assessment Center
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Complete all assessments for comprehensive career guidance
                    </p>
                </motion.div>

                {/* Progress Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                    <Trophy className="w-6 h-6 text-yellow-400" />
                                    Your Progress
                                </h3>
                                <p className="text-gray-300">
                                    {completedAssessments.length} of {assessments.length} assessments completed
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{completionRate.toFixed(0)}%</div>
                                <div className="text-sm text-gray-300">Complete</div>
                            </div>
                        </div>
                        <Progress value={completionRate} className="h-3" />
                    </Card>
                </motion.div>

                {/* Assessment Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {assessments.map((assessment, index) => {
                        const isCompleted = completedAssessments.includes(assessment.id);

                        return (
                            <motion.div
                                key={assessment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                onClick={() => navigate(assessment.route)}
                                className="cursor-pointer"
                            >
                                <Card className={`relative p-6 bg-gradient-to-br ${assessment.color} border-0 overflow-hidden ${isCompleted ? 'ring-2 ring-green-400' : ''}`}>
                                    <div className="absolute top-0 right-0 text-9xl opacity-10">
                                        {assessment.icon}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-5xl">{assessment.icon}</div>
                                            {isCompleted ? (
                                                <div className="p-2 bg-green-500 rounded-full">
                                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                                </div>
                                            ) : (
                                                <Circle className="h-6 w-6 text-white/50" />
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{assessment.title}</h3>
                                        <p className="text-white/80 mb-4">{assessment.description}</p>
                                        <div className="flex items-center gap-2 mb-4 text-sm text-white/70">
                                            <Clock className="w-4 h-4" />
                                            <span>{assessment.duration}</span>
                                        </div>
                                        <Button
                                            className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                                            onClick={() => navigate(assessment.route)}
                                        >
                                            {isCompleted ? 'Retake Assessment' : 'Start Assessment'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Holistic Profile CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-center">
                        <div className="inline-block p-4 bg-white/20 rounded-full mb-6">
                            <Sparkles className="w-12 h-12 text-yellow-300" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">
                            {completionRate === 100 ? 'Your Holistic Profile is Ready!' : 'Unlock Your Holistic Profile'}
                        </h3>
                        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                            {completionRate === 100
                                ? 'View your comprehensive career profile with personalized insights'
                                : `Each assessment now has 10 questions. Complete all 5 assessments to unlock Careers and Roadmap based on your full profile.`
                            }
                        </p>
                        {completionRate !== 100 && (
                            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
                                <div className="p-4 bg-white/10 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-green-300 mx-auto mb-2" />
                                    <p className="text-sm">Career clarity score (0-100)</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-green-300 mx-auto mb-2" />
                                    <p className="text-sm">Confidence & risk analysis</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-green-300 mx-auto mb-2" />
                                    <p className="text-sm">Personalized roadmaps</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-green-300 mx-auto mb-2" />
                                    <p className="text-sm">20-page PDF report</p>
                                </div>
                            </div>
                        )}
                        <Button
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-gray-100"
                            disabled={completionRate !== 100}
                            onClick={() => navigate('/holistic-profile')}
                        >
                            {completionRate === 100 ? 'View Holistic Profile' : 'Complete Assessments First'}
                        </Button>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
