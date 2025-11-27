import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageStream } from '../services/geminiService';
import type { Message } from '../types';
import { LawyerBotIcon } from './icons/LawyerBotIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';

const suggestedQuestions = [
  "ما هي شروط عقد العمل محدد المدة؟",
  "كيف يتم تأسيس شركة ذات مسؤولية محدودة؟",
  "حقوق الحضانة في نظام الأحوال الشخصية",
  "عقوبة الجرائم المعلوماتية في السعودية",
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

  // Simple formatter to handle bolding and lists without heavy external libraries
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Handle Bullet points
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*');
      const cleanLine = isBullet ? line.trim().substring(1) : line;
      
      // Parse Bold **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={i} className={`min-h-[1.5em] ${isBullet ? 'flex items-start gap-2 my-1' : 'my-0.5'}`}>
          {isBullet && <span className="text-emerald-500 mt-1.5 text-[8px] flex-shrink-0">●</span>}
          <p className={`${isBullet ? 'flex-1' : ''}`}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-bold text-emerald-900">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col h-[80vh] max-h-[800px]">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-l from-emerald-50 to-white rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800">المحامي الذكي</h2>
          <p className="text-xs text-emerald-600 font-medium">متصل • جاهز للاستشارات السعودية</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <LawyerBotIcon className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scroll-smooth">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
                   <LawyerBotIcon className="w-5 h-5 text-emerald-600" />
                </div>
              )}
              
              <div className={`max-w-[85%] lg:max-w-[75%] p-4 rounded-2xl shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
              }`}>
                <div className="text-sm leading-relaxed">
                  {msg.sender === 'user' ? msg.text : renderMessageContent(msg.text)}
                </div>
              </div>
              
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shadow-sm flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-emerald-100" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && messages[messages.length-1]?.sender === 'bot' && messages[messages.length - 1]?.text === '' && (
             <div className="flex items-end gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                   <LawyerBotIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="p-4 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-sm">
                    <div className="flex space-x-1 space-x-reverse">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {messages.length <= 1 && !isLoading && (
          <div className="mt-8">
            <p className="text-xs text-center text-gray-400 mb-4">أمثلة على ما يمكنك سؤاله</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSendMessage(q)} 
                  className="text-right p-3.5 bg-white border border-emerald-100 hover:border-emerald-400 hover:shadow-md rounded-xl transition-all text-sm text-gray-600 hover:text-emerald-700">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 rounded-b-xl">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك القانوني هنا..."
              className="w-full p-4 pl-4 pr-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
              disabled={isLoading}
              dir="auto"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || input.trim() === ''}
            className="p-4 bg-emerald-600 text-white rounded-2xl disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400">المحامي الذكي قد يرتكب أخطاء. يرجى مراجعة المعلومات الهامة.</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;