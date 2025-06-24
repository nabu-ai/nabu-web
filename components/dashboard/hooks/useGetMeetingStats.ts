
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";

type MeetingStatsResponse = {
   minutesUsed: number;
   meetingsScheduled: number;
   percentage: number;
}

export const useGetMeetingStats = () => {
     const userInfo = useUserStore.getState().loginData;
    return useQuery<MeetingStatsResponse>({
        queryKey: ["get-meeting-stats"],
        queryFn: async () => {
             const response = await axiosInstance.get(`${NABU_MEETING_API_ENDPOINT}meetings/stats/${userInfo.userId}`);
             return response.data
        }
    });
};
