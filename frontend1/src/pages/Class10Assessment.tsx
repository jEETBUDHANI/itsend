import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Target,
  Briefcase,
  Map,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`;

type AssessmentStep = 'instructions' | 'layer1' | 'layer1-result' | 'layer2' | 'layer2-result';

interface Layer1Question {
  id: number;
  category: string;
  text: string;
  type: 'multi-select' | 'single' | 'scale';
  options?: string[];
  scale?: number[];
}

interface StreamPrediction {
  stream_prediction: string;
  stream_confidence: number;
  stream_scores: Record<string, number>;
  predicted_specialization?: string;
  career_matches: string[];
}

interface FinalResult {
  stream: string;
  specialization: string;
  recommended_careers: Array<{ name: string; cluster: string }>;
  why_this_stream: string;
  roadmap: any;
}

export default function Class10Assessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<AssessmentStep>('instructions');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Layer 1 State
  const [layer1Questions, setLayer1Questions] = useState<Layer1Question[]>([]);
  const [layer1Answers, setLayer1Answers] = useState<Record<string, any>>({});
  const [streamPrediction, setStreamPrediction] = useState<StreamPrediction | null>(null);

  // Layer 2 State
  const [layer2Questions, setLayer2Questions] = useState<Layer1Question[]>([]);
  const [layer2Answers, setLayer2Answers] = useState<Record<string, any>>({});
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  const token = localStorage.getItem('token');

  // Load base questions on mount
  useEffect(() => {
    if (step === 'layer1') {
      fetchBaseQuestions();
    }
  }, [step]);

  const fetchBaseQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/class10/questions/base`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLayer1Questions(response.data.questions);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleLayer1Answer = (questionId: string, answer: any) => {
    setLayer1Answers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitLayer1 = async () => {
    if (Object.keys(layer1Answers).length < layer1Questions.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE}/class10/submit/base`,
        { answers: layer1Answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreamPrediction(response.data);
      setStep('layer1-result');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const proceedToLayer2 = async () => {
    if (!streamPrediction) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE}/class10/questions/layer2`,
        { stream: streamPrediction.stream_prediction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLayer2Questions(response.data.questions);
      setStep('layer2');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load Layer 2 questions');
    } finally {
      setLoading(false);
    }
  };

  const handleLayer2Answer = (questionId: string, answer: any) => {
    setLayer2Answers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitLayer2 = async () => {
    if (Object.keys(layer2Answers).length < layer2Questions.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE}/class10/submit/layer2`,
        {
          stream: streamPrediction!.stream_prediction,
          predicted_specialization: streamPrediction!.predicted_specialization,
          layer1_results: streamPrediction,
          answers: layer2Answers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFinalResult(response.data);
      setStep('layer2-result');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'layer1-result') {
      setStep('layer1');
    } else if (step === 'layer2') {
      setStep('layer1-result');
    } else if (step === 'layer2-result') {
      setStep('layer2');
    }
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
          {step !== 'instructions' && (
            <div className="text-sm text-gray-400">
              {step === 'layer1' && 'Layer 1 of 2'}
              {step === 'layer1-result' && 'Layer 1 Result'}
              {step === 'layer2' && 'Layer 2 of 2'}
              {step === 'layer2-result' && 'Final Results'}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* Instructions Step */}
          {step === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border border-gray-700/50 bg-gray-900/50 text-white backdrop-blur-xl p-8">
                <div className="text-center mb-8">
                  <Target className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                  <h1 className="text-4xl font-bold mb-2">Class 10 Stream Selection</h1>
                  <p className="text-gray-400">Discover Your Perfect Academic Path</p>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Two-Layer Assessment
                    </h3>
                    <p className="text-sm text-gray-300">
                      This assessment helps you choose between Science, Commerce, and Arts streams based on your interests, strengths, and career goals.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <h3 className="font-semibold text-purple-300 mb-2">What You'll Get:</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Stream recommendation with confidence score
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Specialized career paths for your stream
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Personalized Class 11-12 roadmap
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Expert explanation for recommendations
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                    <h3 className="font-semibold mb-2">Timeline:</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>⏱️ Layer 1: 10-15 minutes (14 questions)</span>
                      <span>→</span>
                      <span>⏱️ Layer 2: 5-10 minutes (5 questions)</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('layer1')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  Start Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Layer 1 Questions */}
          {step === 'layer1' && (
            <motion.div
              key="layer1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="border border-gray-700/50 bg-gray-900/50 text-white backdrop-blur-xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Layer 1: Base Assessment</h2>
                    <span className="text-sm text-gray-400">
                      {Object.keys(layer1Answers).length} / {layer1Questions.length}
                    </span>
                  </div>
                  <Progress
                    value={(Object.keys(layer1Answers).length / layer1Questions.length) * 100}
                    className="h-2"
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-6 mb-8">
                  {layer1Questions.map((question) => (
                    <Layer1Question
                      key={question.id}
                      question={question}
                      answer={layer1Answers[String(question.id)]}
                      onChange={(value) => handleLayer1Answer(String(question.id), value)}
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('instructions')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={submitLayer1}
                    disabled={loading || Object.keys(layer1Answers).length < layer1Questions.length}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {loading ? 'Analyzing...' : 'Submit & Continue'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Layer 1 Results */}
          {step === 'layer1-result' && streamPrediction && (
            <motion.div
              key="layer1-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="border border-gray-700/50 bg-gray-900/50 text-white backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Your Stream Prediction</h2>

                {/* Main stream prediction card */}
                <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <div className="flex items-center gap-4 mb-4">
                    <Target className="w-12 h-12 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Predicted Stream</p>
                      <h3 className="text-3xl font-bold text-blue-300">
                        {streamPrediction.stream_prediction.toUpperCase()}
                      </h3>
                    </div>
                  </div>
                  {streamPrediction.predicted_specialization && (
                    <p className="text-gray-300">
                      Specialization: <span className="font-semibold">{streamPrediction.predicted_specialization}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-2">
                    Confidence: <span className="text-green-400 font-semibold">{Math.round(streamPrediction.stream_confidence * 100)}%</span>
                  </p>
                </div>

                {/* Score comparison */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-gray-300">Stream Scores</h3>
                  <div className="space-y-3">
                    {Object.entries(streamPrediction.stream_scores)
                      .sort(([, a], [, b]) => b - a)
                      .map(([stream, score]) => (
                        <div key={stream}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="capitalize font-medium">{stream}</span>
                            <span className="text-sm text-gray-400">{Math.round(score)}%</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Career matches */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-gray-300">Career Paths for {streamPrediction.stream_prediction.toUpperCase()}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {streamPrediction.career_matches.map((career) => (
                      <div key={career} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={goBack}
                    variant="outline"
                    className="flex-1"
                  >
                    Retake Assessment
                  </Button>
                  <Button
                    onClick={proceedToLayer2}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {loading ? 'Loading...' : 'Proceed to Layer 2'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Layer 2 Questions */}
          {step === 'layer2' && (
            <motion.div
              key="layer2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="border border-gray-700/50 bg-gray-900/50 text-white backdrop-blur-xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Layer 2: Stream-Specific Assessment</h2>
                    <span className="text-sm text-gray-400">
                      {Object.keys(layer2Answers).length} / {layer2Questions.length}
                    </span>
                  </div>
                  <Progress
                    value={(Object.keys(layer2Answers).length / layer2Questions.length) * 100}
                    className="h-2"
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-6 mb-8">
                  {layer2Questions.map((question) => (
                    <Layer1Question
                      key={question.id}
                      question={question}
                      answer={layer2Answers[String(question.id)]}
                      onChange={(value) => handleLayer2Answer(String(question.id), value)}
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={goBack}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={submitLayer2}
                    disabled={loading || Object.keys(layer2Answers).length < layer2Questions.length}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {loading ? 'Analyzing...' : 'Get My Results'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Final Results */}
          {step === 'layer2-result' && finalResult && (
            <motion.div
              key="layer2-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-6">
                {/* Main result card */}
                <Card className="border border-gray-700/50 bg-gray-900/50 text-white backdrop-blur-xl p-8">
                  <div className="text-center mb-8">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
                    <p className="text-gray-400">Here are your personalized recommendations</p>
                  </div>

                  {/* Stream summary */}
                  <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
                    <p className="text-sm text-gray-400 mb-2">Your Stream</p>
                    <h3 className="text-2xl font-bold text-blue-300 mb-3">
                      {finalResult.stream.toUpperCase()} {finalResult.specialization && `- ${finalResult.specialization}`}
                    </h3>
                    <p className="text-gray-300">{finalResult.why_this_stream}</p>
                  </div>

                  {/* Career recommendations */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-purple-400" />
                      Recommended Careers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {finalResult.recommended_careers.map((career, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition cursor-pointer"
                        >
                          <div className="text-sm text-purple-400 font-semibold mb-1">{idx + 1}. {career.cluster}</div>
                          <div className="font-semibold text-white">{career.name}</div>
                          <Button variant="outline" size="sm" className="mt-3 w-full border-gray-600 bg-gray-700/50" onClick={() => document.getElementById('class10-roadmap')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Roadmap Below
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap */}
                  <div id="class10-roadmap">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Map className="w-6 h-6 text-cyan-400" />
                      Stream Roadmap for {finalResult.stream.toUpperCase()} {finalResult.specialization && `(${finalResult.specialization})`}
                    </h3>
                    <div className="space-y-4">
                      {finalResult.roadmap.phases.map((phase: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg">{phase.phase}</h4>
                            <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">{phase.duration}</span>
                          </div>
                          <ul className="space-y-1 text-sm text-gray-300">
                            {phase.key_activities.slice(0, 2).map((activity: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={() => setStep('instructions')}
                    variant="outline"
                    className="flex-1"
                  >
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Question component
interface Layer1QuestionProps {
  question: Layer1Question;
  answer: any;
  onChange: (value: any) => void;
}

function Layer1Question({ question, answer, onChange }: Layer1QuestionProps) {
  return (
    <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
      <h3 className="font-semibold mb-4 text-white">{question.text}</h3>

      {question.type === 'multi-select' && (
        <div className="flex flex-wrap gap-2">
          {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => {
                const current = Array.isArray(answer) ? answer : [];
                const updated = current.includes(option)
                  ? current.filter((a: string) => a !== option)
                  : [...current, option];
                onChange(updated);
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                Array.isArray(answer) && answer.includes(option)
                  ? 'bg-blue-600/50 border-blue-500 text-white'
                  : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === 'single' && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-700/20 transition">
              <input
                type="radio"
                name={`q${question.id}`}
                value={option}
                checked={answer === option}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'scale' && (
        <div className="flex gap-2 justify-center">
          {question.scale?.map((value) => (
            <button
              key={value}
              onClick={() => onChange(value)}
              className={`w-12 h-12 rounded-lg border transition font-semibold ${
                answer === value
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
