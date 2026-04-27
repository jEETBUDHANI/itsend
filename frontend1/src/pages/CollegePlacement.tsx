import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Award, Rocket } from 'lucide-react';

export default function CollegePlacement() {
  const navigate = useNavigate();
  const selection = JSON.parse(localStorage.getItem('collegeSelection') || '{}');

  const handleStartAssessment = () => {
    navigate('/college/placement/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <button
          onClick={() => navigate('/college-skeleton')}
          className="mb-8 flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to College Setup
        </button>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-12">
            <Target className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Placement Mode</h1>
            <p className="text-lg text-gray-600">Final Year: Your Path to the Perfect Job</p>
          </div>

          {/* Selection Summary */}
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded mb-12">
            <h2 className="font-bold text-red-900 mb-3">Your Selection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-red-600 font-medium">Degree</p>
                <p className="text-gray-900 font-bold">{selection.degreeName}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Branch</p>
                <p className="text-gray-900 font-bold">{selection.branch}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Year</p>
                <p className="text-gray-900 font-bold">{selection.yearDisplay}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Stage</p>
                <p className="text-gray-900 font-bold capitalize">{selection.stage}</p>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 border-2 border-red-200 rounded-lg">
              <Award className="w-12 h-12 text-red-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Placement Readiness Score</h3>
              <p className="text-sm text-gray-600">Get an accurate assessment of your readiness for placements</p>
            </div>

            <div className="p-6 border-2 border-pink-200 rounded-lg">
              <Rocket className="w-12 h-12 text-pink-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Job Role Recommendations</h3>
              <p className="text-sm text-gray-600">Discover roles and companies that match your profile</p>
            </div>

            <div className="p-6 border-2 border-rose-200 rounded-lg">
              <Target className="w-12 h-12 text-rose-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Skill Gap Analysis</h3>
              <p className="text-sm text-gray-600">Identify exactly what you need to improve</p>
            </div>

            <div className="p-6 border-2 border-red-200 rounded-lg">
              <Rocket className="w-12 h-12 text-red-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">8-Week Roadmap</h3>
              <p className="text-sm text-gray-600">Step-by-step action plan for landing your dream job</p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-700 mb-4 text-lg font-semibold">
              🎯 Ready to start your placement journey?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Complete the comprehensive placement assessment to get personalized recommendations, interview prep plan, and your success roadmap.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartAssessment}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all text-lg"
          >
            Start Placement Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
