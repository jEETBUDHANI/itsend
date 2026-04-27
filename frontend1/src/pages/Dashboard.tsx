import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { predictionApi, userApi, class12Api, collegeApi } from '@/services/api';
import ChatbotWidget from '@/components/ChatbotWidget';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { ElectricBorder } from '@/components/ui/electric-border';
import { getCompletedAssessments, hasCompletedAllAssessments } from '@/lib/assessmentUtils';
import { getClass12CareerProfile } from '@/lib/class12CareerData';
import axios from 'axios';
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
  Activity,
  Compass,
  GraduationCap,
  Lightbulb,
  Eye,
  Award,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentDone, setAssessmentDone] = useState(false);
  const [userModule, setUserModule] = useState<'class10' | 'class12' | 'college' | null>(null);
  const [class10Results, setClass10Results] = useState<any>(null);
  const [class12Results, setClass12Results] = useState<any>(null);
  const [collegeResults, setCollegeResults] = useState<any>(null);
  const [class12Journey, setClass12Journey] = useState({
    selectedCareer: '',
    roadmapStarted: false,
    examPreparing: false,
    collegeShortlisted: false,
  });
  const [collegeJourney, setCollegeJourney] = useState({
    selectedCareer: '',
    roadmapStarted: false,
    examPreparing: false,
    collegeShortlisted: false,
  });

  const careerExamMap: Record<string, { exams: string[]; difficulty: string; subjects: string[]; dailyPlan: string[]; weeklyPlan: string[] }> = {
    'Software Engineer': {
      exams: ['JEE Mains/Advanced', 'State CET', 'VITEEE'],
      difficulty: 'High',
      subjects: ['Physics', 'Chemistry', 'Maths'],
      dailyPlan: ['3 hrs PCM', '1 hr DSA basics', '30 min revision'],
      weeklyPlan: ['2 mock tests', '1 doubt-clearing session', 'Project practice']
    },
    'Doctor': {
      exams: ['NEET'],
      difficulty: 'Very High',
      subjects: ['Biology', 'Chemistry', 'Physics'],
      dailyPlan: ['2 hrs Biology', '2 hrs Chemistry/Physics', '1 hr revision'],
      weeklyPlan: ['2 NEET mock tests', 'Error analysis', 'NCERT revision']
    },
    'Chartered Accountant': {
      exams: ['CA Foundation', 'CA Intermediate'],
      difficulty: 'High',
      subjects: ['Accounts', 'Law', 'Economics', 'Maths'],
      dailyPlan: ['2 hrs Accounts', '1 hr Law', '1 hr practice questions'],
      weeklyPlan: ['1 full mock test', 'Formula revision', 'Case-study practice']
    },
    'UI/UX Designer': {
      exams: ['NIFT', 'NID', 'UCEED'],
      difficulty: 'Medium',
      subjects: ['Design Aptitude', 'Creativity', 'Visual Communication'],
      dailyPlan: ['1 hr sketching', '1 hr design tools', '1 hr portfolio practice'],
      weeklyPlan: ['2 design challenges', 'Portfolio review', 'User research task']
    }
  };

  const careerCollegeMap: Record<string, Array<{ name: string; location: string; fees: string; cutoff: string; examAccepted: string }>> = {
    'Software Engineer': [
      { name: 'IIT Bombay', location: 'Mumbai', fees: '2.4L/year', cutoff: 'Top 1%', examAccepted: 'JEE Advanced' },
      { name: 'NIT Trichy', location: 'Trichy', fees: '1.8L/year', cutoff: 'Top 5%', examAccepted: 'JEE Main' },
      { name: 'VIT Vellore', location: 'Vellore', fees: '2.0L/year', cutoff: 'VITEEE Rank < 10k', examAccepted: 'VITEEE' },
    ],
    'Doctor': [
      { name: 'AIIMS Delhi', location: 'Delhi', fees: '1.6L/year', cutoff: 'Top 0.5%', examAccepted: 'NEET' },
      { name: 'CMC Vellore', location: 'Vellore', fees: '2.2L/year', cutoff: 'Top 2%', examAccepted: 'NEET' },
      { name: 'JIPMER', location: 'Puducherry', fees: '1.9L/year', cutoff: 'Top 1%', examAccepted: 'NEET' },
    ],
    'Chartered Accountant': [
      { name: 'SRCC + CA Path', location: 'Delhi', fees: '0.8L/year', cutoff: 'Top 3%', examAccepted: 'CUET + CA Foundation' },
      { name: 'Christ University', location: 'Bengaluru', fees: '1.2L/year', cutoff: 'Merit', examAccepted: 'University Test + CA Foundation' },
      { name: 'St. Xavier’s College', location: 'Mumbai', fees: '0.9L/year', cutoff: 'High Merit', examAccepted: 'Merit + CA Foundation' },
    ],
    'UI/UX Designer': [
      { name: 'NID Ahmedabad', location: 'Ahmedabad', fees: '2.6L/year', cutoff: 'Top Design Rank', examAccepted: 'NID DAT' },
      { name: 'NIFT Delhi', location: 'Delhi', fees: '2.8L/year', cutoff: 'Top 5%', examAccepted: 'NIFT' },
      { name: 'IIITDM Jabalpur', location: 'Jabalpur', fees: '1.9L/year', cutoff: 'Top UCEED Rank', examAccepted: 'UCEED' },
    ],
  };

  const getModuleInfo = (module: string | null | undefined) => {
    switch (module) {
      case 'class10':
        return {
          name: 'Class 10 - Discovery',
          assessmentTitle: 'Find Your Stream',
          assessmentDesc: 'Take assessments to discover your strengths and choose the right stream (Science, Commerce, Arts)',
          careerTitle: 'Career Clusters',
          careerDesc: 'Explore career clusters suitable for your strengths and interests',
          roadmapTitle: 'Stream Guide',
          roadmapDesc: 'Get guidance on stream selection and preparation for future exams'
        };
      case 'class12':
        return {
          name: 'Class 12 - Decision',
          assessmentTitle: 'Plan Your College Path',
          assessmentDesc: 'Assessments to help you choose the best colleges and degree programs',
          careerTitle: 'Degree & College Fit',
          careerDesc: 'Discover degree programs and colleges aligned with your profile',
          roadmapTitle: 'Exam Roadmap',
          roadmapDesc: 'Strategic roadmap for entrance exams and college applications'
        };
      case 'college':
        return {
          name: 'College - Execution',
          assessmentTitle: 'Placement Readiness',
          assessmentDesc: 'Evaluate your readiness for internships and placements',
          careerTitle: 'Job Roles',
          careerDesc: 'Discover job roles and companies matching your skills',
          roadmapTitle: 'Career Roadmap',
          roadmapDesc: 'Build placement strategy and skill development plan'
        };
      default:
        return {
          name: 'Career Guidance',
          assessmentTitle: 'Take Assessments',
          assessmentDesc: 'Discover your personality, aptitude, values & risk profile through 5 smart tests',
          careerTitle: 'Explore Careers',
          careerDesc: 'Browse 13+ career paths with salary insights, job demand & skill requirements',
          roadmapTitle: 'View Roadmap',
          roadmapDesc: 'Get a personalized step-by-step academic & career roadmap based on your profile'
        };
    }
  };

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
    const loadUserModule = async () => {
      try {
        const profile = await userApi.getProfile();
        const module = profile?.user?.education_module || null;
        setUserModule(module);

        // If Class 10, fetch their Class 10 results
        if (module === 'class10') {
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/class10/results`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (response.data && response.data.results && response.data.results.length > 0) {
              // Get the latest result (descending order)
              const latestResult = response.data.results[0];
              setClass10Results(latestResult.score_payload);
            }
          } catch (err) {
            console.log('No Class 10 results yet');
          }
        }

        if (module === 'class12') {
          try {
            const response = await class12Api.getResults();
            const latest = response?.results?.[0]?.score_payload;
            if (latest) {
              setClass12Results(latest);
              localStorage.setItem('class12_results_snapshot', JSON.stringify(latest));
            }
          } catch (err) {
            try {
              const cached = localStorage.getItem('class12_results_snapshot');
              if (cached) {
                setClass12Results(JSON.parse(cached));
              }
            } catch {
              console.log('No cached Class 12 results available');
            }
          }
        }

        if (module === 'college') {
          try {
            const response = await collegeApi.getResults();
            const latest = response?.results?.[0]?.score_payload;
            if (latest) {
              setCollegeResults(latest);
            }
          } catch (err) {
            console.log('No College results yet');
          }
        }
      } catch (error) {
        console.error('Failed to load user module:', error);
      }
    };
    loadUserModule();
  }, [user]);

  useEffect(() => {
    const readJourney = () => {
      try {
        const rawJourney = localStorage.getItem('class12_journey');
        if (rawJourney) {
          const parsed = JSON.parse(rawJourney);
          setClass12Journey({
            selectedCareer: parsed.selectedCareer || '',
            roadmapStarted: !!parsed.roadmapStarted,
            examPreparing: !!parsed.examPreparing,
            collegeShortlisted: !!parsed.collegeShortlisted,
          });
          return;
        }
      } catch (error) {
        console.error('Failed to read Class 12 journey state:', error);
      }

      const selectedCareer = localStorage.getItem('class12_selected_career') || '';
      setClass12Journey((previous) => ({
        ...previous,
        selectedCareer,
      }));
    };

    readJourney();
    window.addEventListener('storage', readJourney);
    window.addEventListener('class12-journey-updated', readJourney as EventListener);
    return () => {
      window.removeEventListener('storage', readJourney);
      window.removeEventListener('class12-journey-updated', readJourney as EventListener);
    };
  }, [userModule, class12Results]);

  useEffect(() => {
    const readJourney = () => {
      try {
        const rawJourney = localStorage.getItem('college_journey');
        if (rawJourney) {
          const parsed = JSON.parse(rawJourney);
          setCollegeJourney({
            selectedCareer: parsed.selectedCareer || '',
            roadmapStarted: !!parsed.roadmapStarted,
            examPreparing: !!parsed.examPreparing,
            collegeShortlisted: !!parsed.collegeShortlisted,
          });
          return;
        }
      } catch (error) {
        console.error('Failed to read college journey state:', error);
      }

      const selectedCareer = localStorage.getItem('college_selected_career') || '';
      setCollegeJourney((previous) => ({
        ...previous,
        selectedCareer,
      }));
    };

    readJourney();
    window.addEventListener('storage', readJourney);
    window.addEventListener('college-journey-updated', readJourney as EventListener);
    return () => {
      window.removeEventListener('storage', readJourney);
      window.removeEventListener('college-journey-updated', readJourney as EventListener);
    };
  }, [userModule, collegeResults]);

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
    const moduleAssessmentUnlocked =
      userModule === 'class12'
        ? !!(class12Results || class12Journey.selectedCareer)
        : userModule === 'college'
          ? !!(collegeResults || collegeJourney.selectedCareer)
          : assessmentDone;

    if (path === '/mentor' && !moduleAssessmentUnlocked) {
      navigate(userModule === 'class12' ? '/class12-assessment' : userModule === 'college' ? '/college-assessment' : '/assessments');
      return;
    }
    if ((path === '/careers' || path === '/roadmap') && !moduleAssessmentUnlocked) {
      navigate(userModule === 'class12' ? '/class12-assessment' : userModule === 'college' ? '/college-assessment' : '/assessments');
      return;
    }
    navigate(path);
  };

  const moduleInfo = getModuleInfo(userModule);
  const class12TopCareer = class12Results?.career_recommendations?.[0];
  const class12SecondaryCareer = class12Results?.career_recommendations?.[1];
  const class12Exam = class12Results?.exam_strategy?.primary_exam || 'JEE / NEET / CUET';
  const class12RoadmapCareer = class12Journey.selectedCareer || class12Results?.selected_career || class12TopCareer?.career || 'your top career';
  const class12Progress = {
    assessmentDone: !!(class12Results || class12Journey.selectedCareer),
    careerSelected: !!(class12Journey.selectedCareer || class12Results?.selected_career),
    roadmapStarted: class12Journey.roadmapStarted || !!class12Results?.progress?.roadmapStarted,
    appliedForExams: class12Journey.examPreparing || !!class12Results?.progress?.appliedForExams,
    collegeShortlisted: !!class12Journey.collegeShortlisted,
  };

  const collegeTopRole = collegeResults?.job_recommendations?.[0]?.title || '';
  const collegeSelectedRole = collegeJourney.selectedCareer || collegeTopRole;
  const collegeExamMeta = careerExamMap[collegeSelectedRole] || {
    exams: ['Campus Placement Test', 'Role-specific Online Assessments'],
    difficulty: 'Medium',
    subjects: ['Aptitude', 'Communication', 'Core Concepts'],
    dailyPlan: ['2 hrs core subject revision', '1 hr aptitude', '30 min communication practice'],
    weeklyPlan: ['1 mock interview', '2 coding/aptitude tests', 'Resume review']
  };
  const collegeTopColleges = careerCollegeMap[collegeSelectedRole] || careerCollegeMap['Software Engineer'];
  const collegeProgress = {
    assessmentDone: !!collegeResults,
    careerSelected: !!collegeSelectedRole,
    roadmapStarted: !!collegeJourney.roadmapStarted,
    examPreparing: !!collegeJourney.examPreparing,
    collegeShortlisted: !!collegeJourney.collegeShortlisted,
  };

  const handleSaveCollegeJourney = (updates: Partial<{ selectedCareer: string; roadmapStarted: boolean; examPreparing: boolean; collegeShortlisted: boolean }>) => {
    const nextJourney = {
      selectedCareer: collegeJourney.selectedCareer,
      roadmapStarted: collegeJourney.roadmapStarted,
      examPreparing: collegeJourney.examPreparing,
      collegeShortlisted: collegeJourney.collegeShortlisted,
      ...updates,
    };

    setCollegeJourney(nextJourney);
    localStorage.setItem('college_journey', JSON.stringify(nextJourney));
    if (nextJourney.selectedCareer) {
      localStorage.setItem('college_selected_career', nextJourney.selectedCareer);
    }
    window.dispatchEvent(new Event('college-journey-updated'));
  };

  // CLASS 10 SPECIFIC FEATURES
  const class10Features = [
    {
      icon: Target,
      emoji: '🎯',
      title: 'Stream Recommendation',
      description: class10Results?.stream ? `Your recommended stream: ${class10Results.stream} (${class10Results.confidence || '85'}% confidence)` : 'Complete assessment to see your stream recommendation',
      path: class10Results ? '/class10-results' : '/class10-assessment',
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'from-blue-500/20 to-cyan-500/10',
      tag: class10Results ? 'Ready' : 'Start here',
      tagColor: class10Results ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: Compass,
      emoji: '🧭',
      title: 'Stream Details',
      description: 'Subjects, difficulty level, and who should choose this stream',
      path: '/class10-stream-details',
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'from-purple-500/20 to-pink-500/10',
      tag: 'Info',
      tagColor: 'bg-purple-500/20 text-purple-400'
    },
    {
      icon: Map,
      emoji: '🗺️',
      title: 'Your Roadmap',
      description: class10Results ? 'Class 11 → Class 12 → Exams & Skills' : 'Get a personalized 3-phase roadmap for your stream',
      path: class10Results ? '/class10-roadmap' : '/class10-assessment',
      gradient: 'from-green-500 to-emerald-500',
      bgGlow: 'from-green-500/20 to-emerald-500/10',
      tag: class10Results ? 'Personalized' : 'Unlock',
      tagColor: class10Results ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-300'
    },
    {
      icon: Briefcase,
      emoji: '💼',
      title: 'Future Career Options',
      description: 'Discover careers suited for your stream',
      path: '#',
      gradient: 'from-orange-500 to-red-500',
      bgGlow: 'from-orange-500/20 to-red-500/10',
      tag: 'Coming Soon',
      tagColor: 'bg-yellow-500/20 text-yellow-300',
      disabled: true
    },
    {
      icon: Eye,
      emoji: '🔮',
      title: 'Explore Future Path',
      description: 'Preview what awaits you in Class 12 and College',
      path: '/class12-preview',
      gradient: 'from-indigo-500 to-purple-500',
      bgGlow: 'from-indigo-500/20 to-purple-500/10',
      tag: 'Preview',
      tagColor: 'bg-indigo-500/20 text-indigo-400'
    }
  ];

  // CLASS 12 SPECIFIC FEATURES
  const handleSaveClass12Journey = (updates: Partial<{ selectedCareer: string; roadmapStarted: boolean; examPreparing: boolean; collegeShortlisted: boolean }>) => {
    const nextJourney = {
      selectedCareer: class12Journey.selectedCareer,
      roadmapStarted: class12Journey.roadmapStarted,
      examPreparing: class12Journey.examPreparing,
      collegeShortlisted: class12Journey.collegeShortlisted,
      ...updates,
    };

    setClass12Journey(nextJourney);
    localStorage.setItem('class12_journey', JSON.stringify(nextJourney));
    if (nextJourney.selectedCareer) {
      localStorage.setItem('class12_selected_career', nextJourney.selectedCareer);
    }
    window.dispatchEvent(new Event('class12-journey-updated'));
  };

  const class12SelectedCareer = class12Journey.selectedCareer || class12Results?.selected_career || class12TopCareer?.career || '';
  const class12CareerProfile = getClass12CareerProfile(class12SelectedCareer || class12TopCareer?.career);
  const class12RecommendationLabel = class12TopCareer
    ? `${class12TopCareer.career} ${class12TopCareer.match_percent}%`
    : 'View top 3 careers with match %';
  const class12SectionPath = (section: string) => `/class12-assessment?section=${section}`;

  const class12CareerAssessmentCard = {
    icon: Target,
    emoji: '🧠',
    title: 'Career Assessment',
    description: class12Progress.assessmentDone
      ? `✅ Completed. Open your saved ${class12SelectedCareer || 'career'} results and continue the path.`
      : 'Take test to discover best career options and unlock your personalized journey',
    path: class12Progress.assessmentDone ? class12SectionPath('results') : '/class12-assessment',
    gradient: 'from-fuchsia-500 to-rose-500',
    bgGlow: 'from-fuchsia-500/30 to-rose-500/20',
    tag: class12Progress.assessmentDone ? 'Results ready' : 'Start here',
    tagColor: class12Progress.assessmentDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-fuchsia-500/20 text-fuchsia-300',
    featured: !class12Progress.assessmentDone,
    disabled: false,
    actions: class12Progress.assessmentDone
      ? [{ label: 'Open Results', variant: 'outline' as const, onClick: () => navigate(class12SectionPath('results')) }]
      : [{ label: 'Start Assessment', variant: 'default' as const, onClick: () => navigate('/class12-assessment') }],
  };

  const class12RecommendationCard = {
    icon: Briefcase,
    emoji: '🎯',
    title: 'Career Recommendation',
    description: class12TopCareer
      ? `Top picks: ${class12RecommendationLabel}${class12SecondaryCareer ? `, ${class12SecondaryCareer.career} ${class12SecondaryCareer.match_percent}%` : ''}`
      : 'View top 3 careers with match % and personalized reasoning',
    path: class12SectionPath('recommendation'),
    gradient: 'from-violet-500 to-purple-500',
    bgGlow: 'from-violet-500/20 to-purple-500/10',
    tag: class12SelectedCareer ? `Selected: ${class12SelectedCareer}` : (user?.specialization ? `Based on ${user.specialization}` : 'Based on your profile'),
    tagColor: 'bg-violet-500/20 text-violet-300',
    featured: class12Progress.assessmentDone && !class12SelectedCareer,
    actions: [
      { label: 'View Details', variant: 'outline' as const, onClick: () => navigate(class12SectionPath('recommendation')) },
      { label: 'Select Career', variant: 'default' as const, onClick: () => handleSaveClass12Journey({ selectedCareer: class12TopCareer?.career || 'Software Engineer' }) },
    ],
  };

  const class12RoadmapCard = {
    icon: Map,
    emoji: '🗺️',
    title: 'Career Roadmap',
    description: class12SelectedCareer
      ? `${class12CareerProfile.roadmap[0]}${class12CareerProfile.roadmap[1] ? ` • ${class12CareerProfile.roadmap[1]}` : ''}`
      : `Step-by-step path, skills, and timeline for ${class12RoadmapCareer}`,
    path: class12SectionPath('roadmap'),
    gradient: 'from-teal-500 to-emerald-500',
    bgGlow: 'from-teal-500/20 to-emerald-500/10',
    tag: class12Progress.roadmapStarted ? 'Started' : 'Outcome-driven',
    tagColor: class12Progress.roadmapStarted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300',
    featured: !!class12SelectedCareer,
    actions: [
      { label: 'Start Roadmap', variant: 'default' as const, onClick: () => { handleSaveClass12Journey({ roadmapStarted: true }); navigate(class12SectionPath('roadmap')); } },
    ],
  };

  const class12ExamCard = {
    icon: TrendingUp,
    emoji: '📘',
    title: 'Exam Strategy',
    description: `${class12CareerProfile.examFocus}. ${class12CareerProfile.strategy}`,
    path: class12SectionPath('exam'),
    gradient: 'from-blue-500 to-cyan-500',
    bgGlow: 'from-blue-500/20 to-cyan-500/10',
    tag: class12Progress.appliedForExams ? 'Preparing' : class12Exam,
    tagColor: class12Progress.appliedForExams ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/20 text-blue-300',
    actions: [
      { label: 'Mark as Preparing', variant: 'default' as const, onClick: () => { handleSaveClass12Journey({ examPreparing: true }); navigate(class12SectionPath('exam')); } },
    ],
  };

  const class12CollegeCard = {
    icon: GraduationCap,
    emoji: '🏫',
    title: 'College Search',
    description: class12SelectedCareer
      ? `Recommended for YOU: ${class12CareerProfile.colleges.slice(0, 3).map((college) => `${college.name} (${college.city})`).join(', ')}`
      : 'Filter colleges by budget, location, and exam rank to shortlist best-fit options',
    path: class12SectionPath('colleges'),
    gradient: 'from-orange-500 to-amber-500',
    bgGlow: 'from-orange-500/20 to-amber-500/10',
    tag: 'Recommended for YOU',
    tagColor: 'bg-orange-500/20 text-orange-300',
      actions: [
        { label: 'Shortlist Colleges', variant: 'default' as const, onClick: () => { handleSaveClass12Journey({ collegeShortlisted: true }); navigate(class12SectionPath('colleges')); } },
      ],
  };

  const class12ProgressCard = {
    icon: BarChart3,
    emoji: '📊',
    title: 'My Progress',
    description: `✔ Assessment ${class12Progress.assessmentDone ? 'completed' : 'pending'} • ✔ Career ${class12Progress.careerSelected ? 'selected' : 'not selected'} • ${class12Progress.roadmapStarted ? '✔' : '⬜'} Roadmap started • ${class12Progress.appliedForExams ? '✔' : '⬜'} Exam prep • ${class12Progress.collegeShortlisted ? '✔' : '⬜'} College shortlisted`,
    path: class12SectionPath('progress'),
    gradient: 'from-indigo-500 to-sky-500',
    bgGlow: 'from-indigo-500/20 to-sky-500/10',
    tag: 'Progress',
    tagColor: 'bg-indigo-500/20 text-indigo-300',
    actions: [
      { label: 'Refresh Progress', variant: 'outline' as const, onClick: () => navigate(class12SectionPath('progress')) },
    ],
  };

  const class12MentorCard = {
    icon: Sparkles,
    emoji: '🤖',
    title: 'AI Mentor',
    description: class12SelectedCareer
      ? `Based on your profile (${user?.specialization || 'Class 12'} + ${class12SelectedCareer}): ask what to learn next, where to apply, or how to prepare.`
      : 'Ask: What after 12th PCM? Best career in AI? Get guided next actions.',
    path: '/mentor',
    gradient: 'from-cyan-500 to-blue-500',
    bgGlow: 'from-cyan-500/20 to-blue-500/10',
    tag: 'Ask anything',
    tagColor: 'bg-cyan-500/20 text-cyan-300',
    actions: [
      { label: 'Open Mentor', variant: 'default' as const, onClick: () => navigate('/mentor') },
    ],
  };

  const class12Features = class12Progress.assessmentDone
    ? class12SelectedCareer
      ? [class12RecommendationCard, class12RoadmapCard, class12ExamCard, class12CollegeCard, class12ProgressCard, class12MentorCard]
      : [class12RecommendationCard, class12RoadmapCard, class12ExamCard, class12CollegeCard, class12ProgressCard, class12MentorCard]
    : [class12CareerAssessmentCard];

  // COLLEGE SPECIFIC FEATURES
  const collegeFeatures = [
    {
      icon: Zap,
      emoji: '⚡',
      title: 'College Placement Assessment',
      description: collegeProgress.assessmentDone
        ? `Completed ✅ Open your holistic career profile and roadmap.`
        : 'Take your technical assessment to unlock your placement strategy.',
      path: '/college-assessment',
      gradient: 'from-orange-500 to-red-500',
      bgGlow: 'from-orange-500/20 to-red-500/10',
      tag: collegeProgress.assessmentDone ? 'Completed' : 'Start here',
      tagColor: collegeProgress.assessmentDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-400',
      featured: !collegeProgress.assessmentDone,
      disabled: false,
      actions: collegeProgress.assessmentDone
        ? [{ label: 'View Profile & Roadmap', variant: 'default' as const, onClick: () => navigate('/college-assessment') }]
        : [{ label: 'Start Assessment', variant: 'default' as const, onClick: () => navigate('/college-assessment') }]
    },
    {
      icon: Briefcase,
      emoji: '🎯',
      title: 'Career Recommendations',
      description: collegeSelectedRole
        ? `Your targeted role: ${collegeSelectedRole}. Explore other careers in your domain like ML or Data Analytics.`
        : 'Complete your assessment to unlock top career recommendations.',
      path: '/college-assessment',
      gradient: 'from-violet-500 to-purple-500',
      bgGlow: 'from-violet-500/20 to-purple-500/10',
      tag: collegeSelectedRole ? `Target: ${collegeSelectedRole}` : 'Explore Careers',
      tagColor: 'bg-violet-500/20 text-violet-300',
      featured: false,
      actions: [
        { label: 'Explore Careers', variant: 'default' as const, onClick: () => navigate('/college-assessment') },
      ]
    },
    {
      icon: Map,
      emoji: '🗺️',
      title: 'Career Roadmap',
      description: collegeSelectedRole
        ? `Step-by-step preparation plan and skill requirements for ${collegeSelectedRole}.`
        : 'Select a role to see your personalized placement roadmap.',
      path: '/college-assessment',
      gradient: 'from-teal-500 to-emerald-500',
      bgGlow: 'from-teal-500/20 to-emerald-500/10',
      tag: collegeSelectedRole ? 'Dynamic' : 'Locked',
      tagColor: 'bg-emerald-500/20 text-emerald-300',
      actions: [
        { label: 'View Roadmap', variant: 'default' as const, onClick: () => navigate('/college-assessment') },
      ]
    },
    {
      icon: Sparkles,
      emoji: '🎙️',
      title: 'Live AI Mock Interview',
      description: collegeSelectedRole
        ? `Start a hardcore technical interview for ${collegeSelectedRole}. AI will grade your answers instantly.`
        : 'Unlock live interviews after completing your assessment.',
      path: '/mock-interview',
      gradient: 'from-blue-600 to-indigo-600',
      bgGlow: 'from-blue-600/20 to-indigo-600/10',
      tag: 'New Feature',
      tagColor: 'bg-blue-500/20 text-blue-300',
      featured: true,
      actions: [
        { label: 'Start Mock Interview', variant: 'default' as const, onClick: () => navigate('/mock-interview') },
      ]
    },
    {
      icon: Sparkles,
      emoji: '🤖',
      title: 'AI Mentor',
      description: `Based on your profile (${collegeSelectedRole || 'College Student'}): ask preparation strategy and interview questions.`,
      path: '/mentor',
      gradient: 'from-cyan-500 to-blue-500',
      bgGlow: 'from-cyan-500/20 to-blue-500/10',
      tag: 'Context aware',
      tagColor: 'bg-cyan-500/20 text-cyan-300',
      actions: [
        { label: 'Open Mentor', variant: 'default' as const, onClick: () => navigate('/mentor') },
      ]
    }
  ];

  // GENERIC FEATURES (for Class 12, College, or no module)
  const genericFeatures = [
    {
      icon: Target,
      emoji: '🧪',
      title: moduleInfo.assessmentTitle,
      description: moduleInfo.assessmentDesc,
      path: userModule === 'class10' ? '/class10-assessment' : '/assessments',
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'from-blue-500/20 to-cyan-500/10',
      tag: userModule === 'class10' && class10Results ? 'In Progress' : (userModule === 'class10' ? 'Start here' : `${results.length}/5 done`),
      tagColor: userModule === 'class10' ? 'bg-blue-500/20 text-blue-400' : (results.length > 0 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400')
    },
    {
      icon: Briefcase,
      emoji: '💼',
      title: moduleInfo.careerTitle,
      description: moduleInfo.careerDesc,
      path: '/careers',
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'from-purple-500/20 to-pink-500/10',
      tag: assessmentDone ? 'Unlocked' : 'Complete tests',
      tagColor: assessmentDone ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-300'
    },
    {
      icon: Map,
      emoji: '🗺️',
      title: moduleInfo.roadmapTitle,
      description: moduleInfo.roadmapDesc,
      path: '/roadmap',
      gradient: 'from-green-500 to-emerald-500',
      bgGlow: 'from-green-500/20 to-emerald-500/10',
      tag: assessmentDone ? 'Personalized' : 'Complete tests',
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

  // Choose which features to display based on module
  const features = userModule === 'class10' ? class10Features : userModule === 'class12' ? class12Features : userModule === 'college' ? collegeFeatures : genericFeatures;

  const safeAssessmentsCompleted = results?.length || 0;

  const quickStats = userModule === 'class10' ? [
    { label: 'Assessments Done', value: class10Results ? '1/1' : '0/1', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Career Matches', value: class10Results?.top_3_careers ? '3+' : (class10Results ? '3' : '—'), icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Confidence Score', value: class10Results?.stream_confidence ? `${Math.round(class10Results.stream_confidence * 100)}%` : (class10Results ? '85%' : '—'), icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'AI Sessions', value: '∞', icon: Sparkles, color: 'text-orange-400', bg: 'bg-orange-500/10' }
  ] : [
    { label: 'Assessments Done', value: `${safeAssessmentsCompleted}/${totalAssessments}`, icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Career Matches', value: safeAssessmentsCompleted > 0 ? '12+' : '—', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Readiness Score', value: safeAssessmentsCompleted > 0 ? '85%' : '—', icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'AI Sessions', value: '∞', icon: Sparkles, color: 'text-orange-400', bg: 'bg-orange-500/10' }
  ];

  const class12Tracker = [
    { label: 'Assessment Completed', done: !!class12Progress.assessmentDone },
    { label: 'Career Selected', done: !!class12Progress.careerSelected },
    { label: 'Roadmap Started', done: !!class12Progress.roadmapStarted },
    { label: 'Applied for Exams', done: !!class12Progress.appliedForExams }
    ,{ label: 'College Shortlisted', done: !!class12Progress.collegeShortlisted }
  ];

  const class12FlowSteps = [
    { label: '→ Complete Career Assessment', path: '/class12-assessment', active: !class12Progress.assessmentDone },
    { label: '→ Review Top Career Recommendation', path: '/class12-assessment', active: class12Progress.assessmentDone && !class12Progress.careerSelected },
    { label: '→ Follow your Career Roadmap', path: '/class12-assessment', active: class12Progress.careerSelected && !class12Progress.roadmapStarted },
    { label: '→ Execute Exam Strategy', path: '/class12-assessment', active: class12Progress.roadmapStarted && !class12Progress.appliedForExams },
    { label: '→ Shortlist colleges by budget/location/rank', path: '/class12-assessment', active: class12Progress.appliedForExams && !class12Progress.collegeShortlisted },
  ];

  const class12ProgressPercent = Math.round(([
    class12Progress.assessmentDone,
    class12Progress.careerSelected,
    class12Progress.roadmapStarted,
    class12Progress.appliedForExams,
    class12Progress.collegeShortlisted,
  ].filter(Boolean).length / 5) * 100);

  const collegeProgressPercent = Math.round(([
    collegeProgress.assessmentDone,
    collegeProgress.careerSelected,
    collegeProgress.roadmapStarted,
    collegeProgress.examPreparing,
    collegeProgress.collegeShortlisted,
  ].filter(Boolean).length / 5) * 100);

  const collegeTracker = [
    { label: 'Assessment Completed', done: !!collegeProgress.assessmentDone },
    { label: 'Career Selected', done: !!collegeProgress.careerSelected },
    { label: 'Roadmap Started', done: !!collegeProgress.roadmapStarted },
    { label: 'Exam Preparation', done: !!collegeProgress.examPreparing },
    { label: 'College Shortlisted', done: !!collegeProgress.collegeShortlisted },
  ];

  const collegeFlowSteps = [
    { label: '→ Complete Career Assessment', path: '/college-assessment', active: !collegeProgress.assessmentDone },
    { label: '→ Select your role recommendation', path: '/college-assessment', active: collegeProgress.assessmentDone && !collegeProgress.careerSelected },
    { label: '→ Start your roadmap', path: '/college-assessment', active: collegeProgress.careerSelected && !collegeProgress.roadmapStarted },
    { label: '→ Start exam/interview preparation', path: '/college-assessment', active: collegeProgress.roadmapStarted && !collegeProgress.examPreparing },
    { label: '→ Shortlist top colleges', path: '/college-assessment', active: collegeProgress.examPreparing && !collegeProgress.collegeShortlisted },
  ];

  const class10NavItems = class10Results
    ? [
      { label: 'Stream Recommendation', path: '/class10-results' },
      { label: 'Stream Details', path: '/class10-stream-details' },
      { label: 'Roadmap', path: '/class10-roadmap' },
      { label: 'Progress', path: '/dashboard' },
      { label: 'AI Mentor', path: '/mentor' },
    ]
    : [
      { label: 'Assessment', path: '/class10-assessment' },
      { label: 'Progress', path: '/dashboard' },
    ];

  const class12NavItems = class12Progress.assessmentDone
    ? [
      { label: 'Results', path: class12SectionPath('results') },
      { label: 'Recommendation', path: class12SectionPath('recommendation') },
      { label: 'Roadmap', path: class12SectionPath('roadmap') },
      { label: 'Exam Strategy', path: class12SectionPath('exam') },
      { label: 'College Search', path: class12SectionPath('colleges') },
      { label: 'Progress', path: '/dashboard' },
      { label: 'AI Mentor', path: '/mentor' },
    ]
    : [
      { label: 'Assessment', path: '/class12-assessment' },
      { label: 'Progress', path: '/dashboard' },
    ];

  const collegeNavItems = collegeProgress.assessmentDone
    ? [
      { label: 'Assessment', path: '/college-assessment' },
      { label: 'Recommendation', path: '/college-assessment' },
      { label: 'Roadmap', path: '/college-assessment' },
      { label: 'Exam Strategy', path: '/college-assessment' },
      { label: 'College Search', path: '/college-assessment' },
      { label: 'Progress', path: '/dashboard' },
      { label: 'AI Mentor', path: '/mentor' },
    ]
    : [
      { label: 'Assessment', path: '/college-assessment' },
      { label: 'Progress', path: '/dashboard' },
      { label: 'AI Mentor', path: '/mentor' },
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
            {(userModule === 'class10' ? class10NavItems : userModule === 'class12' ? class12NavItems : userModule === 'college' ? collegeNavItems : [
              { label: 'Assessments', path: '/assessments' },
              { label: 'Careers', path: '/careers' },
              { label: 'Roadmap', path: '/roadmap' },
              { label: 'Progress', path: '/progress' },
              { label: 'AI Mentor', path: '/mentor' }
            ]).map((item) => (
              <Link
                key={`${item.path}-${item.label}`}
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
              {(userModule === 'class12' || userModule === 'college') && (
                <div className="mt-6">
                  {(userModule === 'class12' ? !class12Progress.assessmentDone : !collegeProgress.assessmentDone) ? (
                    <>
                      <Button
                        onClick={() => navigate(userModule === 'class12' ? '/class12-assessment' : '/college-assessment')}
                        className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-500 shadow-xl shadow-fuchsia-500/30 hover:scale-[1.02] transition-transform"
                      >
                        Start Career Assessment
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <p className="text-sm text-gray-400 mt-2">Assessment → Recommendation → Roadmap → Exam → College</p>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate(userModule === 'class12' ? '/class12-assessment' : '/college-assessment')}
                        className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 shadow-xl shadow-violet-500/30 hover:scale-[1.02] transition-transform"
                      >
                        {userModule === 'class12' ? 'Open Career Results' : 'Open Career Recommendation'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <p className="text-sm text-gray-400 mt-2">
                        {userModule === 'class12'
                          ? 'Results → Roadmap → Exam Strategy → College Search'
                          : 'Career Recommendation → Roadmap → Preparation → College Search'}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {userModule === 'class12' ? (
              <Card className="p-4 bg-white/[0.04] border border-white/10 min-w-[280px]">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Progress Tracker</h3>
                <div className="space-y-2">
                  {class12Tracker.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{item.label}</span>
                      <span className={item.done ? 'text-emerald-400' : 'text-gray-500'}>{item.done ? 'Completed' : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : userModule === 'college' ? (
              <Card className="p-4 bg-white/[0.04] border border-white/10 min-w-[280px]">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Progress Tracker</h3>
                <div className="space-y-2">
                  {collegeTracker.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{item.label}</span>
                      <span className={item.done ? 'text-emerald-400' : 'text-gray-500'}>{item.done ? 'Completed' : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
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
            )}
          </div>
        </motion.div>

        {/* --- MAIN FEATURE CARDS --- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              {userModule === 'class12' ? 'Recommended flow for you' : 'Choose what to explore'}
            </h2>
            {userModule && (
              <span className="text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {moduleInfo.name}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map((feature, index) => {
            const featureColors = ["#3b82f6", "#a855f7", "#10b981", "#f97316", "#06b6d4", "#ec4899", "#8b5cf6", "#14b8a6"];
            return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!feature.disabled) {
                  gatedNavigate(feature.path);
                }
              }}
              className={`group h-full ${feature.disabled ? 'cursor-default' : 'cursor-pointer'} ${feature.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <ElectricBorder color={featureColors[index % featureColors.length]} variant="swirl" className="h-full">
                <Card className={`relative h-full p-6 bg-white/[0.04] border-0 backdrop-blur-xl overflow-hidden hover:bg-white/10 transition-all duration-300 ${feature.featured ? 'ring-1 ring-fuchsia-400/40 shadow-2xl shadow-fuchsia-500/20' : ''}`}>
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

                  <div className="mt-5 flex flex-wrap gap-2">
                    {feature.actions?.map((action: any) => (
                      <Button
                        key={action.label}
                        variant={action.variant}
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          action.onClick();
                        }}
                        className={action.variant === 'default' ? `bg-gradient-to-r ${feature.gradient}` : ''}
                      >
                        {action.label}
                      </Button>
                    ))}
                    {!feature.actions?.length && (
                      <div className={`flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                        Open
                        <ArrowRight className="w-4 h-4 text-current opacity-70 group-hover:translate-x-1 transition-transform" style={{ color: 'inherit' }} />
                      </div>
                    )}
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
                <p className="text-xs text-gray-500 mb-6">
                  {userModule === 'class12' && user?.specialization
                    ? `Based on your ${user.specialization} profile`
                    : userModule === 'college' && collegeSelectedRole
                      ? `Based on your ${collegeSelectedRole} path`
                    : 'Based on your profile'}
                </p>

                <div className="space-y-3 flex-1">
                  {(userModule === 'class12'
                    ? class12FlowSteps
                    : userModule === 'college'
                      ? collegeFlowSteps
                    : [
                      { label: assessmentsCompleted === 0 ? '→ Start with assessments' : '→ Complete remaining tests', path: '/assessments', active: true },
                      { label: '→ Explore career matches', path: '/careers', active: false },
                      { label: '→ Get your roadmap', path: '/roadmap', active: false },
                      { label: '→ Chat with AI Mentor', path: '/mentor', active: false }
                    ]).map((step, i) => (
                    <Link
                      key={`${step.path}-${step.label}`}
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
                    <span>
                      {userModule === 'class12'
                        ? `${class12ProgressPercent}%`
                        : userModule === 'college'
                          ? `${collegeProgressPercent}%`
                          : `${Math.round((assessmentsCompleted / totalAssessments) * 100)}%`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: userModule === 'class12'
                        ? `${class12ProgressPercent}%`
                        : userModule === 'college'
                          ? `${collegeProgressPercent}%`
                          : `${(assessmentsCompleted / totalAssessments) * 100}%` }}
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
