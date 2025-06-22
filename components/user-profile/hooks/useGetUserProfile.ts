
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";

type UserProfileResponse = {
    data: {};
}

export const useGetUserProfile = (userId:string) => {
    return useQuery<UserProfileResponse>({
        queryKey: ["get-user-profile"],
        queryFn: async () => {
            return axiosInstance.get(`${NABU_USER_API_ENDPOINT}users/${userId}`, {
                headers: { "Content-Type": undefined },
            });
        },
    });
};