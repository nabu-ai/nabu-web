"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { GuestMeetingForm } from "./components/GuestMeetingForm";

export default function MeetingPage() {

    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    return (
        <div className="mx-auto flex h-screen max-w-(--breakpoint-2xl) items-center p-4 md:p-6">
            <div className="my-1 flex w-full flex-1 flex-col">
                <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
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
