'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LobbyPage() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [room, setRoom] = useState('nabu-test');
  const router = useRouter();

  const handleJoin = () => {
    if (!name.trim()) return alert('Please enter your name');
    if (!language) return alert('Please select a language');
    if (!room.trim()) return alert('Please enter a room name');

    router.push(`/meeting?name=${encodeURIComponent(name)}&lang=${language}&room=${room}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Join a Meeting</h1>
          <p className="text-gray-500 text-sm">Enter details to join the meeting</p>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-500"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="">Select Language</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="kn">Kannada</option>
        </select>

        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room name"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-500"
        />

        <button
          onClick={handleJoin}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}
