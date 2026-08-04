import React, { useState, useEffect, useRef } from 'react';
import { IoChatbubbleEllipses, IoClose, IoSend, IoKeyOutline } from 'react-icons/io5';
import api from '../api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I am FoodieAI, your customer support assistant. Ask me anything about our menu, ingredients, allergens, or delivery policies!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_key') || '');
  
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const msgText = textToSend || input;
    if (!msgText.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), text: msgText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    
    setIsLoading(true);
    
    try {
      const response = await api.post('/chat', { message: msgText });
      const botMsg = { id: Date.now() + 1, text: response.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = { id: Date.now() + 1, text: "Sorry, I ran into an issue connecting to my brain. Please try again.", sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openrouter_key', apiKey);
    } else {
      localStorage.removeItem('openrouter_key');
    }
    setShowKeyInput(false);
    // Reload api default headers
    window.location.reload();
  };

  const suggestions = [
    "Do you have vegetarian options?",
    "Recommend a meal under ₹300",
    "What are your delivery hours?",
    "Is there dairy in Margherita Pizza?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full glow-button flex items-center justify-center text-white text-3xl shadow-2xl cursor-pointer"
        >
          <IoChatbubbleEllipses />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[500px] rounded-2xl bg-[#111827] flex flex-col shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-rose-600 to-rose-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                F🤖
              </div>
              <div>
                <h3 className="font-semibold text-white leading-tight">FoodieAI Support</h3>
                <span className="text-xs text-rose-200">AI Assistant (RAG)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/80 hover:text-white text-xl cursor-pointer"
              >
                <IoClose />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white self-end rounded-tr-none'
                    : 'bg-white/5 text-gray-200 border border-white/5 self-start rounded-tl-none'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() ? "mb-1" : "h-2"} dangerouslySetInnerHTML={{
                    __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                ))}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white/5 text-gray-400 border border-white/5 self-start rounded-2xl rounded-tl-none p-3 text-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-300"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5 scrollbar-thin">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-rose-900/30 hover:border-rose-500 border border-white/10 text-xs text-rose-300 transition cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-gray-950 border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FoodieAI..."
              className="flex-1 px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-rose-500 text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-10 h-10 rounded-xl glow-button text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <IoSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
