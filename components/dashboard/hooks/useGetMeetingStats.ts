
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";

type MeetingStatsResponse = {
   secondsUsed: number;
   meetingsScheduled: number;
   consumedPercentage: number;
}

export const useGetMeetingStats = () => {
     const loginInfo = useUserStore().getLoginData();
    return useQuery<MeetingStatsResponse>({
        queryKey: ["get-meeting-stats"],
        queryFn: async () => {
             const response = await axiosInstance.get(`${NABU_MEETING_API_ENDPOINT}/stats/${loginInfo.userId}`,{
                 headers: { 
                    "X-User-Id": loginInfo.userId,
                    "Authorization": "Bearer "+loginInfo.accessToken,
                    "X-Tenant-Id": loginInfo.tenantId
                 },
             });
             return response.data
        }, enabled:Boolean(loginInfo.accessToken),
        refetchOnWindowFocus :true,
    });
};
