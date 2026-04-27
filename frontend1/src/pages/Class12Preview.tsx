import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Eye, Lock } from 'lucide-react';

const Class12Preview = () => {
  const navigate = useNavigate();

  const class12Features = [
    {
      title: 'Degree Path Planning',
      description: 'Choose between Engineering, Medical, Commerce, or Arts degrees',
      icon: '🎓',
      status: 'Coming in Class 12'
    },
    {
      title: 'Entrance Exam Guide',
      description: 'JEE, NEET, CUET preparation guidance and strategies',
      icon: '📚',
      status: 'Coming in Class 12'
    },
    {
      title: 'College Fit Analysis',
      description: 'Discover colleges that match your profile and aspirations',
      icon: '🏫',
      status: 'Coming in Class 12'
    },
    {
      title: 'Backup Planning',
      description: 'Create backup options and alternative career paths',
      icon: '🎯',
      status: 'Coming in Class 12'
    },
    {
      title: 'Risk Assessment',
      description: 'Evaluate risks and make informed career decisions',
      icon: '⚠️',
      status: 'Coming in Class 12'
    },
    {
      title: 'Career Specialization',
      description: 'Deep dive into specific career streams and roles',
      icon: '🔬',
      status: 'Coming in Class 12'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">What's Coming in Class 12</h1>
          <p className="text-gray-400">A preview of features designed for the Decision phase of your career journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {class12Features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/[0.04] border border-white/10 relative overflow-hidden group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold">
                  <Eye className="w-3 h-3" />
                  {feature.status}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Lock className="w-6 h-6 text-purple-400" />
            Unlock Class 12 Features
          </h2>
          <p className="text-gray-300 mb-6">
            Once you progress to Class 12, you'll get access to all these features plus personalized guidance for the Decision phase of your career journey.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">
              <strong>Class 10 Phase (Current):</strong> Discover your strengths and choose the right stream
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Class 12 Phase (Next):</strong> Plan your college path and entrance exams
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>College Phase (Future):</strong> Build your professional profile for placements
            </p>
          </div>
          <p className="text-sm text-gray-400">
            💡 Complete your Class 10 assessment and stay tuned for Class 12 features launching soon!
          </p>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/class10-roadmap')}
            variant="outline"
            className="w-full"
          >
            View Your Current Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Class12Preview;
