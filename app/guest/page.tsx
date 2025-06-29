"use client";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { GuestMeetingForm } from "./components/GuestMeetingForm";
import { useGuestGetMeetings } from "@/components/guest/hooks/useGuestGetMeeting";
import { useMeetingStore } from "@/store/useMeetingStore";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

export default function MeetingPage() {

    const hasInitialized = useRef(false);
    const searchParams = useSearchParams();
    const meetingId = searchParams.get("mid");
    const tenantId = searchParams.get("oid");
    
    const { data: meetingInfo, isLoading, isSuccess } = useGuestGetMeetings(meetingId, tenantId);

    useEffect(() => {
         if (!hasInitialized.current) {
            hasInitialized.current = true;
            useMeetingStore.setState(useMeetingStore.getInitialState())
            useUserStore.setState(useUserStore.getInitialState())
         }
    })

    useEffect(() => {
       
        if(!isLoading && isSuccess){
            useMeetingStore.setState({
                      meetingInfo: meetingInfo.data
                    })
            
             if(meetingInfo?.data?.status === "ACTIVE"){
                toast.warning("Host has not started the meeting yet")
            }
            else if(meetingInfo?.data?.status === "COMPLETED"){
                toast.warning("Meeting is no longer available")
            }
            else if(meetingInfo?.data?.status === "CANCELLED"){
                toast.warning("Host has cancelled the meeting")
            }

        }
    }, [isSuccess])

    return (
        <div className="mx-auto flex h-screen max-w-(--breakpoint-2xl) items-center p-4 md:p-6">
            <div className="my-1 flex w-full flex-1 flex-col">
                <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
                    <img className="m-auto h-44 mb-4" src="/nabu-web/Nabu-Logo.png"></img>
                    <div className="rounded-4xl border-2 border-blue-500 p-8 shadow-lg">
                        <div className="mb-5 sm:mb-8">
                            <h1 className="text-title-lg sm:text-title-lg pt-4 pb-6 text-center font-bold text-gray-900 dark:text-white/90">
                                Join Meeting
                            </h1>
                        </div>
                        <div>
                            <GuestMeetingForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
