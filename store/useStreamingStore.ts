"use client";

import { create } from "zustand";

interface StreamingState {
  agoraInstance: any;
  agoraClient: any;
  setAgoraInstance: (agoraInstance: any) => void;
  setAgoraClient: (agoraClient: any) => void;
}

export const useStreamingStore = create<StreamingState>((set) => ({
  agoraInstance: null,
  agoraClient: null,
  setAgoraInstance: (_agoraInstance) => set(() => ({agoraInstance: _agoraInstance})),
  setAgoraClient: (_agoraClient) => set(() => ({agoraInstance: _agoraClient})),
}));
