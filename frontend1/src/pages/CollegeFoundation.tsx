import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Zap, Lightbulb, Target } from 'lucide-react';

export default function CollegeFoundation() {
  const navigate = useNavigate();
  const selection = JSON.parse(localStorage.getItem('collegeSelection') || '{}');

  const handleStartAssessment = () => {
    navigate('/college/foundation/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <button
          onClick={() => navigate('/college-skeleton')}
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to College Setup
        </button>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-12">
            <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Foundation Mode</h1>
            <p className="text-lg text-gray-600">Year 1-2: Build Strong Fundamentals & Explore Your Path</p>
          </div>

          {/* Selection Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-12">
            <h2 className="font-bold text-blue-900 mb-3">Your Selection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-600 font-medium">Degree</p>
                <p className="text-gray-900 font-bold">{selection.degreeName}</p>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Branch</p>
                <p className="text-gray-900 font-bold">{selection.branch}</p>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Year</p>
                <p className="text-gray-900 font-bold">{selection.yearDisplay}</p>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Stage</p>
                <p className="text-gray-900 font-bold capitalize">{selection.stage}</p>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 border-2 border-blue-200 rounded-lg">
              <BookOpen className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Learning Foundation Assessment</h3>
              <p className="text-sm text-gray-600">Evaluate your current knowledge and learning style</p>
            </div>

            <div className="p-6 border-2 border-purple-200 rounded-lg">
              <Lightbulb className="w-12 h-12 text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Domain Exploration</h3>
              <p className="text-sm text-gray-600">Discover which domains match your interests</p>
            </div>

            <div className="p-6 border-2 border-pink-200 rounded-lg">
              <Target className="w-12 h-12 text-pink-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Personalized Roadmap</h3>
              <p className="text-sm text-gray-600">Get a 6-month learning plan tailored to you</p>
            </div>

            <div className="p-6 border-2 border-blue-200 rounded-lg">
              <Zap className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Action Plan</h3>
              <p className="text-sm text-gray-600">Clear next steps and resources to get started</p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-700 mb-4 text-lg font-semibold">
              🎓 Ready to start your learning journey?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Complete the foundation assessment to understand your current level, identify your interests, and get a personalized learning roadmap for the next 6 months.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartAssessment}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all text-lg"
          >
            Start Foundation Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
