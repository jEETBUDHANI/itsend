import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Target, Briefcase, BookOpen, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
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
  placement_readiness_score: number;
  readiness_level: string;
  job_recommendations: any[];
  skill_gaps: any;
  interview_prep_plan: any;
  placement_roadmap: any;
  progress_tracker: any;
  next_steps: string[];
}

export default function FinalYearAssessment() {
  const navigate = useNavigate();
  
  // UI State
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
      const response = await authApi.get('/final-year/questions/base');
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
      
      // Map answers to the expected format
      const payload = {
        internships: answers[1],
        communication_skill: answers[2],
        technical_level: answers[3],
        programming_languages: answers[4] || [],
        interested_domains: answers[5] || [],
        projects_count: answers[7],
        github_profile: answers[6],
        job_preference: answers[8] || [],
        salary_expectation: answers[9],
        interviews_done: answers[10],
        dsa_level: answers[11],
        system_design: answers[12]
      };

      const response = await authApi.post('/final-year/submit/assessment', payload);
      setResults(response.data.assessment);
      setCurrentStep('results');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  // Questions Section
  if (currentStep === 'questions' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const isAnswered = !!answers[currentQuestion.id];

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/college/placement')}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 mb-6"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Final Year Placement Assessment</h1>
            <p className="text-gray-600">Your path to landing the perfect job</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-red-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* Section Badge */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                {currentQuestion.section}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion.question}</h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.type === 'single' && (
                <>
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium ${
                        answers[currentQuestion.id] === option
                          ? 'border-red-600 bg-red-50 text-red-900'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-red-300'
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
                          ? 'border-red-600 bg-red-50 text-red-900'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-red-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        (answers[currentQuestion.id] || []).includes(option)
                          ? 'border-red-600 bg-red-600'
                          : 'border-gray-300'
                      }`}>
                        {(answers[currentQuestion.id] || []).includes(option) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
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
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-red-400'
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

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isAnswered || submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
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

  // Results Section
  if (currentStep === 'results' && results) {
    return (
      <FinalYearResults results={results} />
    );
  }

  // Loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <Target className="w-16 h-16 text-red-600 mx-auto animate-bounce mb-4" />
        <p className="text-lg text-gray-700">Loading your placement assessment...</p>
      </div>
    </div>
  );
}

// Results Component
function FinalYearResults({ results }: { results: AssessmentResult }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Placement Roadmap</h1>
          <p className="text-lg text-gray-600">Personalized path to landing your dream job</p>
        </div>

        {/* Placement Readiness Score */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg shadow-lg p-8 text-white mb-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90 mb-2">Placement Readiness Score</p>
              <h2 className="text-5xl font-bold mb-4">{results.placement_readiness_score}%</h2>
              <p className="text-lg font-semibold">{results.readiness_level}</p>
            </div>
            <div className="text-6xl opacity-20">🎯</div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Job Recommendations */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-red-600" />
              Recommended Domains
            </h3>
            <div className="space-y-4">
              {results.job_recommendations?.map((rec, idx) => (
                <div key={idx} className="border-l-4 border-red-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-1">{rec.domain}</h4>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.recommended_roles?.map((role: any) => (
                      <span key={role.title} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        {role.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-red-600" />
              Critical Skills to Develop
            </h3>
            {results.skill_gaps?.critical?.map((gap, idx) => (
              <div key={idx} className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-bold text-gray-900 mb-1">{gap.skill}</h4>
                <p className="text-sm text-gray-600 mb-2">{gap.importance}</p>
                <p className="text-xs text-gray-500">Level: {gap.current_level} → {gap.target_level}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Preparation Plan */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-600" />
            Interview Preparation Plan
          </h3>
          <div className="space-y-4">
            {results.interview_prep_plan?.preparation_modules?.map((module, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900">{module.module}</h4>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    module.priority === 'CRITICAL' 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {module.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Duration: {module.duration}</p>
                <p className="text-sm text-gray-600">Focus: {module.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-600 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-red-600" />
            Your Next Steps
          </h3>
          <ol className="space-y-3">
            {results.next_steps?.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700">
                <span className="font-bold text-red-600 min-w-fit">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 border-2 border-red-600 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-all"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
