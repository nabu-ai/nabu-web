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
import { onRaiseHand, sendRaiseHand, onMute, sendMute, onTranscript, sendTranscript, onHostLeft, onParticipantLeft, sendHostLeft } from "@/services/websocket";
import { NABU_SERVER_HOST } from "@/constants/consts";
import { useEndMeeting } from "@/hooks/useEndMeeting";
import { useUserStore } from "@/store/useUserStore";
import { useLeaveMeeting } from "@/hooks/useLeaveMeeting";
import { toast } from "sonner";

const { processMicrophone, stopMicrophoneRecording, terminateStreaming } = nabuTranslator;

export default function ControlBar({ uid, roomName }: { uid: string; roomName: string }) {
  const { raiseHand, muteUser } = useMeetingStore();

  const meetingInfo = useMeetingStore((s) => s.meetingInfo);
  const userData = useUserStore((s) => s.userData);
  const userLoginData = useUserStore((s) => s.loginData);

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
  const [trialDuration, setTrialDuration] = useState(useMeetingStore((s) => s.trialDuration))
  const [isMuteProcessing, setIsMuteProcessing] = useState(true);
  const { isPending, mutate: handleEndMeeting, isSuccess, data } = useEndMeeting();
  const {
    isPending: isGuestPending,
    mutate: handleLeaveMeeting,
    isSuccess: isGuestSuccess,
    data: guestData,
  } = useLeaveMeeting();

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;

      //setTrialDuration(useMeetingStore((s) => s.trialDuration))

      if (muted) {
        muteUser(uid);
        console.log(`[NABU] Muting user, ${uid} by default`);
        sendMute(uid, true);
      }
    }

    const unsubRaise = onRaiseHand((uid, raised) => {
      useMeetingStore.getState().setHandState(uid, raised);
    });

    const unsubMute = onMute((uid, mute) => {
      useMeetingStore.getState().setMuteState(uid, mute);
    });

     const unsubHostLeft = onHostLeft((uid) => {
      console.log("HOST LEFT::::", uid)
      handleLeave()
    });

    return () => {
      unsubRaise();
      unsubMute();
      unsubHostLeft();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
      setTrialDuration((prev) => prev + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trialDuration === 600) {
      toast.warning("You have completed your free trial minutes. Please upgrade the account to continue")
      handleLeave();
    }
  }, [trialDuration]);

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
    store.setActiveSpeaker(uid);
    console.log("Data response::", data);
    if (data?.transcript) {
      // Call BE to submit, transcript, sourceLanguage and audioHeardas
      sendTranscript(uid, data.transcript, meetingInfo.language, meetingInfo.gender);
      addTranscript(uid, data.transcript, meetingInfo.language, meetingInfo.gender);
    }
  };

  const onConnectedToStreaming = () => {
    console.log("[NABU] Connected callback");
    setIsMuteProcessing(false);
  };

  const onAudioError = () => {};

  const onAudioRecordingStopped = () => {
    console.log("microphone stopped");
  };

  const handleMute = () => {
    //toggleMute();
    if (isMuted) {
      setIsMuteProcessing(true);
      const output = "transcriptOnly";
      const options = {
        sourceLanguage: meetingInfo.language,
        targetLanguage: null,
        audioHeardAs: meetingInfo.gender,
        output,
        accessToken: userLoginData.accessToken,
        onProcessed: onAudioProcessed,
        onError: onAudioError,
        onConnected: onConnectedToStreaming,
      };
      processMicrophone(options);
    } else {
      setIsMuteProcessing(false);
      stopMicrophoneRecording({ onStopped: onAudioRecordingStopped });
    }
    muteUser(uid);
    sendMute(uid, !isMuted);
  };

  const handleLeave = async () => {
    setIsMuteProcessing(false);
    stopMicrophoneRecording({ onStopped: onAudioRecordingStopped });
    terminateStreaming(meetingInfo.language);
    userData?.id ? await endMeeting() : await leaveMeeting();

    window.location.href = userData?.id ? "/nabu-web/dashboard" : "/nabu-web";
  };

  const endMeeting = async () => {
    sendHostLeft(uid)
    handleEndMeeting({ meetingId: meetingInfo.meetingId, duration });
  };

  const leaveMeeting = async () => {
    handleLeaveMeeting({ meetingId: meetingInfo.meetingId, duration, participantId: meetingInfo.participants?.[0].id });
    useMeetingStore.setState(useMeetingStore.getInitialState())
  };

  return (
    <div className="fixed top-1/2 right-4 z-50 flex -translate-y-1/2 transform flex-col items-center space-y-4 text-white">
      {/* Room name (at top of control bar) */}
      <div className="text-theme-xl mb-6 font-semibold text-gray-300">{roomName}</div>

      {/* Mic */}
      {!meetingInfo.nonVerbal && (
        <button
          title={isMuted ? "Unmute" : "Mute"}
          onClick={handleMute}
          className={`rounded-full p-3 text-white hover:bg-gray-600 ${
            isMuted ? "bg-red-600" : isMuteProcessing ? "bg-gray-700" : "bg-green-700"
          }`}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </button>
      )}

      {/* Video */}
      <button
        title={videoEnabled ? "Video On" : "Video Off"}
        onClick={toggleVideo}
        className={`rounded-full p-3 text-white hover:bg-gray-600 ${videoEnabled ? "bg-green-700" : "bg-red-600"}`}
      >
        {videoEnabled ? <VideoIcon /> : <VideoOffIcon />}
      </button>

      {/* Raise Hand */}
      <button
        title={isRaised ? "Put hand down" : "Raise Hand"}
        onClick={handleRaiseHand}
        className={`rounded-full p-3 text-white hover:bg-gray-600 ${isRaised ? "bg-yellow-600" : "bg-gray-700"}`}
      >
        <HandIcon />
      </button>

      {/* More Options */}
      {/* <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white">
        <EllipsisVerticalIcon />
      </button> */}

      {/* Leave */}
      <button title="Leave" onClick={handleLeave} className="rounded-full bg-red-600 p-3 text-white hover:bg-red-500">
        <PhoneOffIcon />
      </button>

      {/* Divider */}
      <div className="my-4 w-8 border-t border-gray-500" />

      {/* Chat */}
      <button onClick={toggleChat} title="Chat" className="rounded-full bg-gray-700 p-3 text-white hover:bg-gray-600">
        <MessageCircleMoreIcon />
      </button>

      {/* A */}
      <button
        onClick={toggleTranscript}
        title="Transcripts"
        className="rounded-full bg-gray-700 p-3 text-white hover:bg-gray-600"
      >
        <MessageSquareTextIcon />
      </button>

      {/* Participants */}
      <button
        onClick={toggleParticipants}
        title="Participants"
        className="rounded-full bg-gray-700 p-3 text-white hover:bg-gray-600"
      >
        <UsersIcon />
      </button>

      {/* Room name (at top of control bar) */}
      <div className="text-theme-xl mt-auto pt-6 text-gray-400">{formatDuration(duration)}</div>
    </div>
  );
}
