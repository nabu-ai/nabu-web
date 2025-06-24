"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function useAuthGuard() {
  const router = useRouter();
  const isAuthenticated = () => {
    const loginData = useUserStore.getState().loginData;
    return true;//Boolean(loginData.accessToken);
  };
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin");
    }
  }, [router]);
  return { isAuthenticated: isAuthenticated() }
}
