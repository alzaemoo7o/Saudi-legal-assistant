import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageStream } from '../services/geminiService';
import type { Message } from '../types';
import { GavelIcon } from './icons/GavelIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';

const suggestedQuestions = [
  "ما هي أنواع الشركات في السعودية؟",
  "ما هي حقوق الموظف في القطاع الخاص؟",
  "كيف يتم تسجيل علامة تجارية؟",
  "اشرح لي نظام الأحوال الشخصية الجديد.",
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const initializeConversation = useCallback(async () => {
    setIsLoading(true);
    const initialBotMessage: Message = { id: 'initial-1', text: '', sender: 'bot' };
    setMessages([initialBotMessage]);
    
    await sendMessageStream("مرحبا", (chunk) => {
      setMessages(prev => 
        prev.map(m => m.id === initialBotMessage.id ? { ...m, text: m.text + chunk } : m)
      );
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (textToSend.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: textToSend, sender: 'user' };
    const botMessage: Message = { id: (Date.now() + 1).toString(), text: '', sender: 'bot' };
    
    setMessages(prev => [...prev, userMessage, botMessage]);
    if (!messageText) {
      setInput('');
    }
    setIsLoading(true);

    await sendMessageStream(textToSend, (chunk) => {
      setMessages(prev =>
        prev.map(m => m.id === botMessage.id ? { ...m, text: m.text + chunk } : m)
      );
    });

    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  }

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-[80vh] max-h-[800px]">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">المحامي - مساعدك القانوني</h2>
        <GavelIcon className="w-8 h-8 text-emerald-500" />
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && <GavelIcon className="w-8 h-8 flex-shrink-0 text-gray-400 p-1 bg-gray-200 rounded-full" />}
              <div className={`max-w-xl p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
              {msg.sender === 'user' && <UserIcon className="w-8 h-8 flex-shrink-0 text-white p-1 bg-emerald-600 rounded-full" />}
            </div>
          ))}
          {isLoading && messages[messages.length-1]?.sender === 'bot' && messages[messages.length - 1]?.text === '' && (
             <div className="flex items-start gap-3 justify-start">
                <GavelIcon className="w-8 h-8 flex-shrink-0 text-gray-400 p-1 bg-gray-200 rounded-full" />
                <div className="max-w-md p-3 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-bl-none flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {messages.length === 1 && !isLoading && (
          <div className="mt-6">
            <p className="text-sm text-center text-gray-500 mb-3">أو يمكنك تجربة أحد هذه الأسئلة الشائعة:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSendMessage(q)} 
                  className="w-full text-right p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-emerald-300 transition-all text-sm text-gray-700">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك القانوني هنا..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading}
            dir="auto"
          />
          <button
            type="submit"
            disabled={isLoading || input.trim() === ''}
            className="p-3 bg-emerald-600 text-white rounded-full disabled:bg-gray-400 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
