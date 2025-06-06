"use client";

const nabuTranslator = require("nabu-translator/src");

import { useMeetingStore } from "@/store/useMeetingStore";
import { sendChatMessage, onChat } from '@/services/websocket';

import { SendHorizontalIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatPanel({ uid, room }: { uid: string, room: string }) {
  const isChatOpen = useMeetingStore((s) => s.isChatOpen);
  const messages = useMeetingStore((s) => s.messages);
  const addMessage = useMeetingStore((s) => s.addMessage);
  const toggleChat = useMeetingStore((s) => s.toggleChat);
  const meetingInfo = useMeetingStore((s) => s.meetingInfo);
  const chatWindowRef = useRef(null); // Reference to scroll the chat window

  const [input, setInput] = useState("");

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
    const {translate} = nabuTranslator
    const unsub = onChat((uid, text, sourceLanguage) => {
      const options = {
        text,
        sourceLanguage,
        targetLanguage: meetingInfo.language,
        onProcessed: (data) => {
          const {translation} = data
          useMeetingStore.getState().addMessage(uid, translation, meetingInfo.language);
        },
        onError: (data) => {
          console.log("Error:::", data)
        }
      }
      translate(options)
     
    });
    return unsub;
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(uid, input.trim(), meetingInfo.language);
    addMessage(uid, input.trim(), meetingInfo.language);
    setInput("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isChatOpen])

  if (!isChatOpen) return null;
  return (
    <div className="w-1/4 flex flex-col rounded-xl bg-white text-black shadow-lg  border-l m-4 ml-0">
      {/* Chat Header */}
      <div className="flex justify-between font-bold border-b">
        <div className="p-4 text-lg ">Chat Messages</div>
        <div className="p-4">
          <button
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            onClick={()=>toggleChat()}
          >
            <XIcon />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2"  ref={chatWindowRef}>
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
