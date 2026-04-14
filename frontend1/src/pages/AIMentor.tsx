import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Send, Loader2, User, Bot, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { hasCompletedAllAssessments } from '@/lib/assessmentUtils';

const API_URL = 'http://localhost:5000/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    followUpQuestions?: string[];
    suggestedActions?: string[];
    timestamp: string;
}

export default function AIMentor() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm **Shiv**, your AI Career Mentor 🎯\n\nI'm here to help you with:\n• Career guidance & planning\n• Skill development advice\n• Understanding your assessments\n• Making career decisions\n\nWhat would you like to know?",
            followUpQuestions: [
                "What career should I choose?",
                "How do I learn programming?",
                "Tell me about my career matches"
            ],
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mentorUnlocked, setMentorUnlocked] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!user) return;
        setMentorUnlocked(hasCompletedAllAssessments(user.id));
    }, [user]);

    if (!mentorUnlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center px-4">
                <div className="max-w-xl w-full p-8 bg-white/5 border border-yellow-500/30 rounded-2xl text-center">
                    <h1 className="text-3xl font-bold mb-3">AI Mentor is locked</h1>
                    <p className="text-gray-300 mb-6">
                        Complete all 5 assessments (RIASEC, Aptitude, Personality, Values, and Risk Tolerance) to unlock personalized mentor guidance.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                        <Button onClick={() => navigate('/assessments')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                            Go to Assessments
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input.trim();
        if (!textToSend || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: textToSend,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/services/mentor/chat`,
                { message: textToSend },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.response,
                followUpQuestions: response.data.follow_up_questions || [],
                suggestedActions: response.data.suggested_actions || [],
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Chat error:', error);

            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to get response',
                variant: 'destructive'
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting. Please try again!",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (isLoading) return;
        setInput(suggestion);
        setTimeout(() => handleSend(suggestion), 100);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-300 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                                <Brain className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        AI Career Mentor
                                    </span>
                                    <Sparkles className="h-4 w-4 text-yellow-400" />
                                </div>
                                <p className="text-xs text-gray-400">Powered by OpenRouter AI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="h-[calc(100vh-12rem)] flex flex-col bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className="animate-in fade-in slide-in-from-bottom-2">
                                <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.role === 'assistant' && (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                                            <Bot className="h-6 w-6 text-white" />
                                        </div>
                                    )}

                                    <div className={`max-w-[75%] rounded-2xl px-5 py-4 ${message.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                                            : 'bg-gray-700/80 text-gray-100'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                            {message.content}
                                        </p>

                                        {/* Follow-up Questions */}
                                        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <p className="text-xs font-semibold text-blue-300">
                                                    💬 Quick questions:
                                                </p>
                                                {message.followUpQuestions.map((question, qIndex) => (
                                                    <button
                                                        key={qIndex}
                                                        onClick={() => handleSuggestionClick(question)}
                                                        disabled={isLoading}
                                                        className="w-full text-left rounded-lg border border-blue-400/30 bg-gray-800/50 px-3 py-2 text-sm text-gray-200 hover:bg-blue-600/20 hover:border-blue-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {question}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-600">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex gap-3 justify-start animate-in fade-in">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div className="bg-gray-700/80 rounded-2xl px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                        <span className="text-sm text-gray-300">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-white/10 p-4 bg-gray-800/80">
                        <div className="flex gap-3">
                            <Input
                                placeholder="Ask me anything about your career..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1 bg-gray-700/50 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500"
                                autoFocus
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        <p className="mt-2 text-xs text-gray-400 text-center">
                            💡 Ask about careers, skills, learning paths, or anything else!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
