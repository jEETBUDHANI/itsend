import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getClass12CareerProfile } from '@/lib/class12CareerData';
import { ArrowLeft, CheckCircle2, Briefcase, Target, TrendingUp, Sparkles, BookOpen, School, Compass, MapPin, Wallet, FileText, ChevronRight } from 'lucide-react';

// ─── Stream-specific question banks ───────────────────────────────────────────

const STREAM_QUESTIONS: Record<string, any[]> = {
  PCM: [
    { id: 1, text: 'Your confirmed stream', key: 'stream', type: 'display', value: 'PCM' },
    { id: 2, text: 'Which of these interests you most?', key: 'interest_area', type: 'single', options: ['Software / Coding', 'Data Science / AI', 'Mechanical / Civil Engineering', 'Electronics / Robotics', 'Pure Mathematics / Research'] },
    { id: 3, text: 'Rate your Mathematics confidence (1 = weak, 5 = strong)', key: 'self_math', type: 'scale' },
    { id: 4, text: 'Rate your Physics confidence', key: 'self_physics', type: 'scale' },
    { id: 5, text: 'I enjoy solving complex logic or coding problems', key: 'interest_logical', type: 'likert' },
    { id: 6, text: 'I enjoy working with computers and technology', key: 'interest_computers', type: 'likert' },
    { id: 7, text: 'Which entrance exam are you targeting?', key: 'exams', type: 'single', options: ['JEE Mains/Advanced', 'BITSAT', 'State-level CET (MHT-CET / KCET etc.)', 'CUET (for BSc / BCA)', 'Not decided yet'] },
    { id: 8, text: 'Your current JEE / CET preparation level', key: 'exam_prep_level', type: 'scale' },
    { id: 9, text: 'Expected college budget (4 years total)', key: 'budget', type: 'single', options: ['< 10 Lakhs', '10-20 Lakhs', '20-40 Lakhs', '> 40 Lakhs'] },
    { id: 10, text: 'Preferred college location', key: 'preferred_location', type: 'single', options: ['IIT / NIT city (any)', 'Near my home state', 'Tier 2 city is fine', 'Any location'] },
    { id: 11, text: 'Rate your analytical thinking ability', key: 'self_analytical', type: 'scale' },
    { id: 12, text: 'Goal after B.Tech / BSc', key: 'primary_goal', type: 'single', options: ['Campus placement (product company)', 'Start a tech startup', 'Higher studies (MTech / MS abroad)', 'Government job / GATE', 'Get into top engineering college'] },
  ],
  PCB: [
    { id: 1, text: 'Your confirmed stream', key: 'stream', type: 'display', value: 'PCB' },
    { id: 2, text: 'Which field interests you most?', key: 'interest_area', type: 'single', options: ['MBBS / Doctor', 'Pharmacy / Drug Research', 'Biotechnology / Genetics', 'Nursing / Paramedical', 'Veterinary Science'] },
    { id: 3, text: 'Rate your Biology confidence (1 = weak, 5 = strong)', key: 'interest_biology', type: 'scale' },
    { id: 4, text: 'Rate your Chemistry confidence', key: 'self_chemistry', type: 'scale' },
    { id: 5, text: 'I am committed to a long education path (5+ years) for medicine', key: 'long_path_ok', type: 'likert' },
    { id: 6, text: 'I enjoy studying life sciences and human body topics', key: 'science_interest', type: 'likert' },
    { id: 7, text: 'Which entrance exam are you targeting?', key: 'exams', type: 'single', options: ['NEET (MBBS / BDS)', 'CUET (BSc / Biotech)', 'State Pharmacy Entrance', 'NEET (Pharma / Allied Health)', 'Not decided yet'] },
    { id: 8, text: 'Your current NEET preparation level', key: 'exam_prep_level', type: 'scale' },
    { id: 9, text: 'Expected college budget (4-5 years total)', key: 'budget', type: 'single', options: ['< 10 Lakhs', '10-25 Lakhs', '25-50 Lakhs (Private medical)', '> 50 Lakhs'] },
    { id: 10, text: 'Preferred college location', key: 'preferred_location', type: 'single', options: ['AIIMS / JIPMER (government)', 'Any government medical college', 'Private medical college is fine', 'Any location'] },
    { id: 11, text: 'Rate your discipline and consistency in studies', key: 'self_discipline', type: 'scale' },
    { id: 12, text: 'Goal after completing your degree', key: 'primary_goal', type: 'single', options: ['Medical practice (Doctor)', 'Pharma / Research career', 'PG specialization (MD / MS)', 'Abroad opportunities', 'Pursue medical / dental'] },
  ],
  COMMERCE: [
    { id: 1, text: 'Your confirmed stream', key: 'stream', type: 'display', value: 'Commerce' },
    { id: 2, text: 'Which field interests you most?', key: 'interest_area', type: 'single', options: ['Chartered Accountancy (CA)', 'Investment Banking / Finance', 'Business Management (BBA → MBA)', 'Economics / Research', 'Company Secretary (CS)'] },
    { id: 3, text: 'Rate your Accountancy / Maths confidence', key: 'self_math', type: 'scale' },
    { id: 4, text: 'Rate your Business Studies confidence', key: 'self_business', type: 'scale' },
    { id: 5, text: 'I enjoy analyzing financial data and business cases', key: 'interest_business', type: 'likert' },
    { id: 6, text: 'I am willing to work hard for professional exams (CA / CS)', key: 'professional_exam_ok', type: 'likert' },
    { id: 7, text: 'Which entrance exam are you targeting?', key: 'exams', type: 'single', options: ['CA Foundation (after 12th)', 'CUET (BBA / BCom / Economics)', 'IPMAT (IIM Indore / Rohtak)', 'NPAT (NMIMS)', 'Not decided yet'] },
    { id: 8, text: 'Your current exam preparation level', key: 'exam_prep_level', type: 'scale' },
    { id: 9, text: 'Expected college budget (3 years)', key: 'budget', type: 'single', options: ['< 5 Lakhs', '5-15 Lakhs', '15-30 Lakhs', '> 30 Lakhs'] },
    { id: 10, text: 'Preferred college location', key: 'preferred_location', type: 'single', options: ['Delhi (SRCC / DU)', 'Mumbai / Pune', 'Bangalore / Hyderabad', 'Any good city'] },
    { id: 11, text: 'Rate your communication and presentation skill', key: 'self_communication', type: 'scale' },
    { id: 12, text: 'Career goal after graduation', key: 'primary_goal', type: 'single', options: ['Finance / CA / Investment banking', 'Start own business', 'MBA from top B-school', 'Government / Banking sector', 'Commerce/Business degree'] },
  ],
  ARTS: [
    { id: 1, text: 'Your confirmed stream', key: 'stream', type: 'display', value: 'Arts' },
    { id: 2, text: 'Which field interests you most?', key: 'interest_area', type: 'single', options: ['Law (CLAT / BA-LLB)', 'Journalism / Media', 'Civil Services (IAS/IPS)', 'Psychology / Counselling', 'Political Science / Research'] },
    { id: 3, text: 'Rate your English / writing skill', key: 'self_communication', type: 'scale' },
    { id: 4, text: 'Rate your general knowledge / current affairs interest', key: 'self_gk', type: 'scale' },
    { id: 5, text: 'I enjoy debates, writing, and expressing ideas', key: 'interest_creative', type: 'likert' },
    { id: 6, text: 'I am interested in social issues, law, or government topics', key: 'interest_social', type: 'likert' },
    { id: 7, text: 'Which entrance exam are you targeting?', key: 'exams', type: 'single', options: ['CLAT (NLU Law)', 'CUET (BA / Mass Comm / Psychology)', 'IIMC / Media entrance exams', 'State law entrance exams', 'Not decided yet'] },
    { id: 8, text: 'Your current exam preparation level', key: 'exam_prep_level', type: 'scale' },
    { id: 9, text: 'Expected college budget (3-5 years)', key: 'budget', type: 'single', options: ['< 5 Lakhs', '5-15 Lakhs', '15-30 Lakhs', '> 30 Lakhs'] },
    { id: 10, text: 'Preferred college location', key: 'preferred_location', type: 'single', options: ['Delhi (DU / JNU / NLU)', 'Mumbai / Pune', 'Bangalore / Hyderabad', 'Any good city'] },
    { id: 11, text: 'Rate your logical reasoning / analytical skill', key: 'self_analytical', type: 'scale' },
    { id: 12, text: 'Career goal after graduation', key: 'primary_goal', type: 'single', options: ['Civil Services (IAS/IPS)', 'Lawyer / Corporate law', 'Journalist / Media professional', 'Researcher / Academician', 'Arts/Humanities'] },
  ],
};

