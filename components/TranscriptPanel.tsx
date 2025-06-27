"use client";

const nabuTranslator = require("nabu-translator/src");

import { useMeetingStore } from "@/store/useMeetingStore";
import {
  sendChatMessage,
  onTranscript,
  sendTranscript,
} from "@/services/websocket";
import { useEffect, useRef, useState } from "react";
import { AudioQueue } from "@/utils/AudioQueue";
import { SendHorizontalIcon, XIcon } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function TranscriptPanel({ uid }: { uid: string }) {
  const isTranscriptOpen = useMeetingStore((s) => s.isTranscriptOpen);
  const transcripts = useMeetingStore((s) => s.transcripts);
  const meetingInfo = useMeetingStore((s) => s.meetingInfo);
  const addTranscript = useMeetingStore((s) => s.addTranscript);
  const isMuted = useMeetingStore((s) => s.mutedUsers[uid]);
  const transcriptsWindowRef = useRef(null); // Reference to scroll the transcripts window
  const userLoginData = useUserStore((s) => s.loginData);

  const audioQueue = new AudioQueue();
  const toggleTranscript = useMeetingStore((s) => s.toggleTranscript);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (transcriptsWindowRef.current) {
      transcriptsWindowRef.current.scrollTop = transcriptsWindowRef.current.scrollHeight;
    }

    const unsub = onTranscript(
      (uid, transcript, sourceLanguage, audioHeardAs) => {
        if (meetingInfo.hearingImpaired) {
          const { translate } = nabuTranslator;
          const trOptions = {
            text: transcript,
            sourceLanguage,
            targetLanguage: meetingInfo.language,
            accessToken: userLoginData.accessToken,
            onProcessed: (data) => {
              const { translation } = data;
              useMeetingStore
                .getState()
                .addTranscript(
                  uid,
                  translation,
                  meetingInfo.language,
                  meetingInfo.gender
                );
            },
            onError: (err) => {
              console.log("Error:::", err);
            },
          };
          translate(trOptions);
        } else {
          const { generateTranslationAudio } = nabuTranslator;
          const audioOptions = {
            text: transcript,
            sourceLanguage,
            targetLanguage: meetingInfo.language,
            audioHeardAs,
            accessToken: userLoginData.accessToken,
            onTranslated: (data) => {
              const { translation } = data;
              useMeetingStore
                .getState()
                .addTranscript(
                  uid,
                  translation,
                  meetingInfo.language,
                  meetingInfo.gender
                );
            },
            onProcessed: (data) => {
              const { audio } = data;
              if (audio) {
                console.log(
                  "Audio received on:::",
                  new Date().toLocaleTimeString()
                );
                const audioElement = new Audio(URL.createObjectURL(audio));
                //audioElement.play();
                audioQueue.enqueue(audioElement);
              }
            },
            onError: (data) => {
              console.log("Error:::", data);
            },
          };
          //console.log("receiver options:::", options)

          generateTranslationAudio(audioOptions);
        }
      }
    );
    return unsub;
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendTranscript(uid, input.trim(), meetingInfo.language, meetingInfo.gender);
    addTranscript(uid, input.trim(), meetingInfo.language, meetingInfo.gender);
    setInput("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (transcriptsWindowRef.current) {
      transcriptsWindowRef.current.scrollTop = transcriptsWindowRef.current.scrollHeight;
    }
  }, [transcripts, isTranscriptOpen])

  if (!isTranscriptOpen) return null;

  return (
    <div className="w-1/4 flex flex-col rounded-xl bg-white text-black shadow-lg  border-l m-4 ml-0">
      {/* Transcript Header */}

      <div className="flex justify-between font-bold border-b">
        <div className="p-4 text-lg ">Transcripts</div>
        <div className="p-4">
          <button
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-theme-xl w-8 h-8 inline-flex justify-center items-center"
            onClick={() => toggleTranscript()}
          >
            <XIcon />
          </button>
        </div>
      </div>

      <div></div>
      {/* Transcript Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2"  ref={transcriptsWindowRef}>
        {transcripts.map((transcript, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="text-theme-sm text-gray-500 flex  w-full max-w-xs gap-4">
              <span>
                <b>{transcript.uid === uid ? "You" : transcript.uid}</b>
              </span>
              <span>{transcript.time}</span>
            </div>
            <div className="p-2 pl-0 rounded-lg text-theme-sm">
              {transcript.transcript}
            </div>
          </div>
        ))}
      </div>
      {/* Transcript Input */}
      {isMuted && (
        <div className="p-4 flex">
          <div className="flex items-center p-2 border border-gray-300 rounded-full  w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Detect Enter key press
              className="flex-1 p-2 outline-none bg-transparent"
              placeholder="Type transcript..."
            />
            <button
              className="p-2 text-gray-500 hover:text-blue-500"
              onClick={handleSend}
            >
              <SendHorizontalIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
