import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { predictionApi } from '@/services/api';
import ChatbotWidget from '@/components/ChatbotWidget';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { ElectricBorder } from '@/components/ui/electric-border';
import { getCompletedAssessments, hasCompletedAllAssessments } from '@/lib/assessmentUtils';
import {
  Brain,
  LogOut,
  User,
  Target,
  Map,
  Briefcase,
  ChevronRight,
  Clock,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Zap,
  Trophy,
  Rocket,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Star,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentDone, setAssessmentDone] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await predictionApi.getResults();
          setResults(data);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  useEffect(() => {
    if (!user) return;
    setAssessmentDone(hasCompletedAllAssessments(user.id));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const assessmentsCompleted = results.length;
  const totalAssessments = 5;

  const gatedNavigate = (path: string) => {
    if (path === '/mentor' && !assessmentDone) {
      navigate('/assessments');
      return;
    }
    if ((path === '/careers' || path === '/roadmap') && !assessmentDone) {
      navigate('/assessments');
      return;
    }
    navigate(path);
  };

  const features = [
    {
      icon: Target,
      emoji: '🧪',
      title: 'Take Assessments',
      description: 'Discover your personality, aptitude, values & risk profile through 5 smart tests',
      path: '/assessments',
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'from-blue-500/20 to-cyan-500/10',
      tag: assessmentsCompleted > 0 ? `${assessmentsCompleted}/${totalAssessments} done` : 'Start here',
      tagColor: assessmentsCompleted > 0 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: Briefcase,
      emoji: '💼',
      title: 'Explore Careers',
      description: 'Browse 13+ career paths with salary insights, job demand & skill requirements',
      path: '/careers',
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'from-purple-500/20 to-pink-500/10',
      tag: assessmentDone ? 'Unlocked' : 'Complete all 5 tests',
      tagColor: assessmentDone ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-300'
    },
    {
      icon: Map,
      emoji: '🗺️',
      title: 'View Roadmap',
      description: 'Get a personalized step-by-step academic & career roadmap based on your profile',
      path: '/roadmap',
      gradient: 'from-green-500 to-emerald-500',
      bgGlow: 'from-green-500/20 to-emerald-500/10',
      tag: assessmentDone ? 'Personalized' : 'Complete all 5 tests',
      tagColor: assessmentDone ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-300'
    },
    {
      icon: Sparkles,
      emoji: '🤖',
      title: 'AI Career Mentor',
      description: 'Chat with your AI mentor for personalized career advice, tips & guidance',
      path: '/mentor',
      gradient: 'from-orange-500 to-red-500',
      bgGlow: 'from-orange-500/20 to-red-500/10',
      tag: assessmentDone ? 'AI Powered' : 'Unlock after assessment',
      tagColor: assessmentDone ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-300'
    },
    {
      icon: BarChart3,
      emoji: '📊',
      title: 'Track Progress',
      description: 'Monitor your career readiness, skill growth & assessment results over time',
      path: '/progress',
      gradient: 'from-cyan-500 to-blue-500',
      bgGlow: 'from-cyan-500/20 to-blue-500/10',
      tag: 'Analytics',
      tagColor: 'bg-cyan-500/20 text-cyan-400'
    },
    {
      icon: BookOpen,
      emoji: '🎯',
      title: 'Holistic Profile',
      description: 'See your complete career profile combining all assessments and predictions',
      path: '/holistic-profile',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'from-pink-500/20 to-rose-500/10',
      tag: 'Full view',
      tagColor: 'bg-pink-500/20 text-pink-400'
    }
  ];

  const quickStats = [
    { label: 'Assessments Done', value: `${assessmentsCompleted}/${totalAssessments}`, icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Career Matches', value: '12+', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Readiness Score', value: assessmentsCompleted > 0 ? '85%' : '—', icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'AI Sessions', value: '∞', icon: Sparkles, color: 'text-orange-400', bg: 'bg-orange-500/10' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Black + dots background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DottedSurface className="z-[1] opacity-85" />
      </div>

      <ChatbotWidget />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CareerPath Pro
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Assessments', path: '/assessments' },
              { label: 'Careers', path: '/careers' },
              { label: 'Roadmap', path: '/roadmap' },
              { label: 'Progress', path: '/progress' },
              { label: 'AI Mentor', path: '/mentor' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/8 rounded-lg transition-all font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block">{user?.full_name?.split(' ')[0]}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-10">

        {/* Welcome Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 mb-4">
                <Activity className="w-3 h-3 text-green-400" />
                Career guidance platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight">
                Hey,{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {user?.full_name?.split(' ')[0]}
                </span>! 👋
              </h1>
              <p className="text-lg text-gray-400 max-w-xl">
                What would you like to do today? Choose a feature below to continue building your career journey.
              </p>
            </div>

            {/* Quick Stats Row */}
            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl ${stat.bg} border border-white/10 backdrop-blur-sm`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
                  <div className="text-lg font-bold leading-none">{stat.value}</div>
                  <div className="text-[9px] text-gray-500 text-center mt-0.5 leading-tight px-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* --- MAIN FEATURE CARDS --- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <h2 className="text-xl font-semibold text-gray-300 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Choose what to explore
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map((feature, index) => {
            const featureColors = ["#3b82f6", "#a855f7", "#10b981", "#f97316", "#06b6d4", "#ec4899"];
            return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => gatedNavigate(feature.path)}
              className="cursor-pointer group h-full"
            >
              <ElectricBorder color={featureColors[index]} variant="swirl" className="h-full">
                <Card className="relative h-full p-6 bg-white/[0.04] border-0 backdrop-blur-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                {/* Glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Top-right gradient accent */}
                <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`} />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg text-2xl`}>
                      {feature.emoji}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${feature.tagColor}`}>
                      {feature.tag}
                    </span>
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <div className={`mt-5 flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    Open
                    <ArrowRight className="w-4 h-4 text-current opacity-70 group-hover:translate-x-1 transition-transform" style={{ color: 'inherit' }} />
                  </div>
                </div>
              </Card>
              </ElectricBorder>
            </motion.div>
          );
          })}
        </div>

        {/* Bottom Row: Recent Activity + Next Step Banner */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-white/[0.04] border border-white/10 backdrop-blur-xl h-full">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.slice(0, 4).map((result, i) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.06 }}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => navigate(`/results/${result.id}`)}
                    >
                      <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">Assessment Completed</p>
                        <p className="text-xs text-gray-500 truncate">Personality type: {result.personality_type}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-3xl">🎯</div>
                  <p className="text-gray-400 mb-2 font-medium">No activity yet</p>
                  <p className="text-sm text-gray-600 mb-5">Complete your first assessment to see your results here</p>
                  <Button
                    onClick={() => navigate('/assessments')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                  >
                    Start Assessment
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Next Step Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <Card className="relative p-6 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-pink-600/10 border border-blue-500/20 backdrop-blur-xl overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-yellow-400" />
                  Suggested Next Step
                </h3>
                <p className="text-xs text-gray-500 mb-6">Based on your profile</p>

                <div className="space-y-3 flex-1">
                  {[
                    { label: assessmentsCompleted === 0 ? '→ Start with assessments' : '→ Complete remaining tests', path: '/assessments', active: true },
                    { label: '→ Explore career matches', path: '/careers', active: false },
                    { label: '→ Get your roadmap', path: '/roadmap', active: false },
                    { label: '→ Chat with AI Mentor', path: '/mentor', active: false }
                  ].map((step, i) => (
                    <Link
                      key={step.path}
                      to={step.path}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all group ${step.active
                        ? 'bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                        }`}
                    >
                      <span className={`text-sm font-medium ${step.active ? 'text-blue-300' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round((assessmentsCompleted / totalAssessments) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(assessmentsCompleted / totalAssessments) * 100}%` }}
                      transition={{ delay: 1, duration: 1 }}
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
