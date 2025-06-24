"use client"
import type { Metadata } from "next";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import React from "react";
import MeetingsTable from "@/components/dashboard/MeetingsTable";
import { useUserStore } from "@/store/useUserStore";

export default function DashboardPage() {

    const loginData = useUserStore((s) => s.loginData);

    return (
        <div className="grid gap-4">
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <DashboardMetrics />
            </div>
            <div className="col-span-12 xl:col-span-7">
                <MeetingsTable />
            </div>
        </div>
    );
}
