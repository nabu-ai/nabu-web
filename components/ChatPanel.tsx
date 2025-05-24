'use client';

import { useMeetingStore } from '@/store/useMeetingStore';
import { useState } from 'react';

export default function ChatPanel({ uid }: { uid: string}) {
  const isChatOpen = useMeetingStore((s) => s.isChatOpen);
  const messages = useMeetingStore((s) => s.messages);
  const sendMessage = useMeetingStore((s) => s.sendMessage);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(uid, input.trim());
    setInput('');
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white text-black shadow-lg z-40 flex flex-col border-l">
      <div className="flex-none p-4 border-b font-semibold">Chat</div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className="text-sm">
            <strong>{m.uid === uid ? 'You' : m.uid}</strong>: {m.text}
            <div className="text-xs text-gray-400">{m.time}</div>
          </div>
        ))}
      </div>
      <div className="flex-none p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-2 py-1 border rounded"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
