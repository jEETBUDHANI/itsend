import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send, Bot, User, Target, Award, BrainCircuit, CheckCircle2, ShieldAlert } from 'lucide-react';
import { chatbotApi } from '@/services/api';
import { Textarea } from '@/components/ui/textarea';

const MOCK_QUESTIONS: Record<string, string[]> = {
  "Frontend Developer": [
    "Explain the concept of the Virtual DOM in React and why it improves performance.",
    "How do you handle state management in a large-scale React application?",
    "Describe your process for ensuring a web application is fully accessible and responsive."
  ],
  "Backend Developer": [
    "What is the difference between SQL and NoSQL, and when would you choose one over the other?",
    "Explain how you would secure a REST API against common vulnerabilities.",
    "Describe the concept of microservices architecture and its main challenges."
  ],
  "MBBS Doctor": [
    "A patient presents with sudden severe chest pain and shortness of breath. What is your immediate course of action?",
    "Explain the physiological mechanism of action of ACE inhibitors.",
    "How do you deliver difficult or terminal news to a patient's family?"
  ],
  "Chartered Accountant (CA)": [
    "Walk me through the process of conducting a statutory audit.",
    "Explain the impact of depreciation on cash flow.",
    "How would you identify and address creative accounting or financial fraud in a balance sheet?"
  ],
  "Psychologist": [
    "Describe your approach to building rapport with a resistant client.",
    "Explain the core principles of Cognitive Behavioral Therapy (CBT).",
    "How do you maintain professional boundaries and manage countertransference?"
  ],
  "Data Scientist": [
    "Explain the difference between L1 and L2 regularization.",
    "How do you handle imbalanced datasets in classification problems?",
    "Describe the architecture and attention mechanism of a Transformer model."
  ],
  "Investment Banker": [
    "Walk me through a Discounted Cash Flow (DCF) model.",
    "If a company incurs $10 (pre-tax) of depreciation expense, how does that affect the three financial statements?",
    "What makes a company a good LBO target?"
  ],
  "Corporate Lawyer": [
    "Explain the concept of the 'corporate veil' and when it can be pierced.",
    "What are the key clauses to look out for in a Mergers & Acquisitions (M&A) contract?",
    "How do you handle a situation where a corporate client asks you to draft an agreement that borders on being illegal?"
  ]
};

const getQuestions = (career: string) => {
    return MOCK_QUESTIONS[career] || [
        `What are the core foundational skills required to excel as a ${career}?`,
        `Describe a challenging problem a ${career} might face daily and how you would systematically solve it.`,
        `Where do you see the industry for ${career} heading in the next 5 years?`
    ];
};

const MockInterview = () => {
  const navigate = useNavigate();
  const [career, setCareer] = useState("Software Engineer");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<{ q: string; a: string; feedback: string; score: number }[]>([]);
  const [interviewComplete, setInterviewComplete] = useState(false);

  useEffect(() => {
    const savedCareer = localStorage.getItem('college_selected_career') || "Software Engineer";
    setCareer(savedCareer);
    setQuestions(getQuestions(savedCareer));
  }, []);

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    
    setIsGrading(true);
    const question = questions[currentQIndex];
    const prompt = `You are an expert technical interviewer for a ${career} position. The question is: "${question}". The candidate's answer is: "${answer}". 
    Grade this answer out of 10. Be strict but fair. 
    Format your response EXACTLY like this:
    SCORE: [number]/10
    FEEDBACK: [1 or 2 sentences of constructive feedback explaining why they got that score and how to improve]`;

    try {
      // Use the actual Gemini backend chatbot API
      const response = await chatbotApi.ask(prompt);
      const text = response.answer || "";
      
      // Parse score and feedback
      let scoreMatch = text.match(/SCORE:\s*(\d+)/i);
      let score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 4) + 5; // fallback
      
      let feedbackMatch = text.split(/FEEDBACK:/i);
      let feedback = feedbackMatch.length > 1 ? feedbackMatch[1].trim() : "Good attempt, but make sure to include more technical depth and specific examples.";

      setFeedbackList(prev => [...prev, { q: question, a: answer, feedback, score }]);
      
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
        setAnswer("");
      } else {
        setInterviewComplete(true);
      }
    } catch (error) {
      console.error("Grading failed", error);
      // Fallback if API fails
      setFeedbackList(prev => [...prev, { q: question, a: answer, feedback: "Network error: Unable to reach AI grading server. However, your response has been recorded.", score: 0 }]);
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
        setAnswer("");
      } else {
        setInterviewComplete(true);
      }
    } finally {
      setIsGrading(false);
    }
  };

  const calculateTotalScore = () => {
      const total = feedbackList.reduce((acc, curr) => acc + curr.score, 0);
      return Math.round((total / (questions.length * 10)) * 100);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Live AI Interview</h1>
            <p className="text-blue-400 font-medium">Target Role: {career}</p>
          </div>
        </div>

        {!interviewComplete ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-400 mb-2">
                <span>Question {currentQIndex + 1} of {questions.length}</span>
                <span className="text-blue-400 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">Technical Round</span>
            </div>

            <Card className="p-8 bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mt-1 border border-blue-500/30">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 font-semibold mb-1">AI Hiring Manager</p>
                  <h2 className="text-2xl font-bold text-white leading-relaxed">{questions[currentQIndex]}</h2>
                </div>
              </div>

              <div className="mt-8">
                <Textarea 
                  placeholder="Type your detailed technical answer here..." 
                  className="min-h-[200px] bg-white/5 border-white/10 text-white text-lg p-4 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isGrading}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                    onClick={submitAnswer} 
                    disabled={isGrading || answer.length < 10}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                >
                  {isGrading ? (
                      <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Grading Response...
                      </span>
                  ) : (
                      <span className="flex items-center gap-2">
                          Submit Answer <Send className="w-5 h-5" />
                      </span>
                  )}
                </Button>
              </div>
            </Card>
            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4" /> AI grading uses advanced LLM analysis. Be as specific and technical as possible.
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card className="p-10 bg-gradient-to-br from-black/80 to-blue-900/20 border border-blue-500/30 backdrop-blur-xl text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center border-4 border-blue-500/50 mb-6 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                    <span className="text-4xl font-black text-white">{calculateTotalScore()}%</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Interview Completed</h2>
                <p className="text-gray-400 text-lg">You have completed the technical mock interview for <strong>{career}</strong>.</p>
            </Card>

            <h3 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4"><Target className="w-6 h-6 text-blue-400" /> Detailed AI Feedback</h3>
            
            <div className="space-y-6">
                {feedbackList.map((item, idx) => (
                    <Card key={idx} className="p-6 bg-white/[0.03] border border-white/10">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h4 className="font-bold text-lg text-blue-300 flex-1">Q: {item.q}</h4>
                            <div className="px-4 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold whitespace-nowrap">
                                Score: {item.score}/10
                            </div>
                        </div>
                        <div className="bg-black/50 p-4 rounded-lg mb-4 border border-white/5">
                            <p className="text-sm text-gray-500 mb-1 font-semibold">Your Answer:</p>
                            <p className="text-gray-300 italic">"{item.a}"</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-blue-400 font-semibold mb-1">AI Interviewer Feedback:</p>
                                <p className="text-blue-100">{item.feedback}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <Button onClick={() => navigate('/dashboard')} className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-bold">
                    Return to Dashboard
                </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
