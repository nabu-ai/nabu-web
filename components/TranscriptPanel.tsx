'use client';

import { useMeetingStore } from '@/store/useMeetingStore';
import { useState } from 'react';

export default function TranscriptPanel({ uid }: { uid: string}) {
  const isTranscriptOpen = useMeetingStore((s) => s.isTranscriptOpen);
  const transcripts = useMeetingStore((s) => s.messages);


  if (!isTranscriptOpen) return null;

  return (
     <div className="w-1/4 flex flex-col rounded-xl bg-white text-black shadow-lg  border-l m-4">
      {/* Chat Header */}
      <div className="p-4 text-lg font-bold border-b">Transcripts</div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {transcripts.map((transcript, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="text-xs text-gray-500 flex  w-full max-w-xs gap-4">
              <span>
                <b>{transcript.uid === uid ? "You" : transcript.uid}</b>
              </span>
              <span>{transcript.time}</span>
            </div>
            <div className="max-w-xs p-2 rounded-lg text-xs">{transcript.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
