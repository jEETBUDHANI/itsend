import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Briefcase } from 'lucide-react';
import axios from 'axios';

const Class10Careers = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<any[]>([]);
  const [stream, setStream] = useState<string>('');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios.get('/api/class10/results', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.results && response.data.results.length > 0) {
          const latest = response.data.results[0];
          const payload = latest.score_payload;
          setStream(payload.stream);
          if (payload.recommended_careers) {
            setCareers(payload.recommended_careers);
          }
        }
      } catch (error) {
        console.error('Failed to fetch careers:', error);
      }
    };
    fetchCareers();
  }, []);

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

        <h1 className="text-3xl font-bold mb-2">Career Paths for {stream}</h1>
        <p className="text-gray-400 mb-8">Top career options based on your stream selection</p>

        {careers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {careers.map((career, index) => (
              <Card
                key={index}
                className="p-6 bg-white/[0.04] border border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{career.name}</h3>
                    <p className="text-sm text-gray-400">{career.cluster}</p>
                  </div>
                </div>

                {career.description && (
                  <p className="text-sm text-gray-300 mb-4">{career.description}</p>
                )}

                {career.skills && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2">KEY SKILLS</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(career.skills) ? (
                        career.skills.slice(0, 3).map((skill: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                          {typeof career.skills === 'string' ? career.skills : 'Multiple skills required'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Complete your assessment to see recommended careers</p>
            <Button
              onClick={() => navigate('/class10-assessment')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              Start Assessment
            </Button>
          </div>
        )}

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

export default Class10Careers;
