import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatbotComponent from "./ChatbotComponent";

const ChatbotToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-10">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-sky-800 text-emerald-400 px-4 py-4 rounded-full shadow-lg hover:bg-sky-900 transition"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-20">
          <ChatbotComponent />
        </div>
      )}
    </div>
  );
};

export default ChatbotToggle;
