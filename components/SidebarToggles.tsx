'use client';

import { useMeetingStore } from '@/store/useMeetingStore';

export default function SidebarToggles() {
  const toggleChat = useMeetingStore((s) => s.toggleChat);
  const toggleParticipants = useMeetingStore((s) => s.toggleParticipants);

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <button onClick={toggleParticipants} className="bg-gray-800 text-white px-3 py-1 rounded-md">
        👥
      </button>
      <button onClick={toggleChat} className="bg-gray-800 text-white px-3 py-1 rounded-md">
        💬
      </button>
    </div>
  );
}
