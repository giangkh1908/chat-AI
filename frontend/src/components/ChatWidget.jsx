import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatAi from "./ChatAi"; 

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {open ? (
        <div className="w-[380px] h-[70vh] max-h-[80vh] bg-white shadow-2xl rounded-2xl flex flex-col">
          {/* Header với nút đóng */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white">
            <span className="font-semibold">AI Assistant</span>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat */}
          <div className="flex-1 min-h-0">
            <ChatAi /> 
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
