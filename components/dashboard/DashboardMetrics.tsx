"use client";
import React, { useEffect, useRef, useState } from "react";
import { ClockFading, ListVideo } from "lucide-react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useGetMeetingStats } from "./hooks/useGetMeetingStats";
import { useUserStore } from "@/store/useUserStore";

import { formatTimeDuration } from "@/lib/utils";
import { useMeetingStore } from "@/store/useMeetingStore";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const DashboardMetrics = () => {
  const { data: meetingStats, isSuccess, refetch } = useGetMeetingStats();
  const { secondsUsed, meetingsScheduled } = meetingStats || {};

  const hasInitialized = useRef(false);
  // let series = [consumedPercentage ?? 0];

  const [series, setSeries] = useState<number[]>([0]);
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: "100",
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        offsetX: -50,
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 1, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "24px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      refetch();
    }
  }, []);

  useEffect(() => {
    if (
      meetingStats &&
      typeof meetingStats.consumedPercentage === "number" &&
      !isNaN(meetingStats.consumedPercentage)
    ) {
      setSeries([meetingStats.consumedPercentage]);
      useMeetingStore.setState({ trialDuration: secondsUsed });
    }
  }, [meetingStats]);

  useEffect(() => {
    if (secondsUsed === 600) {
      useUserStore.setState({ trialExpired: true });
    } else {
      //console.log("Setting trial state::::", secondsUsed)
      useUserStore.setState({ trialExpired: false });
    }
  }, [isSuccess]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <ClockFading className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-theme-xl text-gray-500 dark:text-gray-400">Minutes Used</span>
            <h4 className="text-title-sm mt-2 font-semibold text-gray-800 dark:text-white/90">
              {secondsUsed ? formatTimeDuration(secondsUsed) : 0}
            </h4>
          </div>
          {/* <Badge color="success">
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <ListVideo className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-theme-xl text-gray-500 dark:text-gray-400">Meetings Scheduled</span>
            <h4 className="text-title-sm mt-2 font-semibold text-gray-800 dark:text-white/90">{meetingsScheduled} Meeting(s)</h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Trial Minutes Consumed</h3>
            {/* <p className="text-theme-xl mt-1 font-normal text-gray-500 dark:text-gray-400">Trial Minutes Consumed</p> */}
          </div>
          
        </div>
        <div className="flex items-end justify-between">
            <div className="relative">
              <div className="max-h-[200px]">
                <ReactApexChart key={series[0]} options={options} series={series} type="radialBar" height={200} />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};
