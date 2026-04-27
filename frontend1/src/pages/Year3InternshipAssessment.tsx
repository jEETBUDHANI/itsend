import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Briefcase, AlertCircle } from 'lucide-react';
import { authApi } from '@/services/api';

interface Question {
  id: number;
  question: string;
  type: string;
  section: string;
  options?: string[];
  scale?: number[];
  labels?: string[];
}

interface AssessmentResult {
  readiness_score: number;
  readiness_level: any;
  internship_recommendations: any[];
  skill_gaps: any;
  internship_roadmap: any;
  application_strategy: any;
  interview_prep: any;
  next_steps: string[];
}

export default function Year3InternshipAssessment() {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<'loading' | 'questions' | 'results'>('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await authApi.get('/year3-internship/questions/base');
      setQuestions(response.data.questions);
      setCurrentStep('questions');
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load assessment');
      setCurrentStep('loading');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === 'multi-select') {
      const existing = answers[currentQuestion.id] || [];
      if (existing.includes(answer)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: existing.filter((a: any) => a !== answer)
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...existing, answer]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.id]: answer
      });
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id]) {
      setError('Please answer this question');
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const payload = {
        projects_count: answers[1],
        portfolio: answers[2],
        technical_depth: answers[3],
        technologies: answers[4] || [],
        internship_type: answers[5] || [],
        internship_duration: answers[6],
        problem_solving: answers[7],
        communication: answers[8],
        previous_internships: answers[9],
        internship_goal: answers[10],
        interested_domains: []
      };

      const response = await authApi.post('/year3-internship/submit/assessment', payload);
      setResults(response.data.assessment);
      setCurrentStep('results');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (currentStep === 'questions' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const isAnswered = !!answers[currentQuestion.id];

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/college/internship')}
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Internship Readiness Assessment</h1>
          <p className="text-gray-600 mb-8">Get ready for your first internship</p>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-amber-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-6">
              {currentQuestion.section}
            </span>

            <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.type === 'single' && (
                <>
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium ${
                        answers[currentQuestion.id] === option
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-amber-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </>
              )}

              {currentQuestion.type === 'multi-select' && (
                <>
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium flex items-center gap-3 ${
                        (answers[currentQuestion.id] || []).includes(option)
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-amber-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        (answers[currentQuestion.id] || []).includes(option)
                          ? 'border-amber-600 bg-amber-600'
                          : 'border-gray-300'
                      }`} />
                      {option}
                    </button>
                  ))}
                </>
              )}

              {currentQuestion.type === 'scale' && (
                <div className="py-6">
                  <div className="flex justify-between gap-2 mb-4">
                    {Array.from({ length: currentQuestion.scale?.[1] || 5 }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handleAnswerSelect(i + 1)}
                        className={`flex-1 p-4 rounded-lg border-2 font-bold transition-all ${
                          answers[currentQuestion.id] === i + 1
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-amber-400'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 px-2">
                    <span>{currentQuestion.labels?.[0]}</span>
                    <span>{currentQuestion.labels?.[1]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isAnswered || submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Analyzing...' : 'Complete Assessment'}
                {!submitting && <ChevronRight className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <Year3Results results={results} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <Briefcase className="w-16 h-16 text-amber-600 mx-auto animate-bounce mb-4" />
        <p className="text-lg text-gray-700">Loading your internship assessment...</p>
      </div>
    </div>
  );
}

function Year3Results({ results }: { results: AssessmentResult }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Internship Roadmap</h1>
        <p className="text-lg text-gray-600 mb-12">Get internship-ready in 6 weeks</p>

        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg shadow-lg p-8 text-white mb-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90 mb-2">Internship Readiness Score</p>
              <h2 className="text-5xl font-bold mb-4">{results.readiness_score}%</h2>
              <p className="text-lg font-semibold">{results.readiness_level?.status}</p>
            </div>
            <div className="text-6xl opacity-20">💼</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-amber-600" />
              Recommended Internships
            </h3>
            <div className="space-y-4">
              {results.internship_recommendations?.map((rec, idx) => (
                <div key={idx} className="border-l-4 border-amber-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-1">{rec.domain}</h4>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <p className="text-xs text-amber-700">Stipend: {rec.stipend_range}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Application Strategy</h3>
            {results.application_strategy && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Target Tier</p>
                  <p className="font-bold text-gray-900">{results.application_strategy.tier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Apply to</p>
                  <p className="font-bold text-gray-900">{results.application_strategy.apply_count} companies</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Strategy</p>
                  <p className="font-bold text-gray-900 text-sm">{results.application_strategy.strategy}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Next Steps</h3>
          <ol className="space-y-3">
            {results.next_steps?.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700">
                <span className="font-bold text-amber-600 min-w-fit">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
