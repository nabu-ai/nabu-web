
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { NABU_GUEST_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";

type MeetingInfoResponse = {
    data: Record<string, any>;
}

export const useGuestGetMeetings = (meetingId:string, tenantId:string) => {
    return useQuery<MeetingInfoResponse>({
        queryKey: ["get-guest-meeting-info"],
        queryFn: async () => {
            return axiosInstance.get(`${NABU_GUEST_MEETING_API_ENDPOINT}/${meetingId}`, {
                headers: { "X-Tenant-Id": tenantId },
            });
        }
    });
};
