import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Loader2, Bot, User, MessageCircle, Sparkles, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    followUpQuestions?: string[];
    suggestedActions?: string[];
    timestamp: string;
}

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I am Shiv, your AI Career Mentor. 👋 Ask me anything about careers, skills, or your future! How can I help you today?",
            followUpQuestions: [
                "What career is best for me?",
                "How do I improve my skills?",
                "Help me with my career path"
            ],
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input.trim();
        if (!textToSend || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: textToSend,
            timestamp: new Date().toISOString()
        };

        // Initialize assistant message with empty content
        const assistantMessage: Message = {
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);
        const assistantMessageIndex = messages.length + 1; // Index of the new assistant message
        
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Get last 5 messages for history (excluding the ones we just added)
            const chatHistory = messages.slice(-5).map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await fetch(`${API_URL}/services/mentor/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    message: textToSend,
                    history: chatHistory
                })
            });

            if (!response.ok) throw new Error('Failed to connect to AI mentor');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponseText = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.substring(6));
                                
                                if (data.chunk) {
                                    fullResponseText += data.chunk;
                                    // Update the last message content in real-time
                                    setMessages(prev => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1].content = fullResponseText;
                                        return newMessages;
                                    });
                                } else if (data.done) {
                                    // Final update with all metadata
                                    const finalResponse = data.full_response;
                                    setMessages(prev => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1].content = finalResponse;
                                        newMessages[newMessages.length - 1].followUpQuestions = data.follow_up_questions;
                                        return newMessages;
                                    });
                                    if (isSpeechEnabled) {
                                        speak(finalResponse);
                                    }
                                } else if (data.error) {
                                    throw new Error(data.error);
                                }
                            } catch (e) {
                                console.error('Error parsing stream chunk:', e);
                            }
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error('Chat error:', error);
            toast({
                title: 'Connection Error',
                description: 'Failed to connect to AI mentor. Please try again.',
                variant: 'destructive'
            });

            setMessages(prev => {
                const newMessages = [...prev];
                // Update the last message (which was the assistant's) with error
                newMessages[newMessages.length - 1].content = "Sorry, I'm having trouble connecting. Please check your internet and try again.";
                return newMessages;
            });
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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce"
            >
                <MessageCircle className="h-8 w-8" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">1</span>
            </button>
        );
    }

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex flex-col bg-background border-2 border-primary/20 rounded-2xl shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
                }`}
            style={{
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-2 border-white/20">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-sm">Shiv (AI Mentor)</span>
                            <Sparkles className="h-3 w-3 text-yellow-400" />
                        </div>
                        <span className="text-xs text-muted-foreground">Online • Powered by Gemini AI</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${isSpeechEnabled ? 'text-blue-500 bg-blue-500/10' : 'text-muted-foreground'}`}
                        onClick={() => {
                            setIsSpeechEnabled(!isSpeechEnabled);
                            if (!isSpeechEnabled) toast({ title: "Voice Mode On", description: "AI responses will be read aloud." });
                            else window.speechSynthesis.cancel();
                        }}
                        title={isSpeechEnabled ? "Disable Voice" : "Enable Voice"}
                    >
                        {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background to-muted/20">
                        {messages.map((message, index) => (
                            <div key={index} className="animate-in fade-in slide-in-from-bottom-2">
                                <div className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.role === 'assistant' && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                                            <Bot className="h-4 w-4 text-white" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-xs leading-relaxed whitespace-pre-wrap flex-1">{message.content}</p>
                                            {message.role === 'assistant' && (
                                                <button
                                                    onClick={() => speak(message.content)}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    title="Speak"
                                                >
                                                    <Sparkles className="h-3 w-3 text-blue-500" />
                                                </button>
                                            )}
                                        </div>

                                        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-[10px] font-semibold opacity-70">💬 Quick replies:</p>
                                                {message.followUpQuestions.map((question, qIndex) => (
                                                    <button
                                                        key={qIndex}
                                                        onClick={() => handleSuggestionClick(question)}
                                                        disabled={isLoading}
                                                        className="w-full text-left rounded-lg border border-primary/20 bg-background/50 px-2 py-1.5 text-[10px] hover:bg-primary/10 hover:border-primary/40 transition-colors disabled:opacity-50"
                                                    >
                                                        {question}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {message.suggestedActions && message.suggestedActions.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-[10px] font-semibold opacity-70">✨ Actions:</p>
                                                <ul className="text-[10px] space-y-0.5 opacity-80 mt-1">
                                                    {message.suggestedActions.map((action, aIndex) => (
                                                        <li key={aIndex}>• {action}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                                            <User className="h-4 w-4 text-secondary-foreground" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-2 justify-start animate-in fade-in">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                                    <Bot className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="bg-muted rounded-2xl px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-background rounded-b-2xl">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask me anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1 h-9 text-sm text-gray-900 bg-white border-gray-300 focus:ring-blue-500"
                                autoFocus
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                size="icon"
                                className="h-9 w-9 shrink-0 bg-gradient-to-r from-primary to-secondary"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
