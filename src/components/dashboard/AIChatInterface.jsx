import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic } from 'lucide-react';

const AIChatInterface = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'assistant',
            text: 'Hello! 👋 I\'m your AI Booking Assistant. How can I help you find the perfect venue today?',
            timestamp: new Date(),
        },
    ]);

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                'That sounds like a wonderful event! Based on your requirements, I\'d recommend the Grand Ballroom or Botanical Garden. Would you like to see availability?',
                'Great choice! I can help you find a venue that fits your budget and guest count. What\'s your preferred date range?',
                'I\'ve analyzed similar events and found that weekend bookings in the Grand Ballroom have the highest satisfaction rates. Would you like to book a consultation?',
                'Your preferences match our premium tier. Let me suggest some exclusive venues that would be perfect for your event.',
                'I\'m excited to help! Let me search our database for venues that match your criteria. One moment...',
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const assistantMessage = {
                id: messages.length + 2,
                type: 'assistant',
                text: randomResponse,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const suggestedQuestions = [
        'Show me wedding venues',
        'Best venues for 200 guests',
        'Available dates in May',
        'Budget-friendly options',
    ];

    const handleSuggestedQuestion = (question) => {
        setInputValue(question);
    };

    return (
        <div className="fixed bottom-0 right-0 w-96 h-screen max-h-screen md:max-h-[600px] md:bottom-4 md:right-4 md:rounded-3xl
      glass-panel border-emerald-500/30 flex flex-col shadow-2xl shadow-black/50 overflow-hidden
      animate-slide-in-right z-50">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-900/20 to-gold/10">
                <div>
                    <h2 className="heading-md">ExpoInn AI</h2>
                    <p className="text-xs text-muted">Always here to help</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                        <div
                            className={`
                max-w-xs px-4 py-3 rounded-2xl break-words
                ${message.type === 'user'
                                    ? 'bg-gradient-emerald text-white rounded-br-none'
                                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-none'
                                }
              `}
                        >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-white/50'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start animate-fade-in-up">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-2xl rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
                <div className="px-6 py-4 border-t border-emerald-500/20 bg-white/5">
                    <p className="text-xs text-muted mb-3 font-medium">Suggested questions:</p>
                    <div className="space-y-2">
                        {suggestedQuestions.map((question) => (
                            <button
                                key={question}
                                onClick={() => handleSuggestedQuestion(question)}
                                className="w-full text-left text-xs p-2.5 bg-white/5 hover:bg-emerald-500/20
                  border border-white/10 hover:border-emerald-400 rounded-lg transition text-white"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-emerald-500/20 bg-gradient-to-t from-emerald-900/10 to-transparent">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-full
              text-white text-sm placeholder-muted
              focus:outline-none focus:border-gold/60 focus:bg-white/15
              transition backdrop-blur-sm"
                    />
                    <button
                        type="button"
                        className="p-2.5 hover:bg-emerald-500/20 rounded-full transition"
                    >
                        <Mic size={18} className="text-muted hover:text-gold transition" />
                    </button>
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="p-2.5 bg-gradient-emerald rounded-full transition
              hover:shadow-lg hover:shadow-emerald-500/40
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} className="text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChatInterface;
