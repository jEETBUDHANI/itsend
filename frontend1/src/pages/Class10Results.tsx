import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, BarChart3 } from 'lucide-react';

const Class10Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('/api/class10/results', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.results && response.data.results.length > 0) {
          const latest = response.data.results[0];
          setResults(latest.score_payload);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full" />
            </div>
          </div>
        ) : results ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <h1 className="text-3xl font-bold">Your Stream Assessment Results</h1>
            </div>

            <Card className="p-8 bg-white/[0.04] border border-white/10 mb-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Recommended Stream</p>
                  <p className="text-3xl font-bold text-blue-400">{results.stream}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Confidence Score</p>
                  <p className="text-3xl font-bold text-green-400">{results.confidence}%</p>
                </div>
              </div>

              {results.stream === 'SCIENCE' && results.specialization && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Specialization</p>
                  <p className="text-2xl font-bold text-purple-400">{results.specialization}</p>
                </div>
              )}
            </Card>

            {results.stream_scores && (
              <Card className="p-6 bg-white/[0.04] border border-white/10 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Stream Scores
                </h3>
                <div className="space-y-4">
                  {Object.entries(results.stream_scores).map(([stream, score]: [string, any]) => (
                    <div key={stream}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{stream}</span>
                        <span className="text-sm text-gray-400">{score}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ delay: 0.2, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {results.recommended_careers && (
              <Card className="p-6 bg-white/[0.04] border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Recommended Careers</h3>
                <div className="grid grid-cols-1 gap-3">
                  {results.recommended_careers.slice(0, 3).map((career: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <p className="font-semibold">{career.name}</p>
                      <p className="text-sm text-gray-400">{career.cluster || 'Career cluster'}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => navigate('/class10-roadmap')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
              >
                View Your Roadmap
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="flex-1"
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No assessment results found</p>
            <Button
              onClick={() => navigate('/class10-assessment')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              Start Assessment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Class10Results;
