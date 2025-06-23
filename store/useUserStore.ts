"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  loginData: Record<string, any>;
  userData: Record<string, any>;
  trialExpired: boolean;

  
  setLoginData: (loginData: Record<string, any>) => void;
  setTrialExpired: (trialExpired: any) => void;
  setUserData: (userData: Record<string, any>) => void; 
}


export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      loginData: {},
      trialExpired: false,
      userData: {},

      setUserData: (_userData) => set(() => ({ userData: _userData })),
      setLoginData: (_loginData) => set(() => ({loginData: _loginData})),
      setTrialExpired: (_trialExpired) => set(() => ({trialExpired: _trialExpired})),
    }),
    {
      name: 'nabu-user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)