"use client";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import React, { useEffect, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useGetUserProfile } from "@/components/user-profile/hooks/useGetUserProfile";
import Meetings from "@/components/dashboard/Meetings";

export default function DashboardPage() {
  //const loginData = useUserStore((s) => s.loginData);

  const loginData = useUserStore().getLoginData();
  const userId = loginData.userId;
  const { data: userInfo, isLoading, isSuccess } = useGetUserProfile(userId);

  useEffect(() => {
    if (!isLoading) {
      const usrData = userInfo?.data;
      useUserStore.setState({
        userData: {
          id: usrData?.["id"],
          firstName: usrData?.["firstName"],
          lastName: usrData?.["lastName"],
          email: usrData?.["email"],
          address: usrData?.["address"],
          city: usrData?.["city"],
          state: usrData?.["state"],
          postalCode: usrData?.["postalCode"],
          country: usrData?.["country"],
          phoneCode: usrData?.["phoneCode"],
          phoneNumber: usrData?.["phoneNumber"],
          nonVerbal: usrData?.["nonVerbal"],
          hearingImpaired: usrData?.["hearingImpaired"],
          preferredLanguage: usrData?.["preferredLanguage"],
          spokenInVoice: usrData?.["spokenInVoice"],
        },
      });
    }
  }, [isLoading, userInfo]);

  useEffect(() => {
    if(!loginData.accessToken){
     window.location.reload();
    }
  })

  return (
    <>
      {isSuccess && (
        <div className="grid gap-4">
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <DashboardMetrics />
          </div>
          <div className="col-span-12 xl:col-span-7">
            <Meetings />
          </div>
        </div>
      )}
    </>
  );
}
