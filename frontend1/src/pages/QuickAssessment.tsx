import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  QUICK_ASSESSMENT_QUESTIONS,
  computeQuickAssessmentResult,
  saveQuickAssessmentResult,
} from '@/lib/quickAssessment';

export default function QuickAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const current = QUICK_ASSESSMENT_QUESTIONS[index];
  const progress = useMemo(() => ((index + 1) / QUICK_ASSESSMENT_QUESTIONS.length) * 100, [index]);

  const choose = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  };

  const onNext = async () => {
    if (!answers[current.id]) return;

    if (index < QUICK_ASSESSMENT_QUESTIONS.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    if (!user) return;
    setSubmitting(true);

    const result = computeQuickAssessmentResult(answers);
    saveQuickAssessmentResult(user.id, result);

    setTimeout(() => {
      navigate('/careers');
    }, 400);
  };

  const onBack = () => {
    if (index === 0) {
      navigate('/assessments');
      return;
    }
    setIndex((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CareerPath Pro
              </span>
            </Link>
          </div>
          <div className="text-sm text-gray-400">10-Question Career Fit</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">Question {index + 1} / {QUICK_ASSESSMENT_QUESTIONS.length}</p>
              <p className="text-sm text-blue-300">{Math.round(progress)}%</p>
            </div>
            <Progress value={progress} className="h-2" />
          </Card>

          <Card className="bg-white/5 border-white/10 p-8">
            <p className="text-xs uppercase tracking-wider text-purple-300 mb-4">{current.category.replace('_', ' ')}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-8">{current.prompt}</h1>

            <div className="grid gap-3 mb-8">
              {current.options.map((option) => {
                const active = answers[current.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => choose(option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${active ? 'border-blue-400 bg-blue-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {active && <CheckCircle2 className="h-5 w-5 text-blue-300" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={onBack}>Previous</Button>
              <Button
                onClick={onNext}
                disabled={!answers[current.id] || submitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {index === QUICK_ASSESSMENT_QUESTIONS.length - 1 ? (submitting ? 'Scoring...' : 'Finish Assessment') : 'Next'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
