"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MeetingState {
  meetingId: string;
  duration: number;
  trialDuration: number;
  setMeetingId: (meetingId: string) => void;
  setDuration: (duration: number) => void;
  setTrialDuration: (trialDuration: number) => void;

  muted: boolean;
  videoEnabled: boolean;
  raisedHands: Record<string, boolean>;
  mutedUsers: Record<string, boolean>;
  activeSpeakerUid: string | null;
  toggleMute: () => void;
  toggleVideo: () => void;
  raiseHand: (uid: string) => void;
  muteUser: (uid: string) => void;
  setActiveSpeaker: (uid: string) => void;

  isChatOpen: boolean;
  isTranscriptOpen: boolean;
  isParticipantsOpen: boolean;
  toggleChat: () => void;
  toggleTranscript: () => void;
  toggleParticipants: () => void;
  messages: { uid: string; text: string; sourceLanguage: string;  time: string }[];
  addMessage: (uid: string, text: string, sourceLanguage: string) => void;

  transcripts: { uid: string; transcript: string; sourceLanguage: string; audioHeardAs: string; time: string }[];
  addTranscript: (uid: string, transcript: string, sourceLanguage: string, audioHeardAs: string) => void;

  meetingInfo: Record<string, any>; // Placeholder for meeting info;
  setMeetingInfo: (info: Record<string, any>) => void;

  setHandState: (uid: string, raised: boolean) => void;
  setMuteState: (uid: string, mute: boolean) => void;
  
}


export const useMeetingStore = create<MeetingState>()(
  persist(
    (set, get) => ({
      meetingId: "",
  duration: 0,
  trialDuration: 0,
  setMeetingId: (_meetingId) => set(() => ({meetingId: _meetingId})),
  setDuration: (_duration) => set(() => ({duration: _duration})),
  setTrialDuration: (_trialDuration) => set(() => ({trialDuration: _trialDuration})),
  muted: true,
  videoEnabled: false,
  raisedHands: {},
  mutedUsers: {},
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
  muteUser: (uid: string) =>
    set((state) => {
      const current = state.mutedUsers[uid] ?? false;
      return {
        mutedUsers: {
          ...state.mutedUsers,
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
  addMessage: (uid, text, sourceLanguage) =>
    set((s) => ({
      messages: [
        ...s.messages,
        // { uid, text, time: new Date().toLocaleTimeString().split(":").slice(0, 2).join(":") },
        { uid, text, sourceLanguage, time: new Date().toLocaleTimeString() },
      ],
    })),
  transcripts: [],
  addTranscript: (uid, transcript, sourceLanguage, audioHeardAs) =>
    set((s) => ({
      transcripts: [
        ...s.transcripts,
        // { uid, transcript, sourceLanguage, audioHeardAs, time: new Date().toLocaleTimeString().split(":").slice(0, 2).join(":") },
        { uid, transcript, sourceLanguage, audioHeardAs, time: new Date().toLocaleTimeString() },
      ],
  })),
  meetingInfo: {},
  setMeetingInfo: (info) => set(() => ({ meetingInfo: info })),
  setHandState: (uid, raised) =>
    set((s) => ({
      raisedHands: raised
        ? { ...s.raisedHands, [uid]: true }
        : Object.fromEntries(Object.entries(s.raisedHands).filter(([k]) => k !== uid)),
    })),
  setMuteState: (uid, muted) =>
    set((s) => ({
      mutedUsers: muted
        ? { ...s.mutedUsers, [uid]: true }
        : Object.fromEntries(Object.entries(s.mutedUsers).filter(([k]) => k !== uid)),
    })),
    }),
    {
      name: 'nabu-meeting-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
