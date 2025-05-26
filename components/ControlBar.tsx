"use client";

import { useMeetingStore } from "@/store/useMeetingStore";
import {
  EllipsisVerticalIcon,
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
import { useEffect, useRef } from "react";
import { onRaiseHand, sendRaiseHand, onMute, sendMute } from '@/services/websocket';

export default function ControlBar({
  uid,
  roomName,
}: {
  uid: string;
  roomName: string;
}) {
  const { raiseHand, muteUser } = useMeetingStore();

  const isRaised = useMeetingStore((s) => s.raisedHands[uid]);
  const isMuted = useMeetingStore((s) => s.mutedUsers[uid]);

  const muted = useMeetingStore((s) => s.muted);
  const toggleMute = useMeetingStore((s) => s.toggleMute);

  const videoEnabled = useMeetingStore((s) => s.videoEnabled);
  const toggleVideo = useMeetingStore((s) => s.toggleVideo);
  const toggleChat = useMeetingStore((s) => s.toggleChat);
  const toggleTranscript = useMeetingStore((s) => s.toggleTranscript);
  const toggleParticipants = useMeetingStore((s) => s.toggleParticipants);

   const hasInitialized = useRef(false);

  useEffect(() => {

    if (!hasInitialized.current) {
      hasInitialized.current = true;

      if (muted) {
        muteUser(uid);
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


    const handleRaiseHand = () => {
      raiseHand(uid);
      sendRaiseHand(uid, !isRaised);
    };

    const handleMute = () => {
      //toggleMute();
      muteUser(uid);
      sendMute(uid, !isMuted);
    };

    const handleLeave = () => {
      window.location.href = "/lobby";
    };



  return (
    <div className="fixed bottom-4 w-full flex justify-between items-center px-8 text-white">
      {/* Left Group */}
      <div className="flex space-x-4">{roomName}</div>

      {/* Center Group */}
      <div className="flex space-x-4">
        <button
          title={isMuted ? "Unmute" : "Mute"}
          onClick={handleMute}
          className={`p-3  hover:bg-gray-600 rounded-full text-white" ${
            isMuted ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </button>

        <button
          title={videoEnabled ? "Video On" : "Video Off"}
          onClick={toggleVideo}
          className={`p-3  hover:bg-gray-600 rounded-full text-white" ${
            videoEnabled ? "bg-gray-700" : "bg-red-600"
          }`}
        >
          {videoEnabled ? <VideoIcon /> : <VideoOffIcon />}
        </button>
        <button
          title={isRaised ? "Put hand down" : "Raise Hand"}
          onClick={() => handleRaiseHand()}
          className={`p-3  hover:bg-gray-600 rounded-full text-white" ${
            isRaised ? "bg-yellow-600" : "bg-gray-700"
          }`}
        >
          {isRaised ? <HandIcon /> : <HandIcon />}
        </button>
        <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white">
          <EllipsisVerticalIcon />
        </button>
        <button
          title="Leave"
          onClick={() => handleLeave()}
          className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white"
        >
          <PhoneOffIcon />
        </button>
      </div>

      {/* Right Group */}
      <div className="flex space-x-4">
        <button
          onClick={toggleChat}
          title="Chat"
          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
        >
          <MessageCircleMoreIcon />
        </button>
        <button
          onClick={toggleTranscript}
          title="Transcript"
          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
        >
          <MessageSquareTextIcon />
        </button>
        <button
          onClick={toggleParticipants}
          title="Participants"
          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
        >
          <UsersIcon />
        </button>
      </div>
    </div>
  );
}
