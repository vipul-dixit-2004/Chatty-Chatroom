'use client'
import { useEffect, useState } from "react";
import { sendMessageToRoom } from "@/utils/sendMessage";
import useRoomMessages from "@/hooks/useRoomMessages";
import { useParams } from "next/navigation";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  
  const {roomId} = useParams();
  const messages = useRoomMessages(roomId);
  console.log(typeof roomId,roomId)

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessageToRoom(roomId, message, "Vipul");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900 text-white rounded-xl shadow-lg max-w-md mx-auto">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.sender === 'Vipul' ? 'bg-blue-600 text-white self-end' : 'bg-gray-700 text-white'
            }`}
          >
            <strong className="block">{msg.sender}</strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
  
      {/* Input & Send */}
      <div className="flex items-center gap-2">
        <form>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
        >
          Send
        </button>
        </form>
      </div>
    </div>
  );
  
}

