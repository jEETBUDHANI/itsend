import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowRight, CheckCircle2, Brain, LogOut, Sparkles, TrendingUp, Target } from 'lucide-react';
import ChatbotWidget from '@/components/ChatbotWidget';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { ElectricBorder } from '@/components/ui/electric-border';
import { hasCompletedAllAssessments } from '@/lib/assessmentUtils';
import axios from 'axios';

const careerColors: { [key: string]: string } = {
    "Software Engineer": "#3b82f6",
    "Data Scientist": "#a855f7",
    "UX Designer": "#ec4899",
    "Product Manager": "#22c55e",
    "Investment Banker": "#eab308",
    "Doctor": "#ef4444",
    "Scientist": "#06b6d4",
    "Accountant": "#f97316",
    "Teacher": "#6366f1",
    "Analyst": "#10b981",
    "Banker": "#f59e0b",
    "Researcher": "#8b5cf6",
    "Engineer": "#3b82f6"
};

const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`;

interface CareerMatch {
    name: string;
    match: number;
    description: string;
}

interface RoadmapStep {
    title: string;
    desc: string;
    duration?: string;
    icon?: string;
}

const CAREER_ROADMAPS: any = {
    "Software Engineer": {
        steps: [
            { title: "Pick Your First Language", desc: "Start with Python or Java. Focus on syntax, variables, loops.", duration: "1-2 months", icon: "💻" },
            { title: "Master DSA", desc: "Build strong logic using Arrays, Strings, Trees, Graphs. Practice on LeetCode.", duration: "3-6 months", icon: "🧠" },
            { title: "Build Real Projects", desc: "Create a full-stack web app or mobile app. Show your skills in a portfolio.", duration: "Ongoing", icon: "🚀" },
            { title: "Internships & Placements", desc: "Apply for summer internships, prepare resume, practice system design.", duration: "Final Year", icon: "🎯" }
        ]
    },
    "Engineer": {
        steps: [
            { title: "Pick Your First Language", desc: "Start with Python or Java. Focus on syntax, variables, loops.", duration: "1-2 months", icon: "💻" },
            { title: "Master DSA", desc: "Build strong logic using Arrays, Strings, Trees, Graphs. Practice on LeetCode.", duration: "3-6 months", icon: "🧠" },
            { title: "Build Real Projects", desc: "Create a full-stack web app or mobile app. Show your skills in a portfolio.", duration: "Ongoing", icon: "🚀" },
            { title: "Internships & Placements", desc: "Apply for summer internships, prepare resume, practice system design.", duration: "Final Year", icon: "🎯" }
        ]
    },
    "Data Scientist": {
        steps: [
            { title: "Learn Python & Stats", desc: "Master Python, NumPy, Pandas, and statistical concepts.", duration: "2-3 months", icon: "📊" },
            { title: "Machine Learning", desc: "Study ML algorithms, Scikit-learn, TensorFlow basics.", duration: "3-4 months", icon: "🤖" },
            { title: "Build ML Projects", desc: "Create prediction models, work on Kaggle competitions.", duration: "Ongoing", icon: "📈" },
            { title: "Specialize & Apply", desc: "Choose specialization (NLP, CV, etc.), build portfolio, apply for roles.", duration: "Final Year", icon: "🎓" }
        ]
    },
    "Scientist": {
        steps: [
            { title: "Build Strong Foundation", desc: "Master core science subjects (Physics, Chemistry, Biology). Focus on fundamentals.", duration: "1-2 years", icon: "🔬" },
            { title: "Research Skills", desc: "Learn research methodology, data analysis, scientific writing.", duration: "6-12 months", icon: "📚" },
            { title: "Lab Experience", desc: "Work in research labs, conduct experiments, publish papers.", duration: "Ongoing", icon: "🧪" },
            { title: "Advanced Degree", desc: "Pursue Masters/PhD, specialize in your field, network with researchers.", duration: "3-5 years", icon: "🎓" }
        ]
    },
    "Researcher": {
        steps: [
            { title: "Academic Excellence", desc: "Maintain strong grades, read research papers, understand current trends.", duration: "Ongoing", icon: "📖" },
            { title: "Research Methodology", desc: "Learn qualitative and quantitative research methods, statistics.", duration: "6 months", icon: "📊" },
            { title: "Publish Papers", desc: "Conduct original research, write papers, present at conferences.", duration: "Ongoing", icon: "📝" },
            { title: "PhD & Beyond", desc: "Pursue doctoral studies, become subject matter expert, mentor students.", duration: "4-6 years", icon: "🎓" }
        ]
    },
    "Analyst": {
        steps: [
            { title: "Learn Excel & SQL", desc: "Master Excel formulas, pivot tables, SQL queries for data extraction.", duration: "1-2 months", icon: "📊" },
            { title: "Data Visualization", desc: "Learn Tableau, Power BI, create dashboards and reports.", duration: "2-3 months", icon: "📈" },
            { title: "Business Understanding", desc: "Understand business metrics, KPIs, industry-specific analysis.", duration: "3-6 months", icon: "💼" },
            { title: "Advanced Analytics", desc: "Learn Python/R for statistical analysis, predictive modeling.", duration: "Ongoing", icon: "🤖" }
        ]
    },
    "Doctor": {
        steps: [
            { title: "Medical School", desc: "Complete MBBS (5.5 years), focus on anatomy, physiology, pathology.", duration: "5.5 years", icon: "🩺" },
            { title: "Internship", desc: "Complete 1-year rotating internship in various departments.", duration: "1 year", icon: "🏥" },
            { title: "Specialization", desc: "Choose specialty (MD/MS), complete 3-year residency program.", duration: "3 years", icon: "💉" },
            { title: "Practice & Growth", desc: "Start practice, continuous learning, attend conferences, research.", duration: "Ongoing", icon: "⚕️" }
        ]
    },
    "Accountant": {
        steps: [
            { title: "Learn Accounting Basics", desc: "Master double-entry bookkeeping, financial statements, accounting principles.", duration: "2-3 months", icon: "📚" },
            { title: "Accounting Software", desc: "Learn Tally, QuickBooks, SAP for practical accounting work.", duration: "1-2 months", icon: "💻" },
            { title: "Taxation & Compliance", desc: "Study GST, Income Tax, TDS, company law compliance.", duration: "3-6 months", icon: "📋" },
            { title: "CA/CMA Certification", desc: "Pursue professional certification (CA/CMA), gain experience, start practice.", duration: "3-5 years", icon: "🎓" }
        ]
    },
    "Banker": {
        steps: [
            { title: "Banking Fundamentals", desc: "Learn banking operations, financial products, customer service.", duration: "2-3 months", icon: "🏦" },
            { title: "Financial Analysis", desc: "Master credit analysis, risk assessment, loan processing.", duration: "3-6 months", icon: "📊" },
            { title: "Banking Exams", desc: "Prepare for IBPS, SBI PO, RBI exams for government banking jobs.", duration: "6-12 months", icon: "📝" },
            { title: "Career Growth", desc: "Gain experience, pursue MBA Finance, move to senior roles.", duration: "Ongoing", icon: "📈" }
        ]
    },
    "Teacher": {
        steps: [
            { title: "Subject Mastery", desc: "Become expert in your subject, understand curriculum deeply.", duration: "Ongoing", icon: "📚" },
            { title: "Teaching Skills", desc: "Learn pedagogy, classroom management, student psychology.", duration: "6 months", icon: "👨🏫" },
            { title: "B.Ed/Teaching Certification", desc: "Complete B.Ed or teaching certification program.", duration: "1-2 years", icon: "🎓" },
            { title: "Teaching Practice", desc: "Gain experience, develop teaching style, continuous improvement.", duration: "Ongoing", icon: "✏️" }
        ]
    },
    "UX Designer": {
        steps: [
            { title: "Learn Design Tools", desc: "Master Figma, Adobe XD, wireframing, and prototyping.", duration: "1-2 months", icon: "🎨" },
            { title: "User Research", desc: "Learn user interviews, usability testing, A/B testing methods.", duration: "2-3 months", icon: "🔍" },
            { title: "Build Portfolio", desc: "Create 3-5 case studies showing your design process.", duration: "Ongoing", icon: "📱" },
            { title: "Internships & Jobs", desc: "Apply to startups and product companies with your portfolio.", duration: "Final Year", icon: "💼" }
        ]
    }
};

const Roadmap = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [matchedCareers, setMatchedCareers] = useState<CareerMatch[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);
    const [generalCareers, setGeneralCareers] = useState<CareerMatch[]>([]);
    const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
    const [roadmapNote, setRoadmapNote] = useState<string | null>(null);
    const [roadmapLoading, setRoadmapLoading] = useState(false);

    useEffect(() => {
        loadMatchedCareers();
    }, []);

    useEffect(() => {
        const loadRoadmap = async () => {
            if (!selectedCareer?.name || !user || !hasCompletedAllAssessments(user.id)) {
                setRoadmapSteps([]);
                setRoadmapNote(null);
                return;
            }

            try {
                setRoadmapLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/roadmap/career/${encodeURIComponent(selectedCareer.name)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const roadmap = response.data?.roadmap || {};
                const note = roadmap.education_note || response.data?.education_level || null;
                setRoadmapNote(typeof note === 'string' ? note : null);

                const steps = normalizeRoadmapSteps(roadmap);
                setRoadmapSteps(steps);
            } catch (error) {
                console.error('[Roadmap] Failed to load roadmap:', error);
                setRoadmapSteps([]);
                setRoadmapNote(null);
            } finally {
                setRoadmapLoading(false);
            }
        };

        loadRoadmap();
    }, [selectedCareer, user]);

    const normalizeRoadmapSteps = (roadmap: any): RoadmapStep[] => {
        if (!roadmap) return [];

        if (Array.isArray(roadmap.steps)) {
            return roadmap.steps.map((step: any) => ({
                title: step.title || step.focus || 'Next Step',
                desc: step.desc || step.description || step.focus || '',
                duration: step.duration || step.timeline || '',
                icon: step.icon || '🎯'
            }));
        }

        const orderedKeys = Object.keys(roadmap)
            .filter((key) => key.startsWith('step_') || key.startsWith('year_'))
            .sort();

        if (orderedKeys.length > 0) {
            return orderedKeys.map((key) => {
                const value = roadmap[key] || {};
                return {
                    title: value.title || value.focus || key.replace('_', ' ').toUpperCase(),
                    desc: value.description || value.focus || value.tasks?.[0] || 'Personalized roadmap step',
                    duration: value.duration || value.timeline || '',
                    icon: value.icon || '🎯'
                };
            });
        }

        return [];
    };

    const loadMatchedCareers = async () => {
        const hasCompletedAll = user ? hasCompletedAllAssessments(user.id) : false;
        const allNames = Object.keys(CAREER_ROADMAPS);
        setGeneralCareers(
            allNames.slice(0, 6).map((name) => ({ name, match: 60, description: 'General roadmap option' }))
        );

        if (!hasCompletedAll) {
            setHasProfile(false);
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/assessment/holistic`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('[Roadmap] API Response:', response.data);

            if (response.data.profile && response.data.profile.profile_data) {
                const profileData = response.data.profile.profile_data;
                console.log('[Roadmap] Profile Data:', profileData);
                const careers = profileData.top_careers || profileData.topCareers || [];
                console.log('[Roadmap] Matched Careers:', careers);

                // Flexible parsing
                let parsedCareers = careers;
                if (typeof careers === 'string') {
                    try { parsedCareers = JSON.parse(careers); } catch (e) { parsedCareers = []; }
                }

                setMatchedCareers(parsedCareers);
                const selectedNames = new Set(parsedCareers.map((c: CareerMatch) => c.name));
                setGeneralCareers(
                    allNames
                        .filter((name) => !selectedNames.has(name))
                        .slice(0, 6)
                        .map((name) => ({ name, match: 60, description: 'General roadmap option' }))
                );

                if (parsedCareers.length > 0) {
                    setHasProfile(true);
                    setSelectedCareer(parsedCareers[0]);
                } else {
                    setHasProfile(false);
                }
            } else {
                setHasProfile(false);
            }
        } catch (error) {
            console.error('[Roadmap] Failed to load matched careers:', error);
            setHasProfile(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!user || !hasCompletedAllAssessments(user.id)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
                <ChatbotWidget />
                <header className="border-b border-white/10 bg-black/50 backdrop-blur-lg">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                <Brain className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CareerPath Pro</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-8xl mb-8">🎯</div>
                        <h1 className="text-4xl font-bold mb-4">Complete All 5 Assessments First</h1>
                        <p className="text-xl text-gray-400 mb-8">
                            Finish all 5 assessments first. Then Roadmap will open and show the career path recommended from your full assessment profile.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" onClick={() => navigate('/assessments')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                                Take Assessments
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                                Back to Dashboard
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const staticRoadmap = selectedCareer
        ? CAREER_ROADMAPS[selectedCareer.name] || CAREER_ROADMAPS["Software Engineer"]
        : null;

    const activeRoadmapSteps = roadmapSteps.length > 0
        ? roadmapSteps
        : normalizeRoadmapSteps(staticRoadmap);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <ChatbotWidget />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CareerPath Pro</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-bold mb-4">
                        Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Career Roadmap</span>
                    </h1>
                    <p className="text-xl text-gray-300">Step-by-step guide to your dream career</p>
                </motion.div>

                {/* Career Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    {matchedCareers.length > 0 ? (
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Section A: Personalized Roadmap (Based on Your Assessment)
                    </h3>
                    ) : (
                    <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-100">
                        Personalized roadmap will appear here as soon as your assessment data is available. You can still explore general roadmaps below.
                    </div>
                    )}
                    <div className="grid md:grid-cols-3 gap-4">
                        {matchedCareers.map((career, index) => {
                            const careerColor = careerColors[career.name] || "#3b82f6";
                            return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedCareer(career)}
                                className="h-full"
                            >
                                <ElectricBorder color={careerColor} variant="swirl" className="h-full">
                                    <div className={`p-6 rounded-lg cursor-pointer transition-all h-full flex flex-col justify-center ${selectedCareer?.name === career.name
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 ring-2 ring-blue-400'
                                        : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        <h4 className="font-bold text-lg mb-2">{career.name}</h4>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Sparkles className="w-4 h-4 text-yellow-400" />
                                            <span className="text-green-400 font-semibold">{career.match}% Match</span>
                                        </div>
                                    </div>
                                </ElectricBorder>
                            </motion.div>
                            );
                        })}
                    </div>

                    <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-400" />
                        Section B: Other Roadmaps (General)
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {generalCareers.map((career, index) => {
                            const careerColor = careerColors[career.name] || "#8b5cf6";
                            return (
                                <motion.div
                                    key={`general-${index}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.35 + index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                    onClick={() => setSelectedCareer(career)}
                                    className="h-full"
                                >
                                    <ElectricBorder color={careerColor} variant="swirl" className="h-full">
                                        <div className="p-6 rounded-lg cursor-pointer transition-all h-full flex flex-col justify-center bg-white/5 hover:bg-white/10">
                                            <h4 className="font-bold text-lg mb-2">{career.name}</h4>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                                <span className="text-gray-300">General Path</span>
                                            </div>
                                        </div>
                                    </ElectricBorder>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Roadmap Steps */}
                {selectedCareer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                    >
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                            Step-by-Step Roadmap: {selectedCareer?.name}
                        </h3>

                        {roadmapLoading && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                                Loading personalized roadmap...
                            </div>
                        )}

                        {roadmapNote && (
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-100">
                                {roadmapNote}
                            </div>
                        )}

                        {activeRoadmapSteps.map((step: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <Card className="bg-gray-800/90 border-white/20 backdrop-blur-xl overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className="flex items-start gap-6">
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold shadow-lg">
                                                {step.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-2xl font-bold text-white">Step {index + 1}: {step.title}</h4>
                                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                                                        {step.duration}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 text-lg">{step.desc}</p>
                                            </div>
                                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                {index < activeRoadmapSteps.length - 1 && (
                                    <div className="flex justify-center py-4">
                                        <ArrowRight className="w-8 h-8 text-blue-400 rotate-90" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 flex gap-4 justify-center"
                >
                    <Button size="lg" onClick={() => navigate('/careers')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Explore More Careers
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </Button>
                </motion.div>
            </main>
        </div>
    );
};

export default Roadmap;