const BASE_STREAM_SELECTOR = [
  { id: 0, text: 'What is your Class 12 stream?', key: 'stream', type: 'single', options: ['PCM', 'PCB', 'Commerce', 'Arts'] },
];

const LIKERT = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

const normalizeStream = (value?: string | null): string => {
  const text = (value || '').toString().trim().toUpperCase();
  if (!text) return '';
  if (text.includes('COMMER')) return 'COMMERCE';
  if (text.includes('ART') || text.includes('HUMAN')) return 'ARTS';
  if (text.includes('PCB') || (text.includes('BIO') && !text.includes('TECH'))) return 'PCB';
  if (text.includes('PCM') || text.includes('MATH') || text.includes('ENG')) return 'PCM';
  return text;
};

// ─── Component ──────────────────────────────────────────────────────────────

const Class12Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasSavedClass12State = (() => {
    try {
      const cachedResults = localStorage.getItem('class12_results_snapshot');
      const savedJourney = JSON.parse(localStorage.getItem('class12_journey') || '{}');
      return !!(cachedResults || savedJourney?.selectedCareer || localStorage.getItem('class12_selected_career'));
    } catch { return false; }
  })();

  const [step, setStep] = useState<'stream-select' | 'assessment' | 'results'>(
    hasSavedClass12State ? 'results' : 'stream-select'
  );
  
  const [activeCareerIdx, setActiveCareerIdx] = useState(0);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [submitError, setSubmitError] = useState('');
  const [journeyState, setJourneyState] = useState<{ selectedCareer: string; roadmapStarted: boolean; examPreparing: boolean }>(() => {
    try { return JSON.parse(localStorage.getItem('class12_journey') || '{}'); }
    catch { return { selectedCareer: '', roadmapStarted: false, examPreparing: false }; }
  });

  const selectedCareer = journeyState.selectedCareer || results?.selected_career || localStorage.getItem('class12_selected_career') || results?.career_recommendations?.[0]?.career || '';
  const class12Section = new URLSearchParams(location.search).get('section') || 'results';

  // ── Sync Active Career Index ──
  useEffect(() => {
    if (results?.career_recommendations && selectedCareer) {
      const idx = results.career_recommendations.findIndex((c: any) => c.career === selectedCareer);
      if (idx >= 0 && idx !== activeCareerIdx) {
        setActiveCareerIdx(idx);
      }
    }
  }, [selectedCareer, results]);

  const activeCareerData = results?.career_recommendations?.[activeCareerIdx];
  const activeRoadmap = activeCareerData?.roadmap || results?.roadmap;
  const activeExamStrategy = activeCareerData?.exam_strategy || results?.exam_strategy;
  const activeCollegeSearch = activeCareerData?.college_search_filters || results?.college_search_filters;
  const frontendProfile = getClass12CareerProfile(activeCareerData?.career || selectedCareer);

  // ── Derive stream and questions ─────────────────────────────────────────
  const selectedStream = useMemo(() => normalizeStream(answers.stream), [answers.stream]);

  const STREAM_Q = useMemo(() => {
    if (!selectedStream || step === 'stream-select') return [];
    return (STREAM_QUESTIONS[selectedStream] || STREAM_QUESTIONS['PCM']).filter(q => q.type !== 'display');
  }, [selectedStream, step]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleStreamSelect = (stream: string) => {
    setAnswers({ stream });
    setCurrentQ(0);
    setStep('assessment');
  };

  const handleAnswer = (value: any) => {
    const q = STREAM_Q[currentQ];
    if (!q) return;
    setAnswers((prev: any) => ({ ...prev, [q.key]: q.key === 'exams' ? [value] : value }));
    if (currentQ < STREAM_Q.length - 1) setCurrentQ(currentQ + 1);
  };

  const handleMultiToggle = (value: string) => {
    const q = STREAM_Q[currentQ];
    const current = answers[q.key] || [];
    const updated = current.includes(value)
      ? current.filter((s: any) => s !== value)
      : [...current, value];
    setAnswers((prev: any) => ({ ...prev, [q.key]: updated }));
  };

  const submitAssessment = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      const payload = { ...answers };
      const response = await class12Api.submitAssessment(payload);
      if (!response?.result) throw new Error('No result returned from API');
      if (!response.result.stream) response.result.stream = answers.stream;
      setResults(response.result);
      const nextCareer = response.result.selected_career || response.result.career_recommendations?.[0]?.career || '';
      if (nextCareer) saveJourneyState({ selectedCareer: nextCareer });
      // Cache for re-hydration
      localStorage.setItem('class12_results_snapshot', JSON.stringify(response.result));
      setStep('results');
    } catch (error: any) {
      setSubmitError(error?.response?.data?.error || error?.message || 'Failed to generate results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startRetake = () => {
    setAnswers({});
    setResults(null);
    setCurrentQ(0);
    setSubmitError('');
    localStorage.removeItem('class12_results_snapshot');
    localStorage.removeItem('class12_selected_career');
    localStorage.setItem('class12_journey', JSON.stringify({ selectedCareer: '', roadmapStarted: false, examPreparing: false }));
    setJourneyState({ selectedCareer: '', roadmapStarted: false, examPreparing: false });
    setStep('stream-select');
  };

  const saveJourneyState = (updates: Partial<{ selectedCareer: string; roadmapStarted: boolean; examPreparing: boolean }>) => {
    const current = (() => { try { return JSON.parse(localStorage.getItem('class12_journey') || '{}'); } catch { return {}; } })();
    const next = { selectedCareer: current.selectedCareer || '', roadmapStarted: !!current.roadmapStarted, examPreparing: !!current.examPreparing, ...updates };
    setJourneyState(next);
    localStorage.setItem('class12_journey', JSON.stringify(next));
    if (next.selectedCareer) localStorage.setItem('class12_selected_career', next.selectedCareer);
    window.dispatchEvent(new Event('class12-journey-updated'));
  };



  // ── Hydrate on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const profileRes = await userApi.getProfile();
        const profile = profileRes?.user || profileRes;
        const profileStream = normalizeStream(profile?.specialization || profile?.current_stream);
        
        // If we found a stream and the user hasn't selected one yet, auto-select it and skip to the assessment
        if (profileStream && !answers.stream && mounted) {
          const formattedStream = profileStream === 'COMMERCE' ? 'Commerce' : profileStream === 'ARTS' ? 'Arts' : profileStream;
          setAnswers((prev: any) => ({ ...prev, stream: formattedStream }));
          if (!hasSavedClass12State) {
            setStep('assessment');
          }
        }
      } catch { /* ignore */ }
    };

    const loadResults = async () => {
      // Hydrate cached results
      try {
        const cached = localStorage.getItem('class12_results_snapshot');
        if (cached && mounted) {
          const parsed = JSON.parse(cached);
          setResults(parsed);
          const nextCareer = parsed.selected_career || parsed.career_recommendations?.[0]?.career || '';
          if (nextCareer) saveJourneyState({ selectedCareer: nextCareer });
          setStep('results');
          return;
        }
      } catch { /* ignore */ }

      // Fetch from API
      try {
        const response = await class12Api.getResults();
        if (!mounted) return;
        const latest = response?.result || response?.results?.[0]?.score_payload;
        if (latest) {
          setResults(latest);
          setStep('results');
          const nextCareer = latest.selected_career || latest.career_recommendations?.[0]?.career || '';
          if (nextCareer) saveJourneyState({ selectedCareer: nextCareer });
        }
      } catch { /* no existing result — start fresh */ }
    };

    loadProfile();
    if (hasSavedClass12State) loadResults();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (step === 'results' && results) {
      const sectionMap: Record<string, string> = {
        recommendation: 'class12-recommendation',
        roadmap: 'class12-roadmap',
        exam: 'class12-exam-strategy',
        colleges: 'class12-college-search',
      };
      const targetId = sectionMap[class12Section];
      if (targetId) {
        window.requestAnimationFrame(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [step, class12Section]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="dark min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 text-gray-400">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        {/* ── Stream Selection ── */}
        {step === 'stream-select' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">Class 12 Career Assessment</h1>
            </div>
            <Card className="p-8 bg-white/[0.04] border border-white/10 mb-6">
              <p className="text-gray-300 mb-2">Select your Class 12 stream to get <strong>stream-specific career recommendations</strong>.</p>
              <p className="text-gray-400 text-sm">PCM → Engineering/Tech &nbsp;|&nbsp; PCB → Medical/Biotech &nbsp;|&nbsp; Commerce → CA/Finance/BBA &nbsp;|&nbsp; Arts → Law/Media/Civil Services</p>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              {['PCM', 'PCB', 'Commerce', 'Arts'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStreamSelect(s)}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all text-left"
                >
                  <p className="text-xl font-bold mb-1">{s}</p>
                  <p className="text-xs text-gray-400">
                    {s === 'PCM' && 'Physics + Chemistry + Mathematics'}
                    {s === 'PCB' && 'Physics + Chemistry + Biology'}
                    {s === 'Commerce' && 'Accounts + Business + Economics'}
                    {s === 'Arts' && 'Humanities + Languages + Social Sciences'}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Assessment Questions ── */}
        {step === 'assessment' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            {/* Stream badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Stream: {selectedStream}
              </span>
              <button onClick={startRetake} className="text-xs text-gray-500 hover:text-gray-300 underline">Change stream</button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Question {currentQ + 1} of {STREAM_Q.length}</span>
                <span className="text-sm text-gray-400">{Math.round(((currentQ + 1) / STREAM_Q.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${((currentQ + 1) / STREAM_Q.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </div>

            <Card className="p-8 bg-white/[0.04] border border-white/10">
              <h3 className="text-xl font-bold mb-6">{STREAM_Q[currentQ]?.text}</h3>
              <div className="space-y-3">
                {/* Scale */}
                {STREAM_Q[currentQ]?.type === 'scale' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} onClick={() => handleAnswer(i)}
                        className={`flex-1 py-3 rounded-lg transition-all font-semibold ${answers[STREAM_Q[currentQ].key] === i ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}>
                        {i}
                      </button>
                    ))}
                  </div>
                )}
                {STREAM_Q[currentQ]?.type === 'scale' && (
                  <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>Weak</span><span>Strong</span>
                  </div>
                )}

                {/* Likert */}
                {STREAM_Q[currentQ]?.type === 'likert' && (
                  <div className="space-y-2">
                    {LIKERT.map((label, i) => (
                      <button key={label} onClick={() => handleAnswer(i + 1)}
                        className={`w-full p-3 text-left rounded-lg transition-all ${answers[STREAM_Q[currentQ].key] === i + 1 ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Single choice */}
                {STREAM_Q[currentQ]?.type === 'single' && STREAM_Q[currentQ].options?.map((opt: string) => (
                  <button key={opt} onClick={() => handleAnswer(opt)}
                    className={`w-full p-3 text-left rounded-lg transition-all ${answers[STREAM_Q[currentQ].key] === opt || (Array.isArray(answers[STREAM_Q[currentQ].key]) && answers[STREAM_Q[currentQ].key][0] === opt) ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}>
                    {opt}
                  </button>
                ))}

                {/* Multi-select */}
                {STREAM_Q[currentQ]?.type === 'multi' && STREAM_Q[currentQ].options?.map((opt: string) => (
                  <button key={opt} onClick={() => handleMultiToggle(opt)}
                    className={`w-full p-3 text-left rounded-lg transition-all ${(answers[STREAM_Q[currentQ].key] || []).includes(opt) ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}>
                    ☐ {opt}
                  </button>
                ))}
              </div>
            </Card>

            <div className="mt-6 flex gap-3">
              <Button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} variant="outline" className="flex-1">Previous</Button>
              {currentQ === STREAM_Q.length - 1 ? (
                <Button onClick={submitAssessment} disabled={loading} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  {loading ? 'Processing...' : 'Get My Results'}
                </Button>
              ) : (
                <Button onClick={() => setCurrentQ(Math.min(STREAM_Q.length - 1, currentQ + 1))} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  Next
                </Button>
              )}
            </div>
            {submitError && <p className="mt-3 text-sm text-red-400">{submitError}</p>}
          </motion.div>
        )}

        {/* ── Results ── */}
        {step === 'results' && results && (
          <motion.div id="class12-results-top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <div>
                  <h1 className="text-3xl font-bold">Your Career Journey</h1>
                  <p className="text-sm text-gray-400">Stream: <span className="text-purple-300 font-semibold">{results.stream || selectedStream}</span></p>
                </div>
              </div>
              <Button onClick={() => window.print()} variant="outline" className="border-white/20 hover:bg-white/10 hidden md:flex">
                <FileText className="w-4 h-4 mr-2" /> Save PDF Report
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 border-b border-white/10 pb-4">
              {[
                { id: 'results', label: 'Overview All' },
                { id: 'recommendation', label: 'Matches' },
                { id: 'roadmap', label: 'Roadmap' },
                { id: 'exam', label: 'Exam Strategy' },
                { id: 'colleges', label: 'Colleges' },
                { id: 'progress', label: 'Progress' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => navigate(`/class12-assessment?section=${tab.id}`)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${class12Section === tab.id ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recommendations */}
            {(class12Section === 'results' || class12Section === 'recommendation') && (
            <Card id="class12-recommendation" className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" /> Top Career Matches for {results.stream || selectedStream}
              </h3>
              <div className="space-y-4">
                {results.career_recommendations?.slice(0, 3).map((career: any, i: number) => (
                  <div key={i} className={`p-4 rounded-lg border transition-all ${activeCareerIdx === i ? 'bg-white/10 border-purple-400/50' : 'bg-white/5 border-transparent'}`}>
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-lg">{career.career}</p>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">{career.match_percent}% match</span>
                    </div>
                    <ul className="text-sm text-gray-300 mt-2 space-y-1">
                      {(career.reason || []).slice(0, 3).map((r: string, idx: number) => <li key={idx}>✔ {r}</li>)}
                    </ul>
                    <p className="text-xs text-gray-400 mt-1">Salary: {career.salary_range}</p>
                    {career.top_colleges?.length > 0 && (
                      <p className="text-xs text-gray-400">Top Colleges: {career.top_colleges.join(', ')}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant={activeCareerIdx === i ? 'secondary' : 'outline'} size="sm" onClick={() => {
                        setActiveCareerIdx(i);
                        document.getElementById('class12-roadmap')?.scrollIntoView({ behavior: 'smooth' });
                      }} className={activeCareerIdx === i ? 'bg-white/20' : 'border-white/20'}>
                        {activeCareerIdx === i ? 'Viewing Details 👇' : 'View Details & Roadmap'}
                      </Button>
                      <Button size="sm" onClick={() => saveJourneyState({ selectedCareer: career.career })}
                        className={selectedCareer === career.career ? 'bg-emerald-500 text-black' : 'bg-gradient-to-r from-purple-500 to-pink-500'}>
                        {selectedCareer === career.career ? '✓ Selected' : 'Select Career'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            )}

            {/* Exam Strategy */}
            {(class12Section === 'results' || class12Section === 'exam') && (
            <Card id="class12-exam-strategy" className="p-6 bg-white/[0.04] border border-white/10 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Exam Strategy for {activeCareerData?.career || selectedCareer}</h3>
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-4">
                <p className="text-gray-300 mb-2">Primary Exam: <span className="font-semibold text-yellow-300 text-lg">{frontendProfile.examFocus.split(',')[0] || activeExamStrategy?.primary_exam}</span></p>
                <p className="text-sm text-gray-300 mb-2">{frontendProfile.strategy}</p>
                {activeExamStrategy?.secondary_exams?.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2 border-t border-white/10 pt-2">Backup exams: {activeExamStrategy.secondary_exams.join(', ')}</p>
                )}
              </div>
              <div className="mt-3 text-sm text-gray-300 grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
                  <p className="font-semibold mb-3 text-blue-300 flex items-center gap-2"><Target className="w-4 h-4" /> Daily Plan</p>
                  <ul className="space-y-2">
                    {(frontendProfile.dailyPlan || activeExamStrategy?.study_plan?.daily || []).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" /> <span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                  <p className="font-semibold mb-3 text-cyan-300 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Weekly Plan</p>
                  <ul className="space-y-2">
                    {(frontendProfile.weeklyPlan || activeExamStrategy?.study_plan?.weekly || []).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" /> <span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button onClick={() => window.open('https://www.indiabix.com/', '_blank')} variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-blue-400">
                  Practice on IndiaBix
                </Button>
                <Button onClick={() => saveJourneyState({ examPreparing: true })} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  Mark as Preparing
                </Button>
              </div>
            </Card>
            )}

            {/* Roadmap */}
            {(class12Section === 'results' || class12Section === 'roadmap') && (
            <Card id="class12-roadmap" className="p-6 bg-white/[0.04] border border-white/10 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Career Roadmap: {activeCareerData?.career || selectedCareer}</h3>
              <p className="text-sm text-gray-300 mb-6">{activeRoadmap?.overview || `Structured path to become a ${activeCareerData?.career || selectedCareer}.`}</p>
              
              <div className="space-y-4 mb-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-emerald-500 before:to-transparent">
                {(frontendProfile.roadmap || activeRoadmap?.steps || []).map((item: string, i: number) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-black bg-teal-500 text-black font-bold text-xs shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-lg bg-white/5 border border-white/10 hover:border-teal-500/50 transition-colors">
                      <p className="text-sm text-gray-200">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-6 p-4 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <span className="text-sm font-semibold text-teal-300 w-full mb-1">Key Skills Required:</span>
                {(frontendProfile.skills || activeRoadmap?.skills_required || []).map((skill: string) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs bg-teal-500/20 text-teal-200 border border-teal-500/30">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-400">Expected Salary: <span className="font-semibold text-white">{frontendProfile.salary_range || activeRoadmap?.salary_range || 'Varies by industry'}</span></p>
                <Button onClick={() => saveJourneyState({ roadmapStarted: true })} className="bg-gradient-to-r from-teal-500 to-emerald-500">
                  Start Roadmap
                </Button>
              </div>
            </Card>
            )}

            {/* College Search */}
            {(class12Section === 'results' || class12Section === 'colleges') && (
            <Card id="class12-college-search" className="p-6 bg-white/[0.04] border border-white/10 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><School className="w-5 h-5" /> College Recommendations for {activeCareerData?.career || selectedCareer}</h3>
              <div className="grid sm:grid-cols-4 gap-3 text-sm mb-6">
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-orange-400 text-xs mb-1">Budget</p>
                  <p className="font-semibold text-white">{activeCollegeSearch?.budget || 'Any'}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-orange-400 text-xs mb-1">Location</p>
                  <p className="font-semibold text-white">{activeCollegeSearch?.location || 'Any'}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-orange-400 text-xs mb-1">Target Exam</p>
                  <p className="font-semibold text-white">{activeCollegeSearch?.exam || frontendProfile.examFocus?.split(',')[0] || 'Entrance'}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-orange-400 text-xs mb-1">Target Rank</p>
                  <p className="font-semibold text-white">{activeCollegeSearch?.exam_rank_target || 'Top 10%'}</p>
                </div>
              </div>
              
              <p className="font-semibold mb-3 text-sm text-gray-300 border-b border-white/10 pb-2">Top Handpicked Colleges</p>
              <div className="grid md:grid-cols-2 gap-4">
                {(frontendProfile.colleges || []).map((c: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(c.name + ' ' + c.city + ' official website')}`, '_blank')}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all group cursor-pointer"
                  >
                    <h4 className="font-bold text-lg text-white mb-2 flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                      <School className="w-4 h-4 text-orange-400" /> {c.name}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {c.city}, {c.state}</p>
                      <p className="flex items-center gap-2"><Wallet className="w-4 h-4 text-gray-400" /> Fees: {c.fees}</p>
                      <p className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Exam: {c.exam}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 text-xs text-orange-200 flex justify-between items-center">
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">💡 {c.note}</span>
                      <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Visit Official Site &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => saveJourneyState({ collegeShortlisted: true })} className="bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold">
                  Shortlist Colleges
                </Button>
              </div>
            </Card>
            )}

            {/* Progress */}
            {(class12Section === 'results' || class12Section === 'progress') && (
            <Card id="class12-progress" className="p-6 bg-white/[0.04] border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2"><Compass className="w-5 h-5 text-emerald-400" /> Career Journey Progress</h3>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  {Math.round(([true, !!selectedCareer, journeyState.roadmapStarted, journeyState.examPreparing, (journeyState as any).collegeShortlisted].filter(Boolean).length / 5) * 100)}%
                </span>
              </div>
              
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${([true, !!selectedCareer, journeyState.roadmapStarted, journeyState.examPreparing, (journeyState as any).collegeShortlisted].filter(Boolean).length / 5) * 100}%` }} 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                />
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Assessment Taken', active: true },
                  { label: selectedCareer ? `Selected: ${selectedCareer}` : 'Select Career', active: !!selectedCareer },
                  { label: 'Start Roadmap', active: journeyState.roadmapStarted },
                  { label: 'Start Exam Prep', active: journeyState.examPreparing },
                  { label: 'Shortlist Colleges', active: (journeyState as any).collegeShortlisted }
                ].map((step, i) => (
                  <div key={i} className={`flex flex-col items-center text-center p-3 rounded-lg border transition-all ${step.active ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-white/5 border-white/10 opacity-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step.active ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-500'}`}>
                      {step.active ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-semibold ${step.active ? 'text-emerald-300' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </Card>
            )}

            {/* AI Mentor */}
            {(class12Section === 'results' || class12Section === 'mentor') && (
            <Card id="class12-mentor" className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5" /> AI Mentor</h3>
              <p className="text-sm text-gray-300 mb-4">
                Based on your {results.stream || selectedStream} profile{selectedCareer ? ` and goal: ${selectedCareer}` : ''} — ask what to study, how to prepare, or which college to choose.
              </p>
              <Button onClick={() => navigate('/mentor')} className="bg-gradient-to-r from-blue-500 to-purple-600">Open AI Mentor</Button>
            </Card>
            )}

            <div className="flex gap-3">
              <Button onClick={startRetake} variant="outline" className="border-white/20">Retake / Change Stream</Button>
              <Button onClick={() => navigate('/dashboard')} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">Back to Dashboard</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Class12Assessment;
