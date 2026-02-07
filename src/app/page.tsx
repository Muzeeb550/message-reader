'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isSpeaking: boolean;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('messages');
    if (stored) {
      const parsed = JSON.parse(stored);
      const messagesWithDates = parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithDates);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      timestamp: new Date(),
      isSpeaking: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const speakMessage = (message: Message) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);

      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.lang = 'hi-IN';
      
      utterance.onstart = () => setSpeakingId(message.id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    if (messageDate.getTime() === today.getTime()) {
      return 'TODAY';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'YESTERDAY';
    } else {
      return messageDate.toLocaleDateString('en-IN', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).toUpperCase();
    }
  };

  const shouldShowDateSeparator = (currentMsg: Message, previousMsg: Message | null) => {
    if (!previousMsg) return true;
    
    const currentDate = new Date(currentMsg.timestamp);
    const previousDate = new Date(previousMsg.timestamp);
    
    currentDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);
    
    return currentDate.getTime() !== previousDate.getTime();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearMessages = () => {
    if (confirm('Clear all messages?')) {
      setMessages([]);
      localStorage.removeItem('messages');
    }
  };

  return (
    <main className="h-screen flex flex-col bg-[#0b141a]">
      {/* Header - WhatsApp style */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between shadow-lg">
        <h1 className="text-white text-xl font-medium">Message Reader</h1>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-gray-400 hover:text-white text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-[#0b141a] p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <p>Send a message to start</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={message.id}>
                {/* Date Separator */}
                {shouldShowDateSeparator(message, index > 0 ? messages[index - 1] : null) && (
                  <div className="flex justify-center my-4">
                    <div className="bg-[#1f2c34] px-3 py-1.5 rounded-md shadow-md">
                      <span className="text-gray-300 text-xs font-medium">
                        {getDateLabel(message.timestamp)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] rounded-lg px-3 py-2 max-w-[85%] shadow-md">
                    <p className="text-white text-base break-words whitespace-pre-wrap">
                      {message.text}
                    </p>
                    
                    {/* Time */}
                    <div className="flex items-center justify-end mt-1">
                      <span className="text-xs text-gray-300">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    {/* Speak Button */}
                    <div className="mt-2 pt-2 border-t border-[#004d40]">
                      {speakingId === message.id ? (
                        <button
                          onClick={stopSpeaking}
                          className="touch-manipulation flex items-center gap-1.5 text-red-300 hover:text-red-200 active:scale-95 transition-transform text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                          </svg>
                          Stop
                        </button>
                      ) : (
                        <button
                          onClick={() => speakMessage(message)}
                          className="touch-manipulation flex items-center gap-1.5 text-green-300 hover:text-green-200 active:scale-95 transition-transform text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                          </svg>
                          Speak
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Bar - WhatsApp style at bottom */}
      <div className="bg-[#1f2c34] px-3 py-2">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-[#2a3942] rounded-lg px-3 py-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type or paste message..."
              rows={1}
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-base max-h-32"
            />
          </div>
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className="touch-manipulation bg-[#00a884] text-white p-3 rounded-full disabled:bg-gray-600 disabled:opacity-50 active:scale-95 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
