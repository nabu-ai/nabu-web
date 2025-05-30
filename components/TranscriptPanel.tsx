"use client";

const nabuTranslator = require("nabu-translator/src");

import { useMeetingStore } from '@/store/useMeetingStore';
import { sendChatMessage, onTranscript } from '@/services/websocket';
import { useEffect, useState } from 'react';
import { AudioQueue } from "@/utils/AudioQueue";
import { XIcon } from "lucide-react";

export default function TranscriptPanel({ uid }: { uid: string }) {
  const isTranscriptOpen = useMeetingStore((s) => s.isTranscriptOpen);
  const transcripts = useMeetingStore((s) => s.transcripts);
  const meetingInfo = useMeetingStore((s) => s.meetingInfo);

  const audioQueue = new AudioQueue();
  const toggleTranscript = useMeetingStore((s) => s.toggleTranscript);
  

  useEffect(() => {
    const {generateTranslationAudio} = nabuTranslator
    const unsub = onTranscript((uid, transcript, sourceLanguage, audioHeardAs) => {
      const options = {
        text: transcript,
        sourceLanguage,
        targetLanguage: meetingInfo.language,
        audioHeardAs,
        onTranslated: (data) => {
          const {translation} = data
          useMeetingStore.getState().addTranscript(uid, translation, meetingInfo.language, meetingInfo.gender);
        },
        onProcessed:(data)=>{
          const {audio} = data
          if(audio){
            console.log("Audio received on:::", new Date().toLocaleTimeString())
            const audioElement = new Audio(URL.createObjectURL(audio));
            //audioElement.play();
            audioQueue.enqueue(audioElement);
          }
        }, 
        onError: (data) => {
          console.log("Error:::", data)
        }
      }
      console.log("receiver options:::", options)

       generateTranslationAudio(options)
       
       
      //  const trOptions = {
      //   text: transcript,
      //   sourceLanguage,
      //   targetLanguage: meetingInfo.language,
      //   onProcessed: (data) =>{
      //     const {translation} = data
      //     useMeetingStore.getState().addTranscript(uid, translation, meetingInfo.language, meetingInfo.gender);
      //   }, 
      //   onError: () => {

        //   }
        // }
        // translate(trOptions)
      }
    );
    return unsub;
  }, []);

  if (!isTranscriptOpen) return null;

  return (
    <div className="w-1/4 flex flex-col rounded-xl bg-white text-black shadow-lg  border-l m-4 ml-0">
      {/* Transcript Header */}

      <div className="flex justify-between font-bold border-b">
        <div className="p-4 text-lg ">Transcripts</div>
        <div className="p-4">
          <button
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            onClick={() => toggleTranscript()}
          >
            <XIcon />
          </button>
        </div>
      </div>

      <div></div>
      {/* Transcript Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {transcripts.map((transcript, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="text-xs text-gray-500 flex  w-full max-w-xs gap-4">
              <span>
                <b>{transcript.uid === uid ? "You" : transcript.uid}</b>
              </span>
              <span>{transcript.time}</span>
            </div>
            <div className="p-2 pl-0 rounded-lg text-xs">
              {transcript.transcript}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
