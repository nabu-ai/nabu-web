"use client";

import { create } from "zustand";

interface MeetingState {
  muted: boolean;
  videoEnabled: boolean;
  raisedHands: Record<string, boolean>;
  activeSpeakerUid: string | null;
  toggleMute: () => void;
  toggleVideo: () => void;
  raiseHand: (uid: string) => void;
  setActiveSpeaker: (uid: string) => void;

  isChatOpen: boolean;
  isTranscriptOpen: boolean;
  isParticipantsOpen: boolean;
  toggleChat: () => void;
  toggleTranscript: () => void;
  toggleParticipants: () => void;
  messages: { uid: string; text: string; time: string }[];
  sendMessage: (uid: string, text: string) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  muted: false,
  videoEnabled: true,
  raisedHands: {},
  activeSpeakerUid: null,
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  toggleVideo: () => set((s) => ({ videoEnabled: !s.videoEnabled })),
  raiseHand: (uid: string) =>
    set((state) => {
      const current = state.raisedHands[uid] ?? false;
      return {
        raisedHands: {
          ...state.raisedHands,
          [uid]: !current,
        },
      };
    }),
  setActiveSpeaker: (uid) => set(() => ({ activeSpeakerUid: uid })),
  isChatOpen: false,
  isTranscriptOpen: false,
  isParticipantsOpen: false,
  toggleChat: () =>
    set((s) => ({
      isChatOpen: !s.isChatOpen,
      isParticipantsOpen: false,
      isTranscriptOpen: false,
    })),
  toggleTranscript: () =>
    set((s) => ({
      isTranscriptOpen: !s.isTranscriptOpen,
      isParticipantsOpen: false,
      isChatOpen: false,
    })),
  toggleParticipants: () =>
    set((s) => ({
      isParticipantsOpen: !s.isParticipantsOpen,
      isChatOpen: false,
      isTranscriptOpen: false,
    })),
  messages: [],
  sendMessage: (uid, text) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { uid, text, time: new Date().toLocaleTimeString() },
      ],
    })),
}));
