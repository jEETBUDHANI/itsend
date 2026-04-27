import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import { authApi } from '@/services/api';

interface Degree {
  code: string;
  name: string;
  branches: string[];
}

interface Year {
  code: string;
  display: string;
  stage: string;
  description: string;
  route: string;
  focus: string;
}

export default function CollegeSkeleton() {
  const navigate = useNavigate();
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Step state (1: Degree, 2: Branch, 3: Year, 4: Confirm)
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [degreesRes, yearsRes] = await Promise.all([
        authApi.get('/college/selection/degrees'),
        authApi.get('/college/selection/years')
      ]);

      setDegrees(degreesRes.data.degrees);
      setYears(yearsRes.data.years);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load selection options');
    } finally {
      setLoading(false);
    }
  };

  const handleDegreeSelect = (degree: Degree) => {
    setSelectedDegree(degree);
    setSelectedBranch('');
    setStep(2);
  };

  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
    setStep(3);
  };

  const handleYearSelect = (year: Year) => {
    setSelectedYear(year);
    setStep(4);
  };

  const handleConfirm = async () => {
    if (!selectedDegree || !selectedBranch || !selectedYear) {
      setError('Please select all options');
      return;
    }

    try {
      setSubmitting(true);
      const response = await authApi.post('/college/selection/validate-selection', {
        degree: selectedDegree.code,
        branch: selectedBranch,
        year: selectedYear.code
      });

      if (response.data.valid) {
        // Store selection in localStorage
        localStorage.setItem('collegeSelection', JSON.stringify({
          degree: selectedDegree.code,
          degreeName: selectedDegree.name,
          branch: selectedBranch,
          year: selectedYear.code,
          yearDisplay: selectedYear.display,
          stage: selectedYear.stage,
          route: selectedYear.route
        }));

        // Navigate to appropriate flow
        setTimeout(() => {
          navigate(selectedYear.route);
        }, 500);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('Failed to process selection');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-indigo-600 mx-auto animate-bounce mb-4" />
          <p className="text-lg text-gray-700">Loading your college journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your College Journey</h1>
          <p className="text-lg text-gray-600">Let's set up your personalized roadmap</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s <= step
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      s < step ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 px-2">
            <span>Degree</span>
            <span>Branch</span>
            <span>Year</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Degree Selection */}
        {step >= 1 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
              Select Your Degree
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {degrees.map((degree) => (
                <button
                  key={degree.code}
                  onClick={() => handleDegreeSelect(degree)}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    selectedDegree?.code === degree.code
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{degree.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {degree.branches.length} specializations available
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Branch Selection */}
        {step >= 2 && selectedDegree && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
              Select Your Branch
            </h2>
            <p className="text-gray-600 mb-6">From {selectedDegree.name}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedDegree.branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => handleBranchSelect(branch)}
                  className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    selectedBranch === branch
                      ? 'border-purple-600 bg-purple-50 text-purple-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Year Selection */}
        {step >= 3 && selectedBranch && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <GraduationCap className="w-6 h-6 mr-3 text-pink-600" />
              What's Your Current Year?
            </h2>
            <div className="space-y-4">
              {years.map((year) => (
                <button
                  key={year.code}
                  onClick={() => handleYearSelect(year)}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    selectedYear?.code === year.code
                      ? 'border-pink-600 bg-pink-50'
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg text-gray-900">{year.display}</p>
                      <p className="text-sm text-gray-600 mt-1">{year.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Focus: {year.focus}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step >= 4 && selectedYear && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-indigo-600" />
                Confirm Your Selection
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Degree:</span>
                  <span className="text-indigo-600 font-bold">{selectedDegree?.name}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Branch:</span>
                  <span className="text-purple-600 font-bold">{selectedBranch}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Year:</span>
                  <span className="text-pink-600 font-bold">{selectedYear.display}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Stage:</span>
                  <span className="text-blue-600 font-bold capitalize">{selectedYear.stage}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start Your Journey
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          )}
          {step < 4 && selectedYear === null && (
            <button
              onClick={() => {
                if (step === 1 && selectedDegree) setStep(2);
                if (step === 2 && selectedBranch) setStep(3);
                if (step === 3 && selectedYear) setStep(4);
              }}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
              disabled={
                (step === 1 && !selectedDegree) ||
                (step === 2 && !selectedBranch) ||
                (step === 3 && !selectedYear)
              }
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
