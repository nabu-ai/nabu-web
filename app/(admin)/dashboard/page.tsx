"use client"
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import React, { useEffect } from "react";
import MeetingsTable from "@/components/dashboard/MeetingsTable";
import { useUserStore } from "@/store/useUserStore";
import { useGetUserProfile } from "@/components/user-profile/hooks/useGetUserProfile";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

    //const loginData = useUserStore((s) => s.loginData);
    const router = useRouter()
     const loginData = useUserStore().getLoginData()
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
            
            router.refresh()
          }
        }, [isLoading, userInfo]);

    return (
      <>
      { isSuccess && (
        <div className="grid gap-4">
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <DashboardMetrics />
            </div>
            <div className="col-span-12 xl:col-span-7">
                <MeetingsTable />
            </div>
        </div>
      )}
      </>
    );
}
