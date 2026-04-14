import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { markAssessmentComplete } from '@/lib/assessmentUtils';

// Big 5 Personality Questions - Likert scale
const PERSONALITY_QUESTIONS = [
  {
    id: 1,
    question: "I am the life of the party",
    trait: "extraversion"
  },
  {
    id: 2,
    question: "I feel comfortable around people",
    trait: "extraversion"
  },
  {
    id: 3,
    question: "I start conversations easily",
    trait: "extraversion"
  },
  {
    id: 4,
    question: "I get stressed out easily",
    trait: "neuroticism"
  },
  {
    id: 5,
    question: "I worry about things",
    trait: "neuroticism"
  },
  {
    id: 6,
    question: "I am easily disturbed",
    trait: "neuroticism"
  },
  {
    id: 7,
    question: "I am always prepared",
    trait: "conscientiousness"
  },
  {
    id: 8,
    question: "I pay attention to details",
    trait: "conscientiousness"
  },
  {
    id: 9,
    question: "I get chores done right away",
    trait: "conscientiousness"
  },
  {
    id: 10,
    question: "I have a rich vocabulary",
    trait: "openness"
  },
  {
    id: 11,
    question: "I have excellent ideas",
    trait: "openness"
  },
  {
    id: 12,
    question: "I am quick to understand things",
    trait: "openness"
  },
  {
    id: 13,
    question: "I feel others' emotions",
    trait: "agreeableness"
  },
  {
    id: 14,
    question: "I make people feel at ease",
    trait: "agreeableness"
  },
  {
    id: 15,
    question: "I am interested in people's problems",
    trait: "agreeableness"
  },
  {
    id: 16,
    question: "I prefer to do things alone",
    trait: "extraversion_reverse"
  },
  {
    id: 17,
    question: "I am relaxed most of the time",
    trait: "neuroticism_reverse"
  },
  {
    id: 18,
    question: "I leave my belongings around",
    trait: "conscientiousness_reverse"
  },
  {
    id: 19,
    question: "I have difficulty understanding abstract ideas",
    trait: "openness_reverse"
  },
  {
    id: 20,
    question: "I am not interested in other people's problems",
    trait: "agreeableness_reverse"
  }
];

const ACTIVE_PERSONALITY_QUESTIONS = [
  PERSONALITY_QUESTIONS[0],
  PERSONALITY_QUESTIONS[3],
  PERSONALITY_QUESTIONS[6],
  PERSONALITY_QUESTIONS[9],
  PERSONALITY_QUESTIONS[12],
  PERSONALITY_QUESTIONS[15],
  PERSONALITY_QUESTIONS[16],
  PERSONALITY_QUESTIONS[17],
  PERSONALITY_QUESTIONS[18],
  PERSONALITY_QUESTIONS[19],
];

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function PersonalityTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [questions, setQuestions] = useState(ACTIVE_PERSONALITY_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    setQuestions(shuffleArray(ACTIVE_PERSONALITY_QUESTIONS));
  }, []);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    // Auto-advance to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults();
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const traits = {
      extraversion: 0,
      neuroticism: 0,
      conscientiousness: 0,
      openness: 0,
      agreeableness: 0
    };

    questions.forEach((q, index) => {
      const score = answers[index];
      if (q.trait.includes('_reverse')) {
        const baseTrait = q.trait.replace('_reverse', '') as keyof typeof traits;
        traits[baseTrait] += (6 - score);
      } else {
        traits[q.trait as keyof typeof traits] += score;
      }
    });

    // Normalize scores
    Object.keys(traits).forEach(key => {
      traits[key as keyof typeof traits] = Math.round((traits[key as keyof typeof traits] / 20) * 100);
    });

    setResults(traits);
    setShowResults(true);

    // Submit to backend API
    const submitToBackend = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await fetch('http://localhost:5000/api/assessment/personality', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              answers: answers.map((answer, index) => ({
                questionId: questions[index].id,
                value: answer,
                trait: questions[index].trait
              }))
            })
          });
        }
      } catch (error) {
        console.error('Error submitting to backend:', error);
      }
    };

    submitToBackend();

    // Mark assessment as completed - save as 'riasec' for /test route or 'personality' for /assessments/personality
    if (user) {
      const assessmentId = location.pathname === '/test' ? 'riasec' : 'personality';
      markAssessmentComplete(user.id, assessmentId);
    }

    toast({
      title: 'Personality Assessment Complete!',
      description: 'Your personality profile is ready',
    });
  };

  const handleRetake = () => {
    setQuestions(shuffleArray(ACTIVE_PERSONALITY_QUESTIONS));
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults && results) {
    const topTrait = Object.entries(results).sort((a, b) => b[1] - a[1])[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/assessments')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center mb-12">
              <div className="text-6xl mb-6">🎭</div>
              <h1 className="text-4xl font-bold mb-4">Your Personality Profile</h1>
              <p className="text-xl text-gray-400">Based on the Big Five personality traits</p>
            </div>

            <div className="grid gap-6 mb-12">
              {Object.entries(results).map(([trait, score], index) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-gray-800/50 border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold capitalize text-white">{trait}</h3>
                      <span className="text-2xl font-bold text-green-400">{score}%</span>
                    </div>
                    <Progress value={score as number} className="h-3" />
                    <p className="text-sm text-gray-400 mt-2">
                      {trait === 'extraversion' && 'How outgoing and social you are'}
                      {trait === 'neuroticism' && 'Your emotional stability'}
                      {trait === 'conscientiousness' && 'Your level of organization'}
                      {trait === 'openness' && 'Your curiosity and creativity'}
                      {trait === 'agreeableness' && 'How cooperative and compassionate you are'}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="p-8 bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-white">Your Dominant Trait</h3>
              <p className="text-xl text-white capitalize mb-2">{topTrait[0]}: {topTrait[1]}%</p>
              <p className="text-gray-300">
                This trait is your strongest personality characteristic.
              </p>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleRetake}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Retake Test (Questions will shuffle)
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/assessments')}
                className="border-green-600 text-green-400 hover:bg-green-900/50"
              >
                Back to Assessment Center
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/assessments')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit
            </Button>
            <div className="h-6 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-400" />
              <span className="font-semibold">Personality Profile</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-green-400">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-8 bg-gray-800/50 border-gray-700 mb-8">
            <div className="mb-8">
              <div className="text-sm text-green-400 font-semibold mb-2">Question {currentQuestion + 1}</div>
              <h2 className="text-3xl font-bold text-center mb-2">{question.question}</h2>
              <p className="text-center text-gray-400">Rate how much you agree with this statement</p>
            </div>

            <div className="space-y-3">
              {LIKERT_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl border-2 text-center transition-all ${answers[currentQuestion] === option.value
                    ? 'border-green-500 bg-green-900/50 text-white'
                    : 'border-gray-700 bg-gray-900/50 hover:border-green-700 text-gray-300'
                    }`}
                >
                  <span className="font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentQuestion
                    ? 'bg-green-500'
                    : answers[index] !== undefined
                      ? 'bg-green-700'
                      : 'bg-gray-700'
                    }`}
                />
              ))}
            </div>

            <div className="w-24" /> {/* Spacer */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
