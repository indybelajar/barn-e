'use client';
import ChatBot from '../../components/ChatBot';
import Navbar from '../../components/Navbar';
const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
      <ChatBot />
    </div>
  );
};

export default ChatPage;