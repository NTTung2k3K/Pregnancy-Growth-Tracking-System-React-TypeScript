import React, { useState } from "react";
import ChatbotComponentChild from "./ChatbotComponentChild";

const ChatbotChild: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      {/* Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-sky-900 text-emerald-400 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg hover:bg-sky-900 transition"
      >
        {isOpen ? "Close Chat" : "Open Chat"}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-20">
          <ChatbotComponentChild />
        </div>
      )}
    </div>
  );
};

export default ChatbotChild;
