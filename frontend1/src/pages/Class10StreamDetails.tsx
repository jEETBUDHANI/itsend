import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const Class10StreamDetails = () => {
  const navigate = useNavigate();

  const streamData: { [key: string]: any } = {
    SCIENCE: {
      subjects: ['Physics', 'Chemistry', 'Mathematics/Biology'],
      difficulty: 'High - requires strong analytical skills',
      forWho: 'Students interested in engineering, medicine, research, or science-based careers',
      specializations: ['PCM (Physics, Chemistry, Maths)', 'PCB (Physics, Chemistry, Biology)']
    },
    COMMERCE: {
      subjects: ['Accounting', 'Economics', 'Business Studies'],
      difficulty: 'Medium - requires logical thinking and numerical skills',
      forWho: 'Students interested in business, finance, accounting, or economics',
      specializations: ['No major specializations - course content is standardized']
    },
    ARTS: {
      subjects: ['History', 'Geography', 'Political Science', 'Economics'],
      difficulty: 'Medium - requires strong writing and analytical skills',
      forWho: 'Students interested in humanities, social sciences, law, or journalism',
      specializations: ['Optional subjects vary by school']
    }
  };

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

        <h1 className="text-3xl font-bold mb-8">Stream Details & Guides</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(streamData).map(([stream, data], index) => {
            const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500'];
            const color = colors[index % colors.length];
            
            return (
              <Card key={stream} className="group relative p-8 bg-gray-900/40 text-white border-white/10 hover:border-white/20 hover:bg-gray-800/60 transition-all duration-500 overflow-hidden shadow-xl">
                {/* Background Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${color} bg-opacity-20 text-white text-xs font-bold tracking-wider mb-6`}>
                    STREAM {index + 1}
                  </div>
                  <h2 className="text-3xl font-black mb-8 tracking-tight">{stream}</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-4 h-[1px] bg-gray-500"></div> Subjects
                      </h3>
                      <ul className="space-y-2">
                        {data.subjects.map((subject: string) => (
                          <li key={subject} className="text-gray-300 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> {subject}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-4 h-[1px] bg-gray-500"></div> Difficulty
                      </h3>
                      <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{data.difficulty}</p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-4 h-[1px] bg-gray-500"></div> Ideal Profile
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{data.forWho}</p>
                    </div>

                    {data.specializations && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-4 h-[1px] bg-gray-500"></div> Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {data.specializations.map((spec: string) => (
                            <span key={spec} className="text-xs font-medium bg-white/10 text-gray-200 px-3 py-1.5 rounded-full border border-white/10">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
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

export default Class10StreamDetails;
