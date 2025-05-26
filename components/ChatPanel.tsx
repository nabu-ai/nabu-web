"use client";

import { useMeetingStore } from "@/store/useMeetingStore";
import { sendChatMessage, connectWebSocket, onChat } from '@/services/websocket';

import { SendHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatPanel({ uid, room }: { uid: string, room: string }) {
  const isChatOpen = useMeetingStore((s) => s.isChatOpen);
  const messages = useMeetingStore((s) => s.messages);
  const sendMessage = useMeetingStore((s) => s.sendMessage);

  const [input, setInput] = useState("");

  useEffect(() => {
    const unsub = onChat((uid, text) => {
      useMeetingStore.getState().sendMessage(uid, text);
    });
    return unsub;
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(uid, input.trim());
    sendMessage(uid, input.trim());
    setInput("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!isChatOpen) return null;

  return (
    <div className="w-1/4 flex flex-col rounded-xl bg-white text-black shadow-lg  border-l m-4 ml-0">
      {/* Chat Header */}
      <div className="p-4 text-lg font-bold border-b">Chat Messages</div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="text-sm text-gray-500 flex  w-full max-w-xs gap-4">
              <span>
                <b>{msg.uid === uid ? "You" : msg.uid}</b>
              </span>
              <span>{msg.time}</span>
            </div>
            <div className="p-2 pl-0 rounded-lg text-sm">{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 flex">
        <div className="flex items-center p-2 border border-gray-300 rounded-full  w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Detect Enter key press
            className="flex-1 p-2 outline-none bg-transparent"
            placeholder="Type a message..."
          />
          <button
            className="p-2 text-gray-500 hover:text-blue-500"
            onClick={handleSend}
          >
            <SendHorizontalIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
