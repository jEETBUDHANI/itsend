import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FoundationAssessmentData {
  foundation_knowledge: number;
  interests: string[];
  projects_done: string;
  learning_style: string;
  learning_time: string;
  primary_goal: string;
  self_discipline: number;
}

interface AssessmentResult {
  foundation_score: number;
  foundation_level: {
    score: number;
    level: string;
    status: string;
    focus_areas: string[];
  };
  recommended_domains: Array<{
    domain: string;
    description: string;
    courses: string[];
  }>;
  learning_plan: any;
  next_steps: string[];
}

const questions = [
  {
    id: 1,
    question: "What interests you most in your field of study?",
    type: "multi-select",
    key: "interests",
    options: ["Problem-solving", "Building things", "Data & analysis", "People & communication", "Creative work", "Business & entrepreneurship"]
  },
  {
    id: 2,
    question: "How would you rate your current foundational knowledge?",
    type: "scale",
    key: "foundation_knowledge",
    scale: [1, 2, 3, 4, 5],
    labels: ["Beginner", "Intermediate", "Moderate", "Good", "Strong"]
  },
  {
    id: 3,
    question: "What's your preferred learning approach?",
    type: "single",
    key: "learning_style",
    options: ["Hands-on projects", "Structured courses", "Research & reading", "Collaborative learning", "Mix of everything"]
  },
  {
    id: 4,
    question: "How much time can you dedicate to learning per week?",
    type: "single",
    key: "learning_time",
    options: ["5-10 hours", "10-15 hours", "15-20 hours", "20+ hours"]
  },
  {
    id: 5,
    question: "Have you done any projects or courses before?",
    type: "single",
    key: "projects_done",
    options: ["No", "1 course/project", "2-3 courses/projects", "4+ courses/projects"]
  },
  {
    id: 6,
    question: "What's your primary goal for Year 1-2?",
    type: "single",
    key: "primary_goal",
    options: ["Build strong fundamentals", "Explore different domains", "Complete certifications", "Build portfolio projects"]
  },
  {
    id: 7,
    question: "Rate your self-discipline & consistency",
    type: "scale",
    key: "self_discipline",
    scale: [1, 2, 3, 4, 5],
    labels: ["Low", "Below Average", "Average", "Good", "High"]
  }
];

export default function FoundationAssessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Partial<FoundationAssessmentData>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const question = questions[currentQuestion];

  const handleSingleSelect = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [question.key]: value
    }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleScale = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [question.key]: value
    }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleMultiSelect = (value: string) => {
    setResponses(prev => {
      const current = prev[question.key] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [question.key]: current.filter((v: string) => v !== value)
        };
      } else {
        return {
          ...prev,
          [question.key]: [...current, value]
        };
      }
    });
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/foundation/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responses)
      });

      if (!response.ok) throw new Error('Assessment failed');

      const data = await response.json();
      setResult(data.assessment);
      toast({ description: "Assessment completed successfully!" });
    } catch (error) {
      toast({ description: "Failed to submit assessment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/college-skeleton')}
            className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
              <p className="text-lg text-gray-600">Here's your personalized foundation learning roadmap</p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8 text-center">
              <p className="text-lg opacity-90 mb-2">Your Foundation Score</p>
              <p className="text-5xl font-bold mb-2">{result.foundation_score}</p>
              <p className="text-lg font-semibold">{result.foundation_level.status}</p>
            </div>

            {/* Focus Areas */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-blue-900 mb-4">Focus Areas for You</h3>
              <ul className="space-y-2">
                {result.foundation_level.focus_areas.map((area: string, idx: number) => (
                  <li key={idx} className="text-blue-800 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Domains */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Recommended Learning Domains</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recommended_domains.map((domain: any, idx: number) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">{domain.domain}</h4>
                    <p className="text-sm text-gray-600 mb-3">{domain.description}</p>
                    <p className="text-xs text-gray-500 font-semibold">Key Courses:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {domain.courses.slice(0, 3).map((course: string, i: number) => (
                        <li key={i}>• {course}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-purple-900 mb-4">Your Next Steps</h3>
              <ol className="space-y-3">
                {result.next_steps.map((step: string, idx: number) => (
                  <li key={idx} className="text-purple-800 flex items-start gap-3">
                    <span className="font-bold flex-shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-green-900 mb-4">Recommended Weekly Schedule</h3>
              <div className="space-y-2">
                {result.learning_plan.weekly_schedule?.map((schedule: string, idx: number) => (
                  <p key={idx} className="text-green-800">• {schedule}</p>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/college-skeleton')}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-lg transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/college/foundation/roadmap')}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all"
              >
                View Full Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/college-skeleton')}
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Cancel Assessment
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              <p className="text-sm font-semibold text-gray-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.question}</h2>

            {question.type === 'single' && (
              <div className="space-y-3">
                {question.options?.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => handleSingleSelect(option)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      responses[question.key] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{option}</p>
                  </button>
                ))}
              </div>
            )}

            {question.type === 'scale' && (
              <div className="flex justify-between gap-3">
                {question.scale?.map((val: number) => (
                  <div key={val} className="flex-1">
                    <button
                      onClick={() => handleScale(val)}
                      className={`w-full aspect-square rounded-lg border-2 font-bold text-lg transition-all ${
                        responses[question.key] === val
                          ? 'border-purple-600 bg-purple-100 text-purple-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {val}
                    </button>
                    <p className="text-xs text-center text-gray-600 mt-2">
                      {val === 1 && question.labels?.[0]}
                      {val === 5 && question.labels?.[4]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'multi-select' && (
              <div className="space-y-3">
                {question.options?.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => handleMultiSelect(option)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      (responses[question.key] || []).includes(option)
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        (responses[question.key] || []).includes(option)
                          ? 'border-pink-600 bg-pink-600'
                          : 'border-gray-300'
                      }`}>
                        {(responses[question.key] || []).includes(option) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <p className="font-semibold text-gray-900">{option}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-900 font-bold rounded-lg transition-all"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={submitAssessment}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
