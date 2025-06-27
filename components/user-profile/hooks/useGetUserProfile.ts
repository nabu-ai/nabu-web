
import axiosInstance from "@/services/axios-service";
import { useQuery } from "@tanstack/react-query";
import { NABU_USER_API_ENDPOINT } from "@/constants/environmentVariables";
import { useUserStore } from "@/store/useUserStore";

type UserProfileResponse = {
    data: {};
}

export const useGetUserProfile = (userId:string) => {
    const accessToken = useUserStore().getLoginData().accessToken
    const tenantId = useUserStore().getLoginData().tenantId
    return useQuery<UserProfileResponse>({
        queryKey: ["get-user-profile"],
        queryFn: async () => {
            return axiosInstance.get(`${NABU_USER_API_ENDPOINT}/${userId}`, {
                headers: { 
                    "Authorization": "Bearer "+accessToken,
                    "X-Tenant-Id": tenantId,
                    "X-User-Id": userId
                 },
            });
        }, enabled:Boolean(accessToken)
    });
};