import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Code, Palette, Microscope, LineChart, Building, Stethoscope, Calculator, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { ElectricBorder } from '@/components/ui/electric-border';
import { useAuth } from '@/contexts/AuthContext';
import { hasCompletedAllAssessments } from '@/lib/assessmentUtils';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`;

const careerColors: { [key: string]: string } = {
    "Software Engineer": "#3b82f6",
    "Data Scientist": "#a855f7",
    "UX Designer": "#ec4899",
    "Product Manager": "#22c55e",
    "Investment Banker": "#eab308",
    "Doctor": "#ef4444",
    "Scientist": "#06b6d4",
    "Accountant": "#f97316",
    "Teacher": "#6366f1"
};

const careers = [
    { name: "Software Engineer", icon: <Code className="w-8 h-8 text-blue-400" />, desc: "Build software solutions." },
    { name: "Data Scientist", icon: <Brain className="w-8 h-8 text-purple-400" />, desc: "Analyze data for insights." },
    { name: "UX Designer", icon: <Palette className="w-8 h-8 text-pink-400" />, desc: "Design user experiences." },
    { name: "Product Manager", icon: <LineChart className="w-8 h-8 text-green-400" />, desc: "Lead product development." },
    { name: "Investment Banker", icon: <Building className="w-8 h-8 text-yellow-400" />, desc: "Manage financial assets." },
    { name: "Doctor", icon: <Stethoscope className="w-8 h-8 text-red-400" />, desc: "Diagnose and treat patients." },
    { name: "Scientist", icon: <Microscope className="w-8 h-8 text-cyan-400" />, desc: "Conduct scientific research." },
    { name: "Accountant", icon: <Calculator className="w-8 h-8 text-orange-400" />, desc: "Manage financial records." },
    { name: "Teacher", icon: <GraduationCap className="w-8 h-8 text-indigo-400" />, desc: "Educate and mentor students." }
];

export default function CareerExplorer() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [assessmentDone, setAssessmentDone] = useState(false);
    const [personalizedCareerName, setPersonalizedCareerName] = useState<string | null>(null);

    useEffect(() => {
        const loadCareerUnlock = async () => {
            if (!user) return;

            const done = hasCompletedAllAssessments(user.id);
            setAssessmentDone(done);

            if (!done) {
                setPersonalizedCareerName(null);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/assessment/holistic`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const profileData = response.data?.profile?.profile_data || {};
                const topCareers = profileData.top_careers || profileData.topCareers || [];
                const topName = topCareers[0]?.name || topCareers[0] || null;
                setPersonalizedCareerName(typeof topName === 'string' ? topName : null);
            } catch {
                setPersonalizedCareerName(null);
            }
        };

        loadCareerUnlock();
    }, [user]);

    const personalizedCareer = useMemo(
        () => careers.find((c) => c.name === personalizedCareerName) || null,
        [personalizedCareerName]
    );

    const otherCareers = useMemo(() => {
        if (!personalizedCareerName) return careers;
        return careers.filter((c) => c.name !== personalizedCareerName);
    }, [personalizedCareerName]);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Animated Background with Beams */}
            <div className="fixed inset-0 z-0">
                <BackgroundBeams className="opacity-50" />
            </div>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            CareerPath Pro
                        </span>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    >
                        Explore Top Careers
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Discover various career paths, understand what they entail, and find the perfect match for your skills and interests.
                    </motion.p>
                </div>

                {assessmentDone && personalizedCareer && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4 text-blue-300">Section A: Personalized Career (Based on Your Assessment)</h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-xl"
                        >
                            <ElectricBorder color={careerColors[personalizedCareer.name]} variant="hue" className="h-full">
                                <Card className="bg-white/10 border-0 h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="p-3 rounded-xl bg-white/10">
                                                {personalizedCareer.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-green-300 mb-1">Top Match</p>
                                                <CardTitle className="text-2xl text-white">{personalizedCareer.name}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-300 mb-6">{personalizedCareer.desc}</p>
                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group"
                                            onClick={() => navigate(`/careers/${encodeURIComponent(personalizedCareer.name)}`)}
                                        >
                                            View Career Details
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </ElectricBorder>
                        </motion.div>
                    </div>
                )}

                {!assessmentDone && (
                    <Card className="mb-10 p-6 bg-yellow-500/10 border-yellow-500/30">
                        <h3 className="text-xl font-bold mb-2">Careers are locked</h3>
                        <p className="text-gray-300 mb-4">Complete all 5 assessments first. Then Careers will open and show one recommendation based on your full assessment profile plus other general careers.</p>
                        <Button className="bg-gradient-to-r from-indigo-600 to-blue-600" onClick={() => navigate('/assessments')}>
                            Go to Assessments
                        </Button>
                    </Card>
                )}

                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-purple-300">
                        Section B: {assessmentDone ? 'Other Careers (General)' : 'General Careers'}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherCareers.map((career, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="h-full"
                        >
                            <ElectricBorder color={careerColors[career.name]} variant="swirl" className="h-full">
                                <Card className="bg-white/5 border-0 hover:bg-white/10 transition-all cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="p-3 rounded-xl bg-white/5">
                                                {career.icon}
                                            </div>
                                            <CardTitle className="text-xl text-white">{career.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-400 mb-6">{career.desc}</p>
                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group"
                                            onClick={() => navigate(`/careers/${encodeURIComponent(career.name)}`)}
                                        >
                                            View Career Details
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </ElectricBorder>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
