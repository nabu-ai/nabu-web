"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import {
  awsStreamingLanguages,
  ibmStreamingLanguages,
} from "@/constants/languages";
import { getVoiceFromLanguageCode } from "@/constants/voiceMap";
import { useMeetingStore } from "@/store/useMeetingStore";

export default function LobbyPage() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [room, setRoom] = useState("nabu");
  const [hasMaleVoice, setHasMaleVoice] = useState(false);
  const [hasFemaleVoice, setHasFemaleVoice] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");
  const router = useRouter();
  const languagesMap = {
    ...{ "": "Preferred Language" },
    ...awsStreamingLanguages,
    ...ibmStreamingLanguages,
  };
  const meetingInfo = useMeetingStore.getState().meetingInfo;

  const handleJoin = () => {
    if (!name.trim()) return alert("Please enter your name");
    if (!language) return alert("Please select a language");
    if (!room.trim()) return alert("Please enter a room name");
    if (!selectedVoice.trim()) return alert("Please select a voice option");

    alert(selectedVoice.trim())

    useMeetingStore.setState({
      meetingInfo: {
        ...meetingInfo,
        name,
        language,
        room,
        gender: selectedVoice
      }
    });

    router.push(
      `/meeting`
    );
  };

  useEffect(() => {
    const voices = getVoiceFromLanguageCode(language);
    setHasMaleVoice(voices?.male);
    setHasFemaleVoice(voices?.female);
    console.log(voices);
  }, [language]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Nabu Meeting</h1>
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
        {language && (
          <div>
            <div className="text-black text-xl mb-2">Want to be heard as</div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 text-xl">
                <input
                  disabled={!hasMaleVoice}
                  onClick={() => setSelectedVoice('male')}
                  type="radio"
                  className="w-6 h-6 text-blue-500 focus:ring-blue-500"
                  name="option"
                  value="male"
                />
                <span>He</span>
              </label>

              <label className="flex items-center space-x-2 text-xl">
                <input
                  disabled={!hasFemaleVoice}
                  onClick={() => setSelectedVoice('female')}
                  type="radio"
                  className="w-6 h-6 text-red-500 focus:ring-red-500"
                  name="option"
                  value="female"
                />
                <span>She</span>
              </label>
            </div>

            <div className="text-red-500">
              {hasMaleVoice && !hasFemaleVoice && "Only male voice available"}
              {hasFemaleVoice && !hasMaleVoice && "Only female voice available"}
            </div>
          </div>
        )}

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
