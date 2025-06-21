"use client";

const nabuTranslator = require("nabu-translator/src");

import { useMeetingStore } from "@/store/useMeetingStore";
import {
  HandIcon,
  MessageCircleMoreIcon,
  MessageSquareTextIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  UsersIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  onRaiseHand,
  sendRaiseHand,
  onMute,
  sendMute,
  onTranscript,
  sendTranscript,
} from "@/services/websocket";

const { processMicrophone, stopMicrophoneRecording, terminateStreaming } = nabuTranslator;

export default function ControlBar({
  uid,
  roomName,
}: {
  uid: string;
  roomName: string;
}) {
  const { raiseHand, muteUser } = useMeetingStore();

  const meetingInfo = useMeetingStore((s) => s.meetingInfo);

  const isRaised = useMeetingStore((s) => s.raisedHands[uid]);
  const isMuted = useMeetingStore((s) => s.mutedUsers[uid]);

  const muted = useMeetingStore((s) => s.muted);
  const toggleMute = useMeetingStore((s) => s.toggleMute);

  const videoEnabled = useMeetingStore((s) => s.videoEnabled);
  const toggleVideo = useMeetingStore((s) => s.toggleVideo);
  const toggleChat = useMeetingStore((s) => s.toggleChat);
  const toggleTranscript = useMeetingStore((s) => s.toggleTranscript);
  const toggleParticipants = useMeetingStore((s) => s.toggleParticipants);
  const addTranscript = useMeetingStore((s) => s.addTranscript);

  const hasInitialized = useRef(false);
  const [duration, setDuration] = useState(0);
  const [isMuteProcessing, setIsMuteProcessing] = useState(true)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;

      if (muted) {
        muteUser(uid);
        console.log(`[NABU] Muting user, ${uid} by default`)
        sendMute(uid, true);
      }
    }

    const unsubRaise = onRaiseHand((uid, raised) => {
      useMeetingStore.getState().setHandState(uid, raised);
    });

    const unsubMute = onMute((uid, mute) => {
      useMeetingStore.getState().setMuteState(uid, mute);
    });

    return () => {
      unsubRaise();
      unsubMute();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleRaiseHand = () => {
    raiseHand(uid);
    sendRaiseHand(uid, !isRaised);
  };

  const onAudioProcessed = (data) => {
    const store = useMeetingStore.getState();
    store.setActiveSpeaker(uid)
    console.log("Data response::", data);
    if (data?.transcript) {
      // Call BE to submit, transcript, sourceLanguage and audioHeardas
      sendTranscript(
        uid,
        data.transcript,
        meetingInfo.language,
        meetingInfo.gender
      );
      addTranscript(
        uid,
        data.transcript,
        meetingInfo.language,
        meetingInfo.gender
      );
    }
  };

  const onConnectedToStreaming = () => {
    console.log("[NABU] Connected callback")
    setIsMuteProcessing(false)
  }

  const onAudioError = () => {};

  const onAudioRecordingStopped = () => {
    console.log("microphone stopped");
  };

  const handleMute = () => {
    
    //toggleMute();
    if (isMuted) {
      setIsMuteProcessing(true)
      const output = "transcriptOnly";
      const options = {
        sourceLanguage: meetingInfo.language,
        targetLanguage: null,
        audioHeardAs: meetingInfo.gender,
        output,
        onProcessed: onAudioProcessed,
        onError: onAudioError,
        onConnected: onConnectedToStreaming
      };
      processMicrophone(options);
    } else {
      setIsMuteProcessing(false)
      stopMicrophoneRecording({ onStopped: onAudioRecordingStopped });
    }
    muteUser(uid);
    sendMute(uid, !isMuted);
  };

  const handleLeave = () => {
    setIsMuteProcessing(false)
    stopMicrophoneRecording({ onStopped: onAudioRecordingStopped });
    terminateStreaming();
    window.location.href = "/nabu-web/lobby";
  };

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 z-50 text-white">
      {/* Room name (at top of control bar) */}
      <div className="mb-6 text-theme-xl font-semibold text-gray-300">{roomName}</div>

      {/* Mic */}
      { !meetingInfo.nonVerbal && (<button
        title={isMuted ? "Unmute" : "Mute"}
        onClick={handleMute}
        className={`p-3 hover:bg-gray-600 rounded-full text-white ${
          isMuted ? "bg-red-600" : (isMuteProcessing?"bg-gray-700":"bg-green-700")
        }`}
      >
        {isMuted ? <MicOffIcon /> : <MicIcon />}
      </button>
      )}

      {/* Video */}
      <button
        title={videoEnabled ? "Video On" : "Video Off"}
        onClick={toggleVideo}
        className={`p-3 hover:bg-gray-600 rounded-full text-white ${
          videoEnabled ? "bg-green-700" : "bg-red-600"
        }`}
      >
        {videoEnabled ? <VideoIcon /> : <VideoOffIcon />}
      </button>

      {/* Raise Hand */}
      <button
        title={isRaised ? "Put hand down" : "Raise Hand"}
        onClick={handleRaiseHand}
        className={`p-3 hover:bg-gray-600 rounded-full text-white ${
          isRaised ? "bg-yellow-600" : "bg-gray-700"
        }`}
      >
        <HandIcon />
      </button>

      {/* More Options */}
      {/* <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white">
        <EllipsisVerticalIcon />
      </button> */}

      {/* Leave */}
      <button
        title="Leave"
        onClick={handleLeave}
        className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white"
      >
        <PhoneOffIcon />
      </button>

      {/* Divider */}
      <div className="border-t border-gray-500 w-8 my-4" />

      {/* Chat */}
      <button
        onClick={toggleChat}
        title="Chat"
        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
      >
        <MessageCircleMoreIcon />
      </button>

      {/* A */}
      <button
        onClick={toggleTranscript}
        title="Transcripts"
        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
      >
        <MessageSquareTextIcon />
      </button>

      {/* Participants */}
      <button
        onClick={toggleParticipants}
        title="Participants"
        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
      >
        <UsersIcon />
      </button>

      {/* Room name (at top of control bar) */}
      <div className="mt-auto text-theme-xl text-gray-400 pt-6">
        {formatDuration(duration)}
      </div>
    </div>
  );
}
