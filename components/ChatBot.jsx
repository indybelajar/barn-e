'use client';
import { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya adalah Barney AI. Ada yang bisa saya bantu?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Update frontend messages with user's input immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Create the messages array for the API request
      // It's good practice to send the full conversation history to the AI
      // so it has context. Filter out the timestamp for the API.
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // IMPORTANT: Send the 'messages' array
        body: JSON.stringify({ messages: apiMessages }), // <--- Changed here: `messages` array
      });

      const data = await response.json();

      if (response.ok && data.success) { // Check both HTTP status and custom success flag
        const aiMessage = {
          role: 'assistant',
          content: data.response, // Assuming backend now sends 'response' not 'reply'
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle backend errors or non-ok HTTP responses
        const errorMessage = {
          role: 'assistant',
          content: `Error: ${data.message || data.error?.message || 'Unknown error occurred.'}`, // More robust error message
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Frontend fetch error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang di Barney AI</h1>
        <p className="text-gray-600">Ayo Tanyakan Kesulitanmu!</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                message.role === 'user'
                  ? 'bg-[#F95959] text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F95959]"></div>
                <span className="text-sm">AI sedang mengetik...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F95959] focus:border-transparent resize-none"
            rows="1"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-[#F95959] hover:bg-black disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Kirim...' : 'Kirim'}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Tekan Enter untuk kirim, Shift+Enter untuk baris baru</span>
          <span>{input.length}/1000 karakter</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;