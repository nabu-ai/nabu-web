"use client";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import React, { useEffect } from "react";
import { useGetUserProfile } from "@/components/user-profile/hooks/useGetUserProfile";
import { useUserStore } from "@/store/useUserStore";
import UserMeetingPreferencesCard from "@/components/user-profile/UserMeetingPreferencesCard";

export default function Profile() {
  const loginData = useUserStore.getState().loginData;
  const userId = loginData.userId
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

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">Profile</h3>
        <div className="space-y-6">
          {/* <UserMetaCard /> */}
          <UserInfoCard userInfo={userInfo?.data}/>
          <UserAddressCard userInfo={userInfo?.data} />
          <UserMeetingPreferencesCard userInfo={userInfo?.data} />
        </div>
      </div>
    </div>
  );
}
