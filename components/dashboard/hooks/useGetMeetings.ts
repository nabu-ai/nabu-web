
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { NABU_MEETING_API_ENDPOINT } from "@/constants/environmentVariables";

type MeetingTypesResponse = {
    data: string[];
}

export const useGetMeetings = () => {
     const userInfo = useUserStore.getState().loginData;
    return useQuery<MeetingTypesResponse>({
        queryKey: ["get-meetings"],
        queryFn: async () => {
            return axiosInstance.get(`${NABU_MEETING_API_ENDPOINT}meetings/list/${userInfo.userId}`);
        }
    });
};
