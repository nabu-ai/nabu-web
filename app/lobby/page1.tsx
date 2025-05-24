'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const languages = [
  { label: 'Select Language', value: '' },
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Gujarati', value: 'gu' },
];

export default function LobbyPage() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (camOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error('Camera error:', err);
          setStream(null);
        });
    } else {
      if (videoRef.current) videoRef.current.srcObject = null;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [camOn]);

  const handleJoin = () => {
    if (!name.trim()) return alert('Please enter your name');
    if (!language) return alert('Please select a language');
    router.push(`/meeting?name=${encodeURIComponent(name)}&micOn=${micOn}&camOn=${camOn}&lang=${language}`);
  };

  return (
    <div className="w-full px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 w-full max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Join a Meeting</h1>
          <p className="text-gray-500 text-sm">Enter your name and configure your devices</p>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
          {camOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold bg-gray-800">
              Camera Off
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              micOn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {micOn ? 'Mic On' : 'Mic Off'}
          </button>
          <button
            onClick={() => setCamOn(!camOn)}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              camOn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {camOn ? 'Cam On' : 'Cam Off'}
          </button>
        </div>

        <button
          onClick={handleJoin}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}
