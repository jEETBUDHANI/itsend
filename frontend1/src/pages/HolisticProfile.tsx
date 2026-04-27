import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowLeft, Download, Share2, TrendingUp, Award, Target, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { hasCompletedAllAssessments } from '@/lib/assessmentUtils';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`;

export default function HolisticProfile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedCareer, setSelectedCareer] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [assessmentDone, setAssessmentDone] = useState(false);

    useEffect(() => {
        const checkAndLoad = async () => {
            if (!user) return;

            const done = hasCompletedAllAssessments(user.id);
            setAssessmentDone(done);

            if (!done) {
                setLoading(false);
                return;
            }

            await loadProfileData();
        };

        checkAndLoad();
    }, [user]);

    const loadProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/assessment/holistic`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('[HolisticProfile] API Response:', response.data);

            if (response.data.profile) {
                const profile = response.data.profile;
                const data = profile.profile_data || {};

                // Extract top careers
                const topCareers = data.top_careers || data.topCareers || [];

                console.log('[HolisticProfile] Top Careers:', topCareers);

                setProfileData({
                    careerClarityScore: profile.clarity_score || 0,
                    topCareers: topCareers,
                    personalityTraits: data.personality || {},
                    topWorkValues: data.values ? Object.entries(data.values).map(([name, score]) => ({ name, score })).sort((a, b) => (b.score as number) - (a.score as number)).slice(0, 3) : [],
                    riskTolerance: data.risk_tolerance || { level: 'Medium', score: 50 },
                    riasecScores: data.riasec || {},
                    aptitudeScore: data.aptitude ? Object.values(data.aptitude).reduce((a: number, b: any) => a + b, 0) / Object.keys(data.aptitude).length : 0
                });

                if (topCareers.length > 0) {
                    setSelectedCareer(topCareers[0]);
                }
            } else {
                setError('No profile data found. Please complete your assessments first.');
            }
        } catch (err: any) {
            console.error('[HolisticProfile] Error:', err);
            setError('Failed to load profile. Please complete your assessments first.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-300">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!assessmentDone) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-bold mb-4">Complete All 5 Assessments</h2>
                    <p className="text-gray-300 mb-8">You need to complete all 5 assessments (RIASEC, Aptitude, Personality, Values, and Risk Tolerance) to view your holistic profile.</p>
                    <Button onClick={() => navigate('/assessments')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Go to Assessments
                    </Button>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-bold mb-4">Complete Your Assessments</h2>
                    <p className="text-gray-300 mb-8">{error || 'Please complete all assessments to view your holistic profile.'}</p>
                    <Button onClick={() => navigate('/assessments')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Go to Assessments
                    </Button>
                </div>
            </div>
        );
    }

    // Enhanced Career Roadmap Data with more generic fallbacks
    const careerRoadmaps: any = {
        "Software Engineer": [
            { step: 1, title: "Foundations", desc: "Learn Python or Java, basic syntax, and problem-solving.", icon: "💻" },
            { step: 2, title: "Data Structures", desc: "Master Arrays, Lists, Trees, Graphs for efficient coding.", icon: "🧠" },
            { step: 3, title: "Web Development", desc: "Learn HTML, CSS, JavaScript, and a framework like React.", icon: "🌐" },
            { step: 4, title: "Projects & Portfolio", desc: "Build real-world apps and host them on GitHub.", icon: "🚀" },
            { step: 5, title: "Internships", desc: "Gain industry experience and network with professionals.", icon: "briefcase" }
        ],
        "Data Scientist": [
            { step: 1, title: "Mathematics & Stats", desc: "Linear Algebra, Calculus, Probability, and Statistics.", icon: "📊" },
            { step: 2, title: "Python for Data", desc: "NumPy, Pandas, Matplotlib for data manipulation.", icon: "🐍" },
            { step: 3, title: "Machine Learning", desc: "Scikit-Learn, Supervised & Unsupervised learning algorithms.", icon: "🤖" },
            { step: 4, title: "Deep Learning", desc: "Neural Networks, TensorFlow/PyTorch for advanced AI.", icon: "🧠" },
            { step: 5, title: "Real-world Projects", desc: "Kaggle competitions and end-to-end ML piplines.", icon: "🏆" }
        ],
        "UX Designer": [
            { step: 1, title: "Design Tools", desc: "Master Figma, Adobe XD for interface design.", icon: "🎨" },
            { step: 2, title: "User Research", desc: "Learn qualitative and quantitative research methods.", icon: "🔍" },
            { step: 3, title: "Prototyping", desc: "Create interactive prototypes and wireframes.", icon: "📱" },
            { step: 4, title: "Portfolio", desc: "Showcase case studies and design process.", icon: "💼" }
        ],
        "Product Manager": [
            { step: 1, title: "Market Research", desc: "Understand user needs and market trends.", icon: "chart" },
            { step: 2, title: "Agile Methodologies", desc: "Learn Scrum, Kanban, and product lifecycle.", icon: "repeat" },
            { step: 3, title: "Strategy", desc: "Define product vision and roadmap.", icon: "map" },
            { step: 4, title: "Launch", desc: "Go-to-market strategies and user feedback.", icon: "rocket" }
        ],
        // Generic fallback
        "Default": [
            { step: 1, title: "Explore the Field", desc: "Research core requirements, daily tasks, and skills.", icon: "🔍" },
            { step: 2, title: "Skill Acquisition", desc: "Take relevant online courses and certifications.", icon: "📚" },
            { step: 3, title: "Hands-on Practice", desc: "Build personal projects or volunteer.", icon: "🛠️" },
            { step: 4, title: "Professional Network", desc: "Connect with industry experts on LinkedIn.", icon: "🤝" },
            { step: 5, title: "Job Preparation", desc: "Tailor your resume and prepare for interviews.", icon: "📝" }
        ]
    };

    const selectedRoadmap = selectedCareer ? (careerRoadmaps[selectedCareer.name] || careerRoadmaps["Default"]) : [];

    // Helper to get RIASEC description
    const getRiasecDescription = (code: string) => {
        const descriptions: any = {
            'R': 'Realistic (Doers)',
            'I': 'Investigative (Thinkers)',
            'A': 'Artistic (Creators)',
            'S': 'Social (Helpers)',
            'E': 'Enterprising (Persuaders)',
            'C': 'Conventional (Organizers)'
        };
        return descriptions[code] || code;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-2">
                        <Brain className="h-6 w-6 text-blue-400" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Holistic ProfileTests
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-7xl">

                {/* 1. Profile Summary & Clarity Score */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1">
                        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 p-6 text-center h-full flex flex-col justify-center shadow-lg shadow-blue-900/20">
                            <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                            <h2 className="text-2xl font-bold mb-2">Career Clarity</h2>
                            <div className="text-5xl font-bold mb-4">{Math.round(profileData.careerClarityScore)}%</div>
                            <Progress value={profileData.careerClarityScore} className="h-2 mb-4 bg-black/20" />
                            <p className="text-blue-100 text-sm">
                                {profileData.careerClarityScore >= 75 ? 'You have a clear vision!' :
                                    profileData.careerClarityScore > 0 ? 'Keep exploring to gain more clarity.' :
                                        'Complete assessments to boost this score!'}
                            </p>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
                        <Card className="bg-white/5 border-white/10 p-6 h-full backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-white">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                    Your Profile Snippet
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg text-gray-300 leading-relaxed italic">
                                    "{profileData.summary || "Complete your assessments to generate a personalized professional summary."}"
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {profileData.topWorkValues.map((val: any, i: number) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                                            {val.name}
                                        </span>
                                    ))}
                                    {profileData.riskTolerance && (
                                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                                            Risk: {profileData.riskTolerance.level}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* 2. Detailed Assessment Results (Only show if data exists) */}
                {(Object.keys(profileData.personalityTraits).length > 0 || Object.keys(profileData.riasecScores).length > 0) && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                            <Brain className="w-6 h-6 text-blue-400" />
                            Who You Are
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Personality */}
                            {Object.keys(profileData.personalityTraits).length > 0 && (
                                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                                            <Brain className="w-4 h-4 text-pink-400" /> Personality Traits
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {Object.entries(profileData.personalityTraits).map(([trait, score]: [string, any]) => (
                                            <div key={trait}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="capitalize text-gray-300">{trait}</span>
                                                    <span className="text-gray-400">{score}%</span>
                                                </div>
                                                <Progress value={score} className="h-1.5" />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* RIASEC / Interests */}
                            {Object.keys(profileData.riasecScores).length > 0 && (
                                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                                            <Target className="w-4 h-4 text-yellow-400" /> Interests (RIASEC)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Object.entries(profileData.riasecScores)
                                                .sort(([, a]: any, [, b]: any) => b - a)
                                                .slice(0, 3)
                                                .map(([code, score]: [string, any], i) => (
                                                    <div key={code} className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center font-bold text-black shadow-lg">
                                                            {code}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-white">{getRiasecDescription(code)}</div>
                                                            <Progress value={score * 20} className="h-1.5 mt-1" />
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Values & Aptitude (Combine if space needed) */}
                            {profileData.topWorkValues.length > 0 && (
                                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                                            <Target className="w-4 h-4 text-green-400" /> Core Values
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.topWorkValues.map((val: any, i: number) => (
                                                <span key={i} className="px-3 py-1.5 bg-green-500/20 text-green-300 text-sm rounded-md border border-green-500/30">
                                                    {val.name}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <div className="flex items-end justify-between">
                                                <span className="text-gray-400 text-sm">Aptitude Score</span>
                                                <span className="text-2xl font-bold text-white">{Math.round(profileData.aptitudeScore)}%</span>
                                            </div>
                                            <Progress value={profileData.aptitudeScore} className="h-1.5 mt-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* 3. Top Career Matches */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Target className="w-6 h-6 text-blue-400" />
                        Your Top Career Matches
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {profileData.topCareers.map((career: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.03, translateY: -5 }}
                                onClick={() => setSelectedCareer(career)}
                                className={`cursor-pointer p-6 rounded-xl transition-all relative overflow-hidden group ${selectedCareer?.name === career.name
                                    ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/50 ring-1 ring-blue-400 shadow-lg shadow-blue-500/20'
                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <h4 className="font-bold text-lg text-white">{career.name}</h4>
                                    {index === 0 && <Award className="w-5 h-5 text-yellow-400" />}
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Match</span>
                                        <span className="text-green-400 font-semibold">{career.match}%</span>
                                    </div>
                                    <Progress value={career.match} className={`h-1.5 ${selectedCareer?.name === career.name ? 'bg-blue-900' : 'bg-gray-700'}`} />

                                    {career.salary && (
                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="text-gray-400">Salary</span>
                                            <span className="text-gray-200">{career.salary}</span>
                                        </div>
                                    )}
                                </div>
                                {selectedCareer?.name === career.name && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 4. Integrated Roadmap */}
                {selectedCareer && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
                    >
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-200 text-sm font-medium">Interactive Roadmap</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                Path to becoming a {selectedCareer.name}
                            </h3>
                            <p className="text-gray-400">Step-by-step guide tailored for this role.</p>
                        </div>

                        <div className="relative space-y-8 max-w-4xl mx-auto">
                            {/* Line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent hidden md:block"></div>

                            {selectedRoadmap.map((step: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="hidden md:flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full bg-gray-900 border border-white/10 group-hover:border-blue-500/50 group-hover:scale-110 transition-all flex items-center justify-center text-2xl z-10 shadow-lg">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <Card className="flex-1 bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-all hover:translate-x-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-xl font-bold mb-2 text-white flex items-center gap-3">
                                                    <span className="md:hidden text-2xl">{step.icon}</span>
                                                    {step.title}
                                                </h4>
                                                <p className="text-gray-300">{step.desc}</p>
                                            </div>
                                            <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">0{index + 1}</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <Button size="lg" onClick={() => navigate('/roadmap')} className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-105 transition-all">
                                View Full Roadmap Page <TrendingUp className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4 justify-center"
                >
                    <Button size="lg" variant="outline" onClick={() => navigate('/careers')} className="border-white/20 hover:bg-white/10 w-full md:w-auto">
                        Explore All Careers
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/assessments')} className="border-white/20 hover:bg-white/10 w-full md:w-auto">
                        Retake Assessments
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
