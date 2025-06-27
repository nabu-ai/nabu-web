"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function useAuthGuard() {
  const loginData = useUserStore().getLoginData();
  const router = useRouter();
  const isAuthenticated = () => {
    
    return Boolean(loginData.accessToken);
  };
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin");
    }
  }, [router]);
  return { isAuthenticated: isAuthenticated() }
}
