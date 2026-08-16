// client/src/components/AiChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, ShoppingBag } from 'lucide-react';

export default function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi there! 👋 I am your ShopPulse AI Assistant. How can I help you find products, track orders, or explore today’s deals?'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    // AI Smart Response Logic
    setTimeout(() => {
      let botReply = "I can help you explore gadgets, fashion, fragrances, or check your orders!";
      const lower = userText.toLowerCase();

      if (lower.includes('order') || lower.includes('track')) {
        botReply = "You can view and track all your confirmed orders directly inside the 'My Orders' section from your top profile menu! 📦";
      } else if (lower.includes('discount') || lower.includes('deal') || lower.includes('offer')) {
        botReply = "🔥 Today's top deals include up to 40% OFF on M3 MacBooks, Nike Jordans, and Luxury Perfumes on the homepage carousel!";
      } else if (lower.includes('phone') || lower.includes('laptop') || lower.includes('electronic')) {
        botReply = "Check out our Electronics category for Apple iPhone 15 Pro Max, Galaxy S24 Ultra, and Sony ANC headphones!";
      } else if (lower.includes('perfume') || lower.includes('scent')) {
        botReply = "Explore our Fragrances section for Dior Sauvage, Chanel No. 5, and Tom Ford signature perfumes!";
      } else if (lower.includes('return') || lower.includes('refund')) {
        botReply = "We offer a 7-day hassle-free doorstep replacement guarantee on all eligible purchases!";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full shadow-2xl flex items-center gap-2 transition cursor-pointer group"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="text-xs font-black hidden group-hover:inline transition-all pr-1">
            AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[460px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Top Bar */}
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs font-black">ShopPulse AI Support</h3>
                <p className="text-[10px] text-indigo-200">Always online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Flow */}
          <div className="grow p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask about products, deals, orders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="grow px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}