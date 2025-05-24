"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import {
  awsStreamingLanguages,
  ibmStreamingLanguages,
} from "@/constants/languages";

export default function LobbyPage() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");
  const [room, setRoom] = useState("nabu");
  const router = useRouter();
  const languagesMap = { ...awsStreamingLanguages, ...ibmStreamingLanguages };
  const handleJoin = () => {
    if (!name.trim()) return alert("Please enter your name");
    if (!language) return alert("Please select a language");
    if (!room.trim()) return alert("Please enter a room name");

    router.push(
      `/meeting?name=${encodeURIComponent(name)}&lang=${language}&room=${room}`
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Join a Meeting</h1>
          <p className="text-gray-500 text-sm">
            Enter details to join the meeting
          </p>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="h-16 w-full px-4 py-2 border border-black rounded-xl focus:outline-none focus:ring focus:border-blue-500 text-lg"
        />
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none h-16 w-full px-4 py-2 border border-black rounded-xl focus:outline-none focus:ring focus:border-blue-500 text-lg"
          >
            {Object.keys(languagesMap).map((languageCode) => (
              <option key={languageCode} value={languageCode}>
                {languagesMap[languageCode]} {/* Display the language name */}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-black">
            <ChevronDownIcon />
          </div>
        </div>

        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room name"
          className="h-16  w-full px-4 py-2 border border-black rounded-xl  focus:outline-none focus:ring focus:border-blue-500 text-lg"
        />

        <button
          onClick={handleJoin}
          className="h-16 w-full py-2 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}
