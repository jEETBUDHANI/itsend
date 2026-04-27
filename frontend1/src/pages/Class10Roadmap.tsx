import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Briefcase, Trophy } from 'lucide-react';

const Class10Roadmap = () => {
  const navigate = useNavigate();

  const roadmapPhases = [
    {
      phase: 'Phase 1: Class 11 - Foundation',
      duration: '12 months',
      activities: [
        'Build strong fundamentals in core subjects',
        'Develop problem-solving skills',
        'Start competitive exam preparation (JEE/NEET)',
        'Take practice tests monthly',
        'Join study groups'
      ],
      icon: BookOpen
    },
    {
      phase: 'Phase 2: Class 12 - Intensive',
      duration: '12 months',
      activities: [
        'Master advanced concepts',
        'Intensive exam coaching',
        'Mock exams every 2 weeks',
        'Revision and practice',
        'College entrance planning'
      ],
      icon: Trophy
    },
    {
      phase: 'Phase 3: Beyond Class 12',
      duration: '3-6 months',
      activities: [
        'College applications',
        'Entrance exam results',
        'College selection based on cut-offs',
        'Career planning for chosen college',
        'Skill development'
      ],
      icon: Briefcase
    }
  ];

  return (
    <div className="dark min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-2">Your Stream Roadmap</h1>
        <p className="text-gray-400 mb-8">A personalized 3-phase journey from Class 11 to College</p>

        <div className="relative border-l-2 border-blue-500/20 ml-6 pl-10 space-y-12 pb-8">
          {roadmapPhases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <div key={index} className="relative">
                {/* Timeline Dot/Icon */}
                <div className="absolute -left-[60px] top-4 w-12 h-12 rounded-full bg-black border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                
                <Card
                  className="group p-8 bg-gray-900/40 text-white border-white/10 hover:border-blue-500/30 hover:bg-gray-800/60 transition-all duration-300 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-colors">
                        {phase.phase}
                      </h3>
                      <p className="text-gray-400 mt-1 font-medium">Duration: {phase.duration}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Key Activities</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/[0.05] group-hover:border-white/10 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                          <span className="text-gray-300 text-sm leading-relaxed">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl backdrop-blur-sm">
          <p className="text-yellow-300 flex items-center gap-2">
            <span className="text-xl">💡</span>
            <strong>Pro Tip:</strong> This roadmap is flexible. Adjust activities based on your school's curriculum and your personal goals.
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Class10Roadmap;
