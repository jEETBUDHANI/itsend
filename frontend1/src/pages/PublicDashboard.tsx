import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Lock, TrendingUp, Map } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const publicCareers = [
  'Software Engineer',
  'Data Scientist',
  'UX Designer',
  'Product Manager',
  'Doctor',
  'Accountant',
];

const roadmapPresets = [
  { title: 'Software Engineer Starter', steps: 4 },
  { title: 'Data Analyst Starter', steps: 4 },
  { title: 'UX Designer Starter', steps: 4 },
];

export default function PublicDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CareerPath Pro
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Explore Career Paths Publicly</h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Start with general career paths, preset roadmaps, and zero-state progress. Complete a brief 10-question assessment to unlock personalized recommendations and AI mentor.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white/5 border-white/10 p-6">
            <h2 className="font-bold text-xl mb-4">General Careers</h2>
            <div className="space-y-2 text-gray-300">
              {publicCareers.map((career) => <p key={career}>{career}</p>)}
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><Map className="h-5 w-5 text-blue-300" /> Roadmap Presets</h2>
            <div className="space-y-3 text-gray-300">
              {roadmapPresets.map((preset) => (
                <div key={preset.title} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="font-medium">{preset.title}</p>
                  <p className="text-sm text-gray-400">{preset.steps} steps</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-purple-300" /> Progress Summary</h2>
            <p className="text-gray-400 mb-3">Initial user state (before assessment):</p>
            <div className="space-y-2 text-sm">
              <p>Personalized Paths: 0%</p>
              <p>General Paths: 0%</p>
              <p>Status: Not Started</p>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm flex items-center gap-2">
              <Lock className="h-4 w-4" /> Personalized section unlocks after assessment.
            </div>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready for personalized careers and roadmaps?</h3>
          <p className="text-gray-300 mb-6">Take the 10-question assessment to unlock your best-fit career path and AI mentor.</p>
          <div className="flex justify-center gap-3">
            <Link to="/signup"><Button size="lg">Create Account</Button></Link>
            <Link to="/login"><Button variant="outline" size="lg">Login to Continue <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
