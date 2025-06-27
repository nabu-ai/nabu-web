
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";

type MeetingTypesResponse = {
    data: string[];
}

export const useGetMeetings = () => {
     const loginInfo = useUserStore().getLoginData();
    return useQuery<MeetingTypesResponse>({
        queryKey: ["get-meetings"],
        queryFn: async () => {
            return axiosInstance.get(`${NABU_MEETING_API_ENDPOINT}/list/${loginInfo.userId}`,
                {
                    headers: { 
                        "X-User-Id": loginInfo.userId,
                        "Authorization": "Bearer "+loginInfo.accessToken,
                        "X-Tenant-Id": loginInfo.tenantId
                    },
                }
            );
        }, enabled:Boolean(loginInfo.accessToken)
    });
};
