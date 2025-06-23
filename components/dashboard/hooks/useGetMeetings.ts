
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";

type MeetingTypesResponse = {
    data: string[];
}

export const useGetMeetings = () => {
    return useQuery<MeetingTypesResponse>({
        queryKey: ["get-meetings"],
        queryFn: async () => {
            return axiosInstance.post("/meetings/list");
        }
    });
};
