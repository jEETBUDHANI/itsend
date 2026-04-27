import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, TrendingUp, Code } from 'lucide-react';

export default function CollegeInternship() {
  const navigate = useNavigate();
  const selection = JSON.parse(localStorage.getItem('collegeSelection') || '{}');

  const handleStartAssessment = () => {
    navigate('/college/internship/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <button
          onClick={() => navigate('/college-skeleton')}
          className="mb-8 flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to College Setup
        </button>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-12">
            <Briefcase className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Internship Mode</h1>
            <p className="text-lg text-gray-600">Year 3: Internship Preparation & Practical Experience</p>
          </div>

          {/* Selection Summary */}
          <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded mb-12">
            <h2 className="font-bold text-amber-900 mb-3">Your Selection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-amber-600 font-medium">Degree</p>
                <p className="text-gray-900 font-bold">{selection.degreeName}</p>
              </div>
              <div>
                <p className="text-amber-600 font-medium">Branch</p>
                <p className="text-gray-900 font-bold">{selection.branch}</p>
              </div>
              <div>
                <p className="text-amber-600 font-medium">Year</p>
                <p className="text-gray-900 font-bold">{selection.yearDisplay}</p>
              </div>
              <div>
                <p className="text-amber-600 font-medium">Stage</p>
                <p className="text-gray-900 font-bold capitalize">{selection.stage}</p>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 border-2 border-amber-200 rounded-lg">
              <Code className="w-12 h-12 text-amber-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Skill Assessment</h3>
              <p className="text-sm text-gray-600">Evaluate your technical and soft skills</p>
            </div>

            <div className="p-6 border-2 border-orange-200 rounded-lg">
              <TrendingUp className="w-12 h-12 text-orange-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Internship Recommendations</h3>
              <p className="text-sm text-gray-600">Discover internships that match your profile</p>
            </div>

            <div className="p-6 border-2 border-yellow-200 rounded-lg">
              <Briefcase className="w-12 h-12 text-yellow-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Company Matching</h3>
              <p className="text-sm text-gray-600">Find companies looking for your skills</p>
            </div>

            <div className="p-6 border-2 border-amber-200 rounded-lg">
              <TrendingUp className="w-12 h-12 text-amber-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">6-Week Roadmap</h3>
              <p className="text-sm text-gray-600">Step-by-step plan to land your first internship</p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-700 mb-4 text-lg font-semibold">
              💼 Ready to prepare for internships?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Complete the internship readiness assessment to get personalized recommendations and a 6-week preparation plan.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartAssessment}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all text-lg"
          >
            Start Internship Assessment
          </button>

          {/* Info Message */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-700 mb-4 text-lg font-semibold">
              💼 Ready to prepare for internships?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Complete the internship readiness assessment to get personalized recommendations and a 6-week preparation plan.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartAssessment}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all text-lg"
          >
            Start Internship Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
